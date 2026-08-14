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
  Video,
  Film,
  ArrowUp,
  ArrowDown,
  ListChecks,
  CircleCheck,
  Circle,
  LayoutGrid,
} from "lucide-react";
import mammoth from "mammoth";

/* ============================================================
   MagicI3lab — Prototipo funcional
   Tutor de IA "Cogni" + Biblioteca Digital + Calendario + Panel Docente
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
   - Los videos precargados viven en /public/videos (assets
     estáticos, se sirven directo por GitHub Pages). Los videos
     que suba el docente desde la app se guardan como Blob en
     IndexedDB de tu navegador (ver videoStore más abajo) — no
     hay backend real, así que solo quedan disponibles en el
     navegador donde se subieron. Para que todos los estudiantes
     vean lo mismo desde cualquier dispositivo, hace falta un
     backend propio (subida a un storage real).
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

const APP_NAME = "MagicI3lab";
const AI_NAME = "Cogni";
const TOTAL_STUDENTS = 50;
const CONFUSION_THRESHOLD = 3;
const MAX_VIDEO_SECONDS = 10 * 60; // límite de subida del docente: 10 minutos
const MAX_VIDEO_MB = 180; // límite de tamaño razonable para IndexedDB del navegador

// ----------------------------------------------------------------
// 1. ROSTER — "clase" de referencia de 50 estudiantes para las
//    métricas del docente. Los primeros 3 son las cuentas reales
//    de prueba (con login); el resto son nombres de la clase
//    completa usados como referencia estadística (no inician sesión,
//    pero si tú entras con Jorge/Erin/Aquiles y repites una duda,
//    tu id real se suma a estos y el conteo sube de verdad).
// ----------------------------------------------------------------
const STUDENT_ROSTER = [
  { id: "2026001", name: "Jorge López", email: "jlopez@i3lab.ec" },
  { id: "2026002", name: "Erin Pincay", email: "epincay@i3lab.ec" },
  { id: "2026003", name: "Aquiles Moyón", email: "amoyon@i3lab.ec" },
  { id: "2026004", name: "María José Zambrano", email: "mzambrano@i3lab.ec" },
  { id: "2026005", name: "Carlos Molina", email: "cmolina@i3lab.ec" },
  { id: "2026006", name: "Andrea Suárez", email: "asuarez@i3lab.ec" },
  { id: "2026007", name: "Luis Bermeo", email: "lbermeo@i3lab.ec" },
  { id: "2026008", name: "Génesis Palma", email: "gpalma@i3lab.ec" },
  { id: "2026009", name: "Pedro Quinde", email: "pquinde@i3lab.ec" },
  { id: "2026010", name: "Valentina Sánchez", email: "vsanchez@i3lab.ec" },
  { id: "2026011", name: "Diego Barros", email: "dbarros@i3lab.ec" },
  { id: "2026012", name: "Camila Yagual", email: "cyagual@i3lab.ec" },
  { id: "2026013", name: "José Miguel Choez", email: "jchoez@i3lab.ec" },
  { id: "2026014", name: "Fernanda Salvatierra", email: "fsalvatierra@i3lab.ec" },
  { id: "2026015", name: "Kevin Rendón", email: "krendon@i3lab.ec" },
  { id: "2026016", name: "Nicole Orrala", email: "norrala@i3lab.ec" },
  { id: "2026017", name: "Bryan Villamar", email: "bvillamar@i3lab.ec" },
  { id: "2026018", name: "Melany Vera", email: "mvera@i3lab.ec" },
  { id: "2026019", name: "Steven Reyes", email: "sreyes@i3lab.ec" },
  { id: "2026020", name: "Ashley Chávez", email: "achavez@i3lab.ec" },
  { id: "2026021", name: "Jonathan Andrade", email: "jandrade@i3lab.ec" },
  { id: "2026022", name: "Doménica Franco", email: "dfranco@i3lab.ec" },
  { id: "2026023", name: "Michael Tomalá", email: "mtomala@i3lab.ec" },
  { id: "2026024", name: "Gabriela Cañarte", email: "gcanarte@i3lab.ec" },
  { id: "2026025", name: "Christian Pincay", email: "cpincay@i3lab.ec" },
  { id: "2026026", name: "Paola Alcívar", email: "palcivar@i3lab.ec" },
  { id: "2026027", name: "Anthony Mora", email: "amora@i3lab.ec" },
  { id: "2026028", name: "Sofía Panchana", email: "spanchana@i3lab.ec" },
  { id: "2026029", name: "Wellington Baque", email: "wbaque@i3lab.ec" },
  { id: "2026030", name: "Katherine Ponce", email: "kponce@i3lab.ec" },
  { id: "2026031", name: "Ronny Cedeño", email: "rcedeno@i3lab.ec" },
  { id: "2026032", name: "Estefanía Muñoz", email: "emunoz@i3lab.ec" },
  { id: "2026033", name: "Xavier Villón", email: "xvillon@i3lab.ec" },
  { id: "2026034", name: "Mishell Loor", email: "mloor@i3lab.ec" },
  { id: "2026035", name: "Israel Espinoza", email: "iespinoza@i3lab.ec" },
  { id: "2026036", name: "Johanna Macías", email: "jmacias@i3lab.ec" },
  { id: "2026037", name: "Ricardo Rivadeneira", email: "rrivadeneira@i3lab.ec" },
  { id: "2026038", name: "Karen Salazar", email: "ksalazar@i3lab.ec" },
  { id: "2026039", name: "Andrés Borbor", email: "aborbor@i3lab.ec" },
  { id: "2026040", name: "Yadira Delgado", email: "ydelgado@i3lab.ec" },
  { id: "2026041", name: "Marlon Guale", email: "mguale@i3lab.ec" },
  { id: "2026042", name: "Cristina Solórzano", email: "csolorzano@i3lab.ec" },
  { id: "2026043", name: "Freddy Tigrero", email: "ftigrero@i3lab.ec" },
  { id: "2026044", name: "Gabriel Zambrano", email: "gzambrano@i3lab.ec" },
  { id: "2026045", name: "Verónica Molina", email: "vmolina@i3lab.ec" },
  { id: "2026046", name: "Danny Suárez", email: "dsuarez@i3lab.ec" },
  { id: "2026047", name: "Lissette Bermeo", email: "lbermeo2@i3lab.ec" },
  { id: "2026048", name: "Franklin Palma", email: "fpalma@i3lab.ec" },
  { id: "2026049", name: "Adriana Quinde", email: "aquinde@i3lab.ec" },
  { id: "2026050", name: "Byron Sánchez", email: "bsanchez@i3lab.ec" },];

const STUDENT_BY_ID = Object.fromEntries(STUDENT_ROSTER.map((s) => [s.id, s]));

function studentLabel(id) {
  const s = STUDENT_BY_ID[id];
  return s ? { name: s.name, email: s.email } : { name: `Estudiante ${id}`, email: "" };
}

// ----------------------------------------------------------------
// 2. BIBLIOTECA DIGITAL — estructura: Materia > Módulo > Submódulo
//    (reemplazar por el material real del diplomado cuando esté listo)
// ----------------------------------------------------------------
const LIBRARY = [
  {
    id: "dt",
    title: "Design Thinking",
    color: "#ED1C24",
    modules: [
      {
        id: "dt-m1",
        num: "1",
        title: "Módulo 1: Introducción y Fundamentos",
        submodules: [
          {
            id: "dt-m1-1",
            num: "1.1",
            title: "¿Qué es el Design Thinking?",
            type: "video",
            minutes: 12,
            content: `El Design Thinking es una metodología de innovación centrada en las personas: en lugar de partir de una solución o una tecnología, parte de entender profundamente las necesidades reales de quien va a usar lo que se está diseñando. Nació en el mundo del diseño industrial y se popularizó en Stanford (d.school) e IDEO durante los años 90 y 2000, cuando quedó claro que los mismos procesos creativos que usaban los diseñadores de producto podían aplicarse a problemas de negocio, servicios públicos y modelos organizacionales.

Su aporte central frente a la gestión tradicional es que transforma la resolución de problemas complejos —los llamados "wicked problems", sin una única solución correcta— en un proceso iterativo y humano: se investiga, se prototipa, se prueba con usuarios reales y se ajusta, en vez de planificar todo de antemano y ejecutar en una sola pasada.`,
            videos: [
              { id: "dt-m1-1-v1", title: "Introducción e innovación y sus pilares — Parte 1", src: "videos/dt-intro-innovacion-parte1.mp4" },
              { id: "dt-m1-1-v2", title: "Introducción e innovación y sus pilares — Parte 2", src: "videos/dt-intro-innovacion-parte2.mp4" },
            ],
          },
          {
            id: "dt-m1-2",
            num: "1.2",
            title: "Principios y Mentalidad (Mindset)",
            type: "lectura",
            minutes: 7,
            content: `Más que un conjunto de herramientas, el Design Thinking es una mentalidad. Se apoya en cinco actitudes clave: empatía genuina hacia el usuario, colaboración multidisciplinaria (los mejores equipos mezclan perfiles técnicos, de negocio y creativos), tolerancia al fallo como fuente de aprendizaje, experimentación rápida antes que planificación exhaustiva, y pensamiento visual para hacer tangibles las ideas.

La tolerancia al fallo es quizás el cambio de mentalidad más difícil para organizaciones tradicionales: en vez de castigar el error, se diseñan experimentos pequeños y baratos ("fail fast, fail cheap") precisamente para descubrir qué no funciona antes de invertir en una solución a gran escala. Iterar no es un síntoma de mala planificación, es el mecanismo mismo por el cual la metodología llega a mejores soluciones.`,
          },
          {
            id: "dt-m1-3",
            num: "1.3",
            title: "Ámbitos de Aplicación",
            type: "lectura",
            minutes: 6,
            content: `El Design Thinking se aplica hoy mucho más allá del diseño de productos físicos. En diseño de servicios, ayuda a rediseñar la experiencia completa de un cliente con un banco, un hospital o una aerolínea. En modelos de negocio, se usa para validar si una propuesta de valor realmente resuelve un problema antes de construir la operación completa alrededor de ella.

En innovación corporativa —el foco de este diplomado— su valor está en reducir el riesgo de las apuestas de innovación: en vez de invertir meses de desarrollo en una idea basada en supuestos internos, permite validar con usuarios reales en semanas. Empresas como IBM, SAP y bancos latinoamericanos han creado unidades internas de innovación que usan Design Thinking como su proceso estándar para explorar nuevos productos y servicios.`,
          },
        ],
      },
      {
        id: "dt-m2",
        num: "2",
        title: "Módulo 2: Marco Teórico — El Doble Diamante",
        submodules: [
          {
            id: "dt-m2-1",
            num: "2.1",
            title: "Las Cuatro Fases del Doble Diamante",
            type: "lectura",
            minutes: 9,
            content: `El Doble Diamante (Double Diamond), desarrollado por el British Design Council en 2005, es el marco visual más usado para explicar el proceso de Design Thinking. Su forma —dos rombos consecutivos— representa la alternancia entre pensamiento divergente (abrir, explorar muchas posibilidades) y pensamiento convergente (cerrar, elegir y refinar una sola dirección).

Las cuatro fases son: Descubrir (divergente: explorar el problema sin restringirlo), Definir (convergente: sintetizar en un enunciado claro), Desarrollar (divergente: generar muchas soluciones posibles) y Entregar (convergente: seleccionar, refinar y lanzar la mejor). El error más común es saltarse el primer diamante completo —ir directo a generar soluciones— sin haber invertido tiempo real en entender el problema. Un problema mal definido, sin importar qué tan bien ejecutada esté la solución después, produce resultados irrelevantes.`,
          },
          {
            id: "dt-m2-2",
            num: "2.2",
            title: "Fase 1: Descubrir (Explorar)",
            type: "lectura",
            minutes: 8,
            content: `Descubrir es la fase de inmersión: salir del escritorio y observar el contexto real del usuario, no asumirlo desde la oficina. Se apoya en investigación cualitativa —entrevistas semiestructuradas, observación de campo (shadowing), y revisión de datos existentes— con el objetivo específico de encontrar necesidades que el propio usuario no articula espontáneamente.

La habilidad central de esta fase es la escucha activa sin agenda: entrar sin la hipótesis de qué solución vamos a construir, porque esa hipótesis sesga qué preguntas se hacen y qué respuestas se escuchan. Un error frecuente es hacer "entrevistas de confirmación" —preguntas que ya asumen la solución— en vez de entrevistas exploratorias genuinas. El resultado de esta fase no es una lista de soluciones, es una comprensión rica y sin filtrar del problema real.`,
          },
          {
            id: "dt-m2-3",
            num: "2.3",
            title: "Fase 2: Definir (Sintetizar)",
            type: "lectura",
            minutes: 8,
            content: `Definir es donde se procesa todo lo recolectado en Descubrir y se convierte en dirección accionable. El primer paso es sintetizar los hallazgos en insights: afirmaciones que explican por qué el usuario se comporta como se comporta, no solo qué hace. Un insight útil conecta un comportamiento observado con una necesidad o tensión subyacente.

A partir de los insights se delimita un enunciado de problema (Point of View) que identifica quién es el usuario, qué necesita y por qué. De ahí se derivan las preguntas "¿Cómo podríamos...?" (How Might We), que reformulan el problema como una invitación a idear en vez de una restricción. Definir mal el problema en esta fase —dejarlo demasiado amplio o ya con la solución implícita— es la causa más común de que un proyecto de innovación fracase, sin importar qué tan bien se ejecute después.`,
          },
        ],
      },
      {
        id: "dt-m3",
        num: "3",
        title: "Módulo 3: Fase de Empatía",
        submodules: [
          {
            id: "dt-m3-1",
            num: "3.1",
            title: "Investigación Cualitativa y Observación",
            type: "lectura",
            minutes: 8,
            content: `La empatía en Design Thinking no es un sentimiento, es una disciplina de investigación. Las entrevistas semiestructuradas —con preguntas abiertas y espacio para que el usuario se explaye, no un cuestionario cerrado— son la herramienta más usada. Se complementan con observación encubierta (contextual inquiry): ver al usuario actuar en su entorno natural revela comportamientos que la persona ni siquiera reportaría en una entrevista, porque los hace de forma automática.

Los mapas de actores (stakeholder maps) amplían la mirada más allá del usuario final: identifican a todas las personas y organizaciones que influyen o son afectadas por el problema —tomadores de decisión, usuarios secundarios, proveedores— y sus relaciones de poder e influencia entre sí. En contextos corporativos esto es crítico: un problema que involucra a varios departamentos requiere entender la política interna, no solo la experiencia del usuario final.`,
          },
          {
            id: "dt-m3-2",
            num: "3.2",
            title: "Herramientas de Mapeo de Usuario",
            type: "lectura",
            minutes: 9,
            content: `Un User Persona es un arquetipo semi-ficticio que resume patrones reales de comportamiento observados en la investigación —no debe basarse en suposiciones ni en un solo caso aislado—. Incluye objetivos, frustraciones y contexto, y sirve para que todo el equipo diseñe pensando en la misma persona concreta en vez de un "usuario promedio" abstracto.

El Customer Journey Map documenta lo que ese usuario hace, piensa y siente en cada etapa de su interacción con un producto o servicio, típicamente dividido en "antes", "durante" y "después". Su valor está en hacer visibles los puntos de dolor (pain points): los momentos exactos donde la experiencia se rompe. Un error común es diseñar soluciones para el punto de dolor más ruidoso en vez del más frecuente o más costoso para el usuario — por eso conviene priorizar con datos, no solo con la anécdota que más se repitió en la última reunión.`,
          },
          {
            id: "dt-m3-3",
            num: "3.3",
            title: "Extracción de Insights",
            type: "lectura",
            minutes: 7,
            content: `Extraer insights es el puente entre la investigación cruda y la fase de Definir. La técnica más usada es el affinity mapping (agrupación por afinidad): cada hallazgo individual —una cita, una observación— se escribe en una nota separada, y luego el equipo las agrupa físicamente por temas emergentes, sin categorías definidas de antemano. Los patrones que aparecen solos, sin haber sido buscados, suelen ser los insights más valiosos.

Una necesidad latente es distinta de una necesidad expresada: el usuario rara vez dice "necesito sentirme en control", pero sí describe comportamientos —revisar el pedido cinco veces, preguntar lo mismo de varias formas— que la revelan. Distinguir entre lo que el usuario pide literalmente y la necesidad más profunda que hay detrás es la diferencia entre una solución superficial y una que realmente cambia su experiencia.`,
          },
        ],
      },
      {
        id: "dt-m4",
        num: "4",
        title: "Módulo 4: Fase de Ideación",
        submodules: [
          {
            id: "dt-m4-1",
            num: "4.1",
            title: "Preparación para la Ideación",
            type: "lectura",
            minutes: 6,
            content: `Antes de generar ideas, hay que calibrar bien la pregunta que las va a guiar. Una pregunta "¿Cómo podríamos...?" (How Might We) mal calibrada arruina toda la sesión de ideación que sigue: si es demasiado amplia ("¿Cómo podríamos innovar?") no da dirección; si es demasiado estrecha ("¿Cómo podríamos agregar un botón?") ya asume la solución y cierra la exploración antes de empezar.

Una HMW bien calibrada nace directamente del insight y del enunciado de problema de la fase Definir, y define un territorio de exploración, no una respuesta. Es común generar varias variantes de la misma pregunta —cambiando el énfasis en "quién", "qué" o "por qué"— y elegir la que abre más posibilidades sin perder foco. Esta preparación, aunque parece un paso menor, determina la calidad de todas las ideas que van a salir después.`,
          },
          {
            id: "dt-m4-2",
            num: "4.2",
            title: "Técnicas de Divergencia Creativa",
            type: "lectura",
            minutes: 9,
            content: `Divergir bien significa generar muchas alternativas antes de evaluar ninguna — separar la generación de la evaluación es el principio que más mejora los resultados de cualquier técnica de ideación. El brainstorming clásico es la más conocida, pero tiene una limitación real: los grupos numerosos producen menos ideas per cápita que la suma de esas personas trabajando solas, por el "bloqueo de producción" (solo una persona habla a la vez).

Técnicas que lo corrigen: Crazy Eights (ocho ideas en ocho minutos, una por casillero, individual y en silencio antes de compartir), Worst Possible Idea (idear deliberadamente las peores soluciones posibles, lo cual libera al equipo del miedo al ridículo y casi siempre revela una idea buena escondida dentro de una mala), y SCAMPER —un checklist de siete preguntas (Sustituir, Combinar, Adaptar, Modificar, Poner en otro uso, Eliminar, Reordenar) para forzar nuevas perspectivas sobre algo que ya existe, rompiendo la fijación funcional.`,
          },
          {
            id: "dt-m4-3",
            num: "4.3",
            title: "Selección y Filtrado de Ideas",
            type: "lectura",
            minutes: 7,
            content: `Una vez generadas muchas ideas, hay que converger. El criterio clásico de IDEO evalúa cada idea en tres dimensiones: deseabilidad (¿el usuario realmente lo quiere?), factibilidad (¿es técnicamente posible construirlo?) y viabilidad (¿tiene sentido económico para la organización?). Una idea fuerte necesita las tres; muchas ideas atractivas mueren porque nunca fueron viables desde el inicio.

Para priorizar entre varias ideas que sí cumplen los tres criterios, se usan matrices como Impacto vs. Esfuerzo (priorizar lo de alto impacto y bajo esfuerzo primero) o la matriz NUF (Nueva, Útil, Factible), que puntúa cada idea del 1 al 10 en cada dimensión. Estas herramientas no reemplazan el criterio del equipo, pero evitan que la idea que gane sea simplemente la que defendió la persona con más jerarquía en la sala.`,
          },
        ],
      },
      {
        id: "dt-m5",
        num: "5",
        title: "Módulo 5: Prototipado y Validación",
        submodules: [
          {
            id: "dt-m5-1",
            num: "5.1",
            title: "Fundamentos del Prototipado",
            type: "lectura",
            minutes: 8,
            content: `Prototipar es "pensar con las manos": construir algo tangible, por rudimentario que sea, para poder conversar con el usuario sobre algo concreto en vez de una idea abstracta. Un prototipo no busca ser bonito ni completo, busca responder una pregunta específica lo más rápido y barato posible.

Los prototipos de baja resolución (bocetos en papel, maquetas de cartón, un flujo de pantallas dibujado a mano) sirven para validar dirección general en horas. Los de alta resolución —como el que estás construyendo en este mismo diplomado— se usan más adelante, cuando ya hay evidencia de que la dirección es correcta. Una técnica particularmente útil es el Wizard of Oz: simular que un sistema funciona automáticamente (por ejemplo, una app) cuando en realidad hay una persona operando manualmente por detrás, para probar la experiencia sin construir la tecnología real.`,
          },
          {
            id: "dt-m5-2",
            num: "5.2",
            title: "Diseño de Experimentos de Validación",
            type: "lectura",
            minutes: 7,
            content: `Cada prototipo debe probar una hipótesis específica y medible, no "ver qué opina la gente" en general. Una buena hipótesis tiene la forma: "Creemos que [tipo de usuario] hará/preferirá [comportamiento] cuando le ofrezcamos [solución], porque [razón]" — y se define de antemano qué resultado la confirmaría y cuál la refutaría.

El guion de interacción es el protocolo que sigue quien facilita la prueba: qué tareas se le pide al usuario, en qué orden, y qué se observa (no solo lo que dice, sino dónde duda, dónde se detiene, qué ignora). Diseñar el guion con anticipación evita el sesgo más común de las pruebas de usuario: guiar sin querer al usuario hacia la respuesta que el equipo espera escuchar.`,
          },
          {
            id: "dt-m5-3",
            num: "5.3",
            title: "Pruebas e Iteración",
            type: "lectura",
            minutes: 7,
            content: `La sesión de validación combina lo que el usuario dice con lo que hace, porque frecuentemente no coinciden — un usuario puede decir que algo le encantó y aun así abandonarlo a los treinta segundos de uso real. Por eso se recomienda observar antes de preguntar, y dejar las preguntas abiertas ("cuéntame qué pasó ahí") para el final de cada tarea, no interrumpir mientras ocurre.

La iteración no es "arreglar lo que no funcionó", es refinar la propuesta con evidencia real del usuario, ciclo tras ciclo, hasta que el prototipo deja de sorprender — es decir, hasta que las pruebas dejan de revelar problemas nuevos. La iteración no termina cuando se lanza el producto: continúa mientras existan datos de uso reales de los que aprender, tal como se vio en el módulo de introducción del Doble Diamante.`,
          },
        ],
      },
    ],
  },
  {
    id: "gc",
    title: "Gestión de la Creatividad",
    color: "#4A5560",
    modules: [
      {
        id: "gc-m1",
        num: "1",
        title: "Módulo 1: Creatividad e Ideación en la Organización",
        submodules: [
          {
            id: "gc-m1-1",
            num: "1.1",
            title: "Bloqueos creativos en las organizaciones",
            type: "lectura",
            minutes: 8,
            content: `La creatividad organizacional no falla por falta de talento individual, sino por bloqueos estructurales: miedo a equivocarse frente a superiores, procesos de aprobación que castigan la ambigüedad, y culturas que premian la ejecución eficiente por sobre la exploración.

Tres bloqueos frecuentes: (1) el sesgo de confirmación —evaluar ideas nuevas contra "cómo siempre lo hemos hecho"—, (2) el miedo al ridículo en grupo, que reduce la cantidad de ideas expresadas, y (3) la evaluación prematura, cuando se juzga la viabilidad de una idea antes de generar suficientes alternativas.`,
          },
          {
            id: "gc-m1-2",
            num: "1.2",
            title: "Técnica SCAMPER",
            type: "lectura",
            minutes: 9,
            content: `SCAMPER es un checklist de siete preguntas para forzar nuevas perspectivas sobre un producto, servicio o proceso existente: Sustituir, Combinar, Adaptar, Modificar, Poner en otro uso, Eliminar y Reordenar.

Su utilidad principal es romper la fijación funcional: la tendencia mental a ver un objeto o proceso solo por su uso habitual. Aplicar "Eliminar" a un diplomado presencial obliga a preguntar qué pasaría si se quitaran los horarios fijos; aplicar "Poner en otro uso" obliga a preguntar qué otro problema podría resolver la misma infraestructura de mentoría que ya existe.`,
          },
          {
            id: "gc-m1-3",
            num: "1.3",
            title: "Brainstorming y sus variantes",
            type: "lectura",
            minutes: 7,
            content: `El brainstorming clásico tiene una limitación conocida: los grupos numerosos producen menos ideas per cápita que la suma de esas mismas personas trabajando solas, por el "bloqueo de producción" —solo una persona puede hablar a la vez—.

Dos variantes que lo corrigen: el brainwriting (cada persona escribe ideas en silencio antes de compartir) y la ideación por rondas cronometradas. Separar la fase de generación de la fase de evaluación es el principio que más mejora los resultados.`,
          },
          {
            id: "gc-m1-4",
            num: "1.4",
            title: "Mapas mentales para la ideación",
            type: "lectura",
            minutes: 6,
            content: `Un mapa mental organiza ideas de forma radial en vez de lineal. Su ventaja frente a una lista es que hace visibles conexiones entre ideas que parecían no relacionadas, lo cual favorece la ideación combinatoria.

En innovación corporativa, los mapas mentales sirven especialmente en la fase de "Descubrir": ayudan a mapear actores, tensiones y factores de un problema antes de intentar resolverlo.`,
          },
        ],
      },
    ],
  },
  {
    id: "mn",
    title: "Modelo de Negocios",
    color: "#C3151B",
    modules: [
      {
        id: "mn-m1",
        num: "1",
        title: "Módulo 1: Business Model Canvas",
        submodules: [
          {
            id: "mn-m1-1",
            num: "1.1",
            title: "Introducción al Business Model Canvas",
            type: "lectura",
            minutes: 10,
            content: `El Business Model Canvas (Osterwalder & Pigneur) es una plantilla de nueve bloques que describe cómo una organización crea, entrega y captura valor, en una sola vista.

Los nueve bloques son: Segmentos de clientes, Propuesta de valor, Canales, Relación con clientes, Fuentes de ingresos, Recursos clave, Actividades clave, Socios clave y Estructura de costos. Se recomienda empezar por Propuesta de valor y Segmentos de clientes, porque son los dos bloques que definen si el resto del modelo tiene sentido.`,
          },
          {
            id: "mn-m1-2",
            num: "1.2",
            title: "Segmentos de clientes y propuesta de valor",
            type: "lectura",
            minutes: 9,
            content: `Un segmento de clientes agrupa personas u organizaciones con necesidades, comportamientos o atributos similares. Un error frecuente es definir el segmento por datos demográficos en vez de por el trabajo que están tratando de resolver (jobs-to-be-done).

Una propuesta de valor sólida no enumera características del producto, enumera resultados concretos que le importan al cliente: no "clases grabadas con IA", sino "recuperar el tiempo que hoy pierdes buscando en qué clase se explicó tal concepto".`,
          },
          {
            id: "mn-m1-3",
            num: "1.3",
            title: "Canales, relaciones e ingresos",
            type: "lectura",
            minutes: 8,
            content: `Los Canales son los puntos de contacto por los que una empresa entrega su propuesta de valor: comunicación, distribución y venta.

La Relación con clientes define el tipo de vínculo con cada segmento: puede ir desde asistencia personal dedicada hasta comunidades de autoservicio, con implicaciones directas de costo.

Las Fuentes de ingresos pueden ser de pago único o recurrentes. Diseñar bien este bloque implica preguntar no solo cuánto cobrar, sino por qué el cliente pagaría por ese valor específico.`,
          },
          {
            id: "mn-m1-4",
            num: "1.4",
            title: "Recursos, actividades, socios y costos",
            type: "lectura",
            minutes: 8,
            content: `Los Recursos clave son los activos indispensables para que el modelo funcione. Las Actividades clave son las acciones más importantes que la organización debe ejecutar bien para que la propuesta de valor se cumpla.

Los Socios clave son la red de aliados que permiten optimizar el modelo o reducir riesgo. La Estructura de costos resume los costos más relevantes: distinguir entre modelos "impulsados por costo" e "impulsados por valor" ayuda a evaluar la coherencia del diseño del negocio.`,
          },
        ],
      },
    ],
  },
];

// ----------------------------------------------------------------
// 2b. ÍNDICES DERIVADOS de la biblioteca (no editar a mano)
// ----------------------------------------------------------------
// Lista plana de TODOS los submódulos (unidad mínima "vista/completada")
const SUBMODULE_INDEX = LIBRARY.flatMap((subject) =>
  subject.modules.flatMap((mod) =>
    mod.submodules.map((sm) => ({
      id: sm.id,
      title: sm.title,
      num: sm.num,
      type: sm.type,
      minutes: sm.minutes,
      moduleId: mod.id,
      moduleTitle: mod.title,
      subjectId: subject.id,
      subjectTitle: subject.title,
      color: subject.color,
    }))
  )
);
const SUBMODULE_BY_ID = Object.fromEntries(
  LIBRARY.flatMap((s) => s.modules.flatMap((m) => m.submodules.map((sm) => [sm.id, sm])))
);
// mantiene compatibilidad conceptual con la versión anterior (lecciones "planas")
const LESSON_INDEX = SUBMODULE_INDEX;

function findSubject(subjectId) {
  return LIBRARY.find((s) => s.id === subjectId);
}
function findModule(subjectId, moduleId) {
  return findSubject(subjectId)?.modules.find((m) => m.id === moduleId);
}
function totalSubmodulesOf(moduleOrSubject) {
  if (moduleOrSubject.submodules) return moduleOrSubject.submodules.length;
  if (moduleOrSubject.modules) return moduleOrSubject.modules.reduce((n, m) => n + m.submodules.length, 0);
  return 0;
}

// ----------------------------------------------------------------
// 3. "BASE DE DATOS" de usuarios (hardcodeada para la demo)
// ----------------------------------------------------------------
const STUDENTS = [
  { ...STUDENT_ROSTER[0], matricula: STUDENT_ROSTER[0].id, password: "Diplomado2026", courseIds: ["c-git"] },
  { ...STUDENT_ROSTER[1], matricula: STUDENT_ROSTER[1].id, password: "Diplomado2026", courseIds: ["c-git"] },
  { ...STUDENT_ROSTER[2], matricula: STUDENT_ROSTER[2].id, password: "Diplomado2026", courseIds: ["c-git"] },
];

const COURSES = {
  "c-git": { id: "c-git", name: "Gestión de Innovación Corporativa", subjectIds: ["dt", "gc", "mn"] },
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
    subjectIds: ["dt", "gc"], // responsable de Design Thinking y Gestión de la Creatividad
  },
  {
    id: "t2",
    name: "Marcelo Baque",
    email: "mbaque@i3lab.ec",
    password: "Docente2026",
    courseIds: ["c-git", "c-finanzas"],
    subjectIds: ["mn"], // responsable de Modelo de Negocios
  },
];

// ----------------------------------------------------------------
// 4. CALENDARIO — espejo de tareas/clases (simula datos de Canvas)
// ----------------------------------------------------------------
const EVENTS = [
  { id: "e1", date: "2026-08-01", time: "09:00", endTime: "11:00", title: "Clase: Introducción al Canvas", type: "clase", courseId: "c-git", subjectId: "mn", description: "Sesión en vivo: qué es el Business Model Canvas y por qué organiza el modelo de negocio en 9 bloques.", canvasUrl: "https://canvas.i3lab.ec/courses/git-2026/assignments/canvas-intro" },
  { id: "e2", date: "2026-08-05", time: "23:59", title: "Entrega: Ficha SCAMPER aplicada", type: "tarea", courseId: "c-git", subjectId: "gc", description: "Sube tu ficha SCAMPER aplicada a un producto o servicio de tu empresa.", canvasUrl: "https://canvas.i3lab.ec/courses/git-2026/assignments/scamper" },
  { id: "e3", date: "2026-08-06", time: "18:00", endTime: "19:30", title: "Clase: Liderazgo Ágil — Feedback continuo", type: "clase", courseId: "c-liderazgo", description: "Sesión en vivo del curso de Liderazgo Ágil para Equipos.", canvasUrl: "https://canvas.i3lab.ec/courses/liderazgo-2026/live" },
  { id: "e4", date: "2026-08-08", time: "09:00", endTime: "11:00", title: "Clase: Segmentos y propuesta de valor", type: "clase", courseId: "c-git", subjectId: "mn", description: "Cómo definir segmentos de clientes y una propuesta de valor concreta usando el Canvas.", canvasUrl: "https://canvas.i3lab.ec/courses/git-2026/assignments/segmentos" },
  { id: "e5", date: "2026-08-10", time: "23:59", title: "Entrega: Ficha de Segmentos de Clientes", type: "tarea", courseId: "c-git", subjectId: "mn", description: "Entrega individual: describe 2 segmentos de clientes reales de tu empresa.", canvasUrl: "https://canvas.i3lab.ec/courses/git-2026/assignments/ficha-segmentos" },
  { id: "e6", date: "2026-08-10", time: "08:00", title: "Lectura recomendada: Canales, relaciones e ingresos", type: "leccion", courseId: "c-git", subjectId: "mn", lessonId: "mn-m1-3", description: "Lee este tema en la Biblioteca Digital antes de la clase del sábado.", canvasUrl: null },
  { id: "e7", date: "2026-08-12", time: "20:00", title: "Quiz: Gestión de la Creatividad", type: "entrega", courseId: "c-git", subjectId: "gc", description: "Quiz individual de 10 preguntas sobre bloqueos creativos y SCAMPER.", canvasUrl: "https://canvas.i3lab.ec/courses/git-2026/quizzes/creatividad" },
  { id: "e8", date: "2026-08-13", time: "18:00", endTime: "19:30", title: "Clase: Finanzas — Flujo de caja para proyectos", type: "clase", courseId: "c-finanzas", description: "Sesión en vivo del curso de Finanzas para la Innovación.", canvasUrl: "https://canvas.i3lab.ec/courses/finanzas-2026/live" },
  { id: "e9", date: "2026-08-15", time: "09:00", endTime: "11:00", title: "Clase: Recursos, actividades y costos", type: "clase", courseId: "c-git", subjectId: "mn", description: "Cierre del Canvas: recursos clave, actividades clave, socios y estructura de costos.", canvasUrl: "https://canvas.i3lab.ec/courses/git-2026/assignments/recursos" },
  { id: "e10", date: "2026-08-20", time: "23:59", title: "Entrega: Proyecto final — Fase 1 (Diagnóstico)", type: "tarea", courseId: "c-git", description: "Primera entrega del proyecto final aplicando lo visto en las 3 materias.", canvasUrl: "https://canvas.i3lab.ec/courses/git-2026/assignments/proyecto-fase1" },
  { id: "e11", date: "2026-08-22", time: "09:00", endTime: "12:00", title: "Clase: Presentación de Canvas por equipos", type: "clase", courseId: "c-git", subjectId: "mn", description: "Cada equipo presenta su Business Model Canvas ante el grupo.", canvasUrl: "https://canvas.i3lab.ec/courses/git-2026/assignments/presentacion-canvas" },
  { id: "e12", date: "2026-08-29", time: "09:00", endTime: "12:00", title: "Taller integrador: Aplicación en tu empresa", type: "clase", courseId: "c-git", description: "Taller final del módulo con mentoría personalizada.", canvasUrl: "https://canvas.i3lab.ec/courses/git-2026/assignments/taller-final" },
];

const TODAY_STR = "2026-08-10";

// ----------------------------------------------------------------
// 5. IA — helpers de llamada, system prompts y "base de datos" de
//    dudas / progreso de estudiantes (persistente vía window.storage)
// ----------------------------------------------------------------
async function getExtraContent(subjectId) {
  try {
    const res = await window.storage.get(`extra-content:${subjectId}`, true);
    return res.value || "";
  } catch (e) {
    return "";
  }
}

async function buildTutorSystemPrompt() {
  const effLibrary = await getEffectiveLibrary();
  const knowledgeBlocks = await Promise.all(
    effLibrary.map(async (subject) => {
      const moduleBlocks = subject.modules
        .map((mod) => {
          const submods = mod.submodules
            .map((sm) => `### ${sm.num} ${sm.title}\n${sm.content}`)
            .join("\n\n");
          return `## ${mod.title}\n\n${submods}`;
        })
        .join("\n\n");
      const extra = await getExtraContent(subject.id);
      const extraBlock = extra ? `\n\n## Material adicional aportado por el docente\n${extra}` : "";
      return `# Materia: ${subject.title}\n\n${moduleBlocks}${extraBlock}`;
    })
  );
  const knowledge = knowledgeBlocks.join("\n\n---\n\n");

  return `Eres ${AI_NAME}, el tutor de inteligencia artificial de ${APP_NAME}, usado en el Diplomado en Gestión de Innovación Corporativa de i3lab (ESPOL). Hablas español, con un tono cercano, profesional y directo, sin relleno.

REGLAS:
1. Responde ÚNICAMENTE con base en el contenido del diplomado incluido abajo. Es tu única fuente de verdad.
2. Si la pregunta no está cubierta por este contenido, dilo con honestidad en vez de inventar.
3. Prefiere guiar paso a paso en vez de dar la respuesta completa de inmediato: haz una pregunta que ayude al estudiante a llegar a la idea por sí mismo, salvo que pida la respuesta directa. Es una preferencia validada con los estudiantes reales del diplomado.
4. Sé breve — los estudiantes son profesionales con poco tiempo.
5. Cuando cites un concepto, menciona de qué materia y módulo viene (ej. "Design Thinking, Módulo 2").

CONTENIDO DEL DIPLOMADO:

${knowledge}`;
}

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
        friendly = `Google descontinuó el modelo "${GEMINI_MODEL}". Abre src/App.jsx, busca la constante GEMINI_MODEL y cámbiala por un modelo vigente (revisa la lista actual en https://ai.google.dev/gemini-api/docs/models).`;
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
    const system = await buildClassifierPrompt();
    const raw = await callGemini({
      system,
      messages: [{ role: "user", content: text }],
    });
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (e) {
    return null;
  }
}

// --- "base de datos" de dudas por submódulo, compartida entre usuarios ---
const SEED_CONFUSION_LOG = {
  // sembrado de demo para la validación: se usa solo si aún no hay datos reales.
  // Con uso real del chat, esto se llena solo (ver classifyMessage + logConfusion),
  // sumando el id real del estudiante que preguntó.

  "dt-m2-1": ["2026001", "2026002", "2026003", "2026004", "2026005", "2026006", "2026007", "2026008", "2026009", "2026010", "2026011", "2026012", "2026013", "2026014", "2026015", "2026016", "2026017", "2026018", "2026019", "2026020", "2026021", "2026022", "2026023", "2026024", "2026025", "2026026", "2026027", "2026028", "2026029", "2026030", "2026031", "2026032", "2026033", "2026034", "2026035", "2026036", "2026037", "2026038", "2026039", "2026040", "2026041", "2026042", "2026043", "2026044", "2026045", "2026046", "2026047", "2026048"], // Las 4 fases del Doble Diamante — 48/50 (96%)
  "dt-m4-2": ["2026004", "2026005", "2026006", "2026007", "2026008"], // Técnicas de divergencia (SCAMPER etc.) — 5/50 (10%)
  "gc-m1-2": ["2026011", "2026012", "2026013"], // SCAMPER (Gestión de la Creatividad) — justo en el umbral, 3/50 (6%)
  "mn-m1-1": ["2026021"], // Intro Canvas — 1/50: debe quedar filtrado
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

// stats por submódulo, con la lista de ids real (para poder mostrar nombres al hacer clic)
function computeStats(log, subjectIds, index = SUBMODULE_INDEX) {
  return index.filter((l) => subjectIds.includes(l.subjectId))
    .map((l) => {
      const ids = log[l.id] || [];
      return { ...l, ids, count: ids.length, pct: Math.round((ids.length / TOTAL_STUDENTS) * 100) };
    })
    .filter((s) => s.count >= CONFUSION_THRESHOLD)
    .sort((a, b) => b.count - a.count);
}

async function getTeachingSuggestions(stats) {
  const prompt = `Estos son los temas donde más estudiantes muestran dificultad en el Diplomado de Gestión de Innovación Corporativa (sobre una clase de referencia de ${TOTAL_STUDENTS} estudiantes):
${stats.map((s) => `- ${s.title} (${s.subjectTitle} · ${s.moduleTitle}): ${s.count}/${TOTAL_STUDENTS} estudiantes (${s.pct}%) mostraron señales de confusión al preguntarle al tutor de IA.`).join("\n")}

Dame 3 a 4 sugerencias concretas y accionables para reforzar estos temas en la próxima clase presencial. Sé breve y específico, en viñetas, sin introducción.`;
  return callGemini({
    system:
      "Eres un asesor pedagógico para docentes de un diplomado ejecutivo de innovación corporativa. Respondes en español, de forma breve, concreta y accionable.",
    messages: [{ role: "user", content: prompt }],
  });
}

// sugerencia de IA para UN solo tema específico (botón ✨ junto a cada métrica)
async function explainTopicBetter(stat) {
  const prompt = `Un ${stat.pct}% de los estudiantes (${stat.count}/${TOTAL_STUDENTS}) tiene dificultad para entender el tema "${stat.title}", dentro de "${stat.moduleTitle}" (materia: ${stat.subjectTitle}).

Contenido actual de ese tema, tal como lo tienen en la Biblioteca Digital:
"""
${getSubmoduleContent(stat.id).slice(0, 700)}
"""

Dame una forma más clara y concreta de explicar específicamente ESTE tema en la próxima clase presencial — con una analogía o ejemplo práctico incluido. Máximo 6 líneas, directo, sin introducción ni despedida.`;
  return callGemini({
    system:
      "Eres un asesor pedagógico experto en Design Thinking, creatividad organizacional e innovación corporativa. Respondes en español, breve y accionable.",
    messages: [{ role: "user", content: prompt }],
  });
}

// ----------------------------------------------------------------
// 6. PROGRESO — qué submódulos ya "vio" cada estudiante (lectura,
//    video, o porque le preguntó al tutor de IA sobre ese tema)
// ----------------------------------------------------------------
async function getProgress(studentId) {
  try {
    const res = await window.storage.get(`progress:${studentId}`, true);
    return JSON.parse(res.value);
  } catch (e) {
    return {};
  }
}

async function markProgress(studentId, submoduleId, via) {
  if (!submoduleId || !SUBMODULE_BY_ID[submoduleId]) return;
  try {
    const current = await getProgress(studentId);
    const prev = current[submoduleId] || { via: [] };
    const viaSet = new Set(prev.via || []);
    viaSet.add(via);
    current[submoduleId] = { via: Array.from(viaSet), ts: Date.now() };
    await window.storage.set(`progress:${studentId}`, JSON.stringify(current), true);
  } catch (e) {
    /* no bloquear la experiencia del estudiante si falla el guardado */
  }
}

