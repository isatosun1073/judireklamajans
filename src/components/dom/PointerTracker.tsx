'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { pointer } from '@/lib/scroll'

/** İmleç konumunu 3D sahneye aktarır + özel imleç çizer (yalnızca hassas işaretçilerde) */
export default function PointerTracker() {
  const dot = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const xTo = dot.current && fine ? gsap.quickTo(dot.current, 'x', { duration: 0.35, ease: 'power3' }) : null
    const yTo = dot.current && fine ? gsap.quickTo(dot.current, 'y', { duration: 0.35, ease: 'power3' }) : null

    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1
      dot.current?.classList.add('is-active')
      xTo?.(e.clientX)
      yTo?.(e.clientY)
    }
    const onOver = (e: PointerEvent) => {
      const hover = (e.target as HTMLElement).closest('a, button, [data-cursor]')
      dot.current?.classList.toggle('is-hover', !!hover)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerover', onOver)
    if (fine) document.documentElement.classList.add('has-cursor')
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
    }
  }, [])

  return <div ref={dot} className="cursor" aria-hidden />
}
