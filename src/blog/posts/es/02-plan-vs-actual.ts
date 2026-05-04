import type { BlogPostMeta } from '../../types';

const BASE = '/blog-images/plan-vs-actual';

const post: BlogPostMeta = {
  slug: 'plan-vs-actual-in-commissioning-why-its-harder-than-it-looks',
  title: 'Plan vs Real en Commissioning: Por qué es más complejo de lo que parece',
  description:
    'El seguimiento Plan vs Real se usa en todos los proyectos de commissioning, pero el proceso detrás es sorprendentemente complejo. Aprende qué lo hace difícil y cómo Cx Assistant lo simplifica.',
  date: '2026-03-15',
  author: 'Cx Assistant Team',
  category: 'Producto',
  tags: ['commissioning', 'planificación', 'seguimiento-progreso', 'data-center'],
  readTime: 7,
  ogImage: `${BASE}/plan-vs-actual-overview-1.png`,
  content: [
    { type: 'paragraph', text: 'En casi todos los proyectos de commissioning, una pregunta surge repetidamente:' },
    { type: 'paragraph', text: '¿Vamos según el calendario?' },
    { type: 'paragraph', text: 'Para responder a eso, los equipos suelen consultar un gráfico Plan vs Real. La idea es simple:' },
    {
      type: 'bullet-list',
      items: [
        'Cuántos assets estaba previsto completar para una fecha determinada.',
        'Cuántos assets se completaron realmente.',
      ],
    },
    { type: 'paragraph', text: 'Esta métrica se utiliza constantemente durante las reuniones de commissioning, las revisiones diarias y los informes de proyecto.' },
    { type: 'paragraph', text: 'En muchos proyectos, tiene un aspecto similar a este:' },
    {
      type: 'screenshot',
      src: `${BASE}/plan-vs-actual-excel.jpg`,
      alt: 'Gráfico Plan vs Real basado en Excel utilizado en un proyecto de commissioning',
      caption: 'Un gráfico Plan vs Real típico en Excel. A menudo construido a partir de datos actualizados manualmente.',
    },
    { type: 'paragraph', text: 'A primera vista parece sencillo. Pero detrás de este gráfico suele haber un proceso sorprendentemente complicado y frágil.' },
    { type: 'h2', text: 'La Complejidad Oculta detrás del Plan vs Real' },
    { type: 'paragraph', text: 'Para generar un simple gráfico Plan vs Real, varias cosas deben funcionar correctamente. En la práctica, aquí es donde muchos proyectos tienen dificultades.' },
    { type: 'h3', text: '1. Necesitas una Base de Datos de Assets Limpia' },
    { type: 'paragraph', text: 'Todo comienza con una lista completa de assets.' },
    { type: 'bullet-list', items: ['UPS', 'CRAC', 'MDB', 'MLDB', 'TPDU', 'Generadores', 'etc.'] },
    {
      type: 'paragraph',
      text: 'Cada asset debe existir en una base de datos estructurada. Algunas plataformas de commissioning incluyen esto, pero cuando los equipos intentan gestionarlo en Excel se complica rápidamente:',
    },
    {
      type: 'bullet-list',
      items: ['Assets duplicados', 'Nomenclatura inconsistente', 'Equipos faltantes', 'Correcciones manuales'],
    },
    { type: 'paragraph', text: 'Sin una base de datos de assets limpia, el Plan vs Real se vuelve poco fiable.' },
    { type: 'h3', text: '2. Necesitas Fechas Planificadas para Cada Asset' },
    { type: 'paragraph', text: 'Para calcular la línea de "Plan", cada asset debe tener fechas de commissioning esperadas. Por ejemplo:' },
    {
      type: 'bullet-list',
      items: ['L3 para UPS01 → Semana 34', 'L3 para UPS02 → Semana 34', 'L3 para unidades CRAC → Semana 36'],
    },
    {
      type: 'paragraph',
      text: 'Cuando un proyecto tiene cientos de assets, asignar estas fechas manualmente se convierte en una tarea enorme. En muchas herramientas existentes esto requiere abrir cada asset, navegar hasta una sección de planificación e introducir las fechas manualmente. Esto se vuelve rápidamente tedioso y propenso a errores.',
    },
    { type: 'h3', text: '3. Actualizar las Fechas de Ejecución Real' },
    { type: 'paragraph', text: 'La segunda parte del gráfico es la línea Real. Esto requiere registrar cuándo se completa una actividad de commissioning. Los problemas típicos incluyen:' },
    {
      type: 'bullet-list',
      items: [
        'Los ingenieros se olvidan de actualizar el sistema.',
        'Las fechas se introducen manualmente y de forma incorrecta.',
        'Las actualizaciones se retrasan hasta más tarde.',
        'Las actualizaciones se hacen en hojas de cálculo a posteriori.',
      ],
    },
    { type: 'paragraph', text: 'Incluso cuando el sistema registra la fecha automáticamente, actualizar el propio estado puede seguir siendo lento.' },
    { type: 'h3', text: '4. Entender qué Ocurrió en un Día Determinado' },
    {
      type: 'paragraph',
      text: 'Incluso cuando el gráfico existe, responder preguntas básicas suele ser difícil. Por ejemplo: ¿qué assets se completaron realmente el 14 de diciembre? ¿O qué assets debían completarse ese día pero no se completaron? En Excel esto normalmente requiere filtrar tablas, buscar filas e investigación manual — lo que hace difícil el análisis en tiempo real.',
    },
    { type: 'h2', text: 'Diseñando un Sistema Plan vs Real más Simple' },
    {
      type: 'paragraph',
      text: 'Al construir Cx Assistant, queríamos que el Plan vs Real fuera fácil de configurar, fácil de actualizar y fácil de analizar. El resultado es un sistema que conecta assets, planificación y ejecución en un solo lugar.',
    },
    { type: 'h3', text: 'Una Base de Datos de Assets Estructurada' },
    { type: 'paragraph', text: 'Todo comienza con una base de datos de assets limpia. Cada asset contiene:' },
    {
      type: 'bullet-list',
      items: ['Tipo y categoría de asset', 'Ubicación', 'Información de proveedor y modelo', 'Estado de commissioning'],
    },
    {
      type: 'screenshot',
      src: `${BASE}/structured-asset-database.png`,
      alt: 'Modal de detalle de asset en Cx Assistant mostrando tipo, categoría, ubicación, modelo y estado de commissioning',
      caption: 'Cada asset tiene datos estructurados incluyendo tipo, ubicación, modelo y estado de commissioning.',
    },
    { type: 'paragraph', text: 'Esta base estructurada permite al sistema calcular de forma fiable el progreso del proyecto.' },
    { type: 'h3', text: 'Planificación con Arrastrar y Soltar' },
    {
      type: 'paragraph',
      text: 'Establecer fechas planificadas no debería requerir editar cientos de assets individualmente. En Cx Assistant, las actividades de commissioning se pueden programar arrastrando assets a un calendario de commissioning, asignando actividades por semana, o incluso preguntando al asistente en el chat. Por ejemplo:',
    },
    {
      type: 'callout',
      text: '"Programa el commissioning L3 de los sistemas UPS para la semana 34." — El sistema actualiza las fechas esperadas automáticamente.',
    },
    { type: 'h3', text: 'Registro Automático de la Ejecución' },
    {
      type: 'paragraph',
      text: 'Cuando cambia un estado de commissioning, Cx Assistant registra automáticamente la fecha de ejecución. Pero los ingenieros también tienen formas más simples de actualizar el estado — por ejemplo, desde el móvil en obra:',
    },
    {
      type: 'callout',
      text: '"UPS45 completó L3." — El asistente actualiza el estado del asset y registra la marca de tiempo.',
    },
    { type: 'paragraph', text: 'Esto permite a los equipos actualizar el progreso desde cualquier lugar, sin abrir múltiples pantallas.' },
    { type: 'h3', text: 'Visualizando Plan vs Real' },
    {
      type: 'paragraph',
      text: 'Una vez que existen los datos de planificación y ejecución, el sistema genera automáticamente el gráfico Plan vs Real. La línea azul representa el progreso planificado. La línea verde representa la ejecución real. Los equipos pueden ver inmediatamente si el commissioning está adelantado o retrasado respecto al calendario.',
    },
    {
      type: 'screenshot',
      src: `${BASE}/plan-vs-actual-overview-1.png`,
      alt: 'Gráfico Plan vs Real de Cx Assistant mostrando el progreso planificado en azul y la ejecución real en verde',
      caption: 'El gráfico Plan vs Real en Cx Assistant. Azul es el plan previsto, verde es la ejecución real.',
    },
    { type: 'h3', text: 'Profundizando en los Datos' },
    {
      type: 'paragraph',
      text: 'Los gráficos son útiles, pero entender los detalles detrás de ellos es aún más importante. En Cx Assistant, el gráfico Plan vs Real es interactivo. Al hacer clic en cualquier punto del gráfico se muestran qué assets estaba previsto completar y cuáles se completaron realmente.',
    },
    {
      type: 'screenshot',
      src: `${BASE}/plan-vs-actual-click-see-assets.png`,
      alt: 'Gráfico Plan vs Real de Cx Assistant con un punto de datos seleccionado, mostrando una lista de assets para esa fecha',
      caption: 'Al hacer clic en cualquier punto del gráfico se muestran los assets planificados o completados en esa fecha.',
    },
    { type: 'paragraph', text: 'Desde ahí puedes hacer clic en un asset y ver sus detalles inmediatamente.' },
    {
      type: 'screenshot',
      src: `${BASE}/plan-vs-actual-click-asset-dialog-detail.png`,
      alt: 'Panel de detalle de asset abierto desde el drill-down del gráfico Plan vs Real en Cx Assistant',
      caption: 'Al hacer clic en un asset desde el drill-down se abre su vista de detalle completa. Fácil para investigar retrasos.',
    },
    { type: 'paragraph', text: 'Esto facilita investigar retrasos e identificar dónde se necesita atención.' },
    { type: 'h2', text: 'Plan vs Real por Nivel de Commissioning' },
    { type: 'paragraph', text: 'El progreso del commissioning a menudo necesita analizarse por nivel:' },
    { type: 'bullet-list', items: ['Red Tag', 'Yellow Tag', 'Green Tag', 'Blue Tag', 'White Tag'] },
    {
      type: 'paragraph',
      text: 'Cx Assistant permite filtrar el Plan vs Real por nivel de commissioning. Esto ayuda a los equipos a entender dónde existen cuellos de botella en el flujo de trabajo de commissioning.',
    },
    {
      type: 'screenshot',
      src: `${BASE}/plan-vs-actual-filter-per-status.png`,
      alt: 'Gráfico Plan vs Real de Cx Assistant filtrado por nivel de commissioning Red Tag',
      caption: 'Filtrar por nivel de commissioning revela dónde existen cuellos de botella específicos en el proyecto.',
    },
    { type: 'h2', text: 'Haciendo el Progreso del Commissioning más Fácil de Entender' },
    {
      type: 'paragraph',
      text: 'El reporting Plan vs Real no debería requerir hojas de cálculo complejas ni análisis manual. Al conectar datos de assets estructurados, planificación de commissioning y actualizaciones de ejecución en tiempo real, Cx Assistant permite a los equipos hacer seguimiento del progreso del commissioning de forma mucho más simple.',
    },
    { type: 'h2', text: 'Construido para Flujos de Trabajo de Commissioning Reales' },
    {
      type: 'paragraph',
      text: 'El seguimiento Plan vs Real es algo en lo que confía cada equipo de commissioning. Pero las herramientas utilizadas para generarlo han permanecido a menudo excesivamente manuales.',
    },
    {
      type: 'paragraph',
      text: 'Cx Assistant fue diseñado para simplificar este proceso manteniendo la información que los ingenieros realmente necesitan. Si quieres explorar cómo Cx Assistant gestiona el seguimiento del progreso, puedes visitar la plataforma en cx-assistant.com.',
    },
  ],
};

export default post;
