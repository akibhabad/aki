'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/* ─────────────────────────────────────────────────────────────
   Palette — every colour here is a shade of the site purple
   (#7c5cbf) pushed lighter / darker / more saturated.
   Values are linear-ish RGB in 0..1.
   ───────────────────────────────────────────────────────────── */
const C = {
  coreWhite:  [0.93, 0.85, 1.00],  // hot centre, lavender-white
  bulge:      [0.86, 0.74, 1.00],  // pale lilac
  inner:      [0.72, 0.56, 0.98],  // #b78ffa
  arm:        [0.49, 0.36, 0.78],  // #7c5cbf (the brand purple)
  outer:      [0.24, 0.16, 0.48],  // #3d2a7a deep violet
  youngStar:  [0.82, 0.74, 1.00],  // bright pale, young cluster
  nebula:     [0.80, 0.42, 1.00],  // magenta-leaning emission knot
  farStar:    [0.55, 0.50, 0.78],
}

/* Deterministic PRNG so the galaxy is identical on every load */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function gaussian(rand: () => number) {
  let u = 0, v = 0
  while (u === 0) u = rand()
  while (v === 0) v = rand()
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}

function lerp3(a: number[], b: number[], t: number, out: number[]) {
  out[0] = a[0] + (b[0] - a[0]) * t
  out[1] = a[1] + (b[1] - a[1]) * t
  out[2] = a[2] + (b[2] - a[2]) * t
  return out
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/* ─────────────────────────────────────────────────────────────
   Geometry generation
   ───────────────────────────────────────────────────────────── */
const RADIUS = 5.0
const ARMS = 4
const ARM_WEIGHTS = [0.34, 0.16, 0.34, 0.16] // two major, two minor arms
const SPIRAL_K = 2.55        // log-spiral winding
const SPIRAL_R0 = 0.42

function spiralAngle(r: number) {
  return SPIRAL_K * Math.log(1 + r / SPIRAL_R0)
}

function pickArm(rand: () => number) {
  const x = rand()
  let acc = 0
  for (let i = 0; i < ARMS; i++) {
    acc += ARM_WEIGHTS[i]
    if (x < acc) return i
  }
  return ARMS - 1
}

function buildStars(count: number, seed: number) {
  const rand = mulberry32(seed)
  const pos = new Float32Array(count * 3)
  const col = new Float32Array(count * 3)
  const size = new Float32Array(count)
  const seedAttr = new Float32Array(count)
  const tmp = [0, 0, 0]

  const bulgeCount = Math.floor(count * 0.06)

  for (let i = 0; i < count; i++) {
    let x: number, y: number, z: number
    let r: number
    let brightness = 1
    let s = 0.35 + rand() * 0.55
    let cr = 0, cg = 0, cb = 0

    if (i < bulgeCount) {
      /* ── central bulge: squashed 3-D gaussian ── */
      x = gaussian(rand) * 0.55
      y = gaussian(rand) * 0.3
      z = gaussian(rand) * 0.55
      r = Math.sqrt(x * x + z * z)
      const t = smooth(0.0, 0.9, r + Math.abs(y) * 0.8)
      lerp3(C.coreWhite, C.bulge, t, tmp)
      brightness = 0.3 - t * 0.15
      s *= 0.9
      cr = tmp[0]; cg = tmp[1]; cb = tmp[2]
    } else {
      /* ── disk & arms ── */
      r = RADIUS * Math.pow(rand(), 1.35)
      r = Math.max(r, 0.08)

      const arm = pickArm(rand)
      const interarm = rand() < 0.38
      const baseTheta = (arm / ARMS) * Math.PI * 2 + spiralAngle(r)

      // arms broaden outward, inter-arm population is smeared around the disk
      const sigTheta = interarm ? 0.9 : (0.14 + 0.06 * r)
      const sigR = interarm ? 0.35 : (0.10 + 0.05 * r)
      const theta = baseTheta + gaussian(rand) * sigTheta
      const rr = Math.max(0.05, r + gaussian(rand) * sigR)

      // thin disk with a thick inner region and a slight outer flare
      const sigY = 0.035 + 0.16 * Math.exp(-rr / 0.8) + 0.012 * (rr / RADIUS)
      x = Math.cos(theta) * rr
      z = Math.sin(theta) * rr
      y = gaussian(rand) * sigY
      r = rr

      // colour ramp along radius with a bit of per-star noise
      const noise = (rand() - 0.5) * 0.18
      const t = Math.min(1, Math.max(0, r / RADIUS + noise))
      if (t < 0.22) lerp3(C.coreWhite, C.inner, t / 0.22, tmp)
      else if (t < 0.55) lerp3(C.inner, C.arm, (t - 0.22) / 0.33, tmp)
      else lerp3(C.arm, C.outer, (t - 0.55) / 0.45, tmp)
      cr = tmp[0]; cg = tmp[1]; cb = tmp[2]

      brightness = interarm ? 0.40 : 0.66
      brightness *= 0.7 + rand() * 0.5

      // young bright clusters riding the arm ridges
      if (!interarm && rand() < 0.045) {
        cr = C.youngStar[0]; cg = C.youngStar[1]; cb = C.youngStar[2]
        brightness = 0.9 + rand() * 0.4
        s = 1.1 + rand() * 0.9
      }
      // occasional emission knots
      else if (!interarm && r > 0.8 && rand() < 0.006) {
        cr = C.nebula[0]; cg = C.nebula[1]; cb = C.nebula[2]
        brightness = 0.55
        s = 3.0 + rand() * 2.5
      }
    }

    pos[i * 3] = x
    pos[i * 3 + 1] = y
    pos[i * 3 + 2] = z
    col[i * 3] = cr * brightness
    col[i * 3 + 1] = cg * brightness
    col[i * 3 + 2] = cb * brightness
    size[i] = s
    seedAttr[i] = rand()
  }

  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('color', new THREE.BufferAttribute(col, 3))
  g.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
  g.setAttribute('aSeed', new THREE.BufferAttribute(seedAttr, 1))
  return g
}

function buildDust(count: number, seed: number) {
  const rand = mulberry32(seed)
  const pos = new Float32Array(count * 3)
  const size = new Float32Array(count)
  const seedAttr = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const r = 1.4 + Math.pow(rand(), 0.9) * (RADIUS - 1.9)
    const arm = pickArm(rand)
    // dust hugs the inner (trailing) edge of each arm
    const theta = (arm / ARMS) * Math.PI * 2 + spiralAngle(r) - 0.16 + gaussian(rand) * (0.06 + 0.02 * r)
    const rr = r + gaussian(rand) * 0.07
    pos[i * 3] = Math.cos(theta) * rr
    pos[i * 3 + 1] = gaussian(rand) * 0.02
    pos[i * 3 + 2] = Math.sin(theta) * rr
    size[i] = 2.2 + rand() * 3.2
    seedAttr[i] = rand()
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
  g.setAttribute('aSeed', new THREE.BufferAttribute(seedAttr, 1))
  return g
}

function buildFarStars(count: number, seed: number) {
  const rand = mulberry32(seed)
  const pos = new Float32Array(count * 3)
  const col = new Float32Array(count * 3)
  const size = new Float32Array(count)
  const seedAttr = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const u = rand() * 2 - 1
    const phi = rand() * Math.PI * 2
    const rad = 28 + rand() * 30
    const sq = Math.sqrt(1 - u * u)
    pos[i * 3] = Math.cos(phi) * sq * rad
    pos[i * 3 + 1] = u * rad
    pos[i * 3 + 2] = Math.sin(phi) * sq * rad
    const b = 0.25 + rand() * 0.55
    col[i * 3] = C.farStar[0] * b
    col[i * 3 + 1] = C.farStar[1] * b
    col[i * 3 + 2] = C.farStar[2] * b
    size[i] = 0.5 + rand() * 0.9
    seedAttr[i] = rand()
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('color', new THREE.BufferAttribute(col, 3))
  g.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
  g.setAttribute('aSeed', new THREE.BufferAttribute(seedAttr, 1))
  return g
}

/* ─────────────────────────────────────────────────────────────
   Shaders
   ───────────────────────────────────────────────────────────── */
const starVert = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform vec3  uPointer;
  uniform float uPointerStrength;
  uniform float uRotate;      // 1 = stars orbit, 0 = frozen (reduced motion)
  attribute float aSize;
  attribute float aSeed;
  varying vec3  vColor;
  varying float vGlow;

  void main() {
    vec3 p = position;
    float r = length(p.xz);

    // mild differential rotation: flat-ish curve, faster near the core
    float omega = (0.020 + 0.016 / (r + 0.55)) * uRotate;
    float ang = uTime * omega;
    float c = cos(ang), s = sin(ang);
    p.xz = mat2(c, -s, s, c) * p.xz;

    // pointer proximity: stars near the cursor brighten and swell
    float d = distance(p.xz, uPointer.xz);
    float glow = smoothstep(1.25, 0.0, d) * uPointerStrength;

    float tw = 0.86 + 0.14 * sin(uTime * (1.2 + aSeed * 2.4) + aSeed * 60.0);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uSize * (1.0 + glow * 0.9) / -mv.z;
    vColor = color * tw;
    vGlow = glow;
  }
`

const starFrag = /* glsl */ `
  varying vec3  vColor;
  varying float vGlow;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d2 = dot(uv, uv) * 4.0;
    if (d2 > 1.0) discard;
    // tight bright core + soft wide halo
    float a = 0.46 * exp(-d2 * 9.0) + 0.38 * exp(-d2 * 2.2) * (1.0 - d2);
    vec3 col = vColor * (1.0 + vGlow * 1.4);
    gl_FragColor = vec4(col * a, a);
  }
`

const dustVert = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uRotate;
  attribute float aSize;
  attribute float aSeed;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    float r = length(p.xz);
    float omega = (0.020 + 0.016 / (r + 0.55)) * uRotate;
    float ang = uTime * omega;
    float c = cos(ang), s = sin(ang);
    p.xz = mat2(c, -s, s, c) * p.xz;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uSize / -mv.z;
    vAlpha = 0.05 + aSeed * 0.05;
  }
`

const dustFrag = /* glsl */ `
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d2 = dot(uv, uv) * 4.0;
    if (d2 > 1.0) discard;
    float a = exp(-d2 * 2.6) * (1.0 - d2) * vAlpha;
    gl_FragColor = vec4(vec3(0.03, 0.02, 0.06), a);
  }
`

const farVert = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  attribute float aSize;
  attribute float aSeed;
  varying vec3 vColor;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uSize * 2.4 / -mv.z * 6.0;
    float tw = 0.7 + 0.3 * sin(uTime * (0.6 + aSeed * 1.8) + aSeed * 80.0);
    vColor = color * tw;
  }
