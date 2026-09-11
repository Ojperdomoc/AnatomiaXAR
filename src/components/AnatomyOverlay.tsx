import type { LayerId, ViewId } from '../data/anatomy';

interface Props {
  visible: Record<LayerId, boolean>;
  view: ViewId;
  opacity: number; // 0-1
  showLabels: boolean;
  pulse: boolean;
  xray: number; // 0-100
}

export default function AnatomyOverlay({ visible, view, opacity, showLabels, pulse, xray }: Props) {
  const isPost = view === 'posterior';
  const o = opacity;
  const xBoost = xray / 100; // 0..1 aumenta brillo

  return (
    <svg
      id="anatomy-svg"
      viewBox="0 0 400 820"
      className="h-full w-full overflow-visible"
      style={{
        transform: isPost ? 'scaleX(-1)' : view === 'lateral' ? 'scaleX(0.62)' : 'none',
        transition: 'transform .7s cubic-bezier(.22,1,.36,1)',
        filter: `brightness(${1 + xBoost * 0.9}) contrast(${1 + xBoost * 0.35})`,
      }}
    >
      <defs>
        <linearGradient id="muscleGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff6b7a" />
          <stop offset="45%" stopColor="#e11d33" />
          <stop offset="100%" stopColor="#6b0a18" />
        </linearGradient>
        <linearGradient id="muscleDark" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff8a94" stopOpacity=".9" />
          <stop offset="50%" stopColor="#c81e32" />
          <stop offset="100%" stopColor="#5c0713" />
        </linearGradient>
        <linearGradient id="boneGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#9fc4d8" />
        </linearGradient>
        <radialGradient id="jointGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0" />
        </radialGradient>
        <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* silueta base */}
      <g opacity={0.5}>
        <path
          d="M200 12 C 178 12 168 34 168 58 C 168 76 172 88 178 94 L 172 108 L 142 122 L 118 158 L 102 290 L 94 410 L 106 420 L 118 320 L 128 300 L 132 380 L 150 440 L 156 580 L 148 710 L 144 760 L 176 760 L 184 660 L 192 540 L 200 540 L 208 540 L 216 660 L 224 760 L 256 760 L 252 710 L 244 580 L 250 440 L 268 380 L 272 300 L 282 320 L 294 420 L 306 410 L 298 290 L 282 158 L 258 122 L 228 108 L 222 94 C 228 88 232 76 232 58 C 232 34 222 12 200 12 Z"
          fill="rgba(34,211,238,.06)"
          stroke="rgba(34,211,238,.55)"
          strokeWidth="1.6"
        />
      </g>

      {/* ===== HUESOS ===== */}
      {visible.huesos && (
        <g opacity={o} filter="url(#soft)" strokeLinecap="round" strokeLinejoin="round">
          {/* cráneo */}
          <ellipse cx="200" cy="54" rx="30" ry="36" fill="rgba(232,246,255,.14)" stroke="url(#boneGrad)" strokeWidth="5" />
          <path d="M182 78 L182 92 Q200 102 218 92 L218 78" fill="none" stroke="#e8f6ff" strokeWidth="4.5" />
          <ellipse cx="189" cy="56" rx="6.5" ry="8" fill="#05070e" stroke="#e8f6ff" strokeWidth="2.5" />
          <ellipse cx="211" cy="56" rx="6.5" ry="8" fill="#05070e" stroke="#e8f6ff" strokeWidth="2.5" />
          <path d="M196 70 L204 70 L200 75 Z" fill="#e8f6ff" />
          {/* columna cervical */}
          <line x1="200" y1="94" x2="200" y2="132" stroke="#e8f6ff" strokeWidth="6" />
          {/* clavículas */}
          <line x1="156" y1="144" x2="196" y2="136" stroke="#e8f6ff" strokeWidth="5" />
          <line x1="244" y1="144" x2="204" y2="136" stroke="#e8f6ff" strokeWidth="5" />
          {/* esternón */}
          <line x1="200" y1="152" x2="200" y2="262" stroke="#e8f6ff" strokeWidth="5" />
          {/* costillas */}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const y = 162 + i * 20;
            return (
              <g key={i} fill="none" stroke="#dff1ff" strokeWidth={i > 4 ? 3.5 : 4.5} opacity={0.95}>
                <path d={`M200 ${y} C 178 ${y} ${150 + i * 2} ${y + 6} ${148 + i * 2} ${y + 18} Q ${147 + i * 2} ${y + 26} ${156 + i * 3} ${y + 28}`} />
                <path d={`M200 ${y} C 222 ${y} ${250 - i * 2} ${y + 6} ${252 - i * 2} ${y + 18} Q ${253 - i * 2} ${y + 26} ${244 - i * 3} ${y + 28}`} />
              </g>
            );
          })}
          {/* columna torácica + lumbar */}
          <line x1="200" y1="132" x2="200" y2="410" stroke="#cfe8f7" strokeWidth="7" strokeDasharray="0" opacity=".95" />
          {[150, 175, 200, 225, 250, 280, 310, 340, 365, 390].map((y) => (
            <ellipse key={y} cx="200" cy={y} rx="10" ry="4.5" fill="#fff" opacity=".95" />
          ))}
          {/* pelvis */}
          <path d="M154 396 Q200 384 246 396 L238 446 Q200 464 162 446 Z" fill="rgba(232,246,255,.16)" stroke="#eaf6ff" strokeWidth="5" />
          <ellipse cx="200" cy="432" rx="12" ry="16" fill="none" stroke="#eaf6ff" strokeWidth="4" />
          {/* brazos */}
          <g stroke="#eaf6ff" strokeWidth="7" fill="none">
            <line x1="142" y1="158" x2="122" y2="292" />
            <line x1="258" y1="158" x2="278" y2="292" />
          </g>
          <g stroke="#d7ecf8" strokeWidth="5.5" fill="none">
            <line x1="122" y1="292" x2="112" y2="412" />
            <line x1="278" y1="292" x2="288" y2="412" />
            <line x1="122" y1="292" x2="112" y2="412" />
          </g>
          {/* manos huesos */}
          <g fill="none" stroke="#eaf6ff" strokeWidth="3">
            <path d="M104 412 L100 452 M112 412 L110 454 M120 412 L121 450" />
            <path d="M296 412 L300 452 M288 412 L290 454 M280 412 L279 450" />
          </g>
          {/* fémur / tibia */}
          <g stroke="#eaf6ff" strokeWidth="9" fill="none" strokeLinecap="round">
            <line x1="172" y1="452" x2="166" y2="576" />
            <line x1="228" y1="452" x2="234" y2="576" />
          </g>
          <g stroke="#d7ecf8" strokeWidth="7" fill="none">
            <line x1="166" y1="590" x2="160" y2="712" />
            <line x1="234" y1="590" x2="240" y2="712" />
            <line x1="176" y1="590" x2="172" y2="710" opacity=".6" strokeWidth="4" />
            <line x1="224" y1="590" x2="228" y2="710" opacity=".6" strokeWidth="4" />
          </g>
          {/* rótula */}
          <circle cx="166" cy="583" r="9" fill="#fff" stroke="#9fc4d8" strokeWidth="2.5" />
          <circle cx="234" cy="583" r="9" fill="#fff" stroke="#9fc4d8" strokeWidth="2.5" />
          {/* pies */}
          <g fill="rgba(232,246,255,.2)" stroke="#eaf6ff" strokeWidth="4">
            <path d="M146 714 L174 714 L172 748 L142 748 Z" />
            <path d="M226 714 L254 714 L258 748 L228 748 Z" />
          </g>
          {/* articulaciones glow */}
          {[[142,158],[258,158],[122,292],[278,292],[112,412],[288,412],[166,583],[234,583],[160,712],[240,712]].map(([x,y],i)=>(
            <circle key={i} cx={x} cy={y} r="12" fill="url(#jointGlow)" opacity=".55" />
          ))}
        </g>
      )}

      {/* ===== MÚSCULOS ===== */}
      {visible.musculos && (
        <g opacity={o} className={pulse ? 'muscle-pulse' : ''} filter="url(#soft)">
          {/* trapecio */}
          <path d="M182 112 L218 112 L252 152 L148 152 Z" fill="url(#muscleGrad)" stroke="#7a0e1a" strokeWidth="1.5" opacity=".92" />
          {/* deltoides */}
          <ellipse cx="134" cy="176" rx="26" ry="30" fill="url(#muscleGrad)" stroke="#7a0e1a" strokeWidth="1.5" />
          <ellipse cx="266" cy="176" rx="26" ry="30" fill="url(#muscleGrad)" stroke="#7a0e1a" strokeWidth="1.5" />
          {/* pectorales */}
          <path d="M150 168 Q175 164 198 176 L196 214 Q172 222 150 206 Z" fill="url(#muscleDark)" stroke="#4a0510" strokeWidth="1.5" />
          <path d="M250 168 Q225 164 202 176 L204 214 Q228 222 250 206 Z" fill="url(#muscleDark)" stroke="#4a0510" strokeWidth="1.5" />
          {/* serrato / oblicuos */}
          <path d="M148 212 L162 300 L152 300 Z M252 212 L238 300 L248 300 Z" fill="#c81e32" opacity=".85" />
          <path d="M164 232 Q200 246 236 232 L232 320 Q200 334 168 320 Z" fill="url(#muscleGrad)" opacity=".28" />
          {/* abs 6 pack */}
          {[238, 262, 286].map((y) => (
            <g key={y}>
              <rect x="178" y={y} width="18" height="20" rx="6" fill="url(#muscleDark)" stroke="#4a0510" strokeWidth="1.2" />
              <rect x="204" y={y} width="18" height="20" rx="6" fill="url(#muscleDark)" stroke="#4a0510" strokeWidth="1.2" />
            </g>
          ))}
          {/* bíceps / tríceps */}
          <ellipse cx="126" cy="238" rx="14" ry="42" fill="url(#muscleGrad)" stroke="#4a0510" strokeWidth="1.4" />
          <ellipse cx="274" cy="238" rx="14" ry="42" fill="url(#muscleGrad)" stroke="#4a0510" strokeWidth="1.4" />
          <ellipse cx="116" cy="356" rx="11" ry="48" fill="#d8263c" opacity=".9" />
          <ellipse cx="284" cy="356" rx="11" ry="48" fill="#d8263c" opacity=".9" />
          {/* cuádriceps */}
          <path d="M150 456 Q166 452 182 458 L178 566 Q164 574 152 566 Z" fill="url(#muscleGrad)" stroke="#4a0510" strokeWidth="1.5" />
          <path d="M250 456 Q234 452 218 458 L222 566 Q236 574 248 566 Z" fill="url(#muscleGrad)" stroke="#4a0510" strokeWidth="1.5" />
          <ellipse cx="166" cy="510" rx="10" ry="46" fill="#ff6b7a" opacity=".55" />
          <ellipse cx="234" cy="510" rx="10" ry="46" fill="#ff6b7a" opacity=".55" />
          {/* isquios hint lateral */}
          {/* gemelos */}
          <ellipse cx="163" cy="648" rx="14" ry="44" fill="url(#muscleDark)" stroke="#4a0510" strokeWidth="1.3" />
          <ellipse cx="237" cy="648" rx="14" ry="44" fill="url(#muscleDark)" stroke="#4a0510" strokeWidth="1.3" />
          {/* glúteos (post hint, tenue en frontal) */}
          <ellipse cx="178" cy="428" rx="20" ry="26" fill="#b91c2e" opacity={isPost ? .95 : .28} />
          <ellipse cx="222" cy="428" rx="20" ry="26" fill="#b91c2e" opacity={isPost ? .95 : .28} />
          {/* cuello */}
          <path d="M186 96 L214 96 L220 126 L180 126 Z" fill="#d8263c" opacity=".9" />
        </g>
      )}

      {/* ===== LIGAMENTOS ===== */}
      {visible.ligamentos && (
        <g opacity={o} filter="url(#soft)">
          {/* discos intervertebrales */}
          {[168, 208, 248, 288, 326].map((y) => (
            <rect key={y} x="188" y={y} width="24" height="9" rx="4.5" fill="#ffd233" stroke="#7a5a00" strokeWidth="1.2" style={{ filter: 'drop-shadow(0 0 6px rgba(255,210,51,.8))' }} />
          ))}
          {/* hombros */}
          <ellipse cx="142" cy="156" rx="14" ry="7" fill="#ffd233" stroke="#7a5a00" strokeWidth="1.2" transform="rotate(-18 142 156)" />
          <ellipse cx="258" cy="156" rx="14" ry="7" fill="#ffd233" stroke="#7a5a00" strokeWidth="1.2" transform="rotate(18 258 156)" />
          {/* codos colaterales */}
          <g stroke="#ffd233" strokeWidth="5" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 6px rgba(255,210,51,.8))' }}>
            <line x1="114" y1="286" x2="130" y2="298" />
            <line x1="130" y1="286" x2="114" y2="298" />
            <line x1="270" y1="286" x2="286" y2="298" />
            <line x1="286" y1="286" x2="270" y2="298" />
          </g>
          {/* muñecas */}
          <rect x="102" y="404" width="22" height="10" rx="5" fill="#ffd233" stroke="#7a5a00" strokeWidth="1.2" />
          <rect x="276" y="404" width="22" height="10" rx="5" fill="#ffd233" stroke="#7a5a00" strokeWidth="1.2" />
          {/* rodilla LCA/LCP cruz */}
          <g strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 8px rgba(255,210,51,.9))' }}>
            <line x1="158" y1="574" x2="174" y2="592" stroke="#ffd233" strokeWidth="5" />
            <line x1="174" y1="574" x2="158" y2="592" stroke="#ff9d00" strokeWidth="5" />
            <line x1="226" y1="574" x2="242" y2="592" stroke="#ffd233" strokeWidth="5" />
            <line x1="242" y1="574" x2="226" y2="592" stroke="#ff9d00" strokeWidth="5" />
          </g>
          <ellipse cx="166" cy="583" rx="16" ry="16" fill="none" stroke="#ffd233" strokeWidth="2" strokeDasharray="4 4" opacity=".9" />
          <ellipse cx="234" cy="583" rx="16" ry="16" fill="none" stroke="#ffd233" strokeWidth="2" strokeDasharray="4 4" opacity=".9" />
          {/* tobillo deltoideo */}
          <path d="M150 702 L170 702 L168 716 L150 716 Z" fill="#ffd233" stroke="#7a5a00" strokeWidth="1.2" />
          <path d="M230 702 L250 702 L250 716 L232 716 Z" fill="#ffd233" stroke="#7a5a00" strokeWidth="1.2" />
          {/* sacroilíaco */}
          <ellipse cx="168" cy="418" rx="6" ry="14" fill="#ffd233" />
          <ellipse cx="232" cy="418" rx="6" ry="14" fill="#ffd233" />
        </g>
      )}

      {/* ===== TENDONES ===== */}
      {visible.tendones && (
        <g opacity={o} fill="none" strokeLinecap="round" filter="url(#soft)">
          {/* manguito rotador */}
          <g stroke="#4de3ff" strokeWidth="2.6" opacity=".95" className="flow-line">
            <path d="M132 168 L150 152" />
            <path d="M268 168 L250 152" />
            <path d="M136 190 L154 184" />
            <path d="M264 190 L246 184" />
          </g>
          {/* bicipital */}
          <path d="M126 270 L120 292" stroke="#e8ffff" strokeWidth="3.5" style={{ filter: 'drop-shadow(0 0 6px #4de3ff)' }} />
          <path d="M274 270 L280 292" stroke="#e8ffff" strokeWidth="3.5" style={{ filter: 'drop-shadow(0 0 6px #4de3ff)' }} />
          {/* extensores antebrazo → dedos */}
          <g stroke="#4de3ff" strokeWidth="2.2" opacity=".9" className="flow-line">
            <path d="M112 380 L104 452 M116 380 L114 454 M120 380 L124 450" />
            <path d="M288 380 L296 452 M284 380 L286 454 M280 380 L276 450" />
          </g>
          {/* rotuliano */}
          <line x1="166" y1="592" x2="166" y2="614" stroke="#e8ffff" strokeWidth="5" style={{ filter: 'drop-shadow(0 0 8px #4de3ff)' }} />
          <line x1="234" y1="592" x2="234" y2="614" stroke="#e8ffff" strokeWidth="5" style={{ filter: 'drop-shadow(0 0 8px #4de3ff)' }} />
          {/* Aquiles */}
          <line x1="163" y1="678" x2="160" y2="718" stroke="#e8ffff" strokeWidth="5" style={{ filter: 'drop-shadow(0 0 8px #4de3ff)' }} />
          <line x1="237" y1="678" x2="240" y2="718" stroke="#e8ffff" strokeWidth="5" style={{ filter: 'drop-shadow(0 0 8px #4de3ff)' }} />
          {/* cuello / trapecio tendon */}
          <line x1="200" y1="100" x2="200" y2="132" stroke="#4de3ff" strokeWidth="2.5" strokeDasharray="5 4" />
        </g>
      )}

      {/* etiquetas */}
      {showLabels && (
        <g fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#c9f6ff">
          {view !== 'lateral' ? (
            <>
              <g opacity=".95">
                <line x1="230" y1="54" x2="310" y2="34" stroke="#22d3ee" strokeWidth="1" />
                <circle cx="230" cy="54" r="3" fill="#22d3ee" />
                <text x="314" y="37">CRÁNEO</text>
              </g>
              <g opacity=".95">
                <line x1="148" y1="200" x2="62" y2="188" stroke="#ff4d5e" strokeWidth="1" />
                <circle cx="148" cy="200" r="3" fill="#ff4d5e" />
                <text x="8" y="191" fill="#ffc2c8">PECTORAL</text>
              </g>
              <g opacity=".95">
                <line x1="252" y1="288" x2="322" y2="300" stroke="#ffd233" strokeWidth="1" />
                <circle cx="252" cy="288" r="3" fill="#ffd233" />
                <text x="326" y="303" fill="#ffe58a">CODO · LIG.</text>
              </g>
              <g opacity=".95">
                <line x1="166" y1="510" x2="84" y2="530" stroke="#ff4d5e" strokeWidth="1" />
                <circle cx="166" cy="510" r="3" fill="#ff4d5e" />
                <text x="8" y="533" fill="#ffc2c8">CUÁDRICEPS</text>
              </g>
              <g opacity=".95">
                <line x1="234" y1="583" x2="310" y2="600" stroke="#ffd233" strokeWidth="1" />
                <circle cx="234" cy="583" r="3" fill="#fff" stroke="#ffd233" />
                <text x="314" y="603" fill="#ffe58a">LCA · RODILLA</text>
              </g>
              <g opacity=".95">
                <line x1="160" y1="698" x2="70" y2="720" stroke="#4de3ff" strokeWidth="1" />
                <circle cx="160" cy="698" r="3" fill="#4de3ff" />
                <text x="8" y="723" fill="#b8efff">AQUILES</text>
              </g>
            </>
          ) : (
            <>
              <g opacity=".95">
                <line x1="200" y1="54" x2="280" y2="40" stroke="#22d3ee" strokeWidth="1" />
                <text x="284" y="43">PERFIL</text>
              </g>
              <g opacity=".95">
                <line x1="200" y1="280" x2="280" y2="280" stroke="#ffd233" strokeWidth="1" />
                <text x="284" y="283" fill="#ffe58a">CURVA LUMBAR</text>
              </g>
            </>
          )}
        </g>
      )}
    </svg>
  );
}
