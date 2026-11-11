'use client'

import { useProgress } from '@react-three/drei'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { profile } from '@/content/profile'

/** 3D varlıklar yüklenirken yüzde sayacı; bitince perde yukarı kalkar */
export default function Preloader() {
  const { progress, active } = useProgress()
  const root = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(false)
  const [shown, setShown] = useState(0)

  // Sayaç: gerçek ilerlemeye yumuşak yaklaş, en az ~1 sn göster
  useEffect(() => {
    const obj = { v: shown }
    const tween = gsap.to(obj, {
      v: active ? progress : 100,
      duration: 1,
      ease: 'power2.out',
      onUpdate: () => setShown(Math.round(obj.v)),
      onComplete: () => { if (!active) setDone(true) },
    })
    return () => { tween.kill() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, active])

  useGSAP(() => {
    if (!done) return
    gsap.timeline()
      .to('.preloader__count', { yPercent: -100, opacity: 0, duration: 0.6, ease: 'power3.in' })
      .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, '-=0.1')
      .add(() => {
        document.documentElement.dataset.ready = '1'
        window.dispatchEvent(new Event('app:ready'))
      }, '-=0.6')
      .set(root.current, { display: 'none' })
  }, { dependencies: [done], scope: root })

  return (
    <div ref={root} className="preloader" aria-live="polite">
      <span className="preloader__brand">{profile.initials}</span>
      <span className="preloader__count">{shown}%</span>
    </div>
  )
}