`

const farFrag = /* glsl */ `
  varying vec3 vColor;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d2 = dot(uv, uv) * 4.0;
    if (d2 > 1.0) discard;
    float a = exp(-d2 * 5.0);
    gl_FragColor = vec4(vColor * a, a);
  }
`

/* Flat disc of haze under the stars — gives the "milky" density */
const hazeVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv - 0.5;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const hazeFrag = /* glsl */ `
  uniform float uTime;
  uniform float uRotate;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv * 2.0;                  // -1..1
    float r = length(p);
    if (r > 1.0) discard;
    float ang = atan(p.y, p.x);
    // two soft spiral density ridges rotating with the core
    float rr = r * 5.0;
    float sp = 2.55 * log(1.0 + rr / 0.42);
    float rot = uTime * (0.020 + 0.016 / (rr + 0.55)) * uRotate;
    float ridge = 0.5 + 0.5 * cos(2.0 * (ang - sp + rot));
    ridge = pow(ridge, 2.0);
    float disk = exp(-r * 3.2) * 0.55 + exp(-r * 1.3) * 0.18;
    float a = disk * (0.55 + 0.45 * ridge) * (1.0 - smoothstep(0.7, 1.0, r));
    vec3 inner = vec3(0.72, 0.56, 0.98);
    vec3 outer = vec3(0.30, 0.20, 0.58);
    vec3 col = mix(inner, outer, smoothstep(0.05, 0.7, r));
    gl_FragColor = vec4(col * a * 1.1, a * 1.1);
  }
