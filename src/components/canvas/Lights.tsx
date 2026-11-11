'use client'

import { Environment, Lightformer } from '@react-three/drei'

/**
 * Harici HDR dosyası indirmeden stüdyo ışığı: Lightformer'lar
 * environment map'e "pişirilir". Tamamen offline, hızlı ve özelleştirilebilir.
 */
export default function Lights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <Environment resolution={256} frames={1}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={4} position={[0, 5, -9]} scale={2} />
          <Lightformer form="circle" intensity={2} position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={2} />
          <Lightformer form="ring" color="#d4ff3a" intensity={5} position={[10, -1, 1]} rotation-y={-Math.PI / 2} scale={8} />
          <Lightformer form="rect" color="#7aa2ff" intensity={2.5} position={[-10, 2, 4]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} />
        </group>
      </Environment>
    </>
  )
}