// % de un módulo (submódulos vistos / total del módulo)
function moduleCompletion(progress, mod) {
  const total = mod.submodules.length;
  if (total === 0) return 0;
  const done = mod.submodules.filter((sm) => progress[sm.id]).length;
  return Math.round((done / total) * 100);
}
// % de una materia completa (todos los módulos)
function subjectCompletion(progress, subject) {
  const total = totalSubmodulesOf(subject);
  if (total === 0) return 0;
  const done = subject.modules.reduce(
    (n, m) => n + m.submodules.filter((sm) => progress[sm.id]).length,
    0
  );
  return Math.round((done / total) * 100);
}

// ----------------------------------------------------------------
// 7. ALMACÉN DE VIDEOS SUBIDOS POR EL DOCENTE (IndexedDB)
// ----------------------------------------------------------------
// ¿Por qué IndexedDB y no window.storage/localStorage? localStorage
// tiene un límite de unos 5-10 MB en total por navegador — un solo
// video de un par de minutos ya lo desborda. IndexedDB permite
// guardar archivos binarios (Blob) con cupos mucho más grandes
// (cientos de MB a varios GB según el navegador). Sigue siendo
// almacenamiento LOCAL a este navegador (no hay backend real), así
// que un video subido en la laptop del docente no aparece en el
// celular de un estudiante — para eso hace falta un backend propio
// con almacenamiento de archivos (S3, Cloud Storage, etc).
const VIDEO_DB_NAME = "magici3lab-videos";
const VIDEO_STORE_NAME = "videos";

