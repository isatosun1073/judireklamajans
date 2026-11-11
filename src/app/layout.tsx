import type { Metadata, Viewport } from 'next'
import 'lenis/dist/lenis.css'
import './globals.css'
import SmoothScroll from '@/components/providers/SmoothScroll'
import CanvasLoader from '@/components/dom/CanvasLoader'
import Preloader from '@/components/dom/Preloader'
import PointerTracker from '@/components/dom/PointerTracker'
import Header from '@/components/dom/Header'

export const metadata: Metadata = {
  title: 'İsa Tosun — Görsel İletişim Tasarım Uzmanı',
  description:
    'İsa Tosun: Görsel İletişim Tasarım Uzmanı, Reklam ve Dijital Medya Uzmanı, Noah Reklam Ajansı Kurucusu. Kurumsal kimlik, marka iletişimi, sosyal medya ve dijital reklam.',
  openGraph: {
    title: 'İsa Tosun — Portfolyo',
    description: 'Görsel İletişim Tasarım Uzmanı · Reklam ve Dijital Medya Uzmanı · Noah Reklam Ajansı Kurucusu',
    locale: 'tr_TR',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <SmoothScroll>
          <Preloader />
          <CanvasLoader />
          <PointerTracker />
          <Header />
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
