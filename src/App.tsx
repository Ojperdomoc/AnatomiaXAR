import { useState } from 'react';
import { ScanLine, Bone, Beef, Cable, Spline, Camera, Sparkles, ShieldCheck, Zap, Move3d, Layers, ChevronRight, Play, Aperture, Brain, HeartPulse, Footprints } from 'lucide-react';
import Scanner from './components/Scanner';
import { LAYERS } from './data/anatomy';

// Respeta el `base` de Vite: funciona en dev (/), en GitHub Pages (/AnatomiaXAR/)
// y en dominios personalizados sin cambiar código.
const BASE = import.meta.env.BASE_URL;
const img = (file: string) => `${BASE}images/${file}`;

export default function App() {
  const [screen, setScreen] = useState<'home' | 'scanner'>('home');
  const [preview, setPreview] = useState<string>('musculos');

  if (screen === 'scanner') return <Scanner onBack={() => setScreen('home')} />;

  return (
    <div className="min-h-screen bg-[#05070e] text-white selection:bg-cyan-400 selection:text-black">
      {/* NAV */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#05070e]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-blue-600 to-fuchsia-600 shadow-[0_0_24px_rgba(34,211,238,.4)]">
              <ScanLine className="h-5 w-5 text-white" />
            </span>
            <div>
              <div className="font-display text-sm font-bold tracking-[0.18em]">ANATOMIA<span className="text-cyan-300">XR</span></div>
              <div className="font-mono2 text-[10px] uppercase tracking-widest text-white/45">músculo · hueso · ligamento · tendón</div>
            </div>
          </div>
          <div className="hidden items-center gap-6 font-mono2 text-xs text-white/60 md:flex">
            <a href="#capas" className="transition hover:text-white">Capas</a>
            <a href="#como" className="transition hover:text-white">Cómo funciona</a>
            <a href="#higgsfield" className="transition hover:text-white">Higgsfield</a>
            <a href="#zonas" className="transition hover:text-white">Zonas</a>
          </div>
          <button onClick={() => setScreen('scanner')} className="group flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-black transition hover:bg-cyan-300">
            <Camera className="h-4 w-4" /> Abrir escáner
            <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <header className="relative overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img src={img("hero-anatomy.jpg")} alt="Anatomía holográfica" className="h-full w-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#05070e]/60 via-[#05070e]/35 to-[#05070e]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05070e]/85 via-transparent to-[#05070e]/60" />
          <div className="scanner-grid absolute inset-0 opacity-40" />
        </div>

        <div className="relative mx-auto grid max-w-[1280px] gap-10 px-4 pb-14 pt-10 lg:grid-cols-[1.1fr_.9fr] lg:pt-16">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-lime-300/40 bg-lime-300/10 px-3 py-1 font-mono2 text-[11px] font-bold text-lime-200"><Sparkles className="h-3.5 w-3.5" /> RECURSOS GENERADOS CON HIGGSFIELD</span>
              <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1 font-mono2 text-[11px] text-white/70 backdrop-blur"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" /> AR EN VIVO</span>
            </div>
            <h1 className="font-display text-[42px] font-black leading-[0.95] tracking-tight sm:text-7xl lg:text-[86px]">
              MIRA<br />
              <span className="bg-gradient-to-r from-cyan-300 via-white to-fuchsia-400 bg-clip-text text-transparent">DENTRO</span><br />
              <span className="text-stroke">DE TI.</span>
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-white/70">
              Apunta tu cámara y revela tus <b className="text-white">músculos, huesos, ligamentos y tendones</b> en tiempo real. Calibra, haz zoom por zonas y captura tu rayos X estilo sci-fi.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={() => setScreen('scanner')} className="group flex items-center gap-3 rounded-2xl bg-cyan-300 px-7 py-4 font-bold text-black shadow-[0_0_40px_rgba(34,211,238,.45)] transition hover:scale-[1.02] hover:bg-white">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-cyan-300"><Camera className="h-5 w-5" /></span>
                Activar cámara AR
              </button>
              <a href="#capas" className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-4 font-bold backdrop-blur transition hover:bg-white/10">
                <Play className="h-4 w-4 text-cyan-300" /> Explorar capas
              </a>
            </div>
            <div className="mt-8 grid max-w-lg grid-cols-4 gap-2">
              {[
                { n: '206', l: 'huesos' },
                { n: '600+', l: 'músculos' },
                { n: '900+', l: 'ligamentos' },
                { n: '4K', l: 'render' },
              ].map(s => (
                <div key={s.l} className="rounded-2xl border border-white/10 bg-black/45 p-3 text-center backdrop-blur">
                  <div className="font-display text-xl font-black text-cyan-200">{s.n}</div>
                  <div className="font-mono2 text-[10px] uppercase tracking-widest text-white/50">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-4 font-mono2 text-[11px] text-white/45">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-300" /> 100% privado · en tu dispositivo</span>
              <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-amber-300" /> Sin app extra</span>
            </div>
          </div>

          {/* tarjeta HUD flotante */}
          <div className="relative hidden lg:block">
            <div className="float-y glass noise relative overflow-hidden rounded-[28px] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono2 text-[11px]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> LIVE SCAN
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-white/60">frontal</span>
                </div>
                <Aperture className="spin-slow h-5 w-5 text-cyan-300" />
              </div>
              {/* mini selector capas */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'huesos', icon: Bone, c: '#e8f6ff', label: 'Huesos' },
                  { id: 'musculos', icon: Beef, c: '#ff4d5e', label: 'Músculo' },
                  { id: 'ligamentos', icon: Cable, c: '#ffd233', label: 'Ligam.' },
                  { id: 'tendones', icon: Spline, c: '#4de3ff', label: 'Tendón' },
                ].map(t => (
                  <button key={t.id} onClick={() => setPreview(t.id)} className={`rounded-2xl border p-2.5 text-center transition ${preview === t.id ? 'border-white/30 bg-white/10' : 'border-white/10 bg-black/30 opacity-60 hover:opacity-100'}`}>
                    <t.icon className="mx-auto h-5 w-5" style={{ color: t.c }} />
                    <div className="mt-1 font-mono2 text-[10px]">{t.label}</div>
                    {preview === t.id && <div className="mx-auto mt-1.5 h-1 w-8 rounded-full" style={{ background: t.c }} />}
                  </button>
                ))}
              </div>
              <div className="mt-3 overflow-hidden rounded-2xl border border-white/10">
                <img src={preview === 'musculos' ? img("muscle-detail.jpg") : preview === 'huesos' ? img("bone-detail.jpg") : img("hero-anatomy.jpg")} alt="" className="h-56 w-full object-cover transition-all duration-500" key={preview} />
                <div className="bg-black/70 p-3 backdrop-blur">
                  <div className="text-sm font-bold">{LAYERS.find(l => l.id === preview)?.nombre} — {LAYERS.find(l => l.id === preview)?.tagline}</div>
                  <div className="mt-1 line-clamp-2 text-xs text-white/60">{LAYERS.find(l => l.id === preview)?.desc}</div>
                </div>
              </div>
              <button onClick={() => setScreen('scanner')} className="mt-3 w-full rounded-2xl bg-white py-3 text-sm font-bold text-black transition hover:bg-cyan-200">Probar esta capa en mi cuerpo →</button>
            </div>
            {/* badges flotantes */}
            <div className="absolute -left-6 top-16 -rotate-6 rounded-2xl border border-white/15 bg-black/70 px-3 py-2 font-mono2 text-[11px] backdrop-blur">🦴 fémur · 48cm</div>
            <div className="absolute -right-3 bottom-24 rotate-3 rounded-2xl border border-cyan-300/30 bg-cyan-400/15 px-3 py-2 font-mono2 text-[11px] text-cyan-100 backdrop-blur">⚡ cuádriceps activo</div>
          </div>
        </div>

        {/* marquee */}
        <div className="relative border-y border-white/10 bg-black/60 py-3 backdrop-blur">
          <div className="flex gap-8 overflow-hidden whitespace-nowrap font-mono2 text-xs tracking-[0.25em] text-white/50">
            <div className="flex min-w-full shrink-0 animate-[grid-pan_20s_linear_infinite] gap-8">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i}>✦ MÚSCULOS ✦ HUESOS ✦ LIGAMENTOS ✦ TENDONES ✦ HIGGSFIELD AI ✦ TIEMPO REAL</span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* COMO FUNCIONA */}
      <section id="como" className="mx-auto max-w-[1280px] px-4 py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono2 text-xs tracking-[0.3em] text-cyan-300">01 — INTUITIVO EN 3 PASOS</div>
            <h2 className="font-display mt-2 text-3xl font-black sm:text-5xl">Tan fácil como <span className="text-cyan-300">mirarte al espejo</span></h2>
          </div>
          <button onClick={() => setScreen('scanner')} className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-bold transition hover:bg-white hover:text-black">Saltar al escáner →</button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Camera, t: '1 · Activa tu cámara', d: 'Permite el acceso o usa el modo demo Higgsfield. Funciona en móvil y laptop, frontal o trasera.', c: 'from-cyan-400 to-blue-600' },
            { icon: Move3d, t: '2 · Alinéate y calibra', d: 'Ponte a 2 metros, abre un poco los brazos. Ajusta escala, posición y rayos X con sliders gigantes.', c: 'from-lime-300 to-emerald-600' },
            { icon: Layers, t: '3 · Explora y captura', d: 'Enciende capas, cambia frontal / posterior / lateral, haz zoom a mano, rodilla o cráneo y descarga tu foto.', c: 'from-fuchsia-400 to-purple-700' },
          ].map((s, i) => (
            <div key={i} className="glass group rounded-3xl p-6 transition hover:-translate-y-1">
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${s.c} shadow-lg`}><s.icon className="h-6 w-6 text-white" /></span>
              <h3 className="font-display mt-4 text-lg font-bold">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CAPAS */}
      <section id="capas" className="border-y border-white/10 bg-gradient-to-b from-white/[.03] to-transparent py-16">
        <div className="mx-auto max-w-[1280px] px-4">
          <div className="font-mono2 text-xs tracking-[0.3em] text-lime-200">02 — CUATRO SISTEMAS</div>
          <h2 className="font-display mt-2 max-w-2xl text-3xl font-black sm:text-5xl">Enciende capas como en <span className="bg-gradient-to-r from-lime-200 to-cyan-300 bg-clip-text text-transparent">Higgsfield</span></h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LAYERS.map(l => (
              <div key={l.id} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 transition hover:-translate-y-1.5 hover:border-white/25">
                <div className="h-1.5 w-full" style={{ background: l.color, boxShadow: `0 0 20px ${l.glow}` }} />
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono2 text-[11px] text-white/45">{l.count} piezas</span>
                    <span className="rounded-full px-2 py-0.5 font-mono2 text-[10px]" style={{ background: `${l.color}1e`, color: l.color, border: `1px solid ${l.color}44` }}>● LIVE</span>
                  </div>
                  <h3 className="font-display mt-2 text-2xl font-black">{l.nombre}</h3>
                  <p className="font-mono2 text-[11px]" style={{ color: l.color }}>{l.tagline}</p>
                  <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-white/60">{l.desc}</p>
                  <div className="mt-4 space-y-1.5">
                    {l.funcion.map(f => <div key={f} className="flex items-center gap-2 font-mono2 text-[11px] text-white/55"><span style={{ color: l.color }}>▸</span>{f}</div>)}
                  </div>
                  <button onClick={() => setScreen('scanner')} className="mt-5 w-full rounded-xl border border-white/15 py-2.5 text-sm font-bold transition group-hover:bg-white group-hover:text-black">Ver en AR</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HIGGSFIELD */}
      <section id="higgsfield" className="mx-auto max-w-[1280px] px-4 py-16">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/30 bg-fuchsia-400/10 px-3 py-1 font-mono2 text-[11px] text-fuchsia-200"><Sparkles className="h-3.5 w-3.5" /> POWERED BY HIGGSFIELD AI</div>
            <h2 className="font-display mt-3 text-3xl font-black leading-tight sm:text-5xl">Recursos cinemáticos generados con <span className="bg-gradient-to-r from-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">Higgsfield</span></h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/65">Todos los visuales de ANATOMIA XR — hologramas, fibras musculares y huesos volumétricos — fueron direccionados como prompts de Higgsfield: iluminación de laboratorio oscuro, glow neón y detalle médico 8K. Así se ve cool sin perder rigor.</p>
            <div className="mt-5 space-y-2 font-mono2 text-[12px]">
              {[
                '“holographic full-body anatomy, cyan skeleton inside red muscles, dark lab” → hero',
                '“macro muscle fibers + cyan neural HUD, cinematic” → tarjeta músculo',
                '“skull + spine x-ray floating, particles, scanner aesthetic” → tarjeta hueso',
              ].map(p => <div key={p} className="rounded-xl border border-white/10 bg-black/40 p-3 text-white/60"><span className="text-lime-200">$ higgsfield</span> {p}</div>)}
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setScreen('scanner')} className="rounded-2xl bg-gradient-to-r from-fuchsia-400 to-cyan-300 px-6 py-3.5 text-sm font-black text-black transition hover:scale-[1.02]">Crear mi escaneo</button>
              <div className="flex items-center gap-2 font-mono2 text-[11px] text-white/50"><Brain className="h-4 w-4" /> prompts + overlays SVG en vivo</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img src={img("hero-anatomy.jpg")} className="h-64 w-full rounded-3xl border border-white/10 object-cover" alt="Hero Higgsfield" />
            <img src={img("muscle-detail.jpg")} className="mt-8 h-64 w-full rounded-3xl border border-white/10 object-cover" alt="Músculo" />
            <img src={img("bone-detail.jpg")} className="h-56 w-full rounded-3xl border border-white/10 object-cover" alt="Hueso" />
            <div className="mt-8 flex h-56 flex-col justify-between rounded-3xl border border-cyan-300/25 bg-gradient-to-br from-cyan-400/15 to-fuchsia-500/10 p-5">
              <HeartPulse className="h-8 w-8 text-cyan-200" />
              <div><div className="font-display text-3xl font-black">98.2%</div><div className="font-mono2 text-[11px] text-white/55">precisión de alineación simulada + tracking estable</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* ZONAS */}
      <section id="zonas" className="border-t border-white/10 bg-black/40 py-16">
        <div className="mx-auto max-w-[1280px] px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono2 text-xs tracking-[0.3em] text-cyan-300">03 — EXPLORA POR ZONAS</div>
              <h2 className="font-display mt-2 text-3xl font-black sm:text-5xl">Del cráneo al <span className="text-stroke">talón</span></h2>
            </div>
            <p className="max-w-sm text-sm text-white/55">Nueve focos con zoom automático: el overlay hace travelling hasta la articulación que te duele o te da curiosidad.</p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-3">
            {[
              { icon: Brain, t: 'Cráneo y cuello', d: '22 huesos + cervicales C1-C7' },
              { icon: Bone, t: 'Tórax', d: '12 pares de costillas + esternón' },
              { icon: Spline, t: 'Columna', d: '33 vértebras + discos' },
              { icon: Beef, t: 'Brazo y mano', d: '27 huesos en la mano sola' },
              { icon: Aperture, t: 'Pelvis', d: 'Soporta todo tu torso' },
              { icon: Footprints, t: 'Pierna y pie', d: 'Fémur + Aquiles + arco plantar' },
            ].map(z => (
              <button key={z.t} onClick={() => setScreen('scanner')} className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[.03] p-4 text-left transition hover:border-cyan-300/40 hover:bg-cyan-400/10">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 transition group-hover:bg-cyan-300 group-hover:text-black"><z.icon className="h-5 w-5" /></span>
                <span><span className="block font-bold">{z.t}</span><span className="font-mono2 text-[11px] text-white/50">{z.d}</span></span>
                <ChevronRight className="ml-auto h-4 w-4 text-white/30 transition group-hover:translate-x-1 group-hover:text-cyan-200" />
              </button>
            ))}
          </div>

          {/* CTA final */}
          <div className="relative mt-12 overflow-hidden rounded-[32px] border border-white/10">
            <img src={img("hero-anatomy.jpg")} className="absolute inset-0 h-full w-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
            <div className="relative p-8 sm:p-12">
              <div className="font-mono2 text-xs tracking-[0.3em] text-cyan-300">¿LISTO PARA VERTE POR DENTRO?</div>
              <h3 className="font-display mt-2 max-w-xl text-3xl font-black leading-tight sm:text-5xl">Tu cuerpo en modo <span className="text-cyan-300">rayos X.</span> En 5 segundos.</h3>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => setScreen('scanner')} className="flex items-center gap-2 rounded-2xl bg-white px-8 py-4 font-black text-black transition hover:bg-cyan-300"><Camera className="h-5 w-5" /> Abrir escáner ahora</button>
                <span className="flex items-center gap-2 rounded-2xl border border-white/20 bg-black/40 px-5 py-4 font-mono2 text-xs text-white/70 backdrop-blur"><ShieldCheck className="h-4 w-4 text-emerald-300" /> Sin registro · sin subida · gratis</span>
              </div>
            </div>
          </div>

          <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 font-mono2 text-[11px] text-white/40">
            <span>ANATOMIA XR · recursos visuales generados con Higgsfield AI · overlays anatómicos SVG interactivos</span>
            <span>⚕️ Contenido educativo, no es diagnóstico médico</span>
          </footer>
        </div>
      </section>
    </div>
  );
}
