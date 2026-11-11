'use client'

import { useLenis } from 'lenis/react'
import { profile } from '@/content/profile'

const links = [
  { href: '#hakkimda', label: 'Hakkımda' },
  { href: '#uzmanlik', label: 'Uzmanlık' },
  { href: '#deneyim', label: 'Deneyim' },
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
        {profile.firstName} {profile.lastName}
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
