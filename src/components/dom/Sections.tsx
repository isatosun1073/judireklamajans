'use client'

import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useRef } from 'react'
import { scrollState } from '@/lib/scroll'
import { profile } from '@/content/profile'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

const pad = (n: number) => String(n).padStart(2, '0')

/** Doldurulmuş iletişim alanlarından bağlantı listesi üretir */
function contactLinks() {
  const c = profile.contact
  const links: { label: string; href: string; text: string }[] = []
  if (c.email) links.push({ label: 'E-posta', href: `mailto:${c.email}`, text: c.email })
  if (c.phone) links.push({ label: 'Telefon', href: `tel:${c.phone.replace(/\s/g, '')}`, text: c.phone })
  if (c.linkedin) links.push({ label: 'LinkedIn', href: c.linkedin, text: 'LinkedIn' })
  if (c.instagram) links.push({ label: 'Instagram', href: c.instagram, text: 'Instagram' })
  if (c.behance) links.push({ label: 'Behance', href: c.behance, text: 'Behance' })
  if (c.website) links.push({ label: 'Web', href: c.website, text: c.website.replace(/^https?:\/\//, '') })
  return links
}

export default function Sections() {
  const root = useRef<HTMLElement>(null)
  const links = contactLinks()

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Hero girişi — preloader perdesi kalkınca
      const heroSplit = SplitText.create('.hero__name', { type: 'chars', mask: 'chars' })
      gsap.set(heroSplit.chars, { yPercent: 110 })
      gsap.set('.hero__titles li, .hero__top > *, .hero__scroll', { opacity: 0, y: 20 })
      let played = false
      const intro = () => {
        if (played) return
        played = true
        gsap.timeline()
          .to(heroSplit.chars, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.04 })
          .to('.hero__top > *', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 }, 0.2)
          .to('.hero__titles li', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 }, 0.4)
          .to('.hero__scroll', { opacity: 1, y: 0, duration: 0.6 }, 0.8)
      }
      // Preloader zaten bittiyse hemen oynat; bitmediyse olayı bekle.
      // Güvenlik ağı: yavaş cihazlarda içerik asla gizli kalmasın.
      if (document.documentElement.dataset.ready) intro()
      else window.addEventListener('app:ready', intro, { once: true })
      const fallback = window.setTimeout(intro, 5000)

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

      // Uzun metin: kaydırdıkça kelime kelime aydınlanma
      gsap.utils.toArray<HTMLElement>('[data-scrub-words]').forEach((el) => {
        const split = SplitText.create(el, { type: 'words' })
        gsap.fromTo(
          split.words,
          { opacity: 0.15 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
          },
        )
      })

      // Kartlar / bloklar: fade + yukarı
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        })
      })

      // Uzmanlık listesi: satır çizgileri soldan çizilir
      gsap.utils.toArray<HTMLElement>('.skills__item').forEach((el) => {
        gsap.from(el, {
          '--draw': 0,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 92%' },
        })
      })

      // Deneyim: yatay kaydırmalı pinned bölüm (yalnızca geniş ekran)
      const track = document.querySelector<HTMLElement>('.exp__track')
      if (track && window.innerWidth >= 900) {
        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: '.exp',
            start: 'top top',
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
      }

      // Marquee — kaydırma hızına tepki
      const marquee = gsap.to('.marquee__inner', { xPercent: -50, duration: 40, ease: 'none', repeat: -1 })
      ScrollTrigger.create({
        onUpdate: (self) => {
          const v = gsap.utils.clamp(-6, 6, self.getVelocity() / 300)
          gsap.to(marquee, { timeScale: 1 + Math.abs(v), duration: 0.3, overwrite: true })
        },
      })

      return () => {
        window.removeEventListener('app:ready', intro)
        window.clearTimeout(fallback)
      }
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
        <div className="hero__top">
          <span>Portfolyo</span>
          <span>Görsel İletişim · Reklam · Dijital Medya</span>
        </div>
        <h1 className="hero__name">
          <span>{profile.firstName}</span>
          <span className="hero__last">{profile.lastName}</span>
        </h1>
        <div className="hero__bottom">
          <ul className="hero__titles">
            {profile.titles.map((t) => <li key={t}>{t}</li>)}
          </ul>
          <span className="hero__scroll">Kaydır ↓</span>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee" aria-hidden>
        <div className="marquee__inner">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k}>
              {profile.expertise.slice(0, 6).map((e) => `${e} ✦ `).join('')}&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* HAKKIMDA */}
      <section id="hakkimda" className="block about" data-section>
        <p className="label">({pad(1)}) Hakkımda</p>
        <h2 className="about__lead" data-split>{profile.about.lead}</h2>
        <div className="about__cols">
          {profile.about.paragraphs.map((p, i) => (
            <p key={i} data-reveal>{p}</p>
          ))}
        </div>
      </section>

      {/* UZMANLIK */}
      <section id="uzmanlik" className="block skills" data-section>
        <div className="block__head">
          <p className="label">({pad(2)}) Uzmanlık Alanları</p>
          <h2 className="section-title" data-split>Ne <em>yapıyorum</em></h2>
        </div>
        <ol className="skills__list">
          {profile.expertise.map((e, i) => (
            <li key={e} className="skills__item" data-cursor>
              <span className="skills__no">{pad(i + 1)}</span>
              <span className="skills__name">{e}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* DENEYİM — geniş ekranda yatay pinned */}
      <section id="deneyim" className="exp" data-section>
        <div className="exp__track">
          <div className="exp__intro">
            <p className="label">({pad(3)}) Mesleki Deneyim</p>
            <h2 className="section-title" data-split>Kariyer <em>yolculuğum</em></h2>
            <p className="exp__hint">Kaydırmaya devam edin →</p>
          </div>
          {profile.experience.map((x, i) => (
            <article key={x.company} className="exp__card" data-cursor>
              <div className="exp__card-top">
                <span className="exp__no">{pad(i + 1)}</span>
                <span className="exp__role">{x.role}</span>
              </div>
              <h3 className="exp__company">{x.company}</h3>
              <ul className="exp__items">
                {x.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* EĞİTİM */}
      <section id="egitim" className="block edu" data-section>
        <div className="block__head">
          <p className="label">({pad(4)}) Eğitim Bilgileri</p>
          <h2 className="section-title" data-split>Eğitim</h2>
        </div>
        <div className="edu__grid">
          {profile.education.map((e) => (
            <article key={e.school} className="edu__card" data-reveal>
              <h3>{e.school}</h3>
              <ul>
                {e.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* YAKLAŞIM + HEDEF */}
      <section className="block approach" data-section>
        <p className="label">({pad(5)}) Mesleki Yaklaşımım</p>
        <p className="approach__text" data-scrub-words>{profile.approach}</p>
        <ul className="approach__principles">
          {profile.principles.map((p) => <li key={p} data-reveal>{p}</li>)}
        </ul>
        <div className="goal" data-reveal>
          <p className="label">({pad(6)}) Kariyer Hedefim</p>
          <p className="goal__text">{profile.goal}</p>
        </div>
      </section>

      {/* İLETİŞİM */}
      <section id="iletisim" className="contact" data-section>
        <p className="label">({pad(7)}) İletişim</p>
        <h2 className="contact__title" data-split>
          Birlikte güçlü bir <em>marka hikâyesi</em> yazalım.
        </h2>
        {links.length > 0 && (
          <ul className="contact__links">
            {links.map((l) => (
              <li key={l.label} data-reveal>
                <span>{l.label}</span>
                <a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                  {l.text}
                </a>
              </li>
            ))}
          </ul>
        )}
        <footer className="footer">
          <span>© {new Date().getFullYear()} {profile.firstName} {profile.lastName}</span>
          <span>{profile.titles[2]}</span>
        </footer>
      </section>
    </main>
  )
}
