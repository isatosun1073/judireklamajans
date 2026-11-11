# İsa Tosun — Portfolyo

Görsel İletişim Tasarım Uzmanı · Reklam ve Dijital Medya Uzmanı · Noah Reklam Ajansı Kurucusu.

## İçeriği düzenleme

Sitedeki **tüm metinler** `src/content/profile.ts` dosyasında: unvanlar, hakkımda, eğitim, deneyim,
uzmanlık alanları, yaklaşım ve kariyer hedefi. İletişim bölümündeki bağlantılar da buradaki
`contact` alanından gelir (e-posta, telefon, LinkedIn, Instagram, Behance, web). Boş bırakılan
alanlar sitede görünmez.

## Teknoloji

Awwwards tarzı CGI/3D altyapı. Beşli stack:

| Paket | Görev |
|---|---|
| **Next.js 16** (App Router, Turbopack) | Sayfa yapısı, SSR/SSG, SEO |
| **React Three Fiber 9** | Three.js'i React bileşenleriyle kullanma |
| **Drei 10** | Hazır yardımcılar: `Environment`/`Lightformer`, `MeshTransmissionMaterial`, `MeshDistortMaterial`, `Float`, `Sparkles`, `ContactShadows`, `useProgress`, `PerformanceMonitor` |
| **GSAP 3** (+ `ScrollTrigger`, `SplitText`, `@gsap/react`) | Metin reveal'leri, pinned yatay kaydırma, intro timeline |
| **Lenis** | Yumuşak kaydırma — GSAP ticker'ına bağlı tek RAF döngüsü |

## Başlangıç

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Mimari

```
src/
├─ app/
│  ├─ layout.tsx          # SmoothScroll + Preloader + sabit Canvas + Header
│  ├─ page.tsx
│  └─ globals.css
├─ components/
│  ├─ providers/SmoothScroll.tsx   # Lenis ↔ GSAP ticker ↔ ScrollTrigger senkronu
│  ├─ canvas/                      # Yalnızca istemcide (dynamic, ssr:false)
│  │  ├─ Scene.tsx                 # Fixed <Canvas>, adaptif DPR, performans izleme
│  │  ├─ Experience.tsx            # Sahne kompozisyonu + paralaks kamera rig'i
│  │  ├─ Hero3D.tsx                # Sıvı metal küre + cam uydular
│  │  └─ Lights.tsx                # HDR indirmeden Lightformer stüdyo ışığı
│  └─ dom/
│     ├─ Sections.tsx              # Hero, Hakkımda, Uzmanlık, Deneyim (pinned), Eğitim, Yaklaşım, İletişim
│     ├─ Preloader.tsx             # useProgress sayacı + perde animasyonu
│     ├─ PointerTracker.tsx        # İmleç → 3D, özel imleç
│     ├─ Header.tsx                # Lenis scrollTo ile anchor navigasyonu
│     └─ CanvasLoader.tsx
├─ content/profile.ts              # Tüm site içeriği
└─ lib/scroll.ts                   # DOM ↔ WebGL paylaşımlı mutable state
```

**Temel fikir:** Tek bir `position: fixed` canvas tüm sayfanın arkasında durur. Lenis kaydırma
ilerlemesini/hızını `lib/scroll.ts`'e yazar; R3F `useFrame` içinde bu değerler okunup
`MathUtils.damp` ile objelere uygulanır. React yeniden render edilmez → 60 fps.

## Özelleştirme

- **Kendi 3D modeliniz:** `.glb` dosyasını `public/models/` altına koyun, `useGLTF('/models/x.glb')`
  ile `Hero3D.tsx` içinde `Blob` yerine kullanın (`npx gltfjsx x.glb --types` ile bileşene çevirebilirsiniz).
- **Kaydırma koreografisi:** `Hero3D.tsx` → `Blob` içindeki `targetX` / `targetScale`.
- **Renkler:** `globals.css` → `:root` değişkenleri, ışık renkleri `Lights.tsx`.
- **Erişilebilirlik:** `prefers-reduced-motion` açıkken Lenis yumuşatması ve GSAP animasyonları kapanır.
