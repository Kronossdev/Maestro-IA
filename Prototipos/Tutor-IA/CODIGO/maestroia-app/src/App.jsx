import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Home,
  BookOpen,
  MessageCircle,
  User,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Send,
  Sparkles,
  FileText,
  PlayCircle,
  Mic,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Check,
  Loader2,
  GraduationCap,
  ShieldAlert,
  Calendar as CalendarIcon,
  Clock,
  ExternalLink,
  LogOut,
  BarChart3,
  Bell,
  AlertTriangle,
  Users,
  Wand2,
  Upload,
  Trash2,
  Play,
  Pause,
  Square,
  FileUp,
} from "lucide-react";
import mammoth from "mammoth";

/* ============================================================
   MaestrolA — Prototipo funcional
   Tutor de IA + Biblioteca Digital + Calendario + Panel Docente
   Diplomado en Gestión de Innovación Corporativa · i3lab (ESPOL)

   NOTA DE ARQUITECTURA (leer antes de producción):
   - El contenido de la biblioteca vive aquí en el cliente SOLO
     porque esto es un prototipo. En producción debe vivir en un
     backend propio; la IA lo consulta vía ese backend (RAG),
     nunca se expone el material pago directo al dispositivo.
   - Las credenciales están hardcodeadas para la demo. En
     producción deben vivir en un backend con autenticación real
     (hash de contraseñas, tokens de sesión, etc.).
   - El calendario es un espejo de solo lectura pensado para
     alimentarse en el futuro desde la API de Canvas (Instructure)
     de i3lab. No reemplaza Canvas: cada tarea enlaza de vuelta a
     la plataforma oficial.
   ============================================================ */

// ----------------------------------------------------------------
// 0. PALETA — tomada de la identidad de i3lab (rojo #ED1C24 + blanco)
// ----------------------------------------------------------------
const COLORS = {
  bg: "#FFFFFF",
  bgAlt: "#F7F7F8",
  surface: "#FFFFFF",
  border: "#E7E7EA",
  accent: "#ED1C24",
  accentDark: "#C3151B",
  accentSoft: "rgba(237,28,36,0.08)",
  accentSoft2: "rgba(237,28,36,0.15)",
  text: "#1B1B1D",
  textMuted: "#6B6F76",
  textFaint: "#A3A6AC",
  slate: "#4A5560",
  slateSoft: "rgba(74,85,96,0.09)",
};

const TOTAL_STUDENTS = 50;
const CONFUSION_THRESHOLD = 3;

// ----------------------------------------------------------------
// 1. BIBLIOTECA DIGITAL — contenido de ejemplo (reemplazar por el
//    material real del diplomado cuando esté listo)
// ----------------------------------------------------------------
const LIBRARY = [
  {
    id: "m1",
    title: "Design Thinking",
    progress: 100,
    color: "#ED1C24",
    lessons: [
      {
        id: "m1l1",
        title: "Introducción al Design Thinking",
        type: "lectura",
        minutes: 8,
        content: `El Design Thinking es una metodología para resolver problemas centrada en las personas. En lugar de partir de la solución, parte de entender profundamente al usuario: sus necesidades, frustraciones y contexto real.

A diferencia de los métodos tradicionales de gestión (que priorizan procesos y eficiencia desde el inicio), el Design Thinking tolera la ambigüedad al comienzo del proceso a cambio de llegar a soluciones más relevantes. Su promesa central para la innovación corporativa es simple: las mejores ideas no nacen en una sala de juntas, nacen de observar el problema real de cerca.

Se apoya en cinco actitudes clave: empatía genuina, pensamiento visual, experimentación rápida, tolerancia al error como fuente de aprendizaje, y colaboración multidisciplinaria.`,
      },
      {
        id: "m1l2",
        title: "El Doble Diamante: Descubrir y Definir",
        type: "lectura",
        minutes: 10,
        content: `El Doble Diamante divide el proceso de innovación en cuatro fases, agrupadas en dos rombos consecutivos de "abrir" y "cerrar" el pensamiento.

Fase 1 — Descubrir: se abre el pensamiento para explorar el problema sin restringirlo. Aquí se hace investigación de usuario, entrevistas, observación de campo. El objetivo no es encontrar la solución todavía, sino entender la magnitud real del problema y evitar resolver el síntoma equivocado.

Fase 2 — Definir: se cierra el pensamiento para sintetizar todo lo descubierto en un enunciado de problema claro y accionable (a menudo llamado Point of View o POV). Un buen POV identifica: quién es el usuario, qué necesita, y por qué —el insight que lo explica—. Definir mal el problema es la causa más común de que un proyecto de innovación fracase, incluso si la ejecución posterior es impecable.`,
      },
      {
        id: "m1l3",
        title: "El Doble Diamante: Desarrollar y Entregar",
        type: "lectura",
        minutes: 10,
        content: `Fase 3 — Desarrollar (Idear + Prototipar): se vuelve a abrir el pensamiento para generar muchas alternativas de solución antes de escoger una. Técnicas como "How Might We", brainstorming y analogías de mundos alternos sirven para romper el sesgo de quedarse con la primera idea. Después se construyen prototipos de baja resolución —rápidos y baratos— solo para poder conversar con el usuario sobre algo tangible.

Fase 4 — Entregar (Testear + Iterar): se cierra el pensamiento seleccionando y refinando la solución que mejor validó con usuarios reales. Aquí es donde se pasa de un prototipo de papel a uno de alta resolución, y finalmente a una implementación real. La iteración no termina cuando se lanza el producto: continúa mientras existan datos de uso para aprender de ellos.`,
      },
      {
        id: "m1l4",
        title: "Empatía y mapas de experiencia de usuario",
        type: "lectura",
        minutes: 9,
        content: `Un mapa de experiencia de usuario (customer journey map) documenta lo que un usuario hace, piensa y siente en cada etapa de su interacción con un producto, servicio o programa —típicamente dividido en "antes", "durante" y "después".

Su valor para la innovación corporativa está en hacer visibles los "puntos de dolor" (pain points): los momentos exactos donde la experiencia se rompe. Un error común es diseñar soluciones para el punto de dolor más ruidoso en lugar del más frecuente o más costoso para el usuario. Por eso conviene complementar el mapa con un mapa de empatía, que separa explícitamente lo que el usuario dice, piensa, hace y siente.`,
      },
      {
        id: "m1l5",
        title: "Taller: Ideación con How Might We",
        type: "lectura",
        minutes: 7,
        content: `"How Might We" (¿Cómo podríamos...?) es una técnica para convertir un insight o un punto de dolor en una pregunta de diseño abierta, ni tan amplia que no dé dirección, ni tan estrecha que ya contenga la solución.

Ejemplo de calibración: "¿Cómo podríamos hacer una app?" es demasiado amplio. "¿Cómo podríamos agregar un botón de recordatorio?" es demasiado estrecho (ya asume la solución). Un HMW bien calibrado suena más como: "¿Cómo podríamos ayudar al estudiante profesional a aplicar lo aprendido sin que choque con su horario laboral?" — define un territorio de exploración, no una respuesta.`,
      },
    ],
  },
  {
    id: "m2",
    title: "Gestión de la Creatividad",
    progress: 80,
    color: "#4A5560",
    lessons: [
      {
        id: "m2l1",
        title: "Bloqueos creativos en las organizaciones",
        type: "lectura",
        minutes: 8,
        content: `La creatividad organizacional no falla por falta de talento individual, sino por bloqueos estructurales: miedo a equivocarse frente a superiores, procesos de aprobación que castigan la ambigüedad, y culturas que premian la ejecución eficiente por sobre la exploración.

Tres bloqueos frecuentes: (1) el sesgo de confirmación —evaluar ideas nuevas contra "cómo siempre lo hemos hecho"—, (2) el miedo al ridículo en grupo, que reduce la cantidad de ideas expresadas, y (3) la evaluación prematura, cuando se juzga la viabilidad de una idea antes de generar suficientes alternativas.`,
      },
      {
        id: "m2l2",
        title: "Técnica SCAMPER",
        type: "lectura",
        minutes: 9,
        content: `SCAMPER es un checklist de siete preguntas para forzar nuevas perspectivas sobre un producto, servicio o proceso existente: Sustituir, Combinar, Adaptar, Modificar, Poner en otro uso, Eliminar y Reordenar.

Su utilidad principal es romper la fijación funcional: la tendencia mental a ver un objeto o proceso solo por su uso habitual. Aplicar "Eliminar" a un diplomado presencial obliga a preguntar qué pasaría si se quitaran los horarios fijos; aplicar "Poner en otro uso" obliga a preguntar qué otro problema podría resolver la misma infraestructura de mentoría que ya existe.`,
      },
      {
        id: "m2l3",
        title: "Brainstorming y sus variantes",
        type: "lectura",
        minutes: 7,
        content: `El brainstorming clásico tiene una limitación conocida: los grupos numerosos producen menos ideas per cápita que la suma de esas mismas personas trabajando solas, por el "bloqueo de producción" —solo una persona puede hablar a la vez—.

Dos variantes que lo corrigen: el brainwriting (cada persona escribe ideas en silencio antes de compartir) y la ideación por rondas cronometradas. Separar la fase de generación de la fase de evaluación es el principio que más mejora los resultados.`,
      },
      {
        id: "m2l4",
        title: "Mapas mentales para la ideación",
        type: "lectura",
        minutes: 6,
        content: `Un mapa mental organiza ideas de forma radial en vez de lineal. Su ventaja frente a una lista es que hace visibles conexiones entre ideas que parecían no relacionadas, lo cual favorece la ideación combinatoria.

En innovación corporativa, los mapas mentales sirven especialmente en la fase de "Descubrir": ayudan a mapear actores, tensiones y factores de un problema antes de intentar resolverlo.`,
      },
    ],
  },
  {
    id: "m3",
    title: "Modelo de Negocios",
    progress: 45,
    color: "#C3151B",
    lessons: [
      {
        id: "m3l1",
        title: "Introducción al Business Model Canvas",
        type: "lectura",
        minutes: 10,
        content: `El Business Model Canvas (Osterwalder & Pigneur) es una plantilla de nueve bloques que describe cómo una organización crea, entrega y captura valor, en una sola vista.

Los nueve bloques son: Segmentos de clientes, Propuesta de valor, Canales, Relación con clientes, Fuentes de ingresos, Recursos clave, Actividades clave, Socios clave y Estructura de costos. Se recomienda empezar por Propuesta de valor y Segmentos de clientes, porque son los dos bloques que definen si el resto del modelo tiene sentido.`,
      },
      {
        id: "m3l2",
        title: "Segmentos de clientes y propuesta de valor",
        type: "lectura",
        minutes: 9,
        content: `Un segmento de clientes agrupa personas u organizaciones con necesidades, comportamientos o atributos similares. Un error frecuente es definir el segmento por datos demográficos en vez de por el trabajo que están tratando de resolver (jobs-to-be-done).

Una propuesta de valor sólida no enumera características del producto, enumera resultados concretos que le importan al cliente: no "clases grabadas con IA", sino "recuperar el tiempo que hoy pierdes buscando en qué clase se explicó tal concepto".`,
      },
      {
        id: "m3l3",
        title: "Canales, relaciones e ingresos",
        type: "lectura",
        minutes: 8,
        content: `Los Canales son los puntos de contacto por los que una empresa entrega su propuesta de valor: comunicación, distribución y venta.

La Relación con clientes define el tipo de vínculo con cada segmento: puede ir desde asistencia personal dedicada hasta comunidades de autoservicio, con implicaciones directas de costo.

Las Fuentes de ingresos pueden ser de pago único o recurrentes. Diseñar bien este bloque implica preguntar no solo cuánto cobrar, sino por qué el cliente pagaría por ese valor específico.`,
      },
      {
        id: "m3l4",
        title: "Recursos, actividades, socios y costos",
        type: "lectura",
        minutes: 8,
        content: `Los Recursos clave son los activos indispensables para que el modelo funcione. Las Actividades clave son las acciones más importantes que la organización debe ejecutar bien para que la propuesta de valor se cumpla.

Los Socios clave son la red de aliados que permiten optimizar el modelo o reducir riesgo. La Estructura de costos resume los costos más relevantes: distinguir entre modelos "impulsados por costo" e "impulsados por valor" ayuda a evaluar la coherencia del diseño del negocio.`,
      },
    ],
  },
];

