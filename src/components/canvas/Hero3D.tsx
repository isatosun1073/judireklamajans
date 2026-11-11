'use client'

import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Float, MeshTransmissionMaterial, RoundedBox } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import { pointer, scrollState } from '@/lib/scroll'

const damp = THREE.MathUtils.damp

/** Ana CGI objesi: kaydırma + imleçle tepki veren sıvı metal küre */
export function Blob() {
  const group = useRef<THREE.Group>(null)
  const material = useRef<any>(null)

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const p = scrollState.progress
    const v = Math.min(Math.abs(scrollState.velocity) / 40, 1)

    // Kaydırma koreografisi: ortada → sağa → sola → küçülerek ortaya
    const targetX = p < 0.33 ? THREE.MathUtils.lerp(0, 1.6, p / 0.33)
      : p < 0.66 ? THREE.MathUtils.lerp(1.6, -1.6, (p - 0.33) / 0.33)
      : THREE.MathUtils.lerp(-1.6, 0, (p - 0.66) / 0.34)
    const targetScale = 1 - p * 0.35

    g.position.x = damp(g.position.x, targetX, 3, delta)
    g.position.y = damp(g.position.y, pointer.y * 0.15, 3, delta)
    g.rotation.y = damp(g.rotation.y, pointer.x * 0.6 + p * Math.PI * 2, 3, delta)
    g.rotation.x = damp(g.rotation.x, -pointer.y * 0.4, 3, delta)
    g.scale.setScalar(damp(g.scale.x, targetScale, 3, delta))

    if (material.current) {
      material.current.distort = damp(material.current.distort, 0.3 + v * 0.35, 4, delta)
    }
  })

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1, 64]} />
        <MeshDistortMaterial
          ref={material}
          color="#111"
          metalness={1}
          roughness={0.12}
          distort={0.3}
          speed={2}
          envMapIntensity={1.6}
        />
      </mesh>
    </group>
  )
}

/** Etrafında süzülen cam objeler — derinlik ve kırılma hissi */
export function Satellites() {
  const items: { pos: [number, number, number]; s: number; kind: 'box' | 'torus' | 'sphere' }[] = [
    { pos: [-2.4, 1.2, -1], s: 0.45, kind: 'box' },
    { pos: [2.2, -1.3, -0.5], s: 0.35, kind: 'torus' },
    { pos: [1.8, 1.5, -2], s: 0.3, kind: 'sphere' },
    { pos: [-1.9, -1.5, 0.5], s: 0.25, kind: 'sphere' },
  ]

  return (
    <>
      {items.map((it, i) => (
        <Float key={i} speed={1.5 + i * 0.3} rotationIntensity={1.2} floatIntensity={1.5}>
          <group position={it.pos} scale={it.s}>
            {it.kind === 'box' && (
              <RoundedBox args={[1, 1, 1]} radius={0.15} smoothness={4}>
                <Glass />
              </RoundedBox>
            )}
            {it.kind === 'torus' && (
              <mesh>
                <torusGeometry args={[1, 0.35, 32, 96]} />
                <Glass />
              </mesh>
            )}
            {it.kind === 'sphere' && (
              <mesh>
                <sphereGeometry args={[1, 48, 48]} />
                <meshStandardMaterial color="#ff4d2e" metalness={0.4} roughness={0.2} />
              </mesh>
            )}
          </group>
        </Float>
      ))}
    </>
  )
}

function Glass() {
  return (
    <MeshTransmissionMaterial
      backside
      samples={4}
      resolution={256}
      thickness={0.6}
      roughness={0.05}
      chromaticAberration={0.25}
      anisotropy={0.2}
      distortion={0.3}
      distortionScale={0.4}
      temporalDistortion={0.1}
      ior={1.4}
      color="#ffffff"
    />
  )
}
