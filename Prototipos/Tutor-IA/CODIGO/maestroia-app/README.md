# MaestrolA — proyecto local (Vite + React + Tailwind)

Prototipo funcional del tutor de IA + Biblioteca Digital + Calendario + Panel
Docente para el Diplomado en Gestión de Innovación Corporativa (i3lab · ESPOL).

## 1. Requisitos

- [Node.js](https://nodejs.org/) 18 o superior (`node -v` para comprobar).

## 2. Instalación

```bash
npm install
```

## 3. Configura tu API key

```bash
cp .env.example .env
```

Abre `.env` y pega tu key de **Google Gemini** (la consigues gratis, sin
tarjeta de crédito, en <https://aistudio.google.com/apikey> — inicia sesión
con una cuenta de Google, clic en "Create API key"):

```
VITE_GEMINI_API_KEY=AIza...
```

Estudiante y docente usan **la misma key** — no hay configuración separada
por rol.

### Sobre el nivel gratuito de Gemini

Esta app usa el modelo `gemini-3.6-flash` (constante `GEMINI_MODEL` en
`src/App.jsx`), que tiene nivel gratuito sin necesidad de tarjeta. Google
retira modelos de Gemini con cierta frecuencia (por ejemplo, `gemini-2.5-flash`
deja de aceptar cuentas nuevas y se apaga del todo el 16 de octubre de 2026).
Si en el futuro ves un error de "modelo ya no disponible", solo hace falta
cambiar el valor de `GEMINI_MODEL` por el modelo vigente que indique
<https://ai.google.dev/gemini-api/docs/models> — no hay que tocar nada más
del código. El nivel gratuito tiene un límite de solicitudes por minuto y
por día compartido por todos los que usan la misma key (estudiantes +
docentes). Si ves un mensaje de "se alcanzó el límite gratuito de
solicitudes", no es un error de la app: espera unos segundos y vuelve a
intentar, o revisa tus cuotas en <https://aistudio.google.com/> (ahí
también puedes activar facturación si necesitas más capacidad para una
validación con muchos estudiantes a la vez).

## 4. Ejecuta

```bash
npm run dev
```

Abre la URL que te muestre la terminal (normalmente <http://localhost:5173>).

---

## Cómo agregar más contenido de Design Thinking (o cualquier módulo)

Hay dos formas:

### A. Desde la app (rápido, sin tocar código)

Inicia sesión como **docente** → pestaña **Material**. Ahí puedes:
- Pegar texto directo en el cuadro de texto, o
- Subir un archivo **.docx** (se lee automáticamente con la librería
  `mammoth`) o **.txt**.

Ese contenido se guarda y se suma al conocimiento del tutor de IA para ese
módulo — tanto en el chat como en Resumen/Quiz/Podcast de la Biblioteca.

> **Importante en este proyecto local:** ese contenido se guarda en el
> `localStorage` de tu propio navegador (ver sección de `window.storage` más
> abajo). Si abres la app en otro navegador o dispositivo, no lo vas a ver
> — para que un docente suba material y lo vean todos los estudiantes desde
> cualquier dispositivo, hace falta el backend propio que se explica al
> final de este documento.

### B. Directo en el código (permanente, para todos)

Edita `src/App.jsx`, busca el array `LIBRARY` (cerca de la línea 60) y
agrega o edita lecciones dentro del módulo `m1` (Design Thinking), `m2`
(Gestión de la Creatividad) o `m3` (Modelo de Negocios). Cada lección es
así de simple:

```js
{
  id: "m1l6",
  title: "Tu nuevo tema",
  type: "lectura",
  minutes: 8,
  content: `Pega aquí el texto (puedes copiarlo de un Word). Usa saltos de
línea dobles para separar párrafos.`,
},
```

No hace falta tocar nada más — el tutor de IA lee automáticamente todo lo
que haya en `LIBRARY`.

---

## Podcast

En cualquier lección de la Biblioteca, el botón **Podcast**:
1. Le pide a la IA un guion corto (estilo narrador único, ~150 palabras).
2. Lo lee en voz alta usando la síntesis de voz del propio navegador
   (`speechSynthesis`) — no descarga ni genera un archivo de audio, y no usa
   ningún servicio ni API adicional (por lo tanto, no consume crédito extra
   más allá de generar el texto del guion).

Si más adelante quieren un audio real descargable (mp3, voces más naturales),
eso requiere una API de texto a voz aparte (ElevenLabs, OpenAI TTS, Google
Cloud TTS) con su propia key y costo — no está incluido aquí porque no era
lo prioritario, pero el guion generado por la IA ya queda listo para
conectarse a cualquiera de esos servicios el día que lo necesiten.

---

## Publicar en GitHub Pages

### ⚠️ Antes de publicar — lee esto

GitHub Pages es hosting **100% estático**: no hay servidor, no hay forma de
esconder secretos. Todo lo que pongas en `.env` se incrusta tal cual dentro
del código JavaScript público que cualquier visitante puede abrir con
"Ver código fuente" o las herramientas de desarrollador del navegador.

**Eso significa que tu API key quedaría visible para cualquiera que visite
el link**, y podría usarla y agotar tu cuota gratuita. Para esta etapa de
validación con un grupo controlado, dos opciones razonables:

1. **Key dedicada a la validación.** Crea una key nueva en
   <https://aistudio.google.com/apikey> solo para esta prueba (no uses tu
   key personal de otros proyectos), y revócala/bórrala cuando termine la
   validación.
