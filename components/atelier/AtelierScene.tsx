'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { NODES, ACCENTS, NodeConfig, NodeId } from './atelier-types'

/* ─────────────────────────────────────────────────────────────
   Atmospheric layers
   ───────────────────────────────────────────────────────────── */

function softCircleTexture() {
  const size = 128
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.3, 'rgba(255,255,255,0.45)')
  g.addColorStop(0.65, 'rgba(255,255,255,0.08)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function nebulaTexture(hue: number) {
  const size = 512
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, `hsla(${hue}, 90%, 70%, 0.6)`)
  g.addColorStop(0.4, `hsla(${hue}, 80%, 55%, 0.18)`)
  g.addColorStop(0.75, `hsla(${hue}, 70%, 40%, 0.05)`)
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function StarField({ count = 5000, radius = 140 }: { count?: number; radius?: number }) {
  const tex = useMemo(softCircleTexture, [])
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const cyan = new THREE.Color('#bce8ff')
    const warm = new THREE.Color('#ffd9a8')
    const white = new THREE.Color('#ffffff')
    for (let i = 0; i < count; i++) {
      const r = radius * (0.55 + Math.random() * 0.45)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
      const roll = Math.random()
      const c = roll < 0.05 ? warm : roll < 0.65 ? white : cyan
      colors[i * 3 + 0] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
      sizes[i] = Math.random() * 1.6 + 0.4
    }
    return { positions, colors, sizes }
  }, [count, radius])

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    g.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    return g
  }, [positions, colors, sizes])

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uMap: { value: tex },
          uPixelRatio: { value: typeof window === 'undefined' ? 1 : Math.min(window.devicePixelRatio, 2) },
        },
        vertexShader: `
          attribute float aSize;
          varying vec3 vColor;
          uniform float uPixelRatio;
          void main() {
            vColor = color;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = aSize * 22.0 * uPixelRatio * (1.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          uniform sampler2D uMap;
          varying vec3 vColor;
          void main() {
            vec4 t = texture2D(uMap, gl_PointCoord);
            if (t.a < 0.02) discard;
            gl_FragColor = vec4(vColor, t.a);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
      }),
    [tex],
  )

  const ref = useRef<THREE.Points>(null)
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.005
  })

  return <points ref={ref} geometry={geom} material={mat} />
}

function Nebula() {
  const sprites = useMemo(
    () => [
      { hue: 200, color: '#6FE3FF', pos: [-22, 4, -30] as [number, number, number], scale: 50, opacity: 0.45 },
      { hue: 280, color: '#a060ff', pos: [25, -6, -32] as [number, number, number], scale: 56, opacity: 0.35 },
      { hue: 30,  color: '#FFB878', pos: [-6, -12, -22] as [number, number, number], scale: 32, opacity: 0.32 },
      { hue: 215, color: '#5cb0ff', pos: [10, 14, -38] as [number, number, number], scale: 44, opacity: 0.3 },
    ],
    [],
  )
  const textures = useMemo(() => sprites.map((s) => nebulaTexture(s.hue)), [sprites])

  const groupRef = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (groupRef.current) groupRef.current.rotation.z += dt * 0.005
  })

  return (
    <group ref={groupRef}>
      {sprites.map((s, i) => (
        <sprite key={i} position={s.pos} scale={[s.scale, s.scale, 1]}>
          <spriteMaterial
            map={textures[i]}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            opacity={s.opacity}
          />
        </sprite>
      ))}
    </group>
  )
}

/* ─────────────────────────────────────────────────────────────
   Node objects
   ───────────────────────────────────────────────────────────── */

function NodeLabel({
  node,
  hovered,
  active,
}: {
  node: NodeConfig
  hovered: boolean
  active: boolean
}) {
  const accent = ACCENTS[node.accent]
  return (
    <Html
      center
      distanceFactor={10}
      position={[0, -2.0, 0]}
      style={{
        pointerEvents: 'none',
        opacity: active ? 0 : hovered ? 1 : 0.7,
        transition: 'opacity 0.3s ease',
        whiteSpace: 'nowrap',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          fontFamily: '"SF Mono", "Menlo", monospace',
          fontSize: '11px',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: accent,
          padding: '6px 12px',
          background: 'rgba(5, 7, 20, 0.55)',
          border: `1px solid ${accent}55`,
          borderRadius: '2px',
          backdropFilter: 'blur(6px)',
          textShadow: `0 0 12px ${accent}88`,
          boxShadow: hovered ? `0 0 18px ${accent}44` : 'none',
          transition: 'box-shadow 0.2s ease',
        }}
      >
        ◇ {node.name}
      </div>
    </Html>
  )
}

function HoverGlow({ node, hovered }: { node: NodeConfig; hovered: boolean }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, dt) => {
    if (!ref.current) return
    const m = ref.current.material as THREE.MeshBasicMaterial
    const target = hovered ? 0.4 : 0.12
    m.opacity += (target - m.opacity) * Math.min(1, dt * 6)
  })
  const accent = ACCENTS[node.accent]
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.4, 32, 32]} />
      <meshBasicMaterial color={accent} transparent opacity={0.12} />
    </mesh>
  )
}

/* ─── Writing: constellation ───────────────────────────────── */
function ConstellationNode({
  node,
  hovered,
  active,
  onPointerOver,
  onPointerOut,
  onClick,
}: NodeProps) {
  const points = useMemo(() => {
    // 9 stars in a rough open-book / page shape
    return [
      [-1.0, 0.8, 0],
      [-0.55, 1.05, 0.1],
      [0, 0.9, 0],
      [0.55, 1.05, -0.1],
      [1.0, 0.8, 0],
      [-0.6, 0, 0],
      [0, 0.05, 0.05],
      [0.6, 0, 0],
      [0, -0.6, 0],
    ] as [number, number, number][]
  }, [])
  const lines = useMemo(() => {
    return [
      [0, 1], [1, 2], [2, 3], [3, 4],
      [0, 5], [5, 6], [6, 7], [7, 4],
      [5, 8], [8, 7], [6, 8],
    ]
  }, [])

  const groupRef = useRef<THREE.Group>(null)
  useFrame((state, dt) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += dt * 0.18
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.18
    }
  })

  const lineGeom = useMemo(() => {
    const verts: number[] = []
    for (const [a, b] of lines) {
      verts.push(...points[a], ...points[b])
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    return g
  }, [lines, points])

  const accent = ACCENTS[node.accent]
  return (
    <group position={node.position}>
      <group
        ref={groupRef}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onClick={onClick}
      >
        <HoverGlow node={node} hovered={hovered} />
        {points.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial color={accent} toneMapped={false} />
          </mesh>
        ))}
        <lineSegments geometry={lineGeom}>
          <lineBasicMaterial color={accent} transparent opacity={0.55} />
        </lineSegments>
        {/* invisible big hitbox so easier to click */}
        <mesh visible={false}>
          <sphereGeometry args={[1.5, 8, 8]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>
      <NodeLabel node={node} hovered={hovered} active={active} />
    </group>
  )
}

/* ─── Projects: ringed planet ──────────────────────────────── */
function RingedPlanetNode({
  node,
  hovered,
  active,
  onPointerOver,
  onPointerOut,
  onClick,
}: NodeProps) {
  const planetRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state, dt) => {
    if (planetRef.current) planetRef.current.rotation.y += dt * 0.25
    if (ringRef.current) ringRef.current.rotation.z += dt * 0.05
    if (groupRef.current) groupRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.5) * 0.18
  })
  const accent = ACCENTS[node.accent]
  return (
    <group position={node.position}>
      <group
        ref={groupRef}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onClick={onClick}
      >
        <HoverGlow node={node} hovered={hovered} />
        <mesh ref={planetRef}>
          <sphereGeometry args={[0.85, 64, 64]} />
          <meshStandardMaterial
            color={'#3a2a14'}
            emissive={accent}
            emissiveIntensity={0.6}
            roughness={0.6}
          />
        </mesh>
        {/* ring */}
        <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
          <ringGeometry args={[1.25, 1.85, 96]} />
          <meshBasicMaterial
            color={accent}
            side={THREE.DoubleSide}
            transparent
            opacity={0.55}
            toneMapped={false}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <ringGeometry args={[1.95, 2.05, 96]} />
          <meshBasicMaterial
            color={accent}
            side={THREE.DoubleSide}
            transparent
            opacity={0.3}
            toneMapped={false}
          />
        </mesh>
      </group>
      <NodeLabel node={node} hovered={hovered} active={active} />
    </group>
  )
}

/* ─── About: pulsar ─────────────────────────────────────────── */
function PulsarNode({
  node,
  hovered,
  active,
  onPointerOver,
  onPointerOut,
  onClick,
}: NodeProps) {
  const beamRef = useRef<THREE.Group>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  useFrame((state, dt) => {
    if (beamRef.current) beamRef.current.rotation.z += dt * 1.4
    if (coreRef.current) {
      const m = coreRef.current.material as THREE.MeshBasicMaterial
      m.opacity = 0.9 + Math.sin(state.clock.elapsedTime * 4) * 0.1
    }
  })
  const accent = ACCENTS[node.accent]
  return (
    <group position={node.position}>
      <group
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onClick={onClick}
      >
        <HoverGlow node={node} hovered={hovered} />
        <mesh ref={coreRef}>
          <sphereGeometry args={[0.32, 32, 32]} />
          <meshBasicMaterial color={'#ffffff'} transparent opacity={0.9} toneMapped={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshBasicMaterial color={accent} transparent opacity={0.25} toneMapped={false} />
        </mesh>
        <group ref={beamRef}>
          {/* two opposing beams as long thin cones */}
          <mesh position={[0, 1.6, 0]}>
            <coneGeometry args={[0.12, 3, 16, 1, true]} />
            <meshBasicMaterial color={accent} transparent opacity={0.55} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
          <mesh position={[0, -1.6, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.12, 3, 16, 1, true]} />
            <meshBasicMaterial color={accent} transparent opacity={0.55} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
        </group>
      </group>
      <NodeLabel node={node} hovered={hovered} active={active} />
    </group>
  )
}

/* ─── Contact: beacon ──────────────────────────────────────── */
function BeaconNode({
  node,
  hovered,
  active,
  onPointerOver,
  onPointerOut,
  onClick,
}: NodeProps) {
  const ringsRef = useRef<THREE.Group>(null)
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state, dt) => {
    if (groupRef.current) groupRef.current.rotation.y += dt * 0.15
    if (ringsRef.current) {
      ringsRef.current.children.forEach((c, i) => {
        const t = (state.clock.elapsedTime * 0.7 + i * 0.6) % 2
        c.scale.setScalar(0.6 + t * 1.6)
        const m = (c as THREE.Mesh).material as THREE.MeshBasicMaterial
        m.opacity = Math.max(0, 0.5 - t * 0.25)
      })
    }
  })
  const accent = ACCENTS[node.accent]
  return (
    <group position={node.position}>
      <group
        ref={groupRef}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onClick={onClick}
      >
        <HoverGlow node={node} hovered={hovered} />
        {/* obelisk */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.18, 1.6, 8]} />
          <meshStandardMaterial color={'#1a0e04'} emissive={accent} emissiveIntensity={0.7} />
        </mesh>
        <mesh position={[0, 0.95, 0]}>
          <sphereGeometry args={[0.18, 24, 24]} />
          <meshBasicMaterial color={accent} toneMapped={false} />
        </mesh>
        <group ref={ringsRef}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.6, 0.66, 64]} />
              <meshBasicMaterial color={accent} transparent opacity={0.5} side={THREE.DoubleSide} toneMapped={false} />
            </mesh>
          ))}
        </group>
      </group>
      <NodeLabel node={node} hovered={hovered} active={active} />
    </group>
  )
}

interface NodeProps {
  node: NodeConfig
  hovered: boolean
  active: boolean
  onPointerOver: (e: any) => void
  onPointerOut: (e: any) => void
  onClick: (e: any) => void
}

function NodeRenderer(props: NodeProps) {
  switch (props.node.id) {
    case 'writing':
      return <ConstellationNode {...props} />
    case 'projects':
      return <RingedPlanetNode {...props} />
    case 'about':
      return <PulsarNode {...props} />
    case 'contact':
      return <BeaconNode {...props} />
  }
}

/* ─────────────────────────────────────────────────────────────
   Central core (tiny accretion-flare at origin)
   ───────────────────────────────────────────────────────────── */
function CoreFlare() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (ref.current) {
      const m = ref.current.material as THREE.MeshBasicMaterial
      m.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshBasicMaterial color={'#ffd9a8'} transparent opacity={0.3} toneMapped={false} />
    </mesh>
  )
}

/* ─────────────────────────────────────────────────────────────
   Camera rig: orbits when idle, dives toward node when active
   ───────────────────────────────────────────────────────────── */
function CameraRig({
  activeId,
  controls,
  onArrived,
}: {
  activeId: NodeId | null
  controls: React.RefObject<any>
  onArrived: () => void
}) {
  const { camera } = useThree()
  const desiredPos = useMemo(() => new THREE.Vector3(0, 1.2, 16), [])
  const desiredTarget = useMemo(() => new THREE.Vector3(0, 0, 0), [])
  const arrivedRef = useRef(false)

  useFrame(() => {
    const node = activeId ? NODES.find((n) => n.id === activeId) : null
    if (node) {
      const np = new THREE.Vector3(...node.position)
      const dirFromOrigin = np.clone().normalize()
      const cameraOffset = dirFromOrigin.multiplyScalar(4.2)
      desiredPos.set(np.x + cameraOffset.x, np.y + 1.0, np.z + cameraOffset.z)
      desiredTarget.copy(np)
    } else {
      desiredPos.set(0, 1.2, 16)
      desiredTarget.set(0, 0, 0)
    }
    camera.position.lerp(desiredPos, 0.06)
    if (controls.current) {
      controls.current.target.lerp(desiredTarget, 0.06)
      controls.current.update()
    }
    const dist = camera.position.distanceTo(desiredPos)
    if (dist < 0.05 && !arrivedRef.current) {
      arrivedRef.current = true
      if (activeId) onArrived()
    }
    if (dist > 0.2) arrivedRef.current = false
  })

  return null
}

/* ─────────────────────────────────────────────────────────────
   Scene
   ───────────────────────────────────────────────────────────── */
function Scene({
  activeId,
  setActiveId,
  hovered,
  setHovered,
  onArrived,
  isMobile,
}: {
  activeId: NodeId | null
  setActiveId: (id: NodeId | null) => void
  hovered: NodeId | null
  setHovered: (id: NodeId | null) => void
  onArrived: () => void
  isMobile: boolean
}) {
  const controls = useRef<any>(null)

  return (
    <>
      <color attach="background" args={['#050714']} />
      <fog attach="fog" args={['#050714', 25, 80]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 0, 0]} intensity={1.4} color={'#ffd9a8'} distance={20} />
      <pointLight position={[10, 6, 8]} intensity={0.6} color={'#6FE3FF'} distance={30} />

      <StarField count={isMobile ? 2000 : 5500} radius={140} />
      <Nebula />
      <CoreFlare />

      {NODES.map((node) => (
        <NodeRenderer
          key={node.id}
          node={node}
          hovered={hovered === node.id}
          active={activeId === node.id}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHovered(node.id)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={(e) => {
            e.stopPropagation()
            setHovered(null)
            document.body.style.cursor = 'auto'
          }}
          onClick={(e) => {
            e.stopPropagation()
            setActiveId(node.id)
          }}
        />
      ))}

      <OrbitControls
        ref={controls}
        enabled={activeId === null}
        enablePan={false}
        enableZoom={true}
        minDistance={6}
        maxDistance={28}
        rotateSpeed={0.5}
        zoomSpeed={0.6}
        autoRotate={activeId === null}
        autoRotateSpeed={0.18}
        target={[0, 0, 0]}
      />
      <CameraRig activeId={activeId} controls={controls} onArrived={onArrived} />
    </>
  )
}

/* ─────────────────────────────────────────────────────────────
   Exported scene
   ───────────────────────────────────────────────────────────── */
export default function AtelierScene({
  activeId,
  setActiveId,
  setSceneReady,
  onArrived,
  isMobile,
}: {
  activeId: NodeId | null
  setActiveId: (id: NodeId | null) => void
  setSceneReady: (ready: boolean) => void
  onArrived: () => void
  isMobile: boolean
}) {
  const [hovered, setHovered] = useState<NodeId | null>(null)

  return (
    <Canvas
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
      camera={{ position: [0, 1.2, 16], fov: 60, near: 0.1, far: 600 }}
      onCreated={() => setSceneReady(true)}
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
    >
      <Scene
        activeId={activeId}
        setActiveId={setActiveId}
        hovered={hovered}
        setHovered={setHovered}
        onArrived={onArrived}
        isMobile={isMobile}
      />
      {!isMobile && (
        <EffectComposer>
          <Bloom
            intensity={0.9}
            luminanceThreshold={0.35}
            luminanceSmoothing={0.4}
            mipmapBlur
            radius={0.85}
          />
          <Vignette eskil={false} offset={0.15} darkness={0.7} />
        </EffectComposer>
      )}
    </Canvas>
  )
}