function openVideoDB() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("Tu navegador no soporta almacenamiento de video local (IndexedDB)."));
      return;
    }
    const req = indexedDB.open(VIDEO_DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(VIDEO_STORE_NAME)) {
        db.createObjectStore(VIDEO_STORE_NAME, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error("No se pudo abrir el almacenamiento de video."));
  });
}

async function saveVideoBlob(id, blob, meta) {
  const db = await openVideoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(VIDEO_STORE_NAME, "readwrite");
    tx.objectStore(VIDEO_STORE_NAME).put({ id, blob, ...meta });
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error || new Error("No se pudo guardar el video."));
  });
}

async function getVideoBlob(id) {
  const db = await openVideoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(VIDEO_STORE_NAME, "readonly");
    const req = tx.objectStore(VIDEO_STORE_NAME).get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error || new Error("No se pudo leer el video."));
  });
}

async function deleteVideoBlob(id) {
  const db = await openVideoDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(VIDEO_STORE_NAME, "readwrite");
    tx.objectStore(VIDEO_STORE_NAME).delete(id);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error || new Error("No se pudo borrar el video."));
  });
}

// Lee la duración de un archivo de video ANTES de aceptarlo (para
// aplicar el límite de 10 minutos) usando un <video> oculto en memoria.
function readVideoDuration(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () => {
      const duration = v.duration;
      URL.revokeObjectURL(url);
      resolve(duration);
    };
    v.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer este archivo de video. ¿Seguro que es un .mp4 válido?"));
    };
    v.src = url;
  });
}

