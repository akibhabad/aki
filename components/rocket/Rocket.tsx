'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/* ─────────────────────────────────────────────────────────────
   Artemis / SLS Block 1, built from primitives and shaded
   entirely in the site's purple range. Hover (or tap) pulls the
   stack apart into an exploded view; drag to orbit.
   All dimensions are metres × 0.1.
   ───────────────────────────────────────────────────────────── */

const S = 0.1
const SEG = 64

const PAL = {
  core:     0x6a4fb0,   // brand purple, the orange core stage
  coreDark: 0x4a367f,
  srb:      0xb9addc,   // pale lavender, the white boosters
  srbBand:  0x7c5cbf,
  icps:     0x9d85d1,
  lvsa:     0x8168c0,
  orion:    0xa08ccf,
  crew:     0x3d2f66,
  las:      0xc8bde8,
  engine:   0x2a2140,
  engineLip:0x8f7ad8,
}

function mat(color: number, opts: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.55,
    metalness: 0.18,
    ...opts,
  })
}
const engineMat = () => mat(PAL.engine, { roughness: 0.32, metalness: 0.85 })

const edgeMat = new THREE.LineBasicMaterial({
  color: 0xc4b3ff,
  transparent: true,
  opacity: 0.22,
  depthWrite: false,
})

/** cylinder / frustum whose base sits at y0 and top at y1 (metres) */
function tube(rTop: number, rBot: number, y0: number, y1: number, m: THREE.Material, open = false, edges = true) {
  const h = (y1 - y0) * S
  const g = new THREE.CylinderGeometry(rTop * S, rBot * S, h, SEG, 1, open)
  const mesh = new THREE.Mesh(g, m)
  mesh.position.y = (y0 * S) + h / 2
  if (edges) {
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(g, 40), edgeMat)
    mesh.add(e)
  }
  return mesh
}

function ring(r: number, y: number, tubeR: number, m: THREE.Material) {
  const g = new THREE.TorusGeometry(r * S, tubeR * S, 8, SEG)
  const mesh = new THREE.Mesh(g, m)
  mesh.rotation.x = Math.PI / 2
  mesh.position.y = y * S
  return mesh
}

function nozzle(rThroat: number, rExit: number, yTop: number, h: number, x = 0, z = 0) {
  const g = new THREE.Group()
  const bell = tube(rThroat, rExit, yTop - h, yTop, engineMat(), true, false)
  const lip = ring(rExit, yTop - h, rExit * 0.08, mat(PAL.engineLip, { metalness: 0.7, roughness: 0.3 }))
  g.add(bell, lip)
  g.position.set(x * S, 0, z * S)
  return g
}

type Part = {
  group: THREE.Group
  /** explode offset in metres (x, y) at full explosion */
  dx: number
  dy: number
  /** optional extra rotation on z at full explosion (rad) */
  rz?: number
}

