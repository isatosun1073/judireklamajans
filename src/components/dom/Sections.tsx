'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useRef } from 'react'
import { scrollState } from '@/lib/scroll'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

const services = [
  { no: '01', title: 'CGI & 3D Prodüksiyon', text: 'Ürün görselleştirme, fotogerçekçi render ve hareketli 3D reklam filmleri.' },
  { no: '02', title: 'Marka Kimliği', text: 'Strateji, logo, tipografi ve dijitalde yaşayan görsel sistemler.' },
  { no: '03', title: 'Dijital Deneyim', text: 'WebGL tabanlı, ödül odaklı interaktif web siteleri ve kampanya sayfaları.' },
  { no: '04', title: 'Sosyal Medya & Reklam', text: 'Performans odaklı kreatif üretim, motion içerik ve medya planlama.' },
]

const works = [
  { title: 'Aurora Parfüm', tag: 'CGI Reklam Filmi', year: '2026' },
  { title: 'Nova Otomotiv', tag: 'WebGL Konfigüratör', year: '2026' },
  { title: 'Lumen Kozmetik', tag: 'Marka Kimliği', year: '2025' },
  { title: 'Kuzey Kahve', tag: 'Kampanya & Sosyal', year: '2025' },
]

export default function Sections() {
  const root = useRef<HTMLElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Hero giriş animasyonu — preloader bittiğinde
      const heroSplit = SplitText.create('.hero__title', { type: 'lines,words', mask: 'lines' })
      gsap.set(heroSplit.words, { yPercent: 110 })
      gsap.set('.hero__meta > *', { opacity: 0, y: 20 })
      const intro = () => {
        gsap.timeline()
          .to(heroSplit.words, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.06 })
          .to('.hero__meta > *', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 }, '-=0.8')
      }
      window.addEventListener('app:ready', intro, { once: true })

      // Başlıklar: satır satır maskeli reveal
      gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
        const split = SplitText.create(el, { type: 'lines', mask: 'lines' })
        gsap.from(split.lines, {
          yPercent: 100,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 85%' },
        })
      })

      // Kartlar: fade + yukarı
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        })
      })

      // İşler: yatay kaydırmalı pinned bölüm
      const track = document.querySelector<HTMLElement>('.work__track')
      if (track) {
        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: '.work',
            start: 'top top',
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
      }

      // Marquee — kaydırma hızına tepki
      const marquee = gsap.to('.marquee__inner', { xPercent: -50, duration: 20, ease: 'none', repeat: -1 })
      ScrollTrigger.create({
        onUpdate: (self) => {
          const v = gsap.utils.clamp(-6, 6, self.getVelocity() / 300)
          gsap.to(marquee, { timeScale: 1 + Math.abs(v), duration: 0.3, overwrite: true })
        },
      })

      return () => window.removeEventListener('app:ready', intro)
    })

    // Aktif bölümü 3D sahneye bildir
    gsap.utils.toArray<HTMLElement>('[data-section]').forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => { if (self.isActive) scrollState.section = i },
      })
    })
  }, { scope: root })

  return (
    <main ref={root} id="top">
      {/* HERO */}
      <section className="hero" data-section>
        <h1 className="hero__title">
          Markanızı <em>üç boyutlu</em> bir deneyime dönüştürüyoruz.
        </h1>
        <div className="hero__meta">
          <p>CGI · 3D · Marka · Dijital</p>
          <p>İstanbul merkezli kreatif reklam ajansı</p>
          <span className="hero__scroll">Kaydır ↓</span>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee" aria-hidden>
        <div className="marquee__inner">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k}>Yaratıcılık ✦ Teknoloji ✦ CGI ✦ Strateji ✦ Hikâye ✦&nbsp;</span>
          ))}
        </div>
      </div>

      {/* HİZMETLER */}
      <section id="hizmetler" className="services" data-section>
        <h2 className="section-title" data-split>Ne yapıyoruz</h2>
        <div className="services__grid">
          {services.map((s) => (
            <article key={s.no} className="service" data-reveal>
              <span className="service__no">{s.no}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* İŞLER — yatay pinned */}
      <section id="isler" className="work" data-section>
        <div className="work__track">
          <div className="work__intro">
            <h2 className="section-title" data-split>Seçili işler</h2>
            <p>Kaydırmaya devam edin →</p>
          </div>
          {works.map((w, i) => (
            <a key={w.title} href="#iletisim" className="work__card" data-cursor>
              <div className={`work__media work__media--${i}`} />
              <div className="work__info">
                <h3>{w.title}</h3>
                <span>{w.tag} — {w.year}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* İLETİŞİM */}
      <section id="iletisim" className="contact" data-section>
        <h2 className="contact__title" data-split>
          Bir sonraki projeniz <em>burada</em> başlar.
        </h2>
        <a className="contact__cta" href="mailto:merhaba@judireklam.com" data-reveal>
          merhaba@judireklam.com
        </a>
        <footer className="footer">
          <span>© {new Date().getFullYear()} Judi Reklam Ajansı</span>
          <span>Instagram · Behance · LinkedIn</span>
        </footer>
      </section>
    </main>
  )
}