function formatMinSec(totalSeconds) {
  if (!totalSeconds && totalSeconds !== 0) return "";
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
function formatMB(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ----------------------------------------------------------------
// 8. "BASE DE DATOS" de estructura editable por el docente
//    (reordenar módulos/submódulos, mover submódulos, agregar
//    submódulos nuevos con video propio). Vive en window.storage
//    como una capa de "parches" sobre la LIBRARY base en memoria.
// ----------------------------------------------------------------
async function getCustomSubmodules(subjectId) {
  try {
    const res = await window.storage.get(`custom-submodules:${subjectId}`, true);
    return JSON.parse(res.value);
  } catch (e) {
    return [];
  }
}
async function addCustomSubmodule(subjectId, moduleId, submodule) {
  const list = await getCustomSubmodules(subjectId);
  list.push({ ...submodule, moduleId });
  await window.storage.set(`custom-submodules:${subjectId}`, JSON.stringify(list), true);
}
async function deleteCustomSubmodule(subjectId, submoduleId) {
  const list = await getCustomSubmodules(subjectId);
  const next = list.filter((s) => s.id !== submoduleId);
  await window.storage.set(`custom-submodules:${subjectId}`, JSON.stringify(next), true);
  await deleteVideoBlob(submoduleId).catch(() => {});
}

// orden personalizado: { subjectId: { moduleOrder: [ids], submoduleOrderByModule: { moduleId: [ids] } } }
async function getCustomOrder(subjectId) {
  try {
    const res = await window.storage.get(`custom-order:${subjectId}`, true);
    return JSON.parse(res.value);
  } catch (e) {
    return { moduleOrder: [], submoduleOrderByModule: {} };
  }
}
async function saveCustomOrder(subjectId, order) {
  await window.storage.set(`custom-order:${subjectId}`, JSON.stringify(order), true);
}

// override: { [submoduleId]: newModuleId } — para "mover" un submódulo a otro módulo
async function getModuleOverride(subjectId) {
  try {
    const res = await window.storage.get(`module-override:${subjectId}`, true);
    return JSON.parse(res.value);
  } catch (e) {
    return {};
  }
}
async function saveModuleOverride(subjectId, override) {
  await window.storage.set(`module-override:${subjectId}`, JSON.stringify(override), true);
}
async function moveSubmoduleToModule(subjectId, submoduleId, newModuleId) {
  const override = await getModuleOverride(subjectId);
  override[submoduleId] = newModuleId;
  await saveModuleOverride(subjectId, override);
}

// ----------------------------------------------------------------
// 8b. LIBRERÍA "EFECTIVA" — combina la LIBRARY base con lo que el
//     docente reordenó/agregó desde el panel. La usan tanto la UI
//     como el propio tutor de IA (para que aprenda lo nuevo) y el
//     clasificador (para poder ligar dudas a temas nuevos).
// ----------------------------------------------------------------
function mergeSubjectWithCustom(subject, order, customSubs, moduleOverride = {}) {
  // agrupa TODOS los submódulos (base + agregados) por su módulo "efectivo":
  // el módulo original, salvo que el docente lo haya movido a otro (moduleOverride)
  const byModule = {};
  subject.modules.forEach((m) => {
    m.submodules.forEach((sm) => {
      const effModuleId = moduleOverride[sm.id] || m.id;
      if (!byModule[effModuleId]) byModule[effModuleId] = [];
      byModule[effModuleId].push(sm);
    });
  });
  customSubs.forEach((cs) => {
    const effModuleId = moduleOverride[cs.id] || cs.moduleId;
    if (!byModule[effModuleId]) byModule[effModuleId] = [];
    byModule[effModuleId].push(cs);
  });
  let modules = subject.modules.map((m) => {
    let submods = byModule[m.id] || [];
    const subOrder = order?.submoduleOrderByModule?.[m.id];
    if (subOrder && subOrder.length) {
      submods = [...submods].sort((a, b) => {
        const ia = subOrder.indexOf(a.id);
        const ib = subOrder.indexOf(b.id);
        return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
      });
    }
    return { ...m, submodules: submods };
  });
  if (order?.moduleOrder?.length) {
    modules = [...modules].sort((a, b) => {
      const ia = order.moduleOrder.indexOf(a.id);
      const ib = order.moduleOrder.indexOf(b.id);
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    });
  }
  return { ...subject, modules };
}

let EFFECTIVE_SUBMODULE_CACHE = {}; // se llena en cada getEffectiveLibrary(); lectura "best effort" fuera de React

async function getEffectiveLibrary() {
  const merged = await Promise.all(
    LIBRARY.map(async (subject) => {
      const [order, customSubs, override] = await Promise.all([
        getCustomOrder(subject.id),
        getCustomSubmodules(subject.id),
        getModuleOverride(subject.id),
      ]);
      return mergeSubjectWithCustom(subject, order, customSubs, override);
    })
  );
  const cache = {};
  merged.forEach((subject) =>
    subject.modules.forEach((m) => m.submodules.forEach((sm) => (cache[sm.id] = sm)))
  );
  EFFECTIVE_SUBMODULE_CACHE = cache;
  return merged;
}

function getEffectiveSubmoduleIndexFlat(effLibrary) {
  return effLibrary.flatMap((subject) =>
    subject.modules.flatMap((mod) =>
      mod.submodules.map((sm) => ({
        id: sm.id,
        title: sm.title,
        num: sm.num,
        subjectId: subject.id,
        subjectTitle: subject.title,
        moduleId: mod.id,
        moduleTitle: mod.title,
      }))
    )
  );
}

function getSubmoduleContent(id) {
  return SUBMODULE_BY_ID[id]?.content ?? EFFECTIVE_SUBMODULE_CACHE[id]?.content ?? "";
}

async function buildClassifierPrompt() {
  const effLibrary = await getEffectiveLibrary();
  const idx = getEffectiveSubmoduleIndexFlat(effLibrary);
  return `Eres un clasificador silencioso. Dado el mensaje de un estudiante a un tutor de un diplomado, responde SOLO con JSON válido, sin texto adicional y sin backticks, con este formato exacto:
{"lessonId": "<id del submódulo más relacionado de la lista, o null si ninguno aplica>", "confusion": true|false}

"confusion" es true si el mensaje sugiere que el estudiante no entiende, está confundido, pide que le expliquen de nuevo, o repite una duda. Es false si es una pregunta exploratoria normal, un saludo, o una instrucción (como pedir un resumen o quiz) — pero en ambos casos, si el mensaje trata claramente sobre alguno de los temas de la lista, igual debes devolver su id en "lessonId".

Lista de submódulos válidos:
${idx.map((l) => `- ${l.id}: ${l.title} (${l.subjectTitle} · ${l.moduleTitle})`).join("\n")}`;
}

// ----------------------------------------------------------------
// 9. Helpers de fecha / calendario
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
// 10. UI atoms
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
      <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color, transition: "width .25s" }} />
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
          {APP_NAME}
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