function buildRocket() {
  const root = new THREE.Group()
  const parts: Part[] = []
  const add = (group: THREE.Group, dx: number, dy: number, rz?: number) => {
    root.add(group)
    parts.push({ group, dx, dy, rz })
    return group
  }

  /* ── core stage (0 → 64 m) ── */
  const core = new THREE.Group()
  core.add(tube(4.2, 4.2, 0, 64, mat(PAL.core)))
  core.add(ring(4.28, 22, 0.14, mat(PAL.coreDark)))
  core.add(ring(4.28, 45, 0.14, mat(PAL.coreDark)))
  core.add(ring(4.28, 1.2, 0.18, mat(PAL.coreDark)))
  // engine section skirt + four RS-25s
  core.add(tube(4.2, 4.35, -1.0, 0, mat(PAL.coreDark)))
  for (const [x, z] of [[1.9, 1.9], [-1.9, 1.9], [1.9, -1.9], [-1.9, -1.9]]) {
    core.add(nozzle(0.55, 1.25, -1.0, 3.4, x, z))
  }
  // systems tunnel down one side
  const tunnel = new THREE.Mesh(new THREE.BoxGeometry(0.5 * S, 60 * S, 0.5 * S), mat(PAL.coreDark))
  tunnel.position.set(0, 32 * S, 4.3 * S)
  core.add(tunnel)
  add(core, 0, 0)

  /* ── solid rocket boosters ── */
  const srb = (side: number) => {
    const g = new THREE.Group()
    g.add(tube(1.85, 1.85, -1.5, 44.5, mat(PAL.srb)))
    g.add(tube(1.05, 1.85, 44.5, 48.5, mat(PAL.srb)))
    g.add(tube(0.06, 1.05, 48.5, 54.5, mat(PAL.srb)))
    for (const y of [8, 19, 30, 41]) g.add(ring(1.9, y, 0.09, mat(PAL.srbBand)))
    g.add(nozzle(0.75, 1.55, -1.5, 3.2))
    // attach struts to the core
    for (const y of [4, 42]) {
      const strut = new THREE.Mesh(new THREE.BoxGeometry(1.1 * S, 0.5 * S, 0.9 * S), mat(PAL.coreDark))
      strut.position.set(-side * 1.9 * S, y * S, 0)
      g.add(strut)
    }
    g.position.x = side * 6.1 * S
    return g
  }
  add(srb(1), 9, -6, -0.12)
  add(srb(-1), -9, -6, 0.12)

  /* ── launch vehicle stage adapter (64 → 72.5) ── */
  const lvsa = new THREE.Group()
  lvsa.add(tube(2.6, 4.2, 64, 72.5, mat(PAL.lvsa)))
  add(lvsa, 0, 7)

  /* ── ICPS upper stage (72.5 → 86) with its RL10 ── */
  const icps = new THREE.Group()
  icps.add(tube(2.55, 2.55, 72.5, 86, mat(PAL.icps)))
  icps.add(ring(2.6, 84.5, 0.08, mat(PAL.srbBand)))
  icps.add(tube(2.55, 2.4, 71.6, 72.5, mat(PAL.coreDark)))
  icps.add(nozzle(0.35, 1.05, 71.6, 2.6))
  add(icps, 0, 16)

  /* ── Orion service module + fairing panels (86 → 93) ── */
  const esm = new THREE.Group()
  esm.add(tube(2.05, 2.55, 86, 87.2, mat(PAL.lvsa)))
  esm.add(tube(2.0, 2.0, 87.2, 92.6, mat(PAL.crew, { roughness: 0.4, metalness: 0.5 })))
  esm.add(nozzle(0.3, 0.7, 87.2, 1.4))
  add(esm, 0, 27)

  // three jettisonable fairing panels around the ESM
  const panels: Part[] = []
  for (let i = 0; i < 3; i++) {
    const g = new THREE.Group()
    const geo = new THREE.CylinderGeometry(2.5 * S, 2.6 * S, 6 * S, 40, 1, true, (i * Math.PI * 2) / 3 + 0.05, Math.PI * 2 / 3 - 0.1)
    const m = new THREE.Mesh(geo, mat(PAL.orion, { side: THREE.DoubleSide }))
    m.position.y = 90 * S
    m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 40), edgeMat))
    g.add(m)
    root.add(g)
    const ang = (i * Math.PI * 2) / 3 + Math.PI / 3
    panels.push({ group: g, dx: Math.cos(ang) * 6, dy: 27 + 2, rz: 0 })
    ;(g as any).__panelAngle = ang
  }

  /* ── crew module (93 → 96.4) ── */
  const crew = new THREE.Group()
  crew.add(tube(2.5, 2.5, 92.6, 93.2, mat(PAL.crew, { roughness: 0.4, metalness: 0.5 })))
  crew.add(tube(0.95, 2.5, 93.2, 96.4, mat(PAL.crew, { roughness: 0.45, metalness: 0.4 })))
  add(crew, 0, 36)

  /* ── launch abort system (93 → 109) ── */
  const las = new THREE.Group()
  las.add(tube(1.0, 2.65, 93.0, 97.2, mat(PAL.las, { side: THREE.DoubleSide }), true))
  las.add(tube(0.42, 1.0, 97.2, 98.2, mat(PAL.las)))
  las.add(tube(0.42, 0.42, 98.2, 104.0, mat(PAL.las)))
  las.add(tube(0.62, 0.62, 100.0, 102.4, mat(PAL.crew, { metalness: 0.6, roughness: 0.35 })))
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2
    const n = nozzle(0.12, 0.34, 100.9, 0.9, Math.cos(a) * 0.72, Math.sin(a) * 0.72)
    n.rotation.z = Math.cos(a) * 0.6
    n.rotation.x = -Math.sin(a) * 0.6
    las.add(n)
  }
  las.add(tube(0.02, 0.42, 104.0, 109.0, mat(PAL.las)))
  add(las, 0, 47)

  return { root, parts, panels }
}

