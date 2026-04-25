'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/* ─────────────────────────────────────────────────────────────
   GalaxyScene
   A full-viewport 3D scene rendered behind the page:
    · distant spherical starfield (static, tiny)
    · parallax starfield (slow drift)
    · spiral galaxy (~25k shader-drawn particles, warm core → cool arms)
    · additive nebula sprites (soft colored dust)
    · mouse-reactive camera parallax
    · warp-intro: camera pulls back from the galactic core
   ───────────────────────────────────────────────────────────── */

function makeSoftCircleTexture() {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.25, 'rgba(255,255,255,0.55)')
  g.addColorStop(0.55, 'rgba(255,255,255,0.12)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function makeNebulaTexture(hue: number) {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, `hsla(${hue}, 90%, 70%, 0.55)`)
  g.addColorStop(0.4, `hsla(${hue}, 85%, 55%, 0.18)`)
  g.addColorStop(0.75, `hsla(${hue}, 70%, 40%, 0.05)`)
  g.addColorStop(1, 'hsla(0, 0%, 0%, 0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export default function GalaxyScene() {
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let disposed = false

    /* ── Renderer ─────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x05050a, 1)
    mount.appendChild(renderer.domElement)

    /* ── Scene + camera ───────────────────────────────── */
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x05050a, 0.025)

    const camera = new THREE.PerspectiveCamera(
      62,
      window.innerWidth / window.innerHeight,
      0.1,
      600,
    )
    camera.position.set(0, 0.25, 2.0)  // intro: inside the core
    camera.lookAt(0, 0, 0)

    const softTex = makeSoftCircleTexture()

    /* ── Distant starfield (spherical shell) ──────────── */
    const distantGeom = new THREE.BufferGeometry()
    const distantCount = 4000
    const distantPos = new Float32Array(distantCount * 3)
    const distantColor = new Float32Array(distantCount * 3)
    const distantSize = new Float32Array(distantCount)
    for (let i = 0; i < distantCount; i++) {
      const r = 120 + Math.random() * 140
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      distantPos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta)
      distantPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      distantPos[i * 3 + 2] = r * Math.cos(phi)
      const t = Math.random()
      // most are cool white, a few warm
      const col = new THREE.Color().setHSL(
        t < 0.15 ? 0.05 + Math.random() * 0.05 : 0.55 + Math.random() * 0.1,
        t < 0.15 ? 0.6 : 0.25,
        0.7 + Math.random() * 0.3,
      )
      distantColor[i * 3 + 0] = col.r
      distantColor[i * 3 + 1] = col.g
      distantColor[i * 3 + 2] = col.b
      distantSize[i] = Math.random() * 0.9 + 0.3
    }
    distantGeom.setAttribute('position', new THREE.BufferAttribute(distantPos, 3))
    distantGeom.setAttribute('color', new THREE.BufferAttribute(distantColor, 3))
    distantGeom.setAttribute('aSize', new THREE.BufferAttribute(distantSize, 1))

    /* ── Galaxy particles (spiral) ────────────────────── */
    const galaxyCount = 28000
    const galaxyGeom = new THREE.BufferGeometry()
    const gPos = new Float32Array(galaxyCount * 3)
    const gCol = new Float32Array(galaxyCount * 3)
    const gSize = new Float32Array(galaxyCount)
    const gSeed = new Float32Array(galaxyCount)

    const coreColor = new THREE.Color('#ffb878')     // warm amber
    const midColor = new THREE.Color('#c66cff')      // violet
    const armColor = new THREE.Color('#5cc0ff')      // cyan-blue

    const radius = 9
    const branches = 4
    const spin = 1.15
    const randomness = 0.28
    const randomnessPower = 3.2

    for (let i = 0; i < galaxyCount; i++) {
      // concentrate more particles near the core
      const r = Math.pow(Math.random(), 2.2) * radius
      const branchAngle = ((i % branches) / branches) * Math.PI * 2
      const spinAngle = r * spin

      const randX =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        randomness *
        (r + 0.5)
      const randY =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        randomness *
        (r + 0.5) *
        0.35
      const randZ =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        randomness *
        (r + 0.5)

      gPos[i * 3 + 0] = Math.cos(branchAngle + spinAngle) * r + randX
      gPos[i * 3 + 1] = randY * (1 - Math.min(r / radius, 1) * 0.55)
      gPos[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * r + randZ

      // three-stop color ramp: core → mid → arm
      let mixed: THREE.Color
      const t = Math.min(r / radius, 1)
      if (t < 0.45) {
        mixed = coreColor.clone().lerp(midColor, t / 0.45)
      } else {
        mixed = midColor.clone().lerp(armColor, (t - 0.45) / 0.55)
      }
      // a few hot young stars
      if (Math.random() < 0.04) {
        mixed.lerp(new THREE.Color('#ffffff'), 0.6)
      }
      gCol[i * 3 + 0] = mixed.r
      gCol[i * 3 + 1] = mixed.g
      gCol[i * 3 + 2] = mixed.b

      gSize[i] = Math.random() * 1.7 + 0.45
      gSeed[i] = Math.random() * Math.PI * 2
    }
    galaxyGeom.setAttribute('position', new THREE.BufferAttribute(gPos, 3))
    galaxyGeom.setAttribute('color', new THREE.BufferAttribute(gCol, 3))
    galaxyGeom.setAttribute('aSize', new THREE.BufferAttribute(gSize, 1))
    galaxyGeom.setAttribute('aSeed', new THREE.BufferAttribute(gSeed, 1))

    /* ── Shared star shader ───────────────────────────── */
    const starUniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uSize: { value: 28.0 },
      uMap: { value: softTex },
      uOpacity: { value: 0 },
    }

    const starMaterial = new THREE.ShaderMaterial({
      uniforms: starUniforms,
      vertexShader: /* glsl */ `
        attribute float aSize;
        attribute float aSeed;
        uniform float uTime;
        uniform float uPixelRatio;
        uniform float uSize;
        varying vec3 vColor;
        varying float vTwinkle;
        void main() {
          vColor = color;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * uSize * uPixelRatio * (1.0 / -mv.z);
          vTwinkle = 0.75 + 0.25 * sin(uTime * 1.4 + aSeed);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uMap;
        uniform float uOpacity;
        varying vec3 vColor;
        varying float vTwinkle;
        void main() {
          vec4 tex = texture2D(uMap, gl_PointCoord);
          float a = tex.a;
          if (a < 0.02) discard;
          gl_FragColor = vec4(vColor * vTwinkle, a * uOpacity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    })

    // separate uniforms so the distant field twinkles less and with different size
    const distantUniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uSize: { value: 9.0 },
      uMap: { value: softTex },
      uOpacity: { value: 0 },
    }
    const distantMaterial = starMaterial.clone()
    distantMaterial.uniforms = distantUniforms
    distantMaterial.vertexColors = true

    const galaxyPoints = new THREE.Points(galaxyGeom, starMaterial)
    const distantPoints = new THREE.Points(distantGeom, distantMaterial)

    const galaxyGroup = new THREE.Group()
    galaxyGroup.add(galaxyPoints)
    galaxyGroup.rotation.x = -0.35 // tilt
    galaxyGroup.rotation.z = 0.15
    scene.add(galaxyGroup)
    scene.add(distantPoints)

    /* ── Core glow (billboarded sprite) ───────────────── */
    const coreTex = makeNebulaTexture(35)
    const coreGlow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: coreTex,
        color: 0xffc78a,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0,
      }),
    )
    coreGlow.scale.set(6.0, 6.0, 1)
    galaxyGroup.add(coreGlow)

    const coreInner = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: coreTex,
        color: 0xffffff,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0,
      }),
    )
    coreInner.scale.set(2.2, 2.2, 1)
    galaxyGroup.add(coreInner)

    /* ── Nebula dust (large additive sprites at depth) ── */
    const nebulaGroup = new THREE.Group()
    const nebulaSpecs: Array<{ hue: number; pos: [number, number, number]; scale: number; opacity: number }> = [
      { hue: 270, pos: [-18, -4, -22], scale: 36, opacity: 0.55 },   // violet
      { hue: 200, pos: [22, 6, -28], scale: 42, opacity: 0.45 },     // cyan
      { hue: 320, pos: [-6, 10, -40], scale: 48, opacity: 0.35 },    // magenta
      { hue: 20,  pos: [14, -10, -18], scale: 26, opacity: 0.35 },   // warm
      { hue: 240, pos: [0, -14, -34], scale: 40, opacity: 0.3 },     // blue
    ]
    const nebulaTargets: Array<{ sprite: THREE.Sprite; target: number }> = []
    for (const spec of nebulaSpecs) {
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: makeNebulaTexture(spec.hue),
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          opacity: 0,
        }),
      )
      sprite.position.set(...spec.pos)
      sprite.scale.set(spec.scale, spec.scale, 1)
      nebulaGroup.add(sprite)
      nebulaTargets.push({ sprite, target: spec.opacity })
    }
    scene.add(nebulaGroup)

    /* ── Warp streaks (intro only) ────────────────────── */
    const warpCount = 800
    const warpGeom = new THREE.BufferGeometry()
    const warpPos = new Float32Array(warpCount * 3)
    const warpCol = new Float32Array(warpCount * 3)
    const warpSize = new Float32Array(warpCount)
    const warpSeed = new Float32Array(warpCount)
    for (let i = 0; i < warpCount; i++) {
      // cylinder around z axis heading toward camera
      const angle = Math.random() * Math.PI * 2
      const r = 1.5 + Math.random() * 14
      warpPos[i * 3 + 0] = Math.cos(angle) * r
      warpPos[i * 3 + 1] = Math.sin(angle) * r
      warpPos[i * 3 + 2] = -Math.random() * 80
      const c = new THREE.Color().setHSL(0.6 + Math.random() * 0.15, 0.7, 0.8)
      warpCol[i * 3 + 0] = c.r
      warpCol[i * 3 + 1] = c.g
      warpCol[i * 3 + 2] = c.b
      warpSize[i] = Math.random() * 2.5 + 1
      warpSeed[i] = Math.random()
    }
    warpGeom.setAttribute('position', new THREE.BufferAttribute(warpPos, 3))
    warpGeom.setAttribute('color', new THREE.BufferAttribute(warpCol, 3))
    warpGeom.setAttribute('aSize', new THREE.BufferAttribute(warpSize, 1))
    warpGeom.setAttribute('aSeed', new THREE.BufferAttribute(warpSeed, 1))

    const warpUniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uSize: { value: 30.0 },
      uMap: { value: softTex },
      uOpacity: { value: 1.0 },
    }
    const warpMat = starMaterial.clone()
    warpMat.uniforms = warpUniforms
    warpMat.vertexColors = true
    const warpPoints = new THREE.Points(warpGeom, warpMat)
    scene.add(warpPoints)

    /* ── Mouse / camera parallax state ────────────────── */
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    const onMove = (e: MouseEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const onResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      const pr = Math.min(window.devicePixelRatio, 2)
      renderer.setPixelRatio(pr)
      starUniforms.uPixelRatio.value = pr
      distantUniforms.uPixelRatio.value = pr
      warpUniforms.uPixelRatio.value = pr
    }
    window.addEventListener('resize', onResize)

    /* ── Animation loop ───────────────────────────────── */
    const clock = new THREE.Clock()
    const start = performance.now()

    const animate = () => {
      if (disposed) return
      const t = clock.getElapsedTime()
      const elapsed = (performance.now() - start) / 1000

      // intro: 0 → 3.5s. pull camera back and rotate galaxy into view.
      const introT = Math.min(elapsed / 3.5, 1)
      const eased = 1 - Math.pow(1 - introT, 3) // easeOutCubic

      // camera base position (post-intro)
      const baseZ = 14
      const baseY = 2.3
      const introZ = 2.0 + (baseZ - 2.0) * eased
      const introY = 0.25 + (baseY - 0.25) * eased

      // pointer smoothing
      pointer.x += (pointer.tx - pointer.x) * 0.035
      pointer.y += (pointer.ty - pointer.y) * 0.035

      camera.position.x = pointer.x * 0.9
      camera.position.y = introY - pointer.y * 0.45
      camera.position.z = introZ
      camera.lookAt(0, 0, 0)

      // galaxy rotation
      galaxyGroup.rotation.y += 0.0009
      distantPoints.rotation.y += 0.00012
      nebulaGroup.rotation.z += 0.00015

      // fade-ins synced to intro
      starUniforms.uOpacity.value = Math.min(1, eased * 1.1)
      distantUniforms.uOpacity.value = Math.min(1, eased * 1.2)
      ;(coreGlow.material as THREE.SpriteMaterial).opacity = 0.9 * eased
      ;(coreInner.material as THREE.SpriteMaterial).opacity = 0.7 * eased
      for (const n of nebulaTargets) {
        const m = n.sprite.material as THREE.SpriteMaterial
        m.opacity = n.target * eased
      }

      // warp streaks fade out after intro
      const warpOpacity = Math.max(0, 1 - elapsed / 1.8)
      warpUniforms.uOpacity.value = warpOpacity
      if (warpOpacity > 0) {
        // move them toward camera fast
        const pos = warpGeom.attributes.position as THREE.BufferAttribute
        const arr = pos.array as Float32Array
        for (let i = 0; i < warpCount; i++) {
          arr[i * 3 + 2] += 2.6
          if (arr[i * 3 + 2] > 5) arr[i * 3 + 2] = -80
        }
        pos.needsUpdate = true
      } else if (warpPoints.parent) {
        warpPoints.parent.remove(warpPoints)
        warpGeom.dispose()
        warpMat.dispose()
      }

      starUniforms.uTime.value = t
      distantUniforms.uTime.value = t
      warpUniforms.uTime.value = t

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    animate()

    /* ── Cleanup ──────────────────────────────────────── */
    return () => {
      disposed = true
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      galaxyGeom.dispose()
      distantGeom.dispose()
      starMaterial.dispose()
      distantMaterial.dispose()
      softTex.dispose()
      coreTex.dispose()
      for (const n of nebulaTargets) {
        const m = n.sprite.material as THREE.SpriteMaterial
        if (m.map) m.map.dispose()
        m.dispose()
      }
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background:
          'radial-gradient(ellipse at center, #0a0718 0%, #05050a 45%, #030308 100%)',
      }}
    />
  )
}