// Reproductor de video embebido (sin apps externas) — usa Blob de
// IndexedDB si el video fue subido por el docente desde la app, o
// el archivo estático de /public/videos si es un video precargado.
function VideoPlayer({ video }) {
  const [src, setSrc] = useState(video.src || null);
  const [loading, setLoading] = useState(!video.src);
  const [error, setError] = useState("");
  const objectUrlRef = useRef(null);

  useEffect(() => {
    let alive = true;
    if (video.src) {
      setSrc(video.src);
      setLoading(false);
      return;
    }
    // video subido por el docente: vive como Blob en IndexedDB
    setLoading(true);
    getVideoBlob(video.id)
      .then((rec) => {
        if (!alive) return;
        if (!rec) {
          setError("Este video ya no está disponible en este navegador.");
          setLoading(false);
          return;
        }
        const url = URL.createObjectURL(rec.blob);
        objectUrlRef.current = url;
        setSrc(url);
        setLoading(false);
      })
      .catch((e) => {
        if (alive) {
          setError(e.message || "No se pudo cargar el video.");
          setLoading(false);
        }
      });
    return () => {
      alive = false;
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, [video.id, video.src]);

  return (
    <div className="rounded-xl overflow-hidden mb-3" style={{ backgroundColor: "#000" }}>
      {video.title && (
        <div className="flex items-center gap-1.5 px-3 py-2" style={{ backgroundColor: "#111" }}>
          <Film size={12} color="#fff" />
          <span style={{ fontSize: 11, color: "#fff", fontWeight: 600 }}>{video.title}</span>
        </div>
      )}
      {loading && (
        <div className="flex items-center justify-center gap-2" style={{ height: 180 }}>
          <Loader2 size={16} color="#fff" className="animate-spin" />
          <span style={{ fontSize: 11.5, color: "#fff" }}>Cargando video...</span>
        </div>
      )}
      {!loading && error && (
        <div className="flex items-center justify-center px-4 text-center" style={{ height: 120 }}>
          <span style={{ fontSize: 11.5, color: "#fff" }}>{error}</span>
        </div>
      )}
      {!loading && !error && src && (
        <video
          src={src}
          controls
          playsInline
          preload="metadata"
          style={{ width: "100%", display: "block", maxHeight: 220, backgroundColor: "#000" }}
        />
      )}
    </div>
  );
}

// ----------------------------------------------------------------
// 11. LOGIN
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
          {APP_NAME}
        </h1>
        <p className="text-center mt-1" style={{ fontSize: 12.5, color: COLORS.textMuted, lineHeight: 1.4 }}>
          Tu tutor de IA {AI_NAME} para el Diplomado en
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
        Prototipo funcional · v0.5 · i3lab ESPOL
      </p>
    </div>
  );
}