export default function Rocket({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const hostEl: HTMLDivElement = host
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setClearColor(0x000000, 0)
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    renderer.setPixelRatio(dpr)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    const el = renderer.domElement
    el.style.display = 'block'
    el.style.width = '100%'
    el.style.height = '100%'
    el.style.opacity = '0'
    el.style.transition = 'opacity 1.4s ease 0.35s'
    el.style.cursor = 'grab'
    el.style.touchAction = 'pan-y'
    hostEl.appendChild(el)
    void el.offsetWidth

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)

    /* lights: lavender key, purple rim, faint violet fill */
    scene.add(new THREE.AmbientLight(0x3a2c66, 1.6))
    const key = new THREE.DirectionalLight(0xe6dcff, 3.0)
    key.position.set(-4, 8, 6)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0x7c5cbf, 4.0)
    rim.position.set(6, 3, -5)
    scene.add(rim)
    const fill = new THREE.DirectionalLight(0x5a3fa0, 0.9)
    fill.position.set(3, -6, 4)
    scene.add(fill)

    const { root, parts, panels } = buildRocket()
    const pivot = new THREE.Group()
    pivot.add(root)
    scene.add(pivot)

    const H = 109 * S // stack height
    root.position.y = -H / 2 - 0.15

    /* state */
    const st = {
      explode: 0,
      explodeTarget: 0,
      yaw: 0.55,
      yawVel: 0,
      pitch: 0,
      parallaxX: 0,
      parallaxY: 0,
      dragging: false,
      lastX: 0,
      lastY: 0,
      hover: false,
      touchToggle: false,
    }

    function applyExplode(e: number) {
      const ease = e * e * (3 - 2 * e)
      for (const p of parts) {
        p.group.position.x = (p.group === parts[1].group ? 6.1 : p.group === parts[2].group ? -6.1 : 0) * S + p.dx * S * ease
        p.group.position.y = p.dy * S * ease
        p.group.rotation.z = (p.rz ?? 0) * ease
      }
      for (const p of panels) {
        const a = (p.group as any).__panelAngle as number
        p.group.position.x = Math.cos(a) * 5.5 * S * ease
        p.group.position.z = -Math.sin(a) * 5.5 * S * ease
        p.group.position.y = p.dy * S * ease
        p.group.rotation.z = -Math.cos(a) * 0.35 * ease
        p.group.rotation.x = -Math.sin(a) * 0.35 * ease
      }
      // keep the expanded stack centred and framed
      const extra = 47 * S * ease
      root.position.y = -(H + extra) / 2 - 0.15 + 6 * S * ease
      camera.position.z = 25.5 + 10 * ease
    }

    function resize() {
      const w = hostEl.clientWidth || 1
      const h = hostEl.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(hostEl)

    camera.position.set(0, 1.2, 25.5)
    camera.lookAt(0, -0.2, 0)

    /* interaction */
    const onWindowMove = (e: PointerEvent) => {
      st.parallaxX = (e.clientX / window.innerWidth) * 2 - 1
      st.parallaxY = (e.clientY / window.innerHeight) * 2 - 1
    }
    const onEnter = (e: PointerEvent) => { if (e.pointerType === 'mouse') st.hover = true }
    const onLeave = () => { st.hover = false }
    const onMove = (e: PointerEvent) => {
      if (!st.dragging) return
      const dx = e.clientX - st.lastX
      const dy = e.clientY - st.lastY
      st.lastX = e.clientX
      st.lastY = e.clientY
      st.yaw += dx * 0.008
      st.yawVel = dx * 0.008
      st.pitch = Math.max(-0.5, Math.min(0.5, st.pitch + dy * 0.004))
    }
    const onDown = (e: PointerEvent) => {
      st.dragging = true
      st.lastX = e.clientX
      st.lastY = e.clientY
      st.yawVel = 0
      el.setPointerCapture(e.pointerId)
      el.style.cursor = 'grabbing'
    }
    const onUp = (e: PointerEvent) => {
      if (!st.dragging) return
      st.dragging = false
      try { el.releasePointerCapture(e.pointerId) } catch {}
      el.style.cursor = 'grab'
      if (e.pointerType !== 'mouse') st.touchToggle = !st.touchToggle
    }
    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    window.addEventListener('pointermove', onWindowMove, { passive: true })

    let inView = true
    const io = new IntersectionObserver(([en]) => { inView = en.isIntersecting }, { threshold: 0.02 })
    io.observe(hostEl)

    let last = performance.now()
    let raf = 0
    let shown = false

    function frame() {
      raf = requestAnimationFrame(frame)
      const now = performance.now()
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      if (shown && !inView) return

      const k = 1 - Math.pow(0.002, dt)
      st.explodeTarget = (st.hover || st.touchToggle) ? 1 : 0
      st.explode += (st.explodeTarget - st.explode) * k * 0.55
      applyExplode(st.explode)

      if (!st.dragging) {
        if (!reduceMotion) st.yaw += dt * 0.18
        st.yaw += st.yawVel
        st.yawVel *= 0.9
        st.pitch += (0 - st.pitch) * k * 0.3
      }
      pivot.rotation.y = st.yaw + st.parallaxX * 0.18
      pivot.rotation.x = st.pitch + st.parallaxY * 0.08
      pivot.rotation.z = -0.06

      renderer.render(scene, camera)
      if (!shown) {
        shown = true
        el.style.opacity = '1'
      }
    }
    // draw the first frame synchronously so something is on screen immediately
    frame()
    if (process.env.NODE_ENV !== 'production') {
      ;(window as any).__rocketDebug = {
        set(explode: number, yaw?: number) { st.explode = explode; if (yaw !== undefined) st.yaw = yaw; applyExplode(explode); pivot.rotation.y = st.yaw; renderer.render(scene, camera) },
      }
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onWindowMove)
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointerleave', onLeave)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
      scene.traverse((o) => {
        const m = o as THREE.Mesh
        if (m.geometry) m.geometry.dispose()
        const mm = (m as any).material
        if (mm) (Array.isArray(mm) ? mm : [mm]).forEach((x: THREE.Material) => x.dispose())
      })
      renderer.dispose()
      if (el.parentNode === hostEl) hostEl.removeChild(el)
    }
  }, [])

  return <div ref={hostRef} className={className} style={style} aria-hidden="true" />
}
