'use client'

import { useLenis } from 'lenis/react'

const links = [
  { href: '#hizmetler', label: 'Hizmetler' },
  { href: '#isler', label: 'İşler' },
  { href: '#iletisim', label: 'İletişim' },
]

export default function Header() {
  const lenis = useLenis()

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    lenis?.scrollTo(href, { duration: 1.6, offset: 0 })
  }

  return (
    <header className="header">
      <a href="#top" className="header__logo" onClick={(e) => go(e, '#top')}>
        JUDI<span>®</span>
      </a>
      <nav className="header__nav">
        {links.map((l) => (
          <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)}>
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