`

/* ─────────────────────────────────────────────────────────────
   Component
   ───────────────────────────────────────────────────────────── */
export default function Galaxy({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const hostEl: HTMLDivElement = host

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /* ── renderer ── */
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
      premultipliedAlpha: true,
    })
    renderer.setClearColor(0x000000, 0)
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    renderer.setPixelRatio(dpr)
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.opacity = '0'
    renderer.domElement.style.transition = 'opacity 1.4s ease 0.25s'
    host.appendChild(renderer.domElement)
    void renderer.domElement.offsetWidth

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200)

    /* ── galaxy ── */
    const galaxy = new THREE.Group()
    scene.add(galaxy)

    const starGeo = buildStars(110_000, 1337)
    const starMat = new THREE.ShaderMaterial({
      vertexShader: starVert,
      fragmentShader: starFrag,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 56 * dpr },
        uPointer: { value: new THREE.Vector3(999, 0, 999) },
        uPointerStrength: { value: 0 },
        uRotate: { value: reduceMotion ? 0 : 1 },
      },
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    })
    const stars = new THREE.Points(starGeo, starMat)
    stars.frustumCulled = false
    stars.renderOrder = 2
    galaxy.add(stars)

    const dustGeo = buildDust(9_000, 4242)
    const dustMat = new THREE.ShaderMaterial({
      vertexShader: dustVert,
      fragmentShader: dustFrag,
      uniforms: {
        uTime: starMat.uniforms.uTime,
        uSize: { value: 56 * dpr },
        uRotate: starMat.uniforms.uRotate,
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.NormalBlending,
    })
    const dust = new THREE.Points(dustGeo, dustMat)
    dust.frustumCulled = false
    dust.renderOrder = 3
    galaxy.add(dust)

    const hazeMat = new THREE.ShaderMaterial({
      vertexShader: hazeVert,
      fragmentShader: hazeFrag,
      uniforms: {
        uTime: starMat.uniforms.uTime,
        uRotate: starMat.uniforms.uRotate,
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })
    const haze = new THREE.Mesh(new THREE.PlaneGeometry(RADIUS * 2.2, RADIUS * 2.2), hazeMat)
    haze.rotation.x = -Math.PI / 2
    haze.renderOrder = 1
    galaxy.add(haze)

    /* core glow sprite */
    const glowCanvas = document.createElement('canvas')
    glowCanvas.width = glowCanvas.height = 256
    const gctx = glowCanvas.getContext('2d')!
    const grad = gctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    grad.addColorStop(0.0, 'rgba(226,208,255,0.7)')
    grad.addColorStop(0.10, 'rgba(196,166,255,0.5)')
    grad.addColorStop(0.35, 'rgba(140,100,220,0.2)')
    grad.addColorStop(1.0, 'rgba(90,60,160,0)')
    gctx.fillStyle = grad
    gctx.fillRect(0, 0, 256, 256)
    const glowTex = new THREE.CanvasTexture(glowCanvas)
    const glowMat = new THREE.SpriteMaterial({
      map: glowTex,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.5,
    })
    const glow = new THREE.Sprite(glowMat)
    glow.scale.setScalar(3.6)
    glow.renderOrder = 0
    galaxy.add(glow)

    /* far starfield */
    const farGeo = buildFarStars(1600, 99)
    const farMat = new THREE.ShaderMaterial({
      vertexShader: farVert,
      fragmentShader: farFrag,
      uniforms: {
        uTime: starMat.uniforms.uTime,
        uSize: { value: 56 * dpr },
      },
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    })
    const far = new THREE.Points(farGeo, farMat)
    far.frustumCulled = false
    far.renderOrder = -1
    scene.add(far)

    /* ── camera orbit state ── */
    const orbit = {
      azimuth: 0.6,
      polar: 0.86,
      distance: 10.2,
      baseAzimuth: 0.6,
      basePolar: 0.86,
      parallaxX: 0,
      parallaxY: 0,
      velAz: 0,
      velPol: 0,
      dragging: false,
      lastX: 0,
      lastY: 0,
      hover: 0,
      hoverTarget: 0,
    }
    const pointerWorld = new THREE.Vector3(999, 0, 999)
    const pointerTarget = new THREE.Vector3(999, 0, 999)

    const clampPolar = (p: number) => Math.min(1.32, Math.max(0.28, p))

    function updateCamera() {
      const az = orbit.azimuth
      const po = orbit.polar
      const d = orbit.distance
      camera.position.set(
        d * Math.sin(po) * Math.sin(az),
        d * Math.cos(po),
        d * Math.sin(po) * Math.cos(az),
      )
      camera.lookAt(0, 0, 0)
    }

    /* ── sizing ── */
    function resize() {
      const w = hostEl.clientWidth || 1
      const h = hostEl.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(host)

    /* ── pointer → galaxy plane ── */
    const raycaster = new THREE.Raycaster()
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    const ndc = new THREE.Vector2()

    function projectPointer(clientX: number, clientY: number) {
      const rect = renderer.domElement.getBoundingClientRect()
      ndc.x = ((clientX - rect.left) / rect.width) * 2 - 1
      ndc.y = -(((clientY - rect.top) / rect.height) * 2 - 1)
      raycaster.setFromCamera(ndc, camera)
      const hit = new THREE.Vector3()
      if (raycaster.ray.intersectPlane(plane, hit)) {
        pointerTarget.copy(hit)
        return true
      }
      return false
    }

    function onWindowMove(e: PointerEvent) {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      orbit.parallaxX = nx
      orbit.parallaxY = ny
    }

    function onEnter() { orbit.hoverTarget = 1 }
    function onLeave() {
      orbit.hoverTarget = 0
      if (!orbit.dragging) pointerTarget.set(999, 0, 999)
    }
    function onMove(e: PointerEvent) {
      projectPointer(e.clientX, e.clientY)
      if (orbit.dragging) {
        const dx = e.clientX - orbit.lastX
        const dy = e.clientY - orbit.lastY
        orbit.lastX = e.clientX
        orbit.lastY = e.clientY
        orbit.baseAzimuth -= dx * 0.0055
        orbit.basePolar = clampPolar(orbit.basePolar - dy * 0.0045)
        orbit.velAz = -dx * 0.0055
        orbit.velPol = -dy * 0.0045
      }
    }
    function onDown(e: PointerEvent) {
      if (e.button !== 0 && e.pointerType === 'mouse') return
      orbit.dragging = true
      orbit.lastX = e.clientX
      orbit.lastY = e.clientY
      orbit.velAz = 0
      orbit.velPol = 0
      renderer.domElement.setPointerCapture(e.pointerId)
      renderer.domElement.style.cursor = 'grabbing'
    }
    function onUp(e: PointerEvent) {
      if (!orbit.dragging) return
      orbit.dragging = false
      try { renderer.domElement.releasePointerCapture(e.pointerId) } catch {}
      renderer.domElement.style.cursor = 'grab'
    }

    const el = renderer.domElement
    el.style.cursor = 'grab'
    el.style.touchAction = 'pan-y'
    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    window.addEventListener('pointermove', onWindowMove, { passive: true })

    /* ── visibility gating ── */
    let inView = true
    let pageVisible = document.visibilityState === 'visible'
    const io = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting }, { threshold: 0.02 })
    io.observe(host)
    const onVis = () => { pageVisible = document.visibilityState === 'visible' }
    document.addEventListener('visibilitychange', onVis)

    /* ── loop ── */
    let last = performance.now()
    let elapsed = 0
    let raf = 0
    let shown = false

    function frame() {
      raf = requestAnimationFrame(frame)
      const now = performance.now()
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      // always draw the first frame so the fade-in starts even if the
      // observers report the canvas as offscreen at mount time
      if (shown && (!inView || !pageVisible)) return

      if (!reduceMotion) elapsed += dt
      starMat.uniforms.uTime.value = elapsed

      // auto drift + inertia
      if (!orbit.dragging) {
        if (!reduceMotion) orbit.baseAzimuth += dt * 0.035
        orbit.baseAzimuth += orbit.velAz
        orbit.basePolar = clampPolar(orbit.basePolar + orbit.velPol)
        orbit.velAz *= 0.92
        orbit.velPol *= 0.92
      }

      const k = 1 - Math.pow(0.001, dt) // frame-rate independent damping
      const targetAz = orbit.baseAzimuth + orbit.parallaxX * 0.22
      const targetPo = clampPolar(orbit.basePolar + orbit.parallaxY * 0.14)
      orbit.azimuth += (targetAz - orbit.azimuth) * k * 0.6
      orbit.polar += (targetPo - orbit.polar) * k * 0.6
      updateCamera()

      orbit.hover += (orbit.hoverTarget - orbit.hover) * k
      starMat.uniforms.uPointerStrength.value = orbit.hover
      if (pointerTarget.x > 900) {
        // pointer left: keep last position but fade strength
      } else {
        pointerWorld.lerp(pointerTarget, k * 1.4)
      }
      starMat.uniforms.uPointer.value.copy(pointerWorld)

      renderer.render(scene, camera)

      if (!shown) {
        shown = true
        renderer.domElement.style.opacity = '1'
      }
    }
    // draw the first frame synchronously so something is on screen immediately
    frame()
    if (process.env.NODE_ENV !== 'production') {
      ;(window as any).__galaxyDebug = {
        tick(seconds: number) { elapsed += seconds; starMat.uniforms.uTime.value = elapsed; updateCamera(); renderer.render(scene, camera) },
      }
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pointermove', onWindowMove)
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointerleave', onLeave)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
      starGeo.dispose(); starMat.dispose()
      dustGeo.dispose(); dustMat.dispose()
      farGeo.dispose(); farMat.dispose()
      haze.geometry.dispose(); hazeMat.dispose()
      glowTex.dispose(); glowMat.dispose()
      renderer.dispose()
      if (el.parentNode === hostEl) hostEl.removeChild(el)
    }
  }, [])

  return <div ref={hostRef} className={className} style={style} aria-hidden="true" />
}