const LESSON_INDEX = LIBRARY.flatMap((mod) =>
  mod.lessons.map((l) => ({ id: l.id, title: l.title, moduleId: mod.id, moduleTitle: mod.title }))
);

// ----------------------------------------------------------------
// 2. "BASE DE DATOS" de usuarios (hardcodeada para la demo)
// ----------------------------------------------------------------
const STUDENTS = [
  { id: "2026001", matricula: "2026001", email: "jlopez@i3lab.ec", password: "Diplomado2026", name: "Jorge López" },
  { id: "2026002", matricula: "2026002", email: "epincay@i3lab.ec", password: "Diplomado2026", name: "Erin Pincay" },
  { id: "2026003", matricula: "2026003", email: "amoyon@i3lab.ec", password: "Diplomado2026", name: "Aquiles Moyón" },
];

const COURSES = {
  "c-git": { id: "c-git", name: "Gestión de Innovación Corporativa", moduleIds: ["m1", "m2", "m3"] },
  "c-liderazgo": { id: "c-liderazgo", name: "Liderazgo Ágil para Equipos" },
  "c-finanzas": { id: "c-finanzas", name: "Finanzas para la Innovación" },
};

const TEACHERS = [
  {
    id: "t1",
    name: "Christian Baque",
    email: "cbaque@i3lab.ec",
    password: "Docente2026",
    courseIds: ["c-git", "c-liderazgo"],
    moduleIds: ["m1", "m2"], // responsable de Design Thinking y Gestión de la Creatividad
  },
  {
    id: "t2",
    name: "Marcelo Baque",
    email: "mbaque@i3lab.ec",
    password: "Docente2026",
    courseIds: ["c-git", "c-finanzas"],
    moduleIds: ["m3"], // responsable de Modelo de Negocios
  },
];

// ----------------------------------------------------------------
// 3. CALENDARIO — espejo de tareas/clases (simula datos de Canvas)
// ----------------------------------------------------------------
const EVENTS = [
  { id: "e1", date: "2026-08-01", time: "09:00", endTime: "11:00", title: "Clase: Introducción al Canvas", type: "clase", courseId: "c-git", moduleId: "m3", description: "Sesión en vivo: qué es el Business Model Canvas y por qué organiza el modelo de negocio en 9 bloques.", canvasUrl: "https://canvas.i3lab.ec/courses/git-2026/assignments/canvas-intro" },
  { id: "e2", date: "2026-08-05", time: "23:59", title: "Entrega: Ficha SCAMPER aplicada", type: "tarea", courseId: "c-git", moduleId: "m2", description: "Sube tu ficha SCAMPER aplicada a un producto o servicio de tu empresa.", canvasUrl: "https://canvas.i3lab.ec/courses/git-2026/assignments/scamper" },
  { id: "e3", date: "2026-08-06", time: "18:00", endTime: "19:30", title: "Clase: Liderazgo Ágil — Feedback continuo", type: "clase", courseId: "c-liderazgo", description: "Sesión en vivo del curso de Liderazgo Ágil para Equipos.", canvasUrl: "https://canvas.i3lab.ec/courses/liderazgo-2026/live" },
  { id: "e4", date: "2026-08-08", time: "09:00", endTime: "11:00", title: "Clase: Segmentos y propuesta de valor", type: "clase", courseId: "c-git", moduleId: "m3", description: "Cómo definir segmentos de clientes y una propuesta de valor concreta usando el Canvas.", canvasUrl: "https://canvas.i3lab.ec/courses/git-2026/assignments/segmentos" },
  { id: "e5", date: "2026-08-10", time: "23:59", title: "Entrega: Ficha de Segmentos de Clientes", type: "tarea", courseId: "c-git", moduleId: "m3", description: "Entrega individual: describe 2 segmentos de clientes reales de tu empresa.", canvasUrl: "https://canvas.i3lab.ec/courses/git-2026/assignments/ficha-segmentos" },
  { id: "e6", date: "2026-08-10", time: "08:00", title: "Lectura recomendada: Canales, relaciones e ingresos", type: "leccion", courseId: "c-git", moduleId: "m3", lessonId: "m3l3", description: "Lee este tema en la Biblioteca Digital antes de la clase del sábado.", canvasUrl: null },
  { id: "e7", date: "2026-08-12", time: "20:00", title: "Quiz: Gestión de la Creatividad", type: "entrega", courseId: "c-git", moduleId: "m2", description: "Quiz individual de 10 preguntas sobre bloqueos creativos y SCAMPER.", canvasUrl: "https://canvas.i3lab.ec/courses/git-2026/quizzes/creatividad" },
  { id: "e8", date: "2026-08-13", time: "18:00", endTime: "19:30", title: "Clase: Finanzas — Flujo de caja para proyectos", type: "clase", courseId: "c-finanzas", description: "Sesión en vivo del curso de Finanzas para la Innovación.", canvasUrl: "https://canvas.i3lab.ec/courses/finanzas-2026/live" },
  { id: "e9", date: "2026-08-15", time: "09:00", endTime: "11:00", title: "Clase: Recursos, actividades y costos", type: "clase", courseId: "c-git", moduleId: "m3", description: "Cierre del Canvas: recursos clave, actividades clave, socios y estructura de costos.", canvasUrl: "https://canvas.i3lab.ec/courses/git-2026/assignments/recursos" },
  { id: "e10", date: "2026-08-20", time: "23:59", title: "Entrega: Proyecto final — Fase 1 (Diagnóstico)", type: "tarea", courseId: "c-git", description: "Primera entrega del proyecto final aplicando lo visto en los 3 módulos.", canvasUrl: "https://canvas.i3lab.ec/courses/git-2026/assignments/proyecto-fase1" },
  { id: "e11", date: "2026-08-22", time: "09:00", endTime: "12:00", title: "Clase: Presentación de Canvas por equipos", type: "clase", courseId: "c-git", moduleId: "m3", description: "Cada equipo presenta su Business Model Canvas ante el grupo.", canvasUrl: "https://canvas.i3lab.ec/courses/git-2026/assignments/presentacion-canvas" },
  { id: "e12", date: "2026-08-29", time: "09:00", endTime: "12:00", title: "Taller integrador: Aplicación en tu empresa", type: "clase", courseId: "c-git", description: "Taller final del módulo con mentoría personalizada.", canvasUrl: "https://canvas.i3lab.ec/courses/git-2026/assignments/taller-final" },
];

const TODAY_STR = "2026-08-10";

// ----------------------------------------------------------------
// 4. IA — helpers de llamada, system prompts y "base de datos" de
//    dudas de estudiantes (persistente vía window.storage)
// ----------------------------------------------------------------
async function getExtraContent(moduleId) {
  try {
    const res = await window.storage.get(`extra-content:${moduleId}`, true);
    return res.value || "";
  } catch (e) {
    return "";
  }
}

async function buildTutorSystemPrompt() {
  const knowledgeBlocks = await Promise.all(
    LIBRARY.map(async (mod) => {
      const lessons = mod.lessons.map((l) => `### ${l.title}\n${l.content}`).join("\n\n");
      const extra = await getExtraContent(mod.id);
      const extraBlock = extra
        ? `\n\n### Material adicional aportado por el docente\n${extra}`
        : "";
      return `## Módulo: ${mod.title}\n\n${lessons}${extraBlock}`;
    })
  );
  const knowledge = knowledgeBlocks.join("\n\n---\n\n");

  return `Eres MaestrolA, el tutor de inteligencia artificial del Diplomado en Gestión de Innovación Corporativa de i3lab (ESPOL). Hablas español, con un tono cercano, profesional y directo, sin relleno.

REGLAS:
1. Responde ÚNICAMENTE con base en el contenido del diplomado incluido abajo. Es tu única fuente de verdad.
2. Si la pregunta no está cubierta por este contenido, dilo con honestidad en vez de inventar.
3. Prefiere guiar paso a paso en vez de dar la respuesta completa de inmediato: haz una pregunta que ayude al estudiante a llegar a la idea por sí mismo, salvo que pida la respuesta directa. Es una preferencia validada con los estudiantes reales del diplomado.
4. Sé breve — los estudiantes son profesionales con poco tiempo.
5. Cuando cites un concepto, menciona de qué módulo o lección viene.

CONTENIDO DEL DIPLOMADO:

${knowledge}`;
}

