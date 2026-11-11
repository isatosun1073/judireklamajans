'use client'

import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor, Preload } from '@react-three/drei'
import { Suspense, useState } from 'react'
import * as THREE from 'three'
import Experience from './Experience'

/**
 * Sayfanın arkasında sabit duran tek WebGL canvas.
 * Olaylar document.body'den dinlenir; böylece DOM katmanı
 * üstte kalsa bile pointer etkileşimi 3D sahneye ulaşır.
 */
export default function Scene() {
  const [dpr, setDpr] = useState(1.5)

  return (
    <div className="webgl" aria-hidden>
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 6], fov: 35, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        eventSource={typeof document !== 'undefined' ? document.body : undefined}
        eventPrefix="client"
      >
        {/* GPU yavaşlarsa çözünürlüğü otomatik düşür */}
        <PerformanceMonitor
          onIncline={() => setDpr(Math.min(2, window.devicePixelRatio))}
          onDecline={() => setDpr(1)}
        />
        <AdaptiveDpr pixelated />
        <Suspense fallback={null}>
          <Experience />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}
