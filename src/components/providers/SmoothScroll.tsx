'use client'

import { ReactLenis, type LenisRef } from 'lenis/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, type ReactNode } from 'react'
import { scrollState } from '@/lib/scroll'

gsap.registerPlugin(ScrollTrigger)

/**
 * Lenis'i GSAP ticker'ına bağlar: tek bir RAF döngüsü, ScrollTrigger
 * ile kusursuz senkron. prefers-reduced-motion açıksa yumuşatma kapanır.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    const lenis = lenisRef.current?.lenis
    if (lenis && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      lenis.options.lerp = 1
      lenis.options.smoothWheel = false
    }

    const onScroll = () => {
      ScrollTrigger.update()
      if (lenis) {
        scrollState.progress = lenis.progress || 0
        scrollState.velocity = lenis.velocity || 0
      }
    }
    lenis?.on('scroll', onScroll)

    return () => {
      gsap.ticker.remove(update)
      lenis?.off('scroll', onScroll)
    }
  }, [])

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false, lerp: 0.09, smoothWheel: true }}>
      {children}
    </ReactLenis>
  )
}
