'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Sparkles } from '@react-three/drei'
import { useEffect } from 'react'
import * as THREE from 'three'
import Lights from './Lights'
import { Blob, Satellites } from './Hero3D'
import { pointer, scrollState } from '@/lib/scroll'

/** Sahne kompozisyonu + kamera rig'i */
export default function Experience() {
  const { camera, size } = useThree()

  // Mobilde objeleri sığdırmak için kamerayı geri çek
  useEffect(() => {
    camera.position.z = size.width < 768 ? 8.5 : 6
  }, [camera, size.width])

  useFrame((_, delta) => {
    // Hafif paralaks kamera
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.x * 0.3, 2, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, pointer.y * 0.2 - scrollState.progress * 0.5, 2, delta)
    camera.lookAt(0, -scrollState.progress * 0.5, 0)
  })

  return (
    <>
      <Lights />
      <Blob />
      <Satellites />
      <Sparkles count={60} scale={[10, 6, 4]} size={1.5} speed={0.3} opacity={0.5} color="#ffffff" />
      <ContactShadows position={[0, -1.8, 0]} opacity={0.35} scale={10} blur={2.5} far={4} />
    </>
  )
}
