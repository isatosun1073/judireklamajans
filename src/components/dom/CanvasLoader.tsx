'use client'

import dynamic from 'next/dynamic'

// WebGL yalnızca istemcide — SSR'da three.js yüklenmez
const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false })

export default function CanvasLoader() {
  return <Scene />
}