const CLASSIFIER_SYSTEM_PROMPT = `Eres un clasificador silencioso. Dado el mensaje de un estudiante a un tutor de un diplomado, responde SOLO con JSON válido, sin texto adicional y sin backticks, con este formato exacto:
{"lessonId": "<id de la lección más relacionada de la lista, o null si ninguna aplica>", "confusion": true|false}

"confusion" es true si el mensaje sugiere que el estudiante no entiende, está confundido, pide que le expliquen de nuevo, o repite una duda. Es false si es una pregunta exploratoria normal, un saludo, o una instrucción (como pedir un resumen o quiz).

Lista de lecciones válidas:
${LESSON_INDEX.map((l) => `- ${l.id}: ${l.title} (módulo ${l.moduleTitle})`).join("\n")}`;

/**
 * LLAMADA A LA API DE GEMINI (versión local)
 * ------------------------------------------------------------
 * Usamos la API gratuita de Google Gemini (Google AI Studio).
 * Fuera de un backend propio esto se llama directo desde el
 * navegador con tu propia API key desde .env.
 *
 * IMPORTANTE: llamar a la API directo desde el navegador expone
 * tu API key en el código público del bundle (cualquiera que
 * abra "Ver código fuente" puede verla). Es aceptable para este
 * prototipo de validación con un grupo controlado, pero NUNCA
 * subas tu .env a git. Para producción real, esta llamada debe
 * hacerse desde un backend propio (ver README).
 */
const GEMINI_MODEL = "gemini-3.5-flash-lite"; // modelo vigente con nivel gratuito; cambia aquí si Google lo reemplaza más adelante
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

async function callGemini({ system, messages }) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Falta configurar VITE_GEMINI_API_KEY en tu archivo .env (copia .env.example a .env y pega tu API key). Revisa el README."
    );
  }
  // Gemini usa "model" en vez de "assistant", y system va en systemInstruction (no en el arreglo de mensajes).
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const response = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents,
      generationConfig: { maxOutputTokens: 1000 },
    }),
  });
  if (!response.ok) {
    let friendly = `Error de la API de Gemini (${response.status}). Intenta de nuevo.`;
    try {
      const errJson = await response.json();
      const msg = errJson?.error?.message || "";
      const status = errJson?.error?.status || "";
      if (response.status === 400 && /API key not valid/i.test(msg)) {
        friendly = "Tu API key de Gemini no es válida. Revisa VITE_GEMINI_API_KEY en tu archivo .env.";
      } else if (response.status === 404 && /no longer available|not found/i.test(msg)) {
        friendly = `Google descontinuó el modelo "${GEMINI_MODEL}". Abre src/App.jsx, busca la constante GEMINI_MODEL cerca de la línea 357 y cámbiala por un modelo vigente (revisa la lista actual en https://ai.google.dev/gemini-api/docs/models).`;
      } else if (response.status === 403) {
        friendly = "Tu API key de Gemini no tiene permiso para esta solicitud (revisa que esté habilitada en Google AI Studio).";
      } else if (response.status === 429 || status === "RESOURCE_EXHAUSTED") {
        friendly =
          "Se alcanzó el límite gratuito de solicitudes de Gemini (por minuto o por día). Espera un momento e intenta de nuevo — con varios estudiantes usando la misma key a la vez esto puede pasar seguido, ya que el tutor y el análisis del docente comparten la misma API key.";
      } else if (response.status >= 500) {
        friendly = "Los servidores de Gemini tuvieron un problema temporal. Intenta de nuevo en unos segundos.";
      } else if (msg) {
        friendly = `Error de la API de Gemini: ${msg}`;
      }
    } catch (e) {
      /* si no se pudo parsear el error, se usa el mensaje genérico de arriba */
    }
    throw new Error(friendly);
  }
  const data = await response.json();
  const candidate = data.candidates?.[0];
  if (!candidate) {
    if (data.promptFeedback?.blockReason) {
      return "No pude responder a ese mensaje: fue bloqueado por los filtros de seguridad de Gemini. Intenta reformular tu pregunta.";
    }
    return "No pude generar una respuesta. Intenta de nuevo.";
  }
  const text = (candidate.content?.parts || [])
    .map((part) => part.text || "")
    .filter(Boolean)
    .join("\n");
  return text || "No pude generar una respuesta. Intenta de nuevo.";
}

async function classifyMessage(text) {
  try {
    const raw = await callGemini({
      system: CLASSIFIER_SYSTEM_PROMPT,
      messages: [{ role: "user", content: text }],
    });
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (e) {
    return null;
  }
}

// --- "base de datos" de dudas por lección, compartida entre usuarios ---
const SEED_CONFUSION_LOG = {
  // sembrado de demo: se usa solo si aún no hay datos reales.
  // Con uso real del chat, esto se llena solo (ver classifyMessage + logConfusion).
  m1l2: Array.from({ length: 18 }, (_, i) => `seed-${i}`), // Doble Diamante (Descubrir/Definir) — 36%
  m1l3: Array.from({ length: 5 }, (_, i) => `seed-b${i}`), // Doble Diamante (Desarrollar/Entregar) — 10%
  m2l2: Array.from({ length: 3 }, (_, i) => `seed-c${i}`), // SCAMPER — justo en el umbral, 6%
  m3l1: ["seed-d0"], // Canvas intro — solo 1 de 50: debe quedar filtrado
};

async function getConfusionLog() {
  try {
    const res = await window.storage.get("confusion-log", true);
    return JSON.parse(res.value);
  } catch (e) {
    try {
      await window.storage.set("confusion-log", JSON.stringify(SEED_CONFUSION_LOG), true);
    } catch (e2) {
      /* almacenamiento no disponible; seguimos con el seed en memoria */
    }
    return SEED_CONFUSION_LOG;
  }
}

async function logConfusion(lessonId, studentId) {
  try {
    let record = {};
    try {
      const res = await window.storage.get("confusion-log", true);
      record = JSON.parse(res.value);
    } catch (e) {
      record = { ...SEED_CONFUSION_LOG };
    }
    if (!record[lessonId]) record[lessonId] = [];
    if (!record[lessonId].includes(studentId)) {
      record[lessonId] = [...record[lessonId], studentId];
      await window.storage.set("confusion-log", JSON.stringify(record), true);
    }
  } catch (e) {
    /* no bloquear la experiencia del estudiante si falla el guardado */
  }
}

function computeStats(log, moduleIds) {
  return LESSON_INDEX.filter((l) => moduleIds.includes(l.moduleId))
    .map((l) => {
      const count = (log[l.id] || []).length;
      return { ...l, count, pct: Math.round((count / TOTAL_STUDENTS) * 100) };
    })
    .filter((s) => s.count >= CONFUSION_THRESHOLD)
    .sort((a, b) => b.count - a.count);
}

async function getTeachingSuggestions(stats) {
  const prompt = `Estos son los temas donde más estudiantes muestran dificultad en el Diplomado de Gestión de Innovación Corporativa (sobre una clase de referencia de ${TOTAL_STUDENTS} estudiantes, sin nombres, solo agregados):
${stats.map((s) => `- ${s.title} (módulo ${s.moduleTitle}): ${s.count}/${TOTAL_STUDENTS} estudiantes (${s.pct}%) mostraron señales de confusión al preguntarle al tutor de IA.`).join("\n")}

Dame 3 a 4 sugerencias concretas y accionables para reforzar estos temas en la próxima clase presencial. Sé breve y específico, en viñetas, sin introducción.`;
  return callGemini({
    system:
      "Eres un asesor pedagógico para docentes de un diplomado ejecutivo de innovación corporativa. Respondes en español, de forma breve, concreta y accionable.",
    messages: [{ role: "user", content: prompt }],
  });
}

// ----------------------------------------------------------------
// 5. Helpers de fecha / calendario
// ----------------------------------------------------------------
const WEEKDAYS = ["DO", "LU", "MA", "MI", "JU", "VI", "SA"];
const MONTH_NAMES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
const DAY_NAMES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

function pad2(n) {
  return String(n).padStart(2, "0");
}
function dateStr(year, month, day) {
  return `${year}-${pad2(month + 1)}-${pad2(day)}`;
}
function getMonthMatrix(year, month) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}
function formatLongDate(dStr) {
  const [y, m, d] = dStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return `${DAY_NAMES[dt.getDay()]} ${d} de ${MONTH_NAMES[m - 1]}`;
}

// ----------------------------------------------------------------
// 6. UI atoms
// ----------------------------------------------------------------
function TypeIcon({ type, size = 14 }) {
  if (type === "video" || type === "clase") return <PlayCircle size={size} />;
  if (type === "podcast") return <Mic size={size} />;
  if (type === "tarea" || type === "entrega") return <FileText size={size} />;
  return <BookOpen size={size} />;
}

function EVENT_META(type) {
  switch (type) {
    case "clase":
      return { label: "Clase", color: COLORS.accent };
    case "tarea":
      return { label: "Tarea", color: COLORS.slate };
    case "entrega":
      return { label: "Entrega", color: COLORS.accentDark };
    default:
      return { label: "Lectura", color: "#7A828C" };
  }
}

function ProgressBar({ value, color }) {
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ height: 6, backgroundColor: COLORS.bgAlt }}>
      <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
    </div>
  );
}

function TopBrandBar({ onAvatarClick, initials }) {
  return (
    <div
      className="flex items-center justify-between flex-shrink-0"
      style={{ height: 46, padding: "0 16px", backgroundColor: COLORS.accent }}
    >
      <div className="flex items-center gap-1.5">
        <Sparkles size={16} color="#fff" />
        <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: 0.2 }}>
          MaestrolA
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Bell size={16} color="rgba(255,255,255,0.85)" />
        <button
          onClick={onAvatarClick}
          className="rounded-full flex items-center justify-center"
          style={{ width: 26, height: 26, backgroundColor: "rgba(255,255,255,0.22)" }}
        >
          <span style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>{initials}</span>
        </button>
      </div>
    </div>
  );
}