2. **Demo sin IA en vivo.** Publica la app tal cual (login, biblioteca,
   calendario funcionan igual) pero sin key configurada — los validadores
   ven y navegan todo el producto, y el chat/análisis muestran el aviso de
   "falta configurar la key" en vez de fallar feo.

Para producción real (público, sin restricciones) la solución correcta es
el backend propio ya mencionado en el resto de este proyecto — nunca subir
la key a un sitio público sin control de cuota.

### Pasos

1. Crea un repositorio en GitHub y conéctalo:
   ```bash
   git init
   git add .
   git commit -m "MaestrolA — primera versión"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
   git push -u origin main
   ```
2. Publica:
   ```bash
   npm run deploy
   ```
   Esto compila el proyecto y sube el resultado a una rama `gh-pages`
   automáticamente (usa el paquete `gh-pages`, ya incluido).
3. En GitHub: **Settings → Pages → Build and deployment → Source** →
   selecciona la rama `gh-pages` (carpeta `/root`) si no se configuró sola.
4. Tu app queda en `https://TU-USUARIO.github.io/TU-REPO/`.

El proyecto ya está configurado con rutas relativas (`base: "./"` en
`vite.config.js`), así que funciona sin importar el nombre del repositorio.

---

## Qué se corrigió respecto al artifact de Claude.ai

| Problema en local | Causa | Solución aplicada |
|---|---|---|
| La app no cargaba / error de `window.storage` | Esa API solo existe dentro de artifacts de Claude.ai | `src/main.jsx` agrega un "shim" que la reemplaza con `localStorage` |
| El chat/análisis no respondía o tiraba error de red | La llamada a un modelo de IA sin API key propia solo funciona dentro de un artifact de Claude.ai | `callGemini` usa tu propia key de Gemini desde `.env`, llamando directo a `generativelanguage.googleapis.com` |
| El error de la API se veía como JSON crudo | No se interpretaba la respuesta de error | Ahora se detectan los casos comunes (sin crédito, key inválida, límite de solicitudes) y se muestra un mensaje claro |
| No había forma de ejecutar el `.jsx` suelto | Faltaba el proyecto completo | `package.json`, Vite, Tailwind y punto de entrada |

## Nota sobre `window.storage` y datos compartidos

Dentro de Claude.ai, `window.storage` es una base de datos **compartida**
entre todos los que abren el artifact — por eso el panel del docente puede
ver las dudas de "todos los estudiantes", y el material que sube un docente
lo ven todos. Aquí en local (y en GitHub Pages), el shim usa `localStorage`,
que es **solo del navegador donde lo abriste**. Para que estudiantes y
docentes reales compartan esos datos entre dispositivos distintos, hace
falta un backend propio — el mismo que ya se venía recomendando para
proteger el contenido pago del diplomado y las API keys en producción.

## Credenciales de prueba

**Estudiantes** (matrícula o correo + contraseña):
- `2026001` / `jlopez@i3lab.ec` · `Diplomado2026`
- `2026002` / `epincay@i3lab.ec` · `Diplomado2026`
- `2026003` / `amoyon@i3lab.ec` · `Diplomado2026`

**Docentes** (correo + contraseña):
- `cbaque@i3lab.ec` · `Docente2026` (Design Thinking + Gestión de la Creatividad)
- `mbaque@i3lab.ec` · `Docente2026` (Modelo de Negocios)
