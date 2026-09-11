export type LayerId = 'huesos' | 'musculos' | 'ligamentos' | 'tendones';
export type ViewId = 'frontal' | 'posterior' | 'lateral';

export interface LayerInfo {
  id: LayerId;
  nombre: string;
  tagline: string;
  color: string;
  glow: string;
  icon: string;
  count: string;
  desc: string;
  funcion: string[];
  dato: string;
}

export const LAYERS: LayerInfo[] = [
  {
    id: 'huesos',
    nombre: 'Huesos',
    tagline: 'Estructura · 206 piezas',
    color: '#e8f6ff',
    glow: 'rgba(232,246,255,.6)',
    icon: 'bone',
    count: '206',
    desc: 'El esqueleto es tu armazón. Protege órganos, produce sangre en la médula y almacena calcio. En el escáner verás cráneo, caja torácica, columna, pelvis y huesos largos.',
    funcion: ['Soporte y forma', 'Protección cerebral y torácica', 'Palanca para el movimiento'],
    dato: 'El fémur soporta hasta 30x tu peso en un salto.',
  },
  {
    id: 'musculos',
    nombre: 'Músculos',
    tagline: 'Motor · +600 fascículos',
    color: '#ff4d5e',
    glow: 'rgba(255,77,94,.55)',
    icon: 'muscle',
    count: '600+',
    desc: 'Tejido contráctil que convierte energía en movimiento. Deltoides, pectorales, recto abdominal, cuádriceps y gemelos se iluminan con pulso rojo en modo AR.',
    funcion: ['Movimiento voluntario', 'Postura y estabilidad', 'Generación de calor'],
    dato: 'El glúteo mayor es el músculo más grande; el estapedio, el más pequeño.',
  },
  {
    id: 'ligamentos',
    nombre: 'Ligamentos',
    tagline: 'Unión · estabilizadores',
    color: '#ffd233',
    glow: 'rgba(255,210,51,.55)',
    icon: 'link',
    count: '900+',
    desc: 'Bandas elásticas de colágeno que unen hueso con hueso. Mira hombro, codo, muñeca, rodilla (LCA/LCP) y tobillo en amarillo Higgsfield.',
    funcion: ['Estabilizan articulaciones', 'Limitan movimientos extremos', 'Propiocepción'],
    dato: 'El ligamento cruzado anterior aguanta ~2100N antes de romperse.',
  },
  {
    id: 'tendones',
    nombre: 'Tendones',
    tagline: 'Transmisión · colágeno',
    color: '#4de3ff',
    glow: 'rgba(77,227,255,.6)',
    icon: 'tendon',
    count: '4000+',
    desc: 'Cuerdas blanquecinas que conectan músculo con hueso y transmiten la fuerza. Destacan el tendón de Aquiles, rotuliano y manguito rotador.',
    funcion: ['Transmiten fuerza', 'Almacenan energía elástica', 'Precisión en manos'],
    dato: 'El Aquiles soporta 12x tu peso al correr.',
  },
];

export interface Zone {
  id: string;
  nombre: string;
  foco: string;
  scale: number;
  x: number; // translate %
  y: number;
  hueso: string;
  musculo: string;
  lig: string;
  tendon: string;
}

export const ZONES: Zone[] = [
  { id: 'full', nombre: 'Cuerpo completo', foco: 'Vista general AR', scale: 1, x: 0, y: 0, hueso: '206 huesos visibles', musculo: 'Grupos mayores', lig: 'Cinturas + rodilla', tendon: 'Aquiles + rotuliano' },
  { id: 'craneo', nombre: 'Cráneo y cuello', foco: '22 huesos craneales', scale: 2.6, x: 0, y: 32, hueso: 'Cráneo · mandíbula · C1-C7', musculo: 'Esternocleidomastoideo', lig: 'Lig. nucal', tendon: 'Temporal' },
  { id: 'torax', nombre: 'Tórax', foco: 'Caja torácica', scale: 2.1, x: 0, y: 16, hueso: '12 pares costillas + esternón', musculo: 'Pectoral mayor · serrato', lig: 'Costoclavicular', tendon: 'Pectoral' },
  { id: 'columna', nombre: 'Columna', foco: '33 vértebras', scale: 2.2, x: 0, y: 8, hueso: 'Cervical-Lumbar-Sacro', musculo: 'Erectores espinales', lig: 'Longitudinal + discos', tendon: 'Supraespinoso' },
  { id: 'brazo', nombre: 'Brazo', foco: 'Hombro → mano', scale: 2.3, x: -28, y: 8, hueso: 'Húmero · radio · cúbito', musculo: 'Bíceps · tríceps · deltoides', lig: 'Colateral codo · muñeca', tendon: 'Bicipital · extensores' },
  { id: 'mano', nombre: 'Mano', foco: '27 huesos', scale: 3.1, x: -30, y: -12, hueso: 'Carpos · metacarpos', musculo: 'Interóseos · tenar', lig: 'Colaterales dedos', tendon: 'Flexores · extensores' },
  { id: 'pelvis', nombre: 'Pelvis', foco: 'Cintura pélvica', scale: 2.4, x: 0, y: -10, hueso: 'Ilium · isquion · sacro', musculo: 'Glúteo · psoas', lig: 'Sacroilíaco · inguinal', tendon: 'Isquiotibial origen' },
  { id: 'pierna', nombre: 'Pierna', foco: 'Cadera → pie', scale: 2.0, x: 14, y: -22, hueso: 'Fémur · tibia · peroné', musculo: 'Cuádriceps · isquios · gemelos', lig: 'LCA · LCP · lateral', tendon: 'Rotuliano · Aquiles' },
  { id: 'pie', nombre: 'Pie', foco: '26 huesos + arco', scale: 3.2, x: 14, y: -34, hueso: 'Tarso · metatarso', musculo: 'Plantar · sóleo', lig: 'Deltoideo tobillo', tendon: 'Aquiles inserción' },
];

export const DEMO_VIDEO = 'https://videos.pexels.com/video-files/9558739/9558739-uhd_2160_4096_25fps.mp4';