function BottomNav({ items, screen, setScreen }) {
  return (
    <div
      className="flex items-center justify-around flex-shrink-0"
      style={{ borderTop: `1px solid ${COLORS.border}`, backgroundColor: "#fff", padding: "8px 2px 14px" }}
    >
      {items.map(({ id, label, icon: Icon }) => {
        const active = screen === id;
        return (
          <button
            key={id}
            onClick={() => setScreen(id)}
            className="flex flex-col items-center gap-1"
            style={{ color: active ? COLORS.accent : COLORS.textFaint, minWidth: 0, flex: 1 }}
          >
            <Icon size={18} strokeWidth={active ? 2.5 : 2} />
            <span style={{ fontSize: 9, fontWeight: active ? 700 : 500 }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

function ScreenHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="px-5 pt-5 pb-3">
      {eyebrow && (
        <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.accent, letterSpacing: 0.3, textTransform: "uppercase" }}>
          {eyebrow}
        </p>
      )}
      <h1 style={{ fontSize: 19, fontWeight: 700, color: COLORS.text }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 12, color: COLORS.textFaint, marginTop: 2 }}>{subtitle}</p>}
    </div>
  );
}

const cardStyle = {
  backgroundColor: COLORS.surface,
  border: `1px solid ${COLORS.border}`,
  boxShadow: "0 1px 2px rgba(20,20,25,0.04)",
};

// ----------------------------------------------------------------
// 7. LOGIN
// ----------------------------------------------------------------
function LoginScreen({ onLoginSuccess }) {
  const [role, setRole] = useState("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [showDemo, setShowDemo] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit() {
    setError("");
    const id = identifier.trim().toLowerCase();
    const pw = password;
    if (!id || !pw) {
      setError("Completa tu usuario y contraseña.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (role === "student") {
        const match = STUDENTS.find(
          (s) => (s.matricula.toLowerCase() === id || s.email.toLowerCase() === id) && s.password === pw
        );
        if (match) onLoginSuccess(match, "student");
        else setError("Matrícula/correo o contraseña incorrectos.");
      } else {
        const match = TEACHERS.find((t) => t.email.toLowerCase() === id && t.password === pw);
        if (match) onLoginSuccess(match, "teacher");
        else setError("Correo o contraseña incorrectos.");
      }
      setLoading(false);
    }, 350); // pequeña latencia simulada de validación
  }

  return (
    <div className="flex flex-col h-full px-6 pt-12 pb-6 overflow-y-auto" style={{ backgroundColor: COLORS.bg }}>
      <div className="flex flex-col items-center mb-8">
        <div
          className="flex items-center justify-center rounded-2xl mb-4"
          style={{ width: 60, height: 60, backgroundColor: COLORS.accent }}
        >
          <Sparkles color="#fff" size={28} />
        </div>
        <h1 className="font-bold" style={{ fontSize: 21, color: COLORS.text }}>
          MaestrolA
        </h1>
        <p className="text-center mt-1" style={{ fontSize: 12.5, color: COLORS.textMuted, lineHeight: 1.4 }}>
          Tutor inteligente del Diplomado en
          <br />
          Gestión de Innovación Corporativa
        </p>
      </div>

      <div className="flex gap-2 mb-4">
        {[
          { id: "student", label: "Estudiante" },
          { id: "teacher", label: "Docente" },
        ].map((r) => (
          <button
            key={r.id}
            onClick={() => {
              setRole(r.id);
              setError("");
            }}
            className="flex-1 rounded-xl font-semibold"
            style={{
              height: 40,
              fontSize: 13,
              color: role === r.id ? "#fff" : COLORS.textMuted,
              backgroundColor: role === r.id ? COLORS.accent : COLORS.bgAlt,
              border: `1px solid ${role === r.id ? COLORS.accent : COLORS.border}`,
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl p-5" style={cardStyle}>
        <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMuted }}>
          {role === "student" ? "Matrícula o correo" : "Correo institucional"}
        </label>
        <div
          className="flex items-center gap-2 rounded-xl px-3 mt-1 mb-3"
          style={{ backgroundColor: COLORS.bgAlt, border: `1px solid ${COLORS.border}`, height: 44 }}
        >
          {role === "student" ? <User size={15} color={COLORS.textFaint} /> : <Mail size={15} color={COLORS.textFaint} />}
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={role === "student" ? "2026001 o jlopez@i3lab.ec" : "cbaque@i3lab.ec"}
            className="flex-1 bg-transparent outline-none"
            style={{ fontSize: 13.5, color: COLORS.text }}
          />
        </div>

        <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMuted }}>Contraseña</label>
        <div
          className="flex items-center gap-2 rounded-xl px-3 mt-1"
          style={{ backgroundColor: COLORS.bgAlt, border: `1px solid ${COLORS.border}`, height: 44 }}
        >
          <Lock size={15} color={COLORS.textFaint} />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            type={showPw ? "text" : "password"}
            placeholder="••••••••••••"
            className="flex-1 bg-transparent outline-none"
            style={{ fontSize: 13.5, color: COLORS.text }}
          />
          <button onClick={() => setShowPw((s) => !s)}>
            {showPw ? <EyeOff size={15} color={COLORS.textFaint} /> : <Eye size={15} color={COLORS.textFaint} />}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-1.5 mt-3">
            <AlertTriangle size={13} color={COLORS.accent} />
            <span style={{ fontSize: 12, color: COLORS.accent }}>{error}</span>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-4 rounded-xl font-semibold flex items-center justify-center gap-2"
          style={{ height: 46, backgroundColor: COLORS.accent, color: "#fff", fontSize: 14, opacity: loading ? 0.75 : 1 }}
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : null}
          {loading ? "Validando..." : "Ingresar"}
        </button>
      </div>

      <button
        onClick={() => setShowDemo((s) => !s)}
        className="flex items-center justify-center gap-1 mt-4"
        style={{ fontSize: 12, color: COLORS.slate }}
      >
        Ver credenciales de prueba
        <ChevronDown size={13} style={{ transform: showDemo ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
      </button>

      {showDemo && (
        <div className="rounded-xl p-3.5 mt-2" style={{ backgroundColor: COLORS.bgAlt, border: `1px solid ${COLORS.border}` }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.textMuted, marginBottom: 6 }}>ESTUDIANTES</p>
          {STUDENTS.map((s) => (
            <p key={s.id} style={{ fontSize: 11, color: COLORS.text, fontFamily: "monospace", marginBottom: 2 }}>
              {s.matricula} / {s.email} · {s.password}
            </p>
          ))}
          <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.textMuted, margin: "8px 0 6px" }}>DOCENTES</p>
          {TEACHERS.map((t) => (
            <p key={t.id} style={{ fontSize: 11, color: COLORS.text, fontFamily: "monospace", marginBottom: 2 }}>
              {t.email} · {t.password}
            </p>
          ))}
        </div>
      )}

      <p className="text-center mt-auto pt-6" style={{ fontSize: 10.5, color: COLORS.textFaint }}>
        Prototipo funcional · v0.3 · i3lab ESPOL
      </p>
    </div>
  );
}

