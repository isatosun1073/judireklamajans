import type { Metadata, Viewport } from 'next'
import 'lenis/dist/lenis.css'
import './globals.css'
import SmoothScroll from '@/components/providers/SmoothScroll'
import CanvasLoader from '@/components/dom/CanvasLoader'
import Preloader from '@/components/dom/Preloader'
import PointerTracker from '@/components/dom/PointerTracker'
import Header from '@/components/dom/Header'

export const metadata: Metadata = {
  title: 'Judi Reklam Ajansı — CGI & 3D Kreatif Stüdyo',
  description: 'Markaları CGI, 3D ve interaktif dijital deneyimlerle hayata geçiren kreatif reklam ajansı.',
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
