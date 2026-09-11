import { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, RefreshCw, Crosshair, Zap, Eye, EyeOff, ScanLine, Grid3X3, Tag, Activity, FlipHorizontal2, Download, Sparkles, Info, ChevronLeft, Bone, Beef, Cable, Spline } from 'lucide-react';
import AnatomyOverlay from './AnatomyOverlay';
import { LAYERS, ZONES, DEMO_VIDEO, type LayerId, type ViewId } from '../data/anatomy';

interface Props {
  onBack: () => void;
}

const layerIcons: Record<string, any> = {
  bone: Bone,
  muscle: Beef,
  link: Cable,
  tendon: Spline,
};

export default function Scanner({ onBack }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const demoVideoRef = useRef<HTMLVideoElement>(null);
  const [streamOn, setStreamOn] = useState(false);
  const [error, setError] = useState('');
  const [demoMode, setDemoMode] = useState(false);
  const [facing, setFacing] = useState<'user' | 'environment'>('user');
  const [starting, setStarting] = useState(false);

  const [visible, setVisible] = useState<Record<LayerId, boolean>>({ huesos: true, musculos: true, ligamentos: false, tendones: false });
  const [view, setView] = useState<ViewId>('frontal');
  const [zoneId, setZoneId] = useState('full');
  const [opacity, setOpacity] = useState(0.92);
  const [xray, setXray] = useState(28);
  const [scale, setScale] = useState(1);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);

  const [mirror, setMirror] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [pulse, setPulse] = useState(true);
  const [scanActive, setScanActive] = useState(true);
  const [showHelp, setShowHelp] = useState(true);

  const [bpm, setBpm] = useState(72);
  const [track, setTrack] = useState(97.4);
  const [captures, setCaptures] = useState<string[]>([]);
  const [flash, setFlash] = useState(false);
  const [toast, setToast] = useState('');

  const zone = ZONES.find(z => z.id === zoneId)!;
  const activeCount = Object.values(visible).filter(Boolean).length;

  const startCamera = async (mode: 'user' | 'environment' = facing) => {
    setStarting(true);
    setError('');
    try {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1080 }, height: { ideal: 1920 } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStreamOn(true);
      setDemoMode(false);
      showToast('Cámara conectada · tracking corporal activo');
    } catch (e) {
      setError('No se pudo acceder a la cámara. Activo modo demo Higgsfield.');
      setDemoMode(true);
      setStreamOn(false);
    } finally {
      setStarting(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setBpm(b => Math.max(58, Math.min(112, b + (Math.random() * 6 - 3))));
      setTrack(t => Math.max(88, Math.min(99.9, t + (Math.random() * 1.2 - 0.6))));
    }, 1200);
    return () => clearInterval(id);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  };

  const toggleLayer = (id: LayerId) => setVisible(v => ({ ...v, [id]: !v[id] }));

  const switchCamera = async () => {
    const next = facing === 'user' ? 'environment' : 'user';
    setFacing(next);
    setMirror(next === 'user');
    await startCamera(next);
  };

  const capture = async () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 320);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 720; canvas.height = 960;
      const ctx = canvas.getContext('2d')!;
      // fondo
      ctx.fillStyle = '#05070e';
      ctx.fillRect(0, 0, 720, 960);
      const srcVideo = demoMode ? demoVideoRef.current : videoRef.current;
      if (srcVideo) {
        const vw = srcVideo.videoWidth || 720;
        const vh = srcVideo.videoHeight || 960;
        // cover fit
        const scaleF = Math.max(720 / vw, 960 / vh);
        const dw = vw * scaleF, dh = vh * scaleF;
        ctx.save();
        if (mirror) { ctx.translate(720, 0); ctx.scale(-1, 1); }
        // filtro frío tipo rayos X
        ctx.filter = `contrast(${1 + xray / 220}) brightness(${0.75 + xray / 220}) saturate(1.1)`;
        ctx.drawImage(srcVideo, (720 - dw) / 2, (960 - dh) / 2, dw, dh);
        ctx.restore();
        ctx.filter = 'none';
      }
      // overlay svg
      const svgEl = document.getElementById('anatomy-svg');
      if (svgEl) {
        const xml = new XMLSerializer().serializeToString(svgEl);
        const svg64 = btoa(unescape(encodeURIComponent(xml)));
        const img = new Image();
        await new Promise((res, rej) => {
          img.onload = res; img.onerror = rej;
          img.src = 'data:image/svg+xml;base64,' + svg64;
        });
        ctx.globalAlpha = opacity;
        // aplicar zoom de zona + calibración aprox
        const z = zone.scale * scale;
        const w = 460 * z, h = 943 * z;
        const cx = 360 + posX * 3 + zone.x * 3;
        const cy = 480 + posY * 3 - zone.y * 4;
        ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
        ctx.globalAlpha = 1;
      }
      // HUD texto
      ctx.fillStyle = 'rgba(34,211,238,.9)';
      ctx.font = '700 20px monospace';
      ctx.fillText(`ANATOMIA XR · ${view.toUpperCase()} · ${new Date().toLocaleTimeString()}`, 24, 40);
      ctx.fillStyle = 'rgba(255,255,255,.7)';
      ctx.font = '16px monospace';
      ctx.fillText(`Capas: ${Object.entries(visible).filter(([,v])=>v).map(([k])=>k).join(' + ') || 'ninguna'} · XRAY ${xray}%`, 24, 920);
      const url = canvas.toDataURL('image/png');
      setCaptures(c => [url, ...c].slice(0, 6));
      const a = document.createElement('a');
      a.href = url; a.download = `anatomia-xr-${Date.now()}.png`; a.click();
      showToast('Captura guardada · análisis Higgsfield OK');
    } catch {
      showToast('No se pudo capturar');
    }
  };

  return (
    <div className="min-h-screen bg-[#05070e] text-white">
      {/* top bar */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[#05070e]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 transition hover:bg-white/10">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-700 tracking-widest">ANATOMIA<span className="text-cyan-300">XR</span></span>
                <span className="rounded-full border border-lime-300/30 bg-lime-300/10 px-2 py-0.5 font-mono2 text-[10px] text-lime-200">HIGGSFIELD</span>
              </div>
              <p className="font-mono2 text-[11px] text-white/50">Escáner musculoesquelético en vivo</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono2 text-[11px] sm:flex">
              <span className={`h-2 w-2 rounded-full ${streamOn || demoMode ? 'bg-red-500 blink' : 'bg-white/30'}`} />
              {demoMode ? 'DEMO' : streamOn ? 'REC · EN VIVO' : 'SIN SEÑAL'}
              <span className="text-white/40">|</span>
              <span className="text-cyan-200">{track.toFixed(1)}% track</span>
            </div>
            <button onClick={switchCamera} className="flex h-10 items-center gap-2 rounded-xl bg-cyan-400 px-3 text-sm font-bold text-black transition hover:bg-cyan-300">
              <RefreshCw className="h-4 w-4" /> <span className="hidden sm:inline">Girar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1400px] gap-4 px-4 py-4 lg:grid-cols-[1fr_400px]">
        {/* VIEWPORT */}
        <div>
          <div className="glass relative overflow-hidden rounded-3xl noise">
            {/* marco HUD esquinas */}
            <div className="pointer-events-none absolute inset-3 z-30">
              <div className="absolute left-0 top-0 h-10 w-10 rounded-tl-2xl border-l-[3px] border-t-[3px] border-cyan-300" />
              <div className="absolute right-0 top-0 h-10 w-10 rounded-tr-2xl border-r-[3px] border-t-[3px] border-cyan-300" />
              <div className="absolute bottom-0 left-0 h-10 w-10 rounded-bl-2xl border-b-[3px] border-l-[3px] border-cyan-300" />
              <div className="absolute bottom-0 right-0 h-10 w-10 rounded-br-2xl border-b-[3px] border-r-[3px] border-cyan-300" />
            </div>

            {/* top telemetry */}
            <div className="absolute left-0 right-0 top-0 z-30 flex items-start justify-between p-6">
              <div className="flex gap-2">
                <div className="rounded-xl border border-white/15 bg-black/55 px-3 py-2 font-mono2 text-[11px] backdrop-blur">
                  <div className="flex items-center gap-1.5 text-red-300"><Activity className="h-3.5 w-3.5" /> {Math.round(bpm)} BPM</div>
                  <div className="mt-1 h-1 w-24 overflow-hidden rounded-full bg-white/15">
                    <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400" style={{ width: `${Math.min(100, bpm)}%` }} />
                  </div>
                  <div className="mt-1 text-white/60">pulso simulado</div>
                </div>
                <div className="hidden rounded-xl border border-white/15 bg-black/55 px-3 py-2 font-mono2 text-[11px] backdrop-blur sm:block">
                  <div className="text-cyan-200">CUERPO · {view.toUpperCase()}</div>
                  <div className="text-white/60">{zone.nombre} · {activeCount}/4 capas</div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button onClick={() => setScanActive(!scanActive)} className={`flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono2 text-[11px] backdrop-blur transition ${scanActive ? 'border-cyan-300/50 bg-cyan-400/15 text-cyan-100' : 'border-white/15 bg-black/50 text-white/60'}`}>
                  <ScanLine className="h-3.5 w-3.5" /> SCAN {scanActive ? 'ON' : 'OFF'}
                </button>
                <div className="rounded-full border border-lime-300/30 bg-black/55 px-3 py-1 font-mono2 text-[10px] text-lime-200 backdrop-blur">✦ Higgsfield render</div>
              </div>
            </div>

            {/* video + overlay */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-b from-[#0a1222] to-black sm:aspect-[4/5] lg:aspect-auto lg:h-[78vh]">
              {!demoMode ? (
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  autoPlay
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ transform: mirror ? 'scaleX(-1)' : 'none', filter: `contrast(${1 + xray / 300}) brightness(.9) saturate(.9)` }}
                />
              ) : (
                <video
                  ref={demoVideoRef}
                  src={DEMO_VIDEO}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ transform: mirror ? 'scaleX(-1)' : 'none', filter: `contrast(${1 + xray / 300}) brightness(.85) saturate(1)` }}
                />
              )}

              {/* fallback si no hay stream ni demo */}
              {!streamOn && !demoMode && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[radial-gradient(ellipse_at_center,#0e1b33_0%,#05070e_70%)] p-8 text-center">
                  {starting ? (
                    <>
                      <div className="h-14 w-14 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
                      <p className="font-mono2 text-sm text-cyan-200">Solicitando cámara…</p>
                    </>
                  ) : (
                    <>
                      <Camera className="h-10 w-10 text-white/40" />
                      <p className="max-w-xs text-sm text-white/60">Permite el acceso a la cámara para verte en rayos X. O usa el modo demo.</p>
                      <div className="flex gap-2">
                        <button onClick={() => startCamera()} className="rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-black">Reintentar cámara</button>
                        <button onClick={() => setDemoMode(true)} className="rounded-xl border border-white/20 px-5 py-2.5 text-sm">Modo demo</button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* grid */}
              {showGrid && <div className="scanner-grid pointer-events-none absolute inset-0 z-10 opacity-60" />}

              {/* viñeta */}
              <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,.55)_100%)]" />

              {/* overlay anatomía con calibración + foco zona */}
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <div
                  className="h-[92%] transition-all duration-700 ease-out"
                  style={{
                    transform: `translate(${posX * 4 + zone.x * 2.2}px, ${posY * 4 - zone.y * 1.6}px) scale(${zone.scale * scale})`,
                    aspectRatio: '400/820',
                  }}
                >
                  <AnatomyOverlay visible={visible} view={view} opacity={opacity} showLabels={showLabels} pulse={pulse} xray={xray} />
                </div>
              </div>

              {/* línea de escaneo */}
              {scanActive && (
                <div className="pointer-events-none absolute inset-x-0 z-20">
                  <div className="animate-scan-y absolute inset-x-6">
                    <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_24px_6px_rgba(34,211,238,.55)]" />
                    <div className="h-16 w-full bg-gradient-to-b from-cyan-300/20 to-transparent" />
                  </div>
                </div>
              )}

              {/* flash captura */}
              {flash && <div className="absolute inset-0 z-40 bg-white/90" />}

              {/* silueta guía */}
              {showHelp && (
                <div className="absolute inset-x-0 bottom-20 z-30 mx-auto w-fit max-w-[92%]">
                  <div className="flex items-center gap-3 rounded-2xl border border-cyan-300/30 bg-black/75 p-3 pr-4 backdrop-blur-xl">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/20"><Crosshair className="h-5 w-5 text-cyan-200" /></div>
                    <p className="text-xs text-white/85"><b>Alíneate:</b> ponte de pie a 2 m, brazos levemente abiertos. Ajusta escala y posición a la derecha.</p>
                    <button onClick={() => setShowHelp(false)} className="rounded-lg bg-white/10 px-2 py-1 font-mono2 text-[11px]">OK</button>
                  </div>
                </div>
              )}

              {/* bottom controls flotantes */}
              <div className="absolute inset-x-0 bottom-0 z-30 flex items-end justify-between gap-3 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-5 pt-12">
                <div className="flex gap-2">
                  {(Object.keys(visible) as LayerId[]).map(id => (
                    <button
                      key={id}
                      onClick={() => toggleLayer(id)}
                      className={`h-11 rounded-xl border px-2.5 font-mono2 text-[10px] font-bold uppercase backdrop-blur transition ${visible[id] ? 'border-white/10 text-black' : 'border-white/15 bg-black/50 text-white/50'}`}
                      style={visible[id] ? { background: LAYERS.find(l => l.id === id)?.color, boxShadow: `0 0 18px ${LAYERS.find(l => l.id === id)?.glow}` } : {}}
                    >
                      {LAYERS.find(l => l.id === id)?.nombre.slice(0, 4)}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setDemoMode(!demoMode)} className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/60 backdrop-blur transition hover:bg-white/10" title="Demo / cámara">
                    {demoMode ? <Camera className="h-5 w-5" /> : <Sparkles className="h-5 w-5 text-lime-200" />}
                  </button>
                  <button onClick={capture} className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-white p-1.5 shadow-[0_0_30px_rgba(34,211,238,.5)] transition hover:scale-105">
                    <span className="flex h-full w-full items-center justify-center rounded-full border-4 border-black bg-gradient-to-br from-cyan-300 to-blue-600">
                      <Camera className="h-6 w-6 text-white" />
                    </span>
                  </button>
                  <button onClick={switchCamera} className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/60 backdrop-blur transition hover:bg-white/10">
                    <FlipHorizontal2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="hidden w-[92px] sm:block">
                  <div className="rounded-xl border border-white/15 bg-black/60 p-2 font-mono2 text-[10px] backdrop-blur">
                    <div className="text-white/50">XRAY</div>
                    <div className="text-lg font-bold text-cyan-200">{xray}%</div>
                  </div>
                </div>
              </div>

              {/* toast */}
              {toast && (
                <div className="absolute left-1/2 top-20 z-40 -translate-x-1/2 whitespace-nowrap rounded-full border border-cyan-300/40 bg-black/80 px-4 py-2 font-mono2 text-xs text-cyan-100 backdrop-blur">{toast}</div>
              )}
              {error && (
                <div className="absolute left-1/2 top-20 z-40 -translate-x-1/2 whitespace-nowrap rounded-full border border-amber-300/40 bg-black/80 px-4 py-2 font-mono2 text-[11px] text-amber-200">{error}</div>
              )}
            </div>
          </div>

          {/* capturas */}
          {captures.length > 0 && (
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {captures.map((c, i) => (
                <a key={i} href={c} download={`anatomia-${i}.png`} className="group relative h-24 w-[72px] shrink-0 overflow-hidden rounded-xl border border-white/15">
                  <img src={c} className="h-full w-full object-cover" alt="" />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100"><Download className="h-4 w-4" /></span>
                </a>
              ))}
              <div className="flex h-24 w-[72px] shrink-0 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/20 text-white/40">
                <span className="font-mono2 text-[10px]">{captures.length}/6</span>
                <span className="font-mono2 text-[9px]">capturas</span>
              </div>
            </div>
          )}
        </div>

        {/* PANEL */}
        <div className="flex flex-col gap-3 lg:max-h-[78vh] lg:overflow-y-auto lg:pr-1">
          {/* capas */}
          <div className="glass rounded-3xl p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-[13px] font-bold tracking-widest text-white/90">CAPAS ANATÓMICAS</h3>
              <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono2 text-[10px]">{activeCount}/4</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {LAYERS.map(l => {
                const Icon = layerIcons[l.icon];
                const on = visible[l.id];
                return (
                  <button key={l.id} onClick={() => toggleLayer(l.id)} className={`group relative overflow-hidden rounded-2xl border p-3 text-left transition ${on ? 'border-white/20 bg-white/[.07]' : 'border-white/10 bg-black/30 opacity-60'}`}>
                    <div className="flex items-center justify-between">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${l.color}22`, border: `1px solid ${l.color}55` }}>
                        <Icon className="h-4.5 w-4.5" style={{ color: l.color }} />
                      </span>
                      <span className={`flex h-6 w-11 items-center rounded-full p-1 transition ${on ? '' : 'bg-white/15'}`} style={on ? { background: l.color } : {}}>
                        <span className={`h-4 w-4 rounded-full bg-black transition-all ${on ? 'ml-auto !bg-black' : 'bg-white/70'}`} style={on ? {} : {}} />
                      </span>
                    </div>
                    <div className="mt-2 text-sm font-bold">{l.nombre}</div>
                    <div className="font-mono2 text-[10px] text-white/50">{l.tagline}</div>
                    {on && <div className="absolute inset-x-0 bottom-0 h-[3px]" style={{ background: l.color, boxShadow: `0 0 12px ${l.glow}` }} />}
                  </button>
                );
              })}
            </div>
            {/* vista */}
            <div className="mt-3 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-black/30 p-1.5">
              {(['frontal', 'posterior', 'lateral'] as ViewId[]).map(v => (
                <button key={v} onClick={() => setView(v)} className={`rounded-xl px-2 py-2 font-mono2 text-[11px] font-bold uppercase transition ${view === v ? 'bg-cyan-400 text-black shadow-[0_0_16px_rgba(34,211,238,.5)]' : 'text-white/55 hover:bg-white/10'}`}>{v}</button>
              ))}
            </div>
          </div>

          {/* zonas */}
          <div className="glass rounded-3xl p-4">
            <div className="mb-1 flex items-center gap-2">
              <Crosshair className="h-4 w-4 text-cyan-300" />
              <h3 className="font-display text-[13px] font-bold tracking-widest">ZONA DE ENFOQUE</h3>
            </div>
            <p className="mb-3 font-mono2 text-[11px] text-white/50">Toca una zona para hacer zoom AR · {zone.foco}</p>
            <div className="flex flex-wrap gap-1.5">
              {ZONES.map(z => (
                <button key={z.id} onClick={() => setZoneId(z.id)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${zoneId === z.id ? 'border-cyan-300 bg-cyan-400/20 text-cyan-100 shadow-[0_0_14px_rgba(34,211,238,.35)]' : 'border-white/12 bg-white/5 text-white/65 hover:bg-white/10'}`}>{z.nombre}</button>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 font-mono2 text-[10px]">
              <div className="rounded-xl bg-white/5 p-2.5"><span className="text-white/45">🦴 Hueso</span><br /><span className="text-[11px] text-white/90">{zone.hueso}</span></div>
              <div className="rounded-xl bg-white/5 p-2.5"><span className="text-white/45">🥩 Músculo</span><br /><span className="text-[11px] text-white/90">{zone.musculo}</span></div>
              <div className="rounded-xl bg-white/5 p-2.5"><span className="text-white/45">🟡 Ligamento</span><br /><span className="text-[11px] text-white/90">{zone.lig}</span></div>
              <div className="rounded-xl bg-white/5 p-2.5"><span className="text-white/45">🔵 Tendón</span><br /><span className="text-[11px] text-white/90">{zone.tendon}</span></div>
            </div>
          </div>

          {/* calibración */}
          <div className="glass rounded-3xl p-4">
            <h3 className="mb-3 font-display text-[13px] font-bold tracking-widest">CALIBRACIÓN AR</h3>
            {[
              { label: 'Opacidad capas', val: Math.round(opacity * 100) + '%', min: 10, max: 100, cur: opacity * 100, set: (v: number) => setOpacity(v / 100) },
              { label: 'Intensidad rayos X', val: xray + '%', min: 0, max: 100, cur: xray, set: setXray },
              { label: 'Escala cuerpo', val: scale.toFixed(2) + 'x', min: 60, max: 160, cur: scale * 100, set: (v: number) => setScale(v / 100) },
              { label: 'Posición X', val: posX.toFixed(0), min: -50, max: 50, cur: posX + 50, set: (v: number) => setPosX(v - 50) },
              { label: 'Posición Y', val: posY.toFixed(0), min: -50, max: 50, cur: posY + 50, set: (v: number) => setPosY(v - 50) },
            ].map(r => (
              <div key={r.label} className="mb-3 last:mb-0">
                <div className="mb-1.5 flex justify-between font-mono2 text-[11px]"><span className="text-white/65">{r.label}</span><span className="text-cyan-200">{r.val}</span></div>
                <input type="range" min={r.min} max={r.max} value={r.cur} onChange={e => r.set(Number(e.target.value))} className="w-full" />
              </div>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                { k: 'mirror', label: 'Espejo', icon: FlipHorizontal2, v: mirror, fn: setMirror },
                { k: 'grid', label: 'Rejilla', icon: Grid3X3, v: showGrid, fn: setShowGrid },
                { k: 'labels', label: 'Etiquetas', icon: Tag, v: showLabels, fn: setShowLabels },
                { k: 'pulse', label: 'Pulso', icon: Zap, v: pulse, fn: setPulse },
              ].map(t => (
                <button key={t.k} onClick={() => t.fn(!t.v)} className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-xs font-bold transition ${t.v ? 'border-cyan-300/40 bg-cyan-400/10 text-cyan-100' : 'border-white/10 bg-black/30 text-white/45'}`}>
                  <span className="flex items-center gap-2"><t.icon className="h-4 w-4" />{t.label}</span>
                  {t.v ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* info educativa */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[.07] to-transparent p-4">
            <div className="mb-2 flex items-center gap-2"><Info className="h-4 w-4 text-lime-200" /><h3 className="font-display text-[13px] font-bold tracking-widest">GUÍA ANATÓMICA</h3></div>
            <div className="space-y-2">
              {LAYERS.filter(l => visible[l.id]).map(l => (
                <details key={l.id} open={l.id === 'huesos'} className="group rounded-2xl border border-white/10 bg-black/30">
                  <summary className="flex cursor-pointer list-none items-center gap-3 p-3">
                    <span className="h-8 w-1.5 rounded-full" style={{ background: l.color, boxShadow: `0 0 10px ${l.glow}` }} />
                    <div className="flex-1"><div className="text-sm font-bold">{l.nombre} · <span className="font-mono2 text-[11px] text-white/50">{l.count}</span></div>
                      <div className="font-mono2 text-[10px] text-white/45">{l.tagline}</div></div>
                  </summary>
                  <div className="px-4 pb-3 text-xs leading-relaxed text-white/70">{l.desc}
                    <ul className="mt-2 space-y-1">
                      {l.funcion.map(f => <li key={f} className="flex gap-2"><span style={{ color: l.color }}>▸</span>{f}</li>)}
                    </ul>
                    <div className="mt-2 rounded-xl border border-white/10 bg-white/5 p-2 font-mono2 text-[11px] text-amber-100/90">💡 {l.dato}</div>
                  </div>
                </details>
              ))}
              {activeCount === 0 && <p className="rounded-2xl border border-dashed border-white/15 p-4 text-center font-mono2 text-xs text-white/40">Activa al menos una capa para ver la guía.</p>}
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 p-2 text-[11px] text-white/50">
              {!streamOn && !demoMode ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4 text-cyan-300" />}
              {demoMode ? 'Modo demo Higgsfield · video de muestra con overlay AR.' : streamOn ? 'Cámara en vivo · todo se procesa en tu dispositivo, nada se sube.' : 'Sin señal de cámara.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