// ----------------------------------------------------------------
// 8. CALENDARIO (compartido entre estudiante y docente)
// ----------------------------------------------------------------
function CalendarScreen({ events, eyebrow, title, subtitle, onOpenLesson }) {
  const [monthDate, setMonthDate] = useState({ year: 2026, month: 7 }); // agosto 2026
  const [view, setView] = useState("month"); // month | day | task
  const [selectedDateStr, setSelectedDateStr] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const eventsByDate = useMemo(() => {
    const map = {};
    events.forEach((e) => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    Object.values(map).forEach((arr) => arr.sort((a, b) => a.time.localeCompare(b.time)));
    return map;
  }, [events]);

  const weeks = useMemo(() => getMonthMatrix(monthDate.year, monthDate.month), [monthDate]);

  function changeMonth(delta) {
    setMonthDate(({ year, month }) => {
      let m = month + delta;
      let y = year;
      if (m < 0) {
        m = 11;
        y -= 1;
      } else if (m > 11) {
        m = 0;
        y += 1;
      }
      return { year: y, month: m };
    });
  }

  function openDay(dStr) {
    if (!eventsByDate[dStr]) return;
    setSelectedDateStr(dStr);
    setView("day");
  }

  // ---------- vista TAREA ----------
  if (view === "task" && selectedEvent) {
    const meta = EVENT_META(selectedEvent.type);
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 px-4 pt-5 pb-3" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
          <button onClick={() => setView("day")}>
            <ChevronLeft size={20} color={COLORS.text} />
          </button>
          <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMuted }}>
            {formatLongDate(selectedDateStr)}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <span
            className="inline-block rounded-full px-2.5 py-1 mb-3"
            style={{ fontSize: 10.5, fontWeight: 700, color: "#fff", backgroundColor: meta.color }}
          >
            {meta.label.toUpperCase()}
          </span>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, lineHeight: 1.3 }}>
            {selectedEvent.title}
          </h2>

          <div className="flex items-center gap-1.5 mt-3">
            <Clock size={14} color={COLORS.textMuted} />
            <span style={{ fontSize: 13, color: COLORS.textMuted }}>
              {selectedEvent.time}
              {selectedEvent.endTime ? ` – ${selectedEvent.endTime}` : ""}
            </span>
          </div>

          <p style={{ fontSize: 13.5, color: COLORS.text, lineHeight: 1.6, marginTop: 14 }}>
            {selectedEvent.description}
          </p>

          {selectedEvent.canvasUrl && (
            <>
              <a
                href={selectedEvent.canvasUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl font-semibold mt-6"
                style={{ height: 46, backgroundColor: COLORS.accent, color: "#fff", fontSize: 13.5, textDecoration: "none" }}
              >
                Ver en Canvas i3lab <ExternalLink size={14} />
              </a>
              <p style={{ fontSize: 11, color: COLORS.textFaint, marginTop: 8, lineHeight: 1.4 }}>
                Se abre en tu navegador. MaestrolA complementa Canvas — no lo reemplaza; la entrega oficial siempre se hace ahí.
              </p>
            </>
          )}

          {!selectedEvent.canvasUrl && selectedEvent.lessonId && (
            <button
              onClick={() => onOpenLesson && onOpenLesson(selectedEvent.moduleId, selectedEvent.lessonId)}
              className="flex items-center justify-center gap-2 rounded-xl font-semibold mt-6 w-full"
              style={{ height: 46, backgroundColor: COLORS.text, color: "#fff", fontSize: 13.5 }}
            >
              <BookOpen size={14} /> Abrir en la Biblioteca Digital
            </button>
          )}
        </div>
      </div>
    );
  }

  // ---------- vista DÍA ----------
  if (view === "day" && selectedDateStr) {
    const dayEvents = eventsByDate[selectedDateStr] || [];
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 px-4 pt-5 pb-3" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
          <button onClick={() => setView("month")}>
            <ChevronLeft size={20} color={COLORS.text} />
          </button>
          <span style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, textTransform: "capitalize" }}>
            {formatLongDate(selectedDateStr)}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {dayEvents.map((ev) => {
            const meta = EVENT_META(ev.type);
            return (
              <button
                key={ev.id}
                onClick={() => {
                  setSelectedEvent(ev);
                  setView("task");
                }}
                className="w-full flex items-center gap-3 rounded-2xl p-3.5 mb-2.5 text-left"
                style={cardStyle}
              >
                <div
                  className="rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ width: 36, height: 36, backgroundColor: `${meta.color}1A`, color: meta.color }}
                >
                  <TypeIcon type={ev.type} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 10.5, fontWeight: 700, color: meta.color }}>{meta.label.toUpperCase()}</p>
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: COLORS.text, lineHeight: 1.3 }}>{ev.title}</p>
                </div>
                <span style={{ fontSize: 11, color: COLORS.textFaint, flexShrink: 0 }}>{ev.time}</span>
              </button>
            );
          })}
          {dayEvents.length === 0 && (
            <p style={{ fontSize: 13, color: COLORS.textFaint, textAlign: "center", marginTop: 40 }}>
              No hay actividades este día.
            </p>
          )}
        </div>
      </div>
    );
  }

  // ---------- vista MES ----------
  return (
    <div className="flex flex-col h-full">
      <ScreenHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />

      <div className="flex items-center justify-between px-5 mb-2">
        <button onClick={() => changeMonth(-1)}>
          <ChevronLeft size={18} color={COLORS.textMuted} />
        </button>
        <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.accent, textTransform: "capitalize" }}>
          {MONTH_NAMES[monthDate.month]} de {monthDate.year}
        </span>
        <button onClick={() => changeMonth(1)}>
          <ChevronRight size={18} color={COLORS.textMuted} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <div className="grid grid-cols-7 gap-1 px-1 mb-1">
          {WEEKDAYS.map((w) => (
            <div key={w} className="text-center" style={{ fontSize: 9.5, fontWeight: 700, color: COLORS.textFaint }}>
              {w}
            </div>
          ))}
        </div>

        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1 px-1 mb-1">
            {week.map((day, di) => {
              if (!day) return <div key={di} style={{ minHeight: 60 }} />;
              const dStr = dateStr(monthDate.year, monthDate.month, day);
              const dayEvents = eventsByDate[dStr] || [];
              const isToday = dStr === TODAY_STR;
              return (
                <button
                  key={di}
                  onClick={() => openDay(dStr)}
                  className="rounded-lg text-left p-1 flex flex-col"
                  style={{
                    minHeight: 60,
                    backgroundColor: dayEvents.length ? COLORS.bgAlt : "transparent",
                    border: isToday ? `1.5px solid ${COLORS.accent}` : `1px solid ${dayEvents.length ? COLORS.border : "transparent"}`,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: isToday ? 800 : 600,
                      color: isToday ? COLORS.accent : COLORS.text,
                      alignSelf: "flex-end",
                    }}
                  >
                    {day}
                  </span>
                  {dayEvents.length > 0 && (
                    <div className="flex-1 flex flex-col justify-end">
                      <span
                        style={{
                          fontSize: 8,
                          lineHeight: 1.15,
                          color: EVENT_META(dayEvents[0].type).color,
                          fontWeight: 600,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {dayEvents[0].title}
                      </span>
                      {dayEvents.length > 1 && (
                        <span style={{ fontSize: 7.5, color: COLORS.textFaint, fontWeight: 700 }}>
                          +{dayEvents.length - 1} más
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}

        <div className="flex items-center gap-3 px-2 mt-3 flex-wrap">
          {["clase", "tarea", "entrega", "leccion"].map((t) => {
            const meta = EVENT_META(t);
            return (
              <div key={t} className="flex items-center gap-1">
                <span style={{ width: 7, height: 7, borderRadius: 99, backgroundColor: meta.color }} />
                <span style={{ fontSize: 10, color: COLORS.textFaint }}>{meta.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// 9. ESTUDIANTE — Home, Biblioteca, Lección, Chat, Perfil
// ----------------------------------------------------------------
function StudentHome({ user, setScreen, openLesson }) {
  const nextEvent = useMemo(() => {
    const upcoming = EVENTS.filter((e) => e.courseId === "c-git" && e.date >= TODAY_STR);
    upcoming.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    return upcoming[0];
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-2">
        <p style={{ fontSize: 12, color: COLORS.textFaint }}>Bienvenido,</p>
        <h1 style={{ fontSize: 19, fontWeight: 700, color: COLORS.text }}>{user.name}</h1>
        <p style={{ fontSize: 11.5, color: COLORS.textMuted }}>Módulo 3 — Modelo de Negocios</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <button
          onClick={() => setScreen("chat")}
          className="w-full text-left rounded-2xl p-4 mb-4"
          style={cardStyle}
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} color={COLORS.accent} />
            <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>Pregúntale a MaestrolA</span>
          </div>
          <p style={{ fontSize: 12.5, color: COLORS.textMuted, lineHeight: 1.45 }}>
            ¡Hola {user.name.split(" ")[0]}! Hoy podemos repasar el Canvas de Modelo de Negocios o resolver dudas
            de Design Thinking. ¿Por dónde empezamos?
          </p>
        </button>

        {nextEvent && (
          <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: COLORS.text }}>
            <div className="flex items-center gap-1.5 mb-1">
              <CalendarIcon size={13} color="#fff" />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>PRÓXIMA ACTIVIDAD</span>
            </div>
            <p style={{ fontSize: 13.5, fontWeight: 600, color: "#fff" }}>{nextEvent.title}</p>
            <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.7)" }}>
              {formatLongDate(nextEvent.date)} · {nextEvent.time}
            </p>
            <button
              onClick={() => setScreen("calendar")}
              style={{ fontSize: 11.5, color: "#fff", fontWeight: 700, marginTop: 8, textDecoration: "underline" }}
            >
              Ver en el calendario
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mb-2">
          <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>Tu progreso</p>
          <button onClick={() => setScreen("library")} style={{ fontSize: 12, color: COLORS.accent, fontWeight: 600 }}>
            Ver todo
          </button>
        </div>

        {LIBRARY.map((mod, i) => (
          <button
            key={mod.id}
            onClick={() => openLesson(mod, null)}
            className="w-full text-left rounded-2xl p-4 mb-3 flex items-center gap-3"
            style={cardStyle}
          >
            <div
              className="rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ width: 36, height: 36, backgroundColor: `${mod.color}1A`, color: mod.color, fontSize: 12.5, fontWeight: 800 }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="flex-1">
              <p style={{ fontSize: 13.5, fontWeight: 600, color: COLORS.text }}>{mod.title}</p>
              <p style={{ fontSize: 10.5, color: COLORS.textFaint, marginBottom: 5 }}>{mod.lessons.length} temas</p>
              <ProgressBar value={mod.progress} color={mod.color} />
            </div>
            <span style={{ fontSize: 11.5, color: COLORS.textMuted, fontWeight: 600 }}>{mod.progress}%</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function LibraryScreen({ openLesson }) {
  const [expanded, setExpanded] = useState(LIBRARY[0].id);
  return (
    <div className="flex flex-col h-full">
      <ScreenHeader eyebrow="Biblioteca" title="Biblioteca Digital" subtitle="Contenido del diplomado, organizado por módulo" />
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {LIBRARY.map((mod) => {
          const isOpen = expanded === mod.id;
          return (
            <div key={mod.id} className="rounded-2xl mb-3 overflow-hidden" style={cardStyle}>
              <button onClick={() => setExpanded(isOpen ? null : mod.id)} className="w-full flex items-center gap-3 p-4">
                <div
                  className="rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ width: 34, height: 34, backgroundColor: `${mod.color}1A`, color: mod.color }}
                >
                  <BookOpen size={16} />
                </div>
                <div className="flex-1 text-left">
                  <p style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.text }}>{mod.title}</p>
                  <p style={{ fontSize: 10.5, color: COLORS.textFaint }}>
                    {mod.lessons.length} lecciones · {mod.progress}% completado
                  </p>
                </div>
                <ChevronRight size={15} color={COLORS.textFaint} style={{ transform: isOpen ? "rotate(90deg)" : "none", transition: "transform .15s" }} />
              </button>
              {isOpen && (
                <div style={{ borderTop: `1px solid ${COLORS.border}` }}>
                  {mod.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => openLesson(mod, lesson)}
                      className="w-full flex items-center gap-3 px-4 py-3"
                      style={{ borderBottom: `1px solid ${COLORS.border}` }}
                    >
                      <div style={{ color: mod.color }}>
                        <TypeIcon type={lesson.type} size={14} />
                      </div>
                      <span className="flex-1 text-left" style={{ fontSize: 12.5, color: COLORS.text }}>{lesson.title}</span>
                      <span style={{ fontSize: 10.5, color: COLORS.textFaint }}>{lesson.minutes} min</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LessonScreen({ mod, lesson, onBack, askTutor }) {
  const [aiPanel, setAiPanel] = useState(null);
  const [aiText, setAiText] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Podcast: guion generado por IA + narración con la voz del navegador ---
  const [podcastScript, setPodcastScript] = useState("");
  const [podcastStatus, setPodcastStatus] = useState("idle"); // idle | writing | ready | playing | paused
  const [podcastError, setPodcastError] = useState("");

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, [lesson.id]);

  async function runAction(kind) {
    setAiPanel(kind);
    setLoading(true);
    setAiText("");
    const instruction =
      kind === "resumen"
        ? `Genera un resumen breve (máximo 6 líneas, en viñetas) de la lección "${lesson.title}" del módulo "${mod.title}".`
        : `Genera 4 preguntas de repaso tipo quiz (con su respuesta correcta debajo) sobre "${lesson.title}" del módulo "${mod.title}". Sé breve.`;
    try {
      const text = await callGemini({ system: await buildTutorSystemPrompt(), messages: [{ role: "user", content: instruction }] });
      setAiText(text);
    } catch (e) {
      setAiText(e.message || "No se pudo generar el contenido. Intenta de nuevo.");
    }
    setLoading(false);
  }

  async function generatePodcast() {
    setAiPanel("podcast");
    setPodcastStatus("writing");
    setPodcastError("");
    const instruction = `Escribe el guion de un mini-podcast educativo de 1 solo narrador (sin diálogo entre dos personas, sin acotaciones de escena) sobre la lección "${lesson.title}" del módulo "${mod.title}". Tono conversacional, cercano, como si se lo explicaras a un profesional en su carro camino al trabajo. Entre 130 y 180 palabras. No uses encabezados, viñetas ni markdown — solo el texto a leer en voz alta.`;
    try {
      const script = await callGemini({ system: await buildTutorSystemPrompt(), messages: [{ role: "user", content: instruction }] });
      setPodcastScript(script);
      setPodcastStatus("ready");
    } catch (e) {
      setPodcastError(e.message || "No se pudo generar el guion del podcast.");
      setPodcastStatus("idle");
    }
  }

  function playPodcast() {
    if (!window.speechSynthesis) {
      setPodcastError("Tu navegador no soporta lectura en voz alta.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(podcastScript);
    utterance.lang = "es-ES";
    utterance.rate = 1;
    utterance.onend = () => setPodcastStatus("ready");
    utterance.onerror = () => setPodcastStatus("ready");
    window.speechSynthesis.speak(utterance);
    setPodcastStatus("playing");
  }
  function pausePodcast() {
    window.speechSynthesis.pause();
    setPodcastStatus("paused");
  }
  function resumePodcast() {
    window.speechSynthesis.resume();
    setPodcastStatus("playing");
  }
  function stopPodcast() {
    window.speechSynthesis.cancel();
    setPodcastStatus("ready");
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 pt-5 pb-3" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
        <button onClick={onBack}><ChevronLeft size={20} color={COLORS.text} /></button>
        <div className="flex-1">
          <p style={{ fontSize: 10.5, color: mod.color, fontWeight: 700 }}>{mod.title}</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{lesson.title}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <p style={{ fontSize: 13.5, lineHeight: 1.65, color: COLORS.text, whiteSpace: "pre-line" }}>{lesson.content}</p>

        {aiPanel && aiPanel !== "podcast" && (
          <div className="rounded-2xl p-4 mt-5" style={cardStyle}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={12.5} color={COLORS.accent} />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: COLORS.text }}>
                {aiPanel === "resumen" ? "Resumen generado" : "Quiz de repaso"}
              </span>
            </div>
            {loading ? (
              <div className="flex items-center gap-2 py-2">
                <Loader2 size={14} color={COLORS.textMuted} className="animate-spin" />
                <span style={{ fontSize: 12, color: COLORS.textMuted }}>Generando...</span>
              </div>
            ) : (
              <p style={{ fontSize: 12.5, lineHeight: 1.6, color: COLORS.textMuted, whiteSpace: "pre-line" }}>{aiText}</p>
            )}
          </div>
        )}

        {aiPanel === "podcast" && (
          <div className="rounded-2xl p-4 mt-5" style={cardStyle}>
            <div className="flex items-center gap-2 mb-2">
              <Mic size={12.5} color={COLORS.accent} />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: COLORS.text }}>Mini-podcast de este tema</span>
            </div>

            {podcastStatus === "writing" && (
              <div className="flex items-center gap-2 py-2">
                <Loader2 size={14} color={COLORS.textMuted} className="animate-spin" />
                <span style={{ fontSize: 12, color: COLORS.textMuted }}>Escribiendo el guion...</span>
              </div>
            )}

            {podcastError && <p style={{ fontSize: 12, color: COLORS.accent }}>{podcastError}</p>}

            {podcastScript && podcastStatus !== "writing" && (
              <>
                <p style={{ fontSize: 12.5, lineHeight: 1.6, color: COLORS.textMuted, marginBottom: 12 }}>{podcastScript}</p>
                <div className="flex items-center gap-2">
                  {podcastStatus === "playing" ? (
                    <button onClick={pausePodcast} className="flex items-center gap-1.5 rounded-xl px-3.5" style={{ height: 36, fontSize: 12, color: "#fff", backgroundColor: COLORS.accent }}>
                      <Pause size={13} /> Pausar
                    </button>
                  ) : podcastStatus === "paused" ? (
                    <button onClick={resumePodcast} className="flex items-center gap-1.5 rounded-xl px-3.5" style={{ height: 36, fontSize: 12, color: "#fff", backgroundColor: COLORS.accent }}>
                      <Play size={13} /> Reanudar
                    </button>
                  ) : (
                    <button onClick={playPodcast} className="flex items-center gap-1.5 rounded-xl px-3.5" style={{ height: 36, fontSize: 12, color: "#fff", backgroundColor: COLORS.accent }}>
                      <Play size={13} /> Escuchar
                    </button>
                  )}
                  {(podcastStatus === "playing" || podcastStatus === "paused") && (
                    <button onClick={stopPodcast} className="flex items-center gap-1.5 rounded-xl px-3" style={{ height: 36, fontSize: 12, color: COLORS.text, backgroundColor: COLORS.bgAlt, border: `1px solid ${COLORS.border}` }}>
                      <Square size={12} />
                    </button>
                  )}
                </div>
                <p style={{ fontSize: 10, color: COLORS.textFaint, marginTop: 8 }}>
                  Se lee con la voz sintetizada de tu navegador/dispositivo — no es un archivo de audio descargable.
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="px-4 pt-3 pb-4" style={{ borderTop: `1px solid ${COLORS.border}` }}>
        <div className="flex gap-2 mb-2">
          <button onClick={() => runAction("resumen")} className="flex-1 flex items-center justify-center gap-1.5 rounded-xl" style={{ height: 38, fontSize: 11.5, color: COLORS.text, backgroundColor: COLORS.bgAlt, border: `1px solid ${COLORS.border}` }}>
            <FileText size={13} /> Resumen
          </button>
          <button onClick={() => runAction("quiz")} className="flex-1 flex items-center justify-center gap-1.5 rounded-xl" style={{ height: 38, fontSize: 11.5, color: COLORS.text, backgroundColor: COLORS.bgAlt, border: `1px solid ${COLORS.border}` }}>
            <Check size={13} /> Quiz
          </button>
          <button onClick={generatePodcast} className="flex-1 flex items-center justify-center gap-1.5 rounded-xl" style={{ height: 38, fontSize: 11.5, color: COLORS.text, backgroundColor: COLORS.bgAlt, border: `1px solid ${COLORS.border}` }}>
            <Mic size={13} /> Podcast
          </button>
        </div>
        <button onClick={() => askTutor(mod, lesson)} className="w-full flex items-center justify-center gap-2 rounded-xl font-semibold" style={{ height: 42, backgroundColor: COLORS.accent, color: "#fff", fontSize: 13 }}>
          <MessageCircle size={14} /> Preguntarle a MaestrolA sobre esto
        </button>
      </div>
    </div>
  );
}

function ChatScreen({ user, prefillContext, clearPrefill }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: `¡Hola ${user.name.split(" ")[0]}! Soy MaestrolA. Puedo ayudarte con Design Thinking, Gestión de la Creatividad o el Modelo de Negocios — todo con base en el contenido del diplomado. ¿Qué revisamos?` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (prefillContext) {
      setInput(prefillContext);
      clearPrefill();
    }
  }, [prefillContext]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  async function send(text) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const newMessages = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const reply = await callGemini({ system: await buildTutorSystemPrompt(), messages: newMessages });
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: e.message || "No pude conectarme en este momento. Intenta de nuevo en unos segundos." }]);
    }
    setLoading(false);

    // Clasificación silenciosa para el panel del docente — no bloquea la UI del estudiante
    classifyMessage(content).then((result) => {
      if (result && result.lessonId && result.confusion) {
        logConfusion(result.lessonId, user.id);
      }
    });
  }

  const suggestions = ["¿Cómo aplico el Canvas en una startup?", "Hazme un quiz de Design Thinking", "Explícame el Doble Diamante"];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-5 pt-5 pb-3" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
        <div className="rounded-full flex items-center justify-center" style={{ width: 30, height: 30, backgroundColor: COLORS.accent }}>
          <Sparkles size={15} color="#fff" />
        </div>
        <div>
          <p style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.text }}>MaestrolA</p>
          <p style={{ fontSize: 10, color: COLORS.textFaint }}>Entrenado con el contenido del diplomado</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3">
        {messages.map((m, i) => (
          <div key={i} className="flex mb-3" style={{ justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div
              className="rounded-2xl px-3.5 py-2.5"
              style={{
                maxWidth: "82%",
                fontSize: 12.5,
                lineHeight: 1.5,
                whiteSpace: "pre-line",
                backgroundColor: m.role === "user" ? COLORS.accent : COLORS.bgAlt,
                color: m.role === "user" ? "#fff" : COLORS.text,
                border: m.role === "user" ? "none" : `1px solid ${COLORS.border}`,
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex mb-3" style={{ justifyContent: "flex-start" }}>
            <div className="rounded-2xl px-3.5 py-2.5 flex items-center gap-1.5" style={{ backgroundColor: COLORS.bgAlt, border: `1px solid ${COLORS.border}` }}>
              <Loader2 size={13} color={COLORS.textMuted} className="animate-spin" />
              <span style={{ fontSize: 12, color: COLORS.textMuted }}>Escribiendo...</span>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pb-1">
        <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {suggestions.map((s) => (
            <button key={s} onClick={() => send(s)} className="rounded-full whitespace-nowrap flex-shrink-0" style={{ fontSize: 11, padding: "6px 12px", backgroundColor: COLORS.bgAlt, border: `1px solid ${COLORS.border}`, color: COLORS.textMuted }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 pt-2 pb-4" style={{ borderTop: `1px solid ${COLORS.border}` }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Tu pregunta..."
          className="flex-1 rounded-xl px-3.5"
          style={{ height: 42, fontSize: 13, backgroundColor: COLORS.bgAlt, border: `1px solid ${COLORS.border}`, color: COLORS.text, outline: "none" }}
        />
        <button onClick={() => send()} disabled={loading || !input.trim()} className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 42, height: 42, backgroundColor: COLORS.accent, opacity: loading || !input.trim() ? 0.5 : 1 }}>
          <Send size={16} color="#fff" />
        </button>
      </div>
    </div>
  );
}

function ProfileScreen({ user, role, onLogout }) {
  return (
    <div className="flex flex-col h-full px-5 pt-5">
      <ScreenHeader title="Perfil" />
      <div className="rounded-2xl p-4 flex items-center gap-3" style={cardStyle}>
        <div className="rounded-full flex items-center justify-center" style={{ width: 44, height: 44, backgroundColor: COLORS.accentSoft }}>
          <User size={20} color={COLORS.accent} />
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{user.name}</p>
          <p style={{ fontSize: 11.5, color: COLORS.textFaint }}>
            {role === "student" ? `Matrícula ${user.matricula} · PAO 1 · 2026` : user.email}
          </p>
        </div>
      </div>

      <div className="rounded-2xl p-4 mt-3 flex items-start gap-2.5" style={{ backgroundColor: COLORS.accentSoft, border: `1px solid ${COLORS.accent}33` }}>
        <ShieldAlert size={15} color={COLORS.accent} style={{ marginTop: 1, flexShrink: 0 }} />
        <p style={{ fontSize: 11.5, lineHeight: 1.5, color: COLORS.text }}>
          Próxima fase: sincronización automática con Canvas (i3lab) para tareas y fechas, sin reemplazar la plataforma oficial.
        </p>
      </div>

      <button
        onClick={onLogout}
        className="flex items-center justify-center gap-2 rounded-xl font-semibold mt-4"
        style={{ height: 44, backgroundColor: COLORS.bgAlt, border: `1px solid ${COLORS.border}`, color: COLORS.text, fontSize: 13 }}
      >
        <LogOut size={14} /> Cerrar sesión
      </button>
    </div>
  );
}

// ----------------------------------------------------------------
// 10. DOCENTE — Home, Analítica
// ----------------------------------------------------------------
function TeacherHome({ teacher, setScreen }) {
  const myCourses = teacher.courseIds.map((id) => COURSES[id]);
  const myEvents = useMemo(() => {
    const upcoming = EVENTS.filter((e) => teacher.courseIds.includes(e.courseId) && e.type === "clase" && e.date >= TODAY_STR);
    upcoming.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    return upcoming.slice(0, 4);
  }, [teacher]);

  const [topIssue, setTopIssue] = useState(null);
  useEffect(() => {
    let alive = true;
    getConfusionLog().then((log) => {
      if (!alive) return;
      const stats = computeStats(log, teacher.moduleIds);
      setTopIssue(stats[0] || null);
    });
    return () => {
      alive = false;
    };
  }, [teacher]);

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-2">
        <p style={{ fontSize: 12, color: COLORS.textFaint }}>Buenos días,</p>
        <h1 style={{ fontSize: 19, fontWeight: 700, color: COLORS.text }}>{teacher.name}</h1>
        <p style={{ fontSize: 11.5, color: COLORS.textMuted }}>
          {myCourses.map((c) => c.name).join(" · ")}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {topIssue && (
          <button onClick={() => setScreen("analytics")} className="w-full text-left rounded-2xl p-4 mb-4" style={{ backgroundColor: COLORS.text }}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="rounded-full px-2 py-0.5" style={{ fontSize: 9.5, fontWeight: 800, backgroundColor: COLORS.accent, color: "#fff" }}>
                NUEVO
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>ANÁLISIS IA</span>
            </div>
            <p style={{ fontSize: 13.5, fontWeight: 600, color: "#fff", lineHeight: 1.4 }}>
              Refuerza "{topIssue.title}" — {topIssue.pct}% de tus estudiantes tiene duda
            </p>
            <span style={{ fontSize: 11.5, color: COLORS.accent, fontWeight: 700, marginTop: 6, display: "inline-block" }}>
              Ver análisis completo →
            </span>
          </button>
        )}

        <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>Próximas clases</p>
        {myEvents.map((ev) => (
          <div key={ev.id} className="rounded-2xl p-3.5 mb-2.5 flex items-center gap-3" style={cardStyle}>
            <div className="rounded-xl flex flex-col items-center justify-center flex-shrink-0" style={{ width: 44, height: 44, backgroundColor: COLORS.accentSoft }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: COLORS.accent, lineHeight: 1 }}>{ev.date.slice(-2)}</span>
              <span style={{ fontSize: 8.5, fontWeight: 700, color: COLORS.accent, textTransform: "uppercase" }}>
                {MONTH_NAMES[Number(ev.date.slice(5, 7)) - 1].slice(0, 3)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.text, lineHeight: 1.3 }}>{ev.title}</p>
              <p style={{ fontSize: 10.5, color: COLORS.textFaint }}>{COURSES[ev.courseId].name} · {ev.time}</p>
            </div>
          </div>
        ))}

        <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, margin: "16px 0 8px" }}>Tus cursos</p>
        {myCourses.map((c) => (
          <div key={c.id} className="rounded-2xl p-3.5 mb-2.5 flex items-center gap-3" style={cardStyle}>
            <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 36, height: 36, backgroundColor: COLORS.slateSoft, color: COLORS.slate }}>
              <GraduationCap size={16} />
            </div>
            <div className="flex-1">
              <p style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.text }}>{c.name}</p>
              {c.id === "c-git" && (
                <p style={{ fontSize: 10.5, color: COLORS.textFaint }}>
                  A tu cargo: {teacher.moduleIds.map((mId) => LIBRARY.find((m) => m.id === mId)?.title).join(", ")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeacherMaterial({ teacher }) {
  const editableModules = LIBRARY.filter((m) => teacher.moduleIds.includes(m.id));
  const [moduleId, setModuleId] = useState(editableModules[0]?.id);
  const [text, setText] = useState("");
  const [savedText, setSavedText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    getExtraContent(moduleId).then((val) => {
      if (!alive) return;
      setText(val);
      setSavedText(val);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [moduleId]);

  async function handleSave() {
    setSaving(true);
    try {
      await window.storage.set(`extra-content:${moduleId}`, text, true);
      setSavedText(text);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1800);
    } catch (e) {
      /* si no hay almacenamiento disponible, el texto sigue en el campo pero no persiste */
    }
    setSaving(false);
  }

  async function handleClear() {
    setText("");
    setSaving(true);
    try {
      await window.storage.delete(`extra-content:${moduleId}`, true);
    } catch (e) {
      /* no-op */
    }
    setSavedText("");
    setSaving(false);
  }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setParsing(true);
    try {
      if (file.name.toLowerCase().endsWith(".docx")) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setText((prev) => (prev ? `${prev}\n\n${result.value}` : result.value));
      } else {
        const raw = await file.text();
        setText((prev) => (prev ? `${prev}\n\n${raw}` : raw));
      }
    } catch (e) {
      alert("No se pudo leer el archivo. Asegúrate de que sea un .docx o .txt válido.");
    }
    setParsing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const dirty = text !== savedText;

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader eyebrow="Contenido" title="Material adicional" subtitle="Amplía lo que sabe el tutor de IA por módulo" />

      <div className="flex-1 overflow-y-auto px-5 pb-5">
        <div className="flex gap-2 mb-4 flex-wrap">
          {editableModules.map((m) => (
            <button
              key={m.id}
              onClick={() => setModuleId(m.id)}
              className="rounded-full px-3 py-1.5"
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: moduleId === m.id ? "#fff" : COLORS.text,
                backgroundColor: moduleId === m.id ? m.color : COLORS.bgAlt,
                border: `1px solid ${moduleId === m.id ? m.color : COLORS.border}`,
              }}
            >
              {m.title}
            </button>
          ))}
        </div>

        <div className="rounded-2xl p-4 mb-3" style={cardStyle}>
          <p style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>
            Pega texto o sube un documento
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Pega aquí notas, casos de estudio o cualquier contenido adicional sobre este módulo..."
            className="w-full rounded-xl p-3"
            style={{
              minHeight: 160,
              fontSize: 12.5,
              color: COLORS.text,
              backgroundColor: COLORS.bgAlt,
              border: `1px solid ${COLORS.border}`,
              outline: "none",
              resize: "vertical",
              fontFamily: "inherit",
            }}
            disabled={loading}
          />

          <input
            ref={fileInputRef}
            type="file"
            accept=".docx,.txt"
            onChange={handleFile}
            className="hidden"
            id="material-file-input"
          />
          <div className="flex gap-2 mt-2.5">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={parsing}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl"
              style={{ height: 38, fontSize: 12, color: COLORS.text, backgroundColor: COLORS.bgAlt, border: `1px solid ${COLORS.border}` }}
            >
              {parsing ? <Loader2 size={13} className="animate-spin" /> : <FileUp size={13} />}
              {parsing ? "Leyendo archivo..." : "Subir .docx o .txt"}
            </button>
            {text && (
              <button
                onClick={handleClear}
                className="flex items-center justify-center gap-1.5 rounded-xl px-3"
                style={{ height: 38, fontSize: 12, color: COLORS.accent, backgroundColor: COLORS.accentSoft, border: `1px solid ${COLORS.accent}33` }}
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={saving || loading || !dirty}
            className="w-full flex items-center justify-center gap-2 rounded-xl font-semibold mt-3"
            style={{
              height: 42,
              backgroundColor: dirty ? COLORS.accent : COLORS.bgAlt,
              color: dirty ? "#fff" : COLORS.textFaint,
              fontSize: 13,
              border: dirty ? "none" : `1px solid ${COLORS.border}`,
            }}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {savedFlash ? "Guardado ✓" : saving ? "Guardando..." : dirty ? "Guardar material" : "Sin cambios"}
          </button>
        </div>

        <div className="rounded-2xl p-3.5 flex items-start gap-2.5" style={{ backgroundColor: COLORS.slateSoft }}>
          <ShieldAlert size={14} color={COLORS.slate} style={{ marginTop: 1, flexShrink: 0 }} />
          <p style={{ fontSize: 11, lineHeight: 1.5, color: COLORS.text }}>
            Esto se suma al conocimiento del tutor de IA para este módulo, en el chat y en Resumen/Quiz de la
            Biblioteca. En este proyecto local se guarda en el navegador (localStorage); con un backend propio en
            producción quedaría disponible para todos los estudiantes desde cualquier dispositivo.
          </p>
        </div>
      </div>
    </div>
  );
}

function TeacherAnalytics({ teacher }) {
  const [log, setLog] = useState(null);
  const [loadingLog, setLoadingLog] = useState(true);
  const [suggestions, setSuggestions] = useState("");
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    let alive = true;
    getConfusionLog().then((l) => {
      if (alive) {
        setLog(l);
        setLoadingLog(false);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  const stats = useMemo(() => (log ? computeStats(log, teacher.moduleIds) : []), [log, teacher]);

  async function handleSuggestions() {
    setLoadingSuggestions(true);
    try {
      const text = await getTeachingSuggestions(stats);
      setSuggestions(text);
    } catch (e) {
      setSuggestions(e.message || "No se pudieron generar sugerencias. Intenta de nuevo.");
    }
    setLoadingSuggestions(false);
  }

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader eyebrow="Análisis IA" title="Dudas por tema" subtitle={`Agregado anónimo · clase de referencia: ${TOTAL_STUDENTS} estudiantes`} />

      <div className="flex-1 overflow-y-auto px-5 pb-5">
        {loadingLog ? (
          <div className="flex items-center gap-2 py-6 justify-center">
            <Loader2 size={16} color={COLORS.textMuted} className="animate-spin" />
            <span style={{ fontSize: 12.5, color: COLORS.textMuted }}>Cargando datos...</span>
          </div>
        ) : stats.length === 0 ? (
          <p style={{ fontSize: 12.5, color: COLORS.textFaint, textAlign: "center", marginTop: 30, lineHeight: 1.5 }}>
            Todavía no hay suficientes preguntas repetidas sobre un mismo tema (mínimo {CONFUSION_THRESHOLD} estudiantes)
            en los módulos que impartes.
          </p>
        ) : (
          <>
            {stats.map((s) => (
              <div key={s.id} className="rounded-2xl p-4 mb-3" style={cardStyle}>
                <div className="flex items-center justify-between mb-1">
                  <p style={{ fontSize: 10.5, fontWeight: 700, color: COLORS.slate }}>{s.moduleTitle.toUpperCase()}</p>
                  <div className="flex items-center gap-1">
                    <Users size={11} color={COLORS.accent} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.accent }}>
                      {s.count}/{TOTAL_STUDENTS}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: 13.5, fontWeight: 600, color: COLORS.text, marginBottom: 8 }}>{s.title}</p>
                <ProgressBar value={s.pct} color={COLORS.accent} />
                <p style={{ fontSize: 10.5, color: COLORS.textFaint, marginTop: 5 }}>
                  {s.pct}% de la clase mostró señales de confusión sobre este tema.
                </p>
              </div>
            ))}

            <button
              onClick={handleSuggestions}
              disabled={loadingSuggestions}
              className="w-full flex items-center justify-center gap-2 rounded-xl font-semibold mt-2"
              style={{ height: 44, backgroundColor: COLORS.text, color: "#fff", fontSize: 13, opacity: loadingSuggestions ? 0.7 : 1 }}
            >
              {loadingSuggestions ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
              {loadingSuggestions ? "Generando sugerencias..." : "Generar sugerencias con IA"}
            </button>

            {suggestions && (
              <div className="rounded-2xl p-4 mt-3" style={{ backgroundColor: COLORS.accentSoft, border: `1px solid ${COLORS.accent}33` }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles size={12.5} color={COLORS.accent} />
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: COLORS.text }}>Sugerencias para tu próxima clase</span>
                </div>
                <p style={{ fontSize: 12.5, lineHeight: 1.6, color: COLORS.text, whiteSpace: "pre-line" }}>{suggestions}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// 11. APP ROOT
// ----------------------------------------------------------------
export default function App() {
  const [session, setSession] = useState(null); // { user, role }
  const [screen, setScreen] = useState("home");
  const [lessonCtx, setLessonCtx] = useState(null);
  const [prefillContext, setPrefillContext] = useState(null);

  function handleLoginSuccess(user, role) {
    setSession({ user, role });
    setScreen("home");
  }
  function handleLogout() {
    setSession(null);
    setLessonCtx(null);
    setPrefillContext(null);
  }
  function openLesson(mod, lesson) {
    setLessonCtx({ mod, lesson: lesson || mod.lessons[0] });
    setScreen("lesson");
  }
  function openLessonById(moduleId, lessonId) {
    const mod = LIBRARY.find((m) => m.id === moduleId);
    if (!mod) return;
    const lesson = mod.lessons.find((l) => l.id === lessonId) || mod.lessons[0];
    setLessonCtx({ mod, lesson });
    setScreen("lesson");
  }
  function askTutor(mod, lesson) {
    setPrefillContext(`Tengo una duda sobre "${lesson.title}" (módulo ${mod.title}). `);
    setScreen("chat");
  }

  const initials = session ? session.user.name.split(" ").map((p) => p[0]).slice(0, 2).join("") : "";

  const studentNav = [
    { id: "home", label: "Inicio", icon: Home },
    { id: "library", label: "Biblioteca", icon: BookOpen },
    { id: "calendar", label: "Calendario", icon: CalendarIcon },
    { id: "chat", label: "Tutor", icon: MessageCircle },
    { id: "profile", label: "Perfil", icon: User },
  ];
  const teacherNav = [
    { id: "home", label: "Inicio", icon: Home },
    { id: "calendar", label: "Calendario", icon: CalendarIcon },
    { id: "material", label: "Material", icon: Upload },
    { id: "analytics", label: "Análisis", icon: BarChart3 },
    { id: "profile", label: "Perfil", icon: User },
  ];

  const showChrome = !!session;
  const navItems = session?.role === "teacher" ? teacherNav : studentNav;
  const navScreens = navItems.map((n) => n.id);

  return (
    <div className="flex items-center justify-center w-full" style={{ minHeight: 660, backgroundColor: "#efeff1" }}>
      <div
        className="flex flex-col overflow-hidden"
        style={{
          width: 390,
          height: 780,
          backgroundColor: COLORS.bg,
          borderRadius: 34,
          border: "8px solid #000",
          boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {showChrome && <TopBrandBar initials={initials} onAvatarClick={() => setScreen("profile")} />}

        {showChrome && !import.meta.env.VITE_GEMINI_API_KEY && (
          <div
            className="flex items-center gap-2 px-4 flex-shrink-0"
            style={{ height: 30, backgroundColor: "#FEF3C7", borderBottom: "1px solid #FDE68A" }}
          >
            <AlertTriangle size={12} color="#92400E" />
            <span style={{ fontSize: 10.5, color: "#92400E" }}>
              Falta tu VITE_GEMINI_API_KEY en .env — el tutor y el análisis no responderán hasta configurarla.
            </span>
          </div>
        )}

        <div className="flex-1 overflow-hidden relative">
          {!session && <LoginScreen onLoginSuccess={handleLoginSuccess} />}

          {session && session.role === "student" && (
            <>
              {screen === "home" && <StudentHome user={session.user} setScreen={setScreen} openLesson={openLesson} />}
              {screen === "library" && <LibraryScreen openLesson={openLesson} />}
              {screen === "calendar" && (
                <CalendarScreen
                  events={EVENTS.filter((e) => e.courseId === "c-git")}
                  eyebrow="Calendario"
                  title="Tu calendario"
                  subtitle="Tareas y clases del diplomado — enlazadas a Canvas"
                  onOpenLesson={openLessonById}
                />
              )}
              {screen === "lesson" && lessonCtx && (
                <LessonScreen mod={lessonCtx.mod} lesson={lessonCtx.lesson} onBack={() => setScreen("library")} askTutor={askTutor} />
              )}
              {screen === "chat" && (
                <ChatScreen user={session.user} prefillContext={prefillContext} clearPrefill={() => setPrefillContext(null)} />
              )}
              {screen === "profile" && <ProfileScreen user={session.user} role="student" onLogout={handleLogout} />}
            </>
          )}

          {session && session.role === "teacher" && (
            <>
              {screen === "home" && <TeacherHome teacher={session.user} setScreen={setScreen} />}
              {screen === "calendar" && (
                <CalendarScreen
                  events={EVENTS.filter((e) => session.user.courseIds.includes(e.courseId))}
                  eyebrow="Calendario"
                  title="Tu agenda"
                  subtitle="Todas tus clases, en un solo lugar"
                />
              )}
              {screen === "material" && <TeacherMaterial teacher={session.user} />}
              {screen === "analytics" && <TeacherAnalytics teacher={session.user} />}
              {screen === "profile" && <ProfileScreen user={session.user} role="teacher" onLogout={handleLogout} />}
            </>
          )}
        </div>

        {showChrome && navScreens.includes(screen) && <BottomNav items={navItems} screen={screen} setScreen={setScreen} />}
      </div>
    </div>
  );
}