// ----------------------------------------------------------------
// 12. BIENVENIDA — pantalla intermedia justo después del login
// ----------------------------------------------------------------
function WelcomeScreen({ user, role, onContinue }) {
  const courses = (user.courseIds || []).map((id) => COURSES[id]).filter(Boolean);
  return (
    <div className="flex flex-col h-full px-6 py-8" style={{ backgroundColor: COLORS.bg }}>
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div
          className="flex items-center justify-center rounded-2xl mb-5"
          style={{ width: 64, height: 64, backgroundColor: COLORS.accent }}
        >
          <Sparkles color="#fff" size={30} />
        </div>
        <p style={{ fontSize: 12.5, color: COLORS.textMuted }}>Bienvenido a</p>
        <h1 className="font-bold" style={{ fontSize: 26, color: COLORS.text, marginTop: 2 }}>
          {APP_NAME}
        </h1>
        <p style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 8, lineHeight: 1.5, maxWidth: 260 }}>
          Hola {user.name.split(" ")[0]}, tu tutor de IA {AI_NAME} y tu biblioteca digital ya están listos.
        </p>
      </div>

      <div className="mb-5">
        <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 8 }}>
          {role === "student" ? "Estás cursando" : "Tus cursos"}
        </p>
        {courses.length === 0 && (
          <p style={{ fontSize: 12, color: COLORS.textFaint }}>Aún no tienes cursos asignados.</p>
        )}
        {courses.map((c) => (
          <div key={c.id} className="rounded-2xl p-3.5 mb-2.5 flex items-center gap-3" style={cardStyle}>
            <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 36, height: 36, backgroundColor: COLORS.accentSoft, color: COLORS.accent }}>
              <GraduationCap size={16} />
            </div>
            <div className="flex-1">
              <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{c.name}</p>
              {c.subjectIds && (
                <p style={{ fontSize: 10.5, color: COLORS.textFaint }}>
                  {c.subjectIds.map((sid) => findSubject(sid)?.title).join(" · ")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onContinue}
        className="w-full flex items-center justify-center gap-2 rounded-xl font-semibold"
        style={{ height: 46, backgroundColor: COLORS.accent, color: "#fff", fontSize: 14 }}
      >
        Entrar <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ----------------------------------------------------------------
// 13. CALENDARIO (compartido entre estudiante y docente)
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

          {selectedEvent.lessonId && onOpenLesson && (
            <button
              onClick={() => onOpenLesson(selectedEvent.subjectId, selectedEvent.lessonId)}
              className="flex items-center justify-center gap-2 rounded-xl font-semibold mt-6 w-full"
              style={{ height: 46, backgroundColor: COLORS.bgAlt, border: `1px solid ${COLORS.border}`, color: COLORS.text, fontSize: 13.5 }}
            >
              <BookOpen size={14} /> Ver en la Biblioteca Digital
            </button>
          )}

          {selectedEvent.canvasUrl && (
            <>
              <a
                href={selectedEvent.canvasUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl font-semibold mt-3"
                style={{ height: 46, backgroundColor: COLORS.accent, color: "#fff", fontSize: 13.5, textDecoration: "none" }}
              >
                Ver en Canvas i3lab <ExternalLink size={14} />
              </a>
              <p style={{ fontSize: 11, color: COLORS.textFaint, marginTop: 8, lineHeight: 1.4 }}>
                Se abre en tu navegador. {APP_NAME} complementa Canvas — no lo reemplaza; la entrega oficial siempre se hace ahí.
              </p>
            </>
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
          <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, textTransform: "capitalize" }}>
            {formatLongDate(selectedDateStr)}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {dayEvents.map((ev) => {
            const meta = EVENT_META(ev.type);
            return (
              <button
                key={ev.id}
                onClick={() => {
                  setSelectedEvent(ev);
                  setView("task");
                }}
                className="w-full text-left rounded-2xl p-3.5 mb-2.5 flex items-start gap-3"
                style={cardStyle}
              >
                <div className="rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ width: 30, height: 30, backgroundColor: `${meta.color}1A`, color: meta.color }}>
                  <TypeIcon type={ev.type} size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.text, lineHeight: 1.3 }}>{ev.title}</p>
                  <p style={{ fontSize: 10.5, color: COLORS.textFaint, marginTop: 2 }}>
                    {ev.time}
                    {ev.endTime ? ` – ${ev.endTime}` : ""} · {meta.label}
                  </p>
                </div>
                <ChevronRight size={15} color={COLORS.textFaint} />
              </button>
            );
          })}
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
// 14. ESTUDIANTE — Home, Biblioteca, Lección, Chat, Perfil
// ----------------------------------------------------------------
function StudentHome({ user, setScreen, openSubmodule, effLibrary }) {
  const nextEvent = useMemo(() => {
    const upcoming = EVENTS.filter((e) => e.courseId === "c-git" && e.date >= TODAY_STR);
    upcoming.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    return upcoming[0];
  }, []);

  const [progress, setProgress] = useState({});
  useEffect(() => {
    let alive = true;
    getProgress(user.id).then((p) => alive && setProgress(p));
    return () => { alive = false; };
  }, [user.id]);

  const subjects = effLibrary || LIBRARY;

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-5 pb-2">
        <p style={{ fontSize: 12, color: COLORS.textFaint }}>Bienvenido,</p>
        <h1 style={{ fontSize: 19, fontWeight: 700, color: COLORS.text }}>{user.name}</h1>
        <p style={{ fontSize: 11.5, color: COLORS.textMuted }}>Diplomado en Gestión de Innovación Corporativa</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <button
          onClick={() => setScreen("chat")}
          className="w-full text-left rounded-2xl p-4 mb-4"
          style={cardStyle}
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} color={COLORS.accent} />
            <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>Pregúntale a {AI_NAME}</span>
          </div>
          <p style={{ fontSize: 12.5, color: COLORS.textMuted, lineHeight: 1.45 }}>
            ¡Hola {user.name.split(" ")[0]}! Hoy podemos repasar el Doble Diamante, resolver dudas de Design Thinking
            o revisar el Canvas de Modelo de Negocios. ¿Por dónde empezamos?
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

        {subjects.map((subject, i) => {
          const pct = subjectCompletion(progress, subject);
          const total = totalSubmodulesOf(subject);
          return (
            <button
              key={subject.id}
              onClick={() => openSubmodule(subject.id, null, null)}
              className="w-full text-left rounded-2xl p-4 mb-3 flex items-center gap-3"
              style={cardStyle}
            >
              <div
                className="rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ width: 36, height: 36, backgroundColor: `${subject.color}1A`, color: subject.color, fontSize: 12.5, fontWeight: 800 }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 13.5, fontWeight: 600, color: COLORS.text }}>{subject.title}</p>
                <p style={{ fontSize: 10.5, color: COLORS.textFaint, marginBottom: 5 }}>
                  {subject.modules.length} módulos · {total} temas
                </p>
                <ProgressBar value={pct} color={subject.color} />
              </div>
              <span style={{ fontSize: 11.5, color: COLORS.textMuted, fontWeight: 600 }}>{pct}%</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function LibraryScreen({ openSubmodule, effLibrary, progress }) {
  const subjects = effLibrary || LIBRARY;
  const [expandedSubject, setExpandedSubject] = useState(subjects[0]?.id);
  const [expandedModule, setExpandedModule] = useState(null);

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader eyebrow="Biblioteca" title="Biblioteca Digital" subtitle="Contenido del diplomado, por materia y módulo" />
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {subjects.map((subject) => {
          const isOpen = expandedSubject === subject.id;
          const pct = subjectCompletion(progress || {}, subject);
          return (
            <div key={subject.id} className="rounded-2xl mb-3 overflow-hidden" style={cardStyle}>
              <button
                onClick={() => {
                  setExpandedSubject(isOpen ? null : subject.id);
                  setExpandedModule(null);
                }}
                className="w-full flex items-center gap-3 p-4"
              >
                <div
                  className="rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ width: 34, height: 34, backgroundColor: `${subject.color}1A`, color: subject.color }}
                >
                  <BookOpen size={16} />
                </div>
                <div className="flex-1 text-left">
                  <p style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.text }}>{subject.title}</p>
                  <p style={{ fontSize: 10.5, color: COLORS.textFaint }}>
                    {subject.modules.length} módulos · {pct}% completado
                  </p>
                </div>
                <ChevronRight size={15} color={COLORS.textFaint} style={{ transform: isOpen ? "rotate(90deg)" : "none", transition: "transform .15s" }} />
              </button>
              {isOpen && (
                <div style={{ borderTop: `1px solid ${COLORS.border}` }}>
                  {subject.modules.map((mod) => {
                    const modOpen = expandedModule === mod.id;
                    const modPct = moduleCompletion(progress || {}, mod);
                    return (
                      <div key={mod.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                        <button
                          onClick={() => setExpandedModule(modOpen ? null : mod.id)}
                          className="w-full flex items-center gap-2.5 px-4 py-3"
                          style={{ backgroundColor: COLORS.bgAlt }}
                        >
                          <span style={{ fontSize: 11.5, fontWeight: 700, color: subject.color, flexShrink: 0 }}>{mod.num}</span>
                          <span className="flex-1 text-left" style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}>
                            {mod.title.replace(/^Módulo \d+:\s*/, "")}
                          </span>
                          <span style={{ fontSize: 10, color: COLORS.textFaint, fontWeight: 600 }}>{modPct}%</span>
                          <ChevronDown size={13} color={COLORS.textFaint} style={{ transform: modOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
                        </button>
                        {modOpen && (
                          <div>
                            {mod.submodules.map((sm) => {
                              const done = !!(progress || {})[sm.id];
                              return (
                                <button
                                  key={sm.id}
                                  onClick={() => openSubmodule(subject.id, mod.id, sm.id)}
                                  className="w-full flex items-center gap-3 px-4 py-3"
                                  style={{ borderTop: `1px solid ${COLORS.border}` }}
                                >
                                  <div style={{ color: subject.color, flexShrink: 0 }}>
                                    {sm.videos?.length ? <Video size={14} /> : <TypeIcon type={sm.type} size={14} />}
                                  </div>
                                  <span className="flex-1 text-left" style={{ fontSize: 12.5, color: COLORS.text }}>
                                    <span style={{ color: COLORS.textFaint, fontWeight: 600 }}>{sm.num}</span> {sm.title}
                                  </span>
                                  {done ? (
                                    <CircleCheck size={14} color={COLORS.accent} />
                                  ) : (
                                    <span style={{ fontSize: 10.5, color: COLORS.textFaint }}>{sm.minutes} min</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LessonScreen({ subject, mod, submodule, user, onBack, askTutor }) {
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
  }, [submodule.id]);

  // marca este submódulo como "visto" apenas el estudiante lo abre
  // (lectura o video — ambos cuentan igual para el % de avance)
  useEffect(() => {
    if (user?.id) markProgress(user.id, submodule.id, submodule.videos?.length ? "video" : "lectura");
  }, [submodule.id, user?.id]);

  async function runAction(kind) {
    setAiPanel(kind);
    setLoading(true);
    setAiText("");
    const instruction =
      kind === "resumen"
        ? `Genera un resumen breve (máximo 6 líneas, en viñetas) del tema "${submodule.title}" (${mod.title}, materia: ${subject.title}).`
        : `Genera 4 preguntas de repaso tipo quiz (con su respuesta correcta debajo) sobre "${submodule.title}" (${mod.title}, materia: ${subject.title}). Sé breve.`;
    try {
      const text = await callGemini({ system: await buildTutorSystemPrompt(), messages: [{ role: "user", content: instruction }] });
      setAiText(text);
      if (user?.id) markProgress(user.id, submodule.id, "resumen-ia");
    } catch (e) {
      setAiText(e.message || "No se pudo generar el contenido. Intenta de nuevo.");
    }
    setLoading(false);
  }

  async function generatePodcast() {
    setAiPanel("podcast");
    setPodcastStatus("writing");
    setPodcastError("");
    const instruction = `Escribe el guion de un mini-podcast educativo de 1 solo narrador (sin diálogo entre dos personas, sin acotaciones de escena) sobre el tema "${submodule.title}" (${mod.title}, materia: ${subject.title}). Tono conversacional, cercano, como si se lo explicaras a un profesional en su carro camino al trabajo. Entre 130 y 180 palabras. No uses encabezados, viñetas ni markdown — solo el texto a leer en voz alta.`;
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
          <p style={{ fontSize: 10.5, color: subject.color, fontWeight: 700 }}>{subject.title} · {mod.title}</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{submodule.num} {submodule.title}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {submodule.videos?.map((v) => <VideoPlayer key={v.id} video={v} />)}

        {submodule.content && (
          <p style={{ fontSize: 13.5, lineHeight: 1.65, color: COLORS.text, whiteSpace: "pre-line" }}>{submodule.content}</p>
        )}

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
        <button onClick={() => askTutor(subject, mod, submodule)} className="w-full flex items-center justify-center gap-2 rounded-xl font-semibold" style={{ height: 42, backgroundColor: COLORS.accent, color: "#fff", fontSize: 13 }}>
          <MessageCircle size={14} /> Preguntarle a {AI_NAME} sobre esto
        </button>
      </div>
    </div>
  );
}

function ChatScreen({ user, prefillContext, clearPrefill }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: `¡Hola ${user.name.split(" ")[0]}! Soy ${AI_NAME}. Puedo ayudarte con Design Thinking, Gestión de la Creatividad o Modelo de Negocios — todo con base en el contenido del diplomado. ¿Qué revisamos?` },
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

    // Clasificación silenciosa para el panel del docente — no bloquea la UI del estudiante.
    // Si el mensaje trata sobre un tema existente, cuenta como "visto" (progreso); si además
    // hay señales de confusión, se suma al registro de dudas del docente.
    classifyMessage(content).then((result) => {
      if (result && result.lessonId) {
        markProgress(user.id, result.lessonId, "chat");
        if (result.confusion) logConfusion(result.lessonId, user.id);
      }
    });
  }

  const suggestions = ["¿Cómo aplico el Canvas en una startup?", "Hazme un quiz de Design Thinking", "Explícame el Doble Diamante"];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-5 pt-5 pb-3" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
        <div className="rounded-full flex items-center justify-center" style={{ width: 30, height: 30, backgroundColor: COLORS.accent }}>
          <Sparkles size={14} color="#fff" />
        </div>
        <div>
          <p style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.text }}>{AI_NAME}</p>
          <p style={{ fontSize: 10.5, color: COLORS.textFaint }}>Tutor de IA · {APP_NAME}</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        {messages.map((m, i) => (
          <div key={i} className="flex mb-3" style={{ justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div
              className="rounded-2xl px-3.5 py-2.5"
              style={{
                maxWidth: "82%",
                fontSize: 13,
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
// 15. DOCENTE — Home
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
      const stats = computeStats(log, teacher.subjectIds);
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
                  A tu cargo: {teacher.subjectIds.map((sid) => findSubject(sid)?.title).join(", ")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// 16. DOCENTE — Material: estructura editable + subida de video +
//     material adicional de texto libre (para el conocimiento de la IA)
// ----------------------------------------------------------------
function AddSubmoduleForm({ subjectId, moduleId, onDone, onCancel }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [duration, setDuration] = useState(null);
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  async function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setError("");
    if (!f.type.startsWith("video/")) {
      setError("Selecciona un archivo de video (.mp4 recomendado).");
      return;
    }
    if (f.size > MAX_VIDEO_MB * 1024 * 1024) {
      setError(`El archivo pesa ${formatMB(f.size)} — el máximo es ${MAX_VIDEO_MB} MB. Comprime el video antes de subirlo.`);
      return;
    }
    setChecking(true);
    try {
      const dur = await readVideoDuration(f);
      if (dur > MAX_VIDEO_SECONDS) {
        setError(`El video dura ${formatMinSec(dur)} — el máximo permitido es 10:00. Recorta o divide el video antes de subirlo.`);
        setChecking(false);
        return;
      }
      setDuration(dur);
      setFile(f);
    } catch (e2) {
      setError(e2.message || "No se pudo leer el video.");
    }
    setChecking(false);
  }

  async function handleSubmit() {
    if (!title.trim()) {
      setError("Ponle un título al tema.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const id = `custom-${subjectId}-${Date.now()}`;
      let videos = [];
      if (file) {
        await saveVideoBlob(id, file, { title: title.trim(), size: file.size, duration });
        videos = [{ id, title: title.trim() }];
      }
      await addCustomSubmodule(subjectId, moduleId, {
        id,
        num: "+",
        title: title.trim(),
        type: file ? "video" : "lectura",
        minutes: file ? Math.max(1, Math.round(duration / 60)) : 5,
        content: content.trim(),
        videos,
      });
      onDone();
    } catch (e3) {
      setError(e3.message || "No se pudo guardar el tema.");
    }
    setSaving(false);
  }

  return (
    <div className="rounded-2xl p-4 mb-3" style={{ backgroundColor: COLORS.bgAlt, border: `1px solid ${COLORS.border}` }}>
      <p style={{ fontSize: 11.5, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>Nuevo tema en este módulo</p>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título del tema"
        className="w-full rounded-lg px-3 mb-2"
        style={{ height: 38, fontSize: 12.5, border: `1px solid ${COLORS.border}`, backgroundColor: "#fff", outline: "none" }}
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Descripción o contenido de texto (opcional, pero ayuda a que la IA lo entienda mejor)"
        className="w-full rounded-lg p-3 mb-2"
        style={{ minHeight: 70, fontSize: 12, border: `1px solid ${COLORS.border}`, backgroundColor: "#fff", outline: "none", resize: "vertical", fontFamily: "inherit" }}
      />

      <input ref={fileInputRef} type="file" accept="video/mp4,video/*" onChange={handleFile} className="hidden" />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={checking}
        className="w-full flex items-center justify-center gap-1.5 rounded-lg mb-2"
        style={{ height: 36, fontSize: 11.5, color: COLORS.text, backgroundColor: "#fff", border: `1px solid ${COLORS.border}` }}
      >
        {checking ? <Loader2 size={13} className="animate-spin" /> : <Video size={13} />}
        {checking ? "Revisando video..." : file ? `Video: ${file.name.slice(0, 24)}${file.name.length > 24 ? "…" : ""} (${formatMinSec(duration)})` : "Adjuntar video (opcional, máx. 10:00)"}
      </button>

      {error && (
        <div className="flex items-start gap-1.5 mb-2">
          <AlertTriangle size={12} color={COLORS.accent} style={{ marginTop: 1, flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: COLORS.accent, lineHeight: 1.4 }}>{error}</span>
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 rounded-lg" style={{ height: 36, fontSize: 12, color: COLORS.textMuted, backgroundColor: "#fff", border: `1px solid ${COLORS.border}` }}>
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving || checking}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg font-semibold"
          style={{ height: 36, fontSize: 12, color: "#fff", backgroundColor: COLORS.accent, opacity: saving ? 0.7 : 1 }}
        >
          {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
          Guardar tema
        </button>
      </div>
    </div>
  );
}

function TeacherStructure({ subject, refreshKey, bumpRefresh }) {
  const [order, setOrder] = useState({ moduleOrder: [], submoduleOrderByModule: {} });
  const [customSubs, setCustomSubs] = useState([]);
  const [override, setOverride] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState(null);
  const [addingToModule, setAddingToModule] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([getCustomOrder(subject.id), getCustomSubmodules(subject.id), getModuleOverride(subject.id)]).then(
      ([o, c, ov]) => {
        if (!alive) return;
        setOrder(o);
        setCustomSubs(c);
        setOverride(ov);
        setLoading(false);
      }
    );
    return () => { alive = false; };
  }, [subject.id, refreshKey]);

  const merged = useMemo(() => mergeSubjectWithCustom(subject, order, customSubs, override), [subject, order, customSubs, override]);

  async function moveModule(index, dir) {
    const ids = merged.modules.map((m) => m.id);
    const j = index + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[index], ids[j]] = [ids[j], ids[index]];
    const next = { ...order, moduleOrder: ids };
    setOrder(next);
    await saveCustomOrder(subject.id, next);
    bumpRefresh();
  }

  async function moveSubmodule(mod, index, dir) {
    const ids = mod.submodules.map((s) => s.id);
    const j = index + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[index], ids[j]] = [ids[j], ids[index]];
    const next = {
      ...order,
      submoduleOrderByModule: { ...order.submoduleOrderByModule, [mod.id]: ids },
    };
    setOrder(next);
    await saveCustomOrder(subject.id, next);
    bumpRefresh();
  }

  async function handleMoveToModule(submoduleId, newModuleId) {
    await moveSubmoduleToModule(subject.id, submoduleId, newModuleId);
    const ov = await getModuleOverride(subject.id);
    setOverride(ov);
    bumpRefresh();
  }

  async function handleDeleteCustom(submoduleId) {
    if (!window.confirm("¿Borrar este tema? Esto también elimina su video si tiene uno.")) return;
    await deleteCustomSubmodule(subject.id, submoduleId);
    const c = await getCustomSubmodules(subject.id);
    setCustomSubs(c);
    bumpRefresh();
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-6 justify-center">
        <Loader2 size={16} color={COLORS.textMuted} className="animate-spin" />
        <span style={{ fontSize: 12.5, color: COLORS.textMuted }}>Cargando estructura...</span>
      </div>
    );
  }

  return (
    <div>
      {merged.modules.map((mod, mi) => {
        const isOpen = expandedModule === mod.id;
        const isCustomSub = (id) => customSubs.some((c) => c.id === id);
        return (
          <div key={mod.id} className="rounded-2xl mb-3 overflow-hidden" style={cardStyle}>
            <div className="w-full flex items-center gap-2 p-3.5" style={{ backgroundColor: COLORS.bgAlt }}>
              <div className="flex flex-col" style={{ gap: 2 }}>
                <button onClick={() => moveModule(mi, -1)} disabled={mi === 0} style={{ opacity: mi === 0 ? 0.3 : 1 }}>
                  <ArrowUp size={13} color={COLORS.textMuted} />
                </button>
                <button onClick={() => moveModule(mi, 1)} disabled={mi === merged.modules.length - 1} style={{ opacity: mi === merged.modules.length - 1 ? 0.3 : 1 }}>
                  <ArrowDown size={13} color={COLORS.textMuted} />
                </button>
              </div>
              <button onClick={() => setExpandedModule(isOpen ? null : mod.id)} className="flex-1 flex items-center gap-2 text-left">
                <span style={{ fontSize: 11.5, fontWeight: 700, color: subject.color }}>{mod.num}</span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: COLORS.text, flex: 1 }}>{mod.title}</span>
                <span style={{ fontSize: 10, color: COLORS.textFaint }}>{mod.submodules.length} temas</span>
                <ChevronDown size={13} color={COLORS.textFaint} style={{ transform: isOpen ? "rotate(180deg)" : "none" }} />
              </button>
            </div>

            {isOpen && (
              <div className="p-3">
                {mod.submodules.map((sm, si) => (
                  <div key={sm.id} className="rounded-xl p-2.5 mb-2 flex items-center gap-2" style={{ border: `1px solid ${COLORS.border}` }}>
                    <div className="flex flex-col" style={{ gap: 1 }}>
                      <button onClick={() => moveSubmodule(mod, si, -1)} disabled={si === 0} style={{ opacity: si === 0 ? 0.3 : 1 }}>
                        <ArrowUp size={11} color={COLORS.textMuted} />
                      </button>
                      <button onClick={() => moveSubmodule(mod, si, 1)} disabled={si === mod.submodules.length - 1} style={{ opacity: si === mod.submodules.length - 1 ? 0.3 : 1 }}>
                        <ArrowDown size={11} color={COLORS.textMuted} />
                      </button>
                    </div>
                    {sm.videos?.length ? <Video size={13} color={subject.color} /> : <FileText size={13} color={subject.color} />}
                    <span className="flex-1" style={{ fontSize: 11.5, color: COLORS.text }}>{sm.title}</span>
                    <select
                      value={mod.id}
                      onChange={(e) => handleMoveToModule(sm.id, e.target.value)}
                      style={{ fontSize: 10, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "2px 4px", color: COLORS.textMuted, maxWidth: 76 }}
                    >
                      {merged.modules.map((m2) => (
                        <option key={m2.id} value={m2.id}>{m2.num}. {m2.title.replace(/^Módulo \d+:\s*/, "").slice(0, 14)}</option>
                      ))}
                    </select>
                    {isCustomSub(sm.id) && (
                      <button onClick={() => handleDeleteCustom(sm.id)}>
                        <Trash2 size={13} color={COLORS.accent} />
                      </button>
                    )}
                  </div>
                ))}

                {addingToModule === mod.id ? (
                  <AddSubmoduleForm
                    subjectId={subject.id}
                    moduleId={mod.id}
                    onCancel={() => setAddingToModule(null)}
                    onDone={async () => {
                      setAddingToModule(null);
                      const c = await getCustomSubmodules(subject.id);
                      setCustomSubs(c);
                      bumpRefresh();
                    }}
                  />
                ) : (
                  <button
                    onClick={() => setAddingToModule(mod.id)}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl"
                    style={{ height: 36, fontSize: 11.5, color: COLORS.accent, backgroundColor: COLORS.accentSoft, border: `1px dashed ${COLORS.accent}55` }}
                  >
                    <Upload size={12} /> Agregar tema o video a este módulo
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
      <p style={{ fontSize: 10.5, color: COLORS.textFaint, lineHeight: 1.5, marginTop: 4 }}>
        Usa las flechas para reordenar módulos y temas, o el selector para mover un tema a otro módulo. Los videos que
        subas aquí quedan guardados en este navegador (no se comparten automáticamente a otro dispositivo).
      </p>
    </div>
  );
}

function TeacherMaterialText({ subject }) {
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
    getExtraContent(subject.id).then((val) => {
      if (!alive) return;
      setText(val);
      setSavedText(val);
      setLoading(false);
    });
    return () => { alive = false; };
  }, [subject.id]);

  async function handleSave() {
    setSaving(true);
    try {
      await window.storage.set(`extra-content:${subject.id}`, text, true);
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
      await window.storage.delete(`extra-content:${subject.id}`, true);
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
    <div>
      <div className="rounded-2xl p-4 mb-3" style={cardStyle}>
        <p style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>
          Pega texto o sube un documento
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Pega aquí notas, casos de estudio o cualquier contenido adicional sobre esta materia..."
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
          Esto se suma al conocimiento de {AI_NAME} para esta materia, en el chat y en Resumen/Quiz de la
          Biblioteca. En este proyecto local se guarda en el navegador (localStorage); con un backend propio en
          producción quedaría disponible para todos los estudiantes desde cualquier dispositivo.
        </p>
      </div>
    </div>
  );
}

function TeacherMaterial({ teacher }) {
  const editableSubjects = LIBRARY.filter((s) => teacher.subjectIds.includes(s.id));
  const [subjectId, setSubjectId] = useState(editableSubjects[0]?.id);
  const [tab, setTab] = useState("estructura"); // estructura | material
  const [refreshKey, setRefreshKey] = useState(0);
  const subject = findSubject(subjectId);

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader eyebrow="Contenido" title="Material del curso" subtitle={`Estructura, videos y conocimiento de ${AI_NAME}`} />

      <div className="flex-1 overflow-y-auto px-5 pb-5">
        <div className="flex gap-2 mb-3 flex-wrap">
          {editableSubjects.map((s) => (
            <button
              key={s.id}
              onClick={() => setSubjectId(s.id)}
              className="rounded-full px-3 py-1.5"
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: subjectId === s.id ? "#fff" : COLORS.text,
                backgroundColor: subjectId === s.id ? s.color : COLORS.bgAlt,
                border: `1px solid ${subjectId === s.id ? s.color : COLORS.border}`,
              }}
            >
              {s.title}
            </button>
          ))}
        </div>

        <div className="flex gap-1 mb-4 rounded-xl p-1" style={{ backgroundColor: COLORS.bgAlt }}>
          {[
            { id: "estructura", label: "Estructura y videos", icon: LayoutGrid },
            { id: "material", label: "Material adicional", icon: FileText },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg"
              style={{
                height: 34,
                fontSize: 11.5,
                fontWeight: 600,
                color: tab === t.id ? COLORS.text : COLORS.textFaint,
                backgroundColor: tab === t.id ? "#fff" : "transparent",
                boxShadow: tab === t.id ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
              }}
            >
              <t.icon size={12} /> {t.label}
            </button>
          ))}
        </div>

        {subject && tab === "estructura" && (
          <TeacherStructure subject={subject} refreshKey={refreshKey} bumpRefresh={() => setRefreshKey((k) => k + 1)} />
        )}
        {subject && tab === "material" && <TeacherMaterialText subject={subject} />}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// 17. DOCENTE — Análisis: dudas por tema (con nombres reales al
//     hacer clic + sugerencia IA por tema) y progreso por estudiante
// ----------------------------------------------------------------
function StatCard({ stat, expanded, onToggle }) {
  const [suggestion, setSuggestion] = useState("");
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [suggestionError, setSuggestionError] = useState("");

  async function handleSparkle(e) {
    e.stopPropagation();
    setLoadingSuggestion(true);
    setSuggestionError("");
    try {
      const text = await explainTopicBetter(stat);
      setSuggestion(text);
    } catch (err) {
      setSuggestionError(err.message || "No se pudo generar la sugerencia.");
    }
    setLoadingSuggestion(false);
  }

  return (
    <div className="rounded-2xl mb-3 overflow-hidden" style={cardStyle}>
      <button onClick={onToggle} className="w-full text-left p-4">
        <div className="flex items-center justify-between mb-1">
          <p style={{ fontSize: 10.5, fontWeight: 700, color: COLORS.slate }}>
            {stat.subjectTitle.toUpperCase()} · {stat.moduleTitle.replace(/^Módulo \d+:\s*/, "").toUpperCase()}
          </p>
          <div className="flex items-center gap-1">
            <Users size={11} color={COLORS.accent} />
            <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.accent }}>
              {stat.count}/{TOTAL_STUDENTS}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className="flex-1" style={{ fontSize: 13.5, fontWeight: 600, color: COLORS.text, marginBottom: 8 }}>{stat.title}</p>
          <button
            onClick={handleSparkle}
            title={`Cómo explicar mejor "${stat.title}"`}
            className="rounded-full flex items-center justify-center flex-shrink-0"
            style={{ width: 30, height: 30, backgroundColor: COLORS.accentSoft, marginBottom: 8 }}
          >
            {loadingSuggestion ? (
              <Loader2 size={13} color={COLORS.accent} className="animate-spin" />
            ) : (
              <Sparkles size={13} color={COLORS.accent} />
            )}
          </button>
        </div>
        <ProgressBar value={stat.pct} color={COLORS.accent} />
        <p style={{ fontSize: 10.5, color: COLORS.textFaint, marginTop: 5 }}>
          {stat.pct}% de la clase mostró señales de confusión sobre este tema · toca para ver quiénes
        </p>
      </button>

      {(suggestion || suggestionError) && (
        <div className="mx-4 mb-3 rounded-xl p-3" style={{ backgroundColor: COLORS.accentSoft, border: `1px solid ${COLORS.accent}33` }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles size={11} color={COLORS.accent} />
            <span style={{ fontSize: 10.5, fontWeight: 700, color: COLORS.text }}>Cómo explicarlo mejor</span>
          </div>
          <p style={{ fontSize: 11.5, lineHeight: 1.55, color: COLORS.text, whiteSpace: "pre-line" }}>
            {suggestion || suggestionError}
          </p>
        </div>
      )}

      {expanded && (
        <div className="px-4 pb-4" style={{ borderTop: `1px solid ${COLORS.border}` }}>
          <p style={{ fontSize: 10.5, fontWeight: 700, color: COLORS.textFaint, margin: "10px 0 6px" }}>
            ESTUDIANTES CON ESTA DUDA ({stat.count})
          </p>
          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {stat.ids.map((id) => {
              const s = studentLabel(id);
              return (
                <div key={id} className="flex items-center justify-between py-1.5" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <span style={{ fontSize: 12, color: COLORS.text, fontWeight: 500 }}>{s.name}</span>
                  <span style={{ fontSize: 10.5, color: COLORS.textFaint }}>{s.email}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function StudentProgressRow({ studentId, teacher, expanded, onToggle }) {
  const s = studentLabel(studentId);
  const [progress, setProgress] = useState(null);
  const [expandedModule, setExpandedModule] = useState(null);

  useEffect(() => {
    if (expanded && progress === null) {
      getProgress(studentId).then(setProgress);
    }
  }, [expanded, studentId, progress]);

  const teacherSubjects = teacher.subjectIds.map((id) => findSubject(id)).filter(Boolean);

  // % rápido para la fila colapsada (se calcula sin esperar el toggle)
  const [quickPct, setQuickPct] = useState(null);
  useEffect(() => {
    let alive = true;
    getProgress(studentId).then((p) => {
      if (!alive) return;
      const total = teacherSubjects.reduce((n, s2) => n + totalSubmodulesOf(s2), 0);
      const done = teacherSubjects.reduce(
        (n, s2) => n + s2.modules.reduce((n2, m) => n2 + m.submodules.filter((sm) => p[sm.id]).length, 0),
        0
      );
      setQuickPct(total ? Math.round((done / total) * 100) : 0);
    });
    return () => { alive = false; };
  }, [studentId]);

  return (
    <div className="rounded-2xl mb-2.5 overflow-hidden" style={cardStyle}>
      <button onClick={onToggle} className="w-full flex items-center gap-3 p-3.5">
        <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 34, height: 34, backgroundColor: COLORS.slateSoft }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.slate }}>
            {s.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
          </span>
        </div>
        <div className="flex-1 text-left min-w-0">
          <p style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.text }}>{s.name}</p>
          <p style={{ fontSize: 10, color: COLORS.textFaint }}>{s.email}</p>
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.accent }}>{quickPct ?? "…"}%</span>
        <ChevronDown size={14} color={COLORS.textFaint} style={{ transform: expanded ? "rotate(180deg)" : "none" }} />
      </button>

      {expanded && (
        <div className="px-3.5 pb-3.5" style={{ borderTop: `1px solid ${COLORS.border}` }}>
          {progress === null ? (
            <div className="flex items-center gap-2 py-3 justify-center">
              <Loader2 size={13} className="animate-spin" color={COLORS.textMuted} />
              <span style={{ fontSize: 11.5, color: COLORS.textMuted }}>Cargando progreso...</span>
            </div>
          ) : (
            teacherSubjects.map((subject) => (
              <div key={subject.id} className="mt-2.5">
                <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>{subject.title}</p>
                {subject.modules.map((mod) => {
                  const pct = moduleCompletion(progress, mod);
                  const modOpen = expandedModule === mod.id;
                  return (
                    <div key={mod.id} className="mb-1.5">
                      <button onClick={() => setExpandedModule(modOpen ? null : mod.id)} className="w-full flex items-center gap-2 py-1">
                        <span className="flex-1 text-left" style={{ fontSize: 11, color: COLORS.textMuted }}>{mod.title}</span>
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: pct === 100 ? COLORS.accent : COLORS.textFaint }}>{pct}%</span>
                      </button>
                      <ProgressBar value={pct} color={subject.color} />
                      {modOpen && (
                        <div className="mt-1.5 mb-1 pl-1">
                          {mod.submodules.map((sm) => {
                            const done = !!progress[sm.id];
                            return (
                              <div key={sm.id} className="flex items-center gap-1.5 py-1">
                                {done ? <CircleCheck size={12} color={COLORS.accent} /> : <Circle size={12} color={COLORS.textFaint} />}
                                <span style={{ fontSize: 10.5, color: done ? COLORS.text : COLORS.textFaint }}>{sm.num} {sm.title}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function TeacherAnalytics({ teacher }) {
  const [tab, setTab] = useState("dudas"); // dudas | progreso
  const [log, setLog] = useState(null);
  const [effIndex, setEffIndex] = useState(SUBMODULE_INDEX);
  const [loadingLog, setLoadingLog] = useState(true);
  const [suggestions, setSuggestions] = useState("");
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [expandedStat, setExpandedStat] = useState(null);
  const [expandedStudent, setExpandedStudent] = useState(null);

  useEffect(() => {
    let alive = true;
    Promise.all([getConfusionLog(), getEffectiveLibrary()]).then(([l, effLib]) => {
      if (!alive) return;
      setLog(l);
      setEffIndex(getEffectiveSubmoduleIndexFlat(effLib));
      setLoadingLog(false);
    });
    return () => { alive = false; };
  }, []);

  const stats = useMemo(() => (log ? computeStats(log, teacher.subjectIds, effIndex) : []), [log, teacher, effIndex]);

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
      <ScreenHeader eyebrow="Análisis IA" title="Análisis de tu curso" subtitle={`Clase de referencia: ${TOTAL_STUDENTS} estudiantes`} />

      <div className="px-5">
        <div className="flex gap-1 mb-4 rounded-xl p-1" style={{ backgroundColor: COLORS.bgAlt }}>
          {[
            { id: "dudas", label: "Dudas por tema", icon: BarChart3 },
            { id: "progreso", label: "Progreso de estudiantes", icon: ListChecks },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg"
              style={{
                height: 34,
                fontSize: 11.5,
                fontWeight: 600,
                color: tab === t.id ? COLORS.text : COLORS.textFaint,
                backgroundColor: tab === t.id ? "#fff" : "transparent",
                boxShadow: tab === t.id ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
              }}
            >
              <t.icon size={12} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-5">
        {tab === "dudas" && (
          loadingLog ? (
            <div className="flex items-center gap-2 py-6 justify-center">
              <Loader2 size={16} color={COLORS.textMuted} className="animate-spin" />
              <span style={{ fontSize: 12.5, color: COLORS.textMuted }}>Cargando datos...</span>
            </div>
          ) : stats.length === 0 ? (
            <p style={{ fontSize: 12.5, color: COLORS.textFaint, textAlign: "center", marginTop: 30, lineHeight: 1.5 }}>
              Todavía no hay suficientes preguntas repetidas sobre un mismo tema (mínimo {CONFUSION_THRESHOLD} estudiantes)
              en las materias que impartes.
            </p>
          ) : (
            <>
              {stats.map((s) => (
                <StatCard key={s.id} stat={s} expanded={expandedStat === s.id} onToggle={() => setExpandedStat(expandedStat === s.id ? null : s.id)} />
              ))}

              <button
                onClick={handleSuggestions}
                disabled={loadingSuggestions}
                className="w-full flex items-center justify-center gap-2 rounded-xl font-semibold mt-2"
                style={{ height: 44, backgroundColor: COLORS.text, color: "#fff", fontSize: 13, opacity: loadingSuggestions ? 0.7 : 1 }}
              >
                {loadingSuggestions ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                {loadingSuggestions ? "Generando sugerencias..." : "Generar sugerencias generales con IA"}
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
          )
        )}

        {tab === "progreso" && (
          <>
            <p style={{ fontSize: 11, color: COLORS.textFaint, lineHeight: 1.5, marginBottom: 10 }}>
              Un tema cuenta como "visto" si el estudiante lo abrió en la Biblioteca (lectura o video) o le preguntó
              a {AI_NAME} sobre ese tema. Solo las cuentas reales de prueba generan progreso; el resto de la clase de
              referencia parte en 0%.
            </p>
            {STUDENT_ROSTER.map((s) => (
              <StudentProgressRow
                key={s.id}
                studentId={s.id}
                teacher={teacher}
                expanded={expandedStudent === s.id}
                onToggle={() => setExpandedStudent(expandedStudent === s.id ? null : s.id)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// 18. APP ROOT
// ----------------------------------------------------------------
export default function App() {
  const [session, setSession] = useState(null); // { user, role }
  const [screen, setScreen] = useState("welcome");
  const [lessonCtx, setLessonCtx] = useState(null); // { subject, mod, submodule }
  const [prefillContext, setPrefillContext] = useState(null);
  const [effLibrary, setEffLibrary] = useState(LIBRARY);
  const [libraryVersion, setLibraryVersion] = useState(0);

  // recarga la biblioteca "efectiva" (con lo que el docente reordenó/agregó)
  // al iniciar sesión y cada vez que el docente guarda un cambio de estructura.
  useEffect(() => {
    if (!session) return;
    let alive = true;
    getEffectiveLibrary().then((lib) => alive && setEffLibrary(lib));
    return () => { alive = false; };
  }, [session, libraryVersion]);

  function handleLoginSuccess(user, role) {
    setSession({ user, role });
    setScreen("welcome");
  }
  function handleLogout() {
    setSession(null);
    setLessonCtx(null);
    setPrefillContext(null);
    setScreen("welcome");
  }
  function openSubmodule(subjectId, moduleId, submoduleId) {
    const subject = effLibrary.find((s) => s.id === subjectId) || findSubject(subjectId);
    if (!subject) return;
    const mod = moduleId ? subject.modules.find((m) => m.id === moduleId) : subject.modules[0];
    if (!mod) return;
    const submodule = submoduleId ? mod.submodules.find((s) => s.id === submoduleId) : mod.submodules[0];
    if (!submodule) return;
    setLessonCtx({ subject, mod, submodule });
    setScreen("lesson");
  }
  function askTutor(subject, mod, submodule) {
    setPrefillContext(`Tengo una duda sobre "${submodule.title}" (${mod.title}, materia: ${subject.title}). `);
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

  const showChrome = !!session && screen !== "welcome";
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
              Falta tu VITE_GEMINI_API_KEY en .env — {AI_NAME} y el análisis no responderán hasta configurarla.
            </span>
          </div>
        )}

        <div className="flex-1 overflow-hidden relative">
          {!session && <LoginScreen onLoginSuccess={handleLoginSuccess} />}

          {session && screen === "welcome" && (
            <WelcomeScreen user={session.user} role={session.role} onContinue={() => setScreen("home")} />
          )}

          {session && session.role === "student" && screen !== "welcome" && (
            <>
              {screen === "home" && <StudentHome user={session.user} setScreen={setScreen} openSubmodule={openSubmodule} effLibrary={effLibrary} />}
              {screen === "library" && (
                <LibraryScreenWithProgress user={session.user} openSubmodule={openSubmodule} effLibrary={effLibrary} />
              )}
              {screen === "calendar" && (
                <CalendarScreen
                  events={EVENTS.filter((e) => e.courseId === "c-git")}
                  eyebrow="Calendario"
                  title="Tu calendario"
                  subtitle="Tareas y clases del diplomado — enlazadas a Canvas"
                  onOpenLesson={(subjectId, submoduleId) => openSubmodule(subjectId, null, submoduleId)}
                />
              )}
              {screen === "lesson" && lessonCtx && (
                <LessonScreen
                  subject={lessonCtx.subject}
                  mod={lessonCtx.mod}
                  submodule={lessonCtx.submodule}
                  user={session.user}
                  onBack={() => setScreen("library")}
                  askTutor={askTutor}
                />
              )}
              {screen === "chat" && (
                <ChatScreen user={session.user} prefillContext={prefillContext} clearPrefill={() => setPrefillContext(null)} />
              )}
              {screen === "profile" && <ProfileScreen user={session.user} role="student" onLogout={handleLogout} />}
            </>
          )}

          {session && session.role === "teacher" && screen !== "welcome" && (
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
              {screen === "material" && (
                <TeacherMaterialWrapper teacher={session.user} onStructureChange={() => setLibraryVersion((v) => v + 1)} />
              )}
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

// pequeños envoltorios para inyectar el progreso del estudiante / refrescar la
// biblioteca efectiva tras un cambio de estructura, sin inflar el componente raíz
function LibraryScreenWithProgress({ user, openSubmodule, effLibrary }) {
  const [progress, setProgress] = useState({});
  useEffect(() => {
    let alive = true;
    getProgress(user.id).then((p) => alive && setProgress(p));
    const id = setInterval(() => getProgress(user.id).then((p) => alive && setProgress(p)), 2000);
    return () => { alive = false; clearInterval(id); };
  }, [user.id]);
  return <LibraryScreen openSubmodule={openSubmodule} effLibrary={effLibrary} progress={progress} />;
}

function TeacherMaterialWrapper({ teacher, onStructureChange }) {
  useEffect(() => {
    // cualquier visita a Material puede haber cambiado la estructura de una
    // sesión anterior; al salir de la pantalla, refrescamos por si acaso.
    return () => onStructureChange();
  }, []);
  return <TeacherMaterial teacher={teacher} />;
}
