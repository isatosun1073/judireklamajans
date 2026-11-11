/**
 * DOM (GSAP ScrollTrigger) ile WebGL sahnesi (R3F useFrame) arasında
 * React render'ı tetiklemeden veri paylaşmak için mutable store.
 * Her karede okunur; asla setState kullanılmaz.
 */
export const scrollState = {
  /** Tüm sayfanın 0..1 ilerlemesi */
  progress: 0,
  /** Lenis hızı (px/frame) — distorsiyon vb. efektler için */
  velocity: 0,
  /** Aktif bölüm indeksi (0: hero, 1: hizmetler, 2: işler, 3: iletişim) */
  section: 0,
}

/** Normalize edilmiş imleç (-1..1) */
export const pointer = { x: 0, y: 0 }
