<div align="center">

# ANATOMIA XR · Escáner de Músculos, Huesos y Tendones

Apunta tu cámara y revela tus **músculos, huesos, ligamentos y tendones** en tiempo real.
Calibra, haz zoom por zonas y captura tu rayos X estilo sci-fi.

**Demo en vivo:** https://ojperdomoc.github.io/AnatomiaXAR/

![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-222?logo=github)

</div>

---

## ✨ Funciones

- 📷 **Escáner AR en vivo** — overlay anatómico SVG sobre tu cámara (frontal o trasera).
- 🦴 **4 capas anatómicas** — huesos, músculos, ligamentos y tendones, combinables.
- 🔄 **3 vistas** — frontal, posterior y lateral.
- 🎯 **9 zonas de enfoque** — del cráneo al pie, con zoom automático y guía educativa.
- 🎛️ **Calibración AR** — opacidad, intensidad rayos X, escala, posición, espejo, rejilla.
- 📸 **Capturas** — descarga tu escaneo en PNG (hasta 6 en sesión).
- 🤖 **Modo demo Higgsfield** — funciona sin cámara con video de muestra.
- 🔒 **100% privado** — todo se procesa en tu dispositivo, nada se sube.

## 🛠️ Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 7](https://vite.dev/) + [vite-plugin-singlefile](https://github.com/richardtallent/vite-plugin-singlefile)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [lucide-react](https://lucide.dev/) (iconos)

## 🚀 Desarrollo local

Requisitos: **Node.js 20+** (recomendado 22) y npm.

```bash
# Clonar
git clone https://github.com/Ojperdomoc/AnatomiaXAR.git
cd AnatomiaXAR

# Instalar dependencias
npm install

# Servidor de desarrollo (http://localhost:5173)
npm run dev

# Verificación de tipos + build de producción (salida en dist/)
npm run build

# Vista previa del build
npm run preview
```

> 📱 **Nota sobre la cámara:** los navegadores solo permiten `getUserMedia` en contextos
> seguros (HTTPS o `localhost`). En GitHub Pages funciona directo; en red local usa
> `localhost` o un túnel HTTPS. Sin cámara disponible, la app ofrece el modo demo.

## 🌐 Despliegue en GitHub Pages

El repo incluye el workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
que construye y publica `dist/` automáticamente en cada push a `main`.

**Activarlo (solo una vez):**

1. Ve a **Settings → Pages**.
2. En **Build and deployment → Source**, elige **GitHub Actions**.
3. Haz push a `main` (o ejecuta el workflow manualmente desde **Actions**).
4. Tu sitio quedará en `https://ojperdomoc.github.io/AnatomiaXAR/`.

El proyecto usa `base: "./"` en [`vite.config.ts`](vite.config.ts) y rutas de imágenes
relativas a `import.meta.env.BASE_URL`, así que el mismo build funciona en GitHub Pages,
en un dominio personalizado o en cualquier subruta.

## 📁 Estructura

```
├── index.html                  # Entrada HTML
├── public/images/              # Visuales (hero, músculo, hueso)
├── src/
│   ├── App.tsx                 # Landing page
│   ├── main.tsx                # Punto de entrada React
│   ├── index.css               # Estilos + animaciones + Tailwind
│   ├── components/
│   │   ├── Scanner.tsx         # Escáner AR (cámara + HUD + panel)
│   │   └── AnatomyOverlay.tsx  # Overlay anatómico SVG (4 capas, 3 vistas)
│   ├── data/anatomy.ts         # Capas, zonas y video demo
│   └── utils/cn.ts             # Utilidad de clases
├── .github/workflows/deploy.yml# CI/CD a GitHub Pages
└── vite.config.ts              # Config Vite (base relativa + singlefile)
```

## ⚕️ Aviso

Contenido con fines **educativos**. No es diagnóstico médico.

## 📄 Licencia

MIT — úsalo, mejóralo y comparte.
