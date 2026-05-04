import type { BlogPostMeta } from '../../types';

const BASE = '/blog-images/commissioning-teams-tracker';

const post: BlogPostMeta = {
  slug: 'why-commissioning-teams-still-track-documentation-in-excel',
  title: 'Por qué los equipos de commissioning siguen gestionando la documentación en Excel — y por qué construimos algo mejor',
  description:
    'Los trackers de documentación basados en Excel siguen siendo la norma en commissioning. Descubre los problemas reales que generan — enlaces rotos, requisitos poco claros, sin conexión a assets — y cómo Cx Assistant fue diseñado para resolverlos.',
  date: '2026-03-08',
  author: 'Cx Assistant Team',
  category: 'Producto',
  tags: ['commissioning', 'documentación', 'asset-management', 'data-center'],
  readTime: 6,
  ogImage: `${BASE}/cx-assistant-tracker-overview.png`,
  content: [
    { type: 'paragraph', text: 'En muchos proyectos de commissioning hoy en día, el seguimiento de la documentación sigue gestionándose con grandes hojas de cálculo de Excel.' },
    { type: 'paragraph', text: 'Si has trabajado en proyectos de commissioning de data centers o instalaciones industriales, probablemente hayas visto trackers como éste:' },
    {
      type: 'screenshot',
      src: `${BASE}/excel-example.png`,
      alt: 'Tracker de documentación de assets basado en Excel utilizado en un proyecto de commissioning',
      caption: 'Un tracker de documentación típico en Excel. Las filas son assets, las columnas son documentos o pruebas.',
    },
    {
      type: 'bullet-list',
      items: [
        'Las filas representan assets.',
        'Las columnas representan la documentación o pruebas esperadas.',
        'FAT, SAT, pruebas IR, informes de toma de tierra, certificados de calibración, checklists de proveedor — todo registrado en una gran cuadrícula de celdas.',
      ],
    },
    { type: 'paragraph', text: 'En teoría, esto funciona. En la práctica, genera varios problemas con los que los equipos lidian en casi todos los proyectos.' },
    { type: 'h2', text: 'Los Problemas de los Trackers de Documentación en Excel' },
    { type: 'paragraph', text: 'A lo largo de múltiples proyectos y países, hemos encontrado repetidamente los mismos issues.' },
    { type: 'h3', text: '1. Los documentos frecuentemente no están enlazados' },
    { type: 'paragraph', text: 'En muchos trackers, la hoja de cálculo solo muestra el estado. Pero el documento real vive en otro lugar:' },
    {
      type: 'bullet-list',
      items: ['SharePoint o BIM360', 'Datascope u otras plataformas similares', 'Hilos de email', 'Carpetas locales y portales de proveedores'],
    },
    { type: 'paragraph', text: 'El tracker te dice que el documento existe, pero no dónde está. Igualmente tienes que buscarlo.' },
    { type: 'h3', text: '2. Los enlaces se añaden manualmente' },
    {
      type: 'paragraph',
      text: 'En el mejor de los casos, los equipos pegan los enlaces manualmente en Excel. Esto genera nuevos problemas: los enlaces se rompen, los permisos cambian, los documentos se mueven, las versiones cambian. Muy a menudo el enlace apunta a un archivo desactualizado o deja de funcionar completamente.',
    },
    { type: 'h3', text: '3. La documentación no está vinculada a los assets' },
    {
      type: 'paragraph',
      text: 'Algunas plataformas de commissioning almacenan documentación, pero sin conectarla a un asset específico. Así que los documentos existen en el sistema, pero no puedes responder fácilmente preguntas como:',
    },
    {
      type: 'bullet-list',
      items: ['¿Tenemos el FAT para este UPS?', '¿Dónde está la prueba IR de este panel?', '¿Qué unidades CRAC no tienen el manual O&M?'],
    },
    { type: 'paragraph', text: 'Sin un vínculo sólido con los assets, el seguimiento de la documentación se vuelve rápidamente difícil.' },
    { type: 'h3', text: '4. Los requisitos de documentación no están claros' },
    {
      type: 'paragraph',
      text: 'Otro problema habitual: la gente sube documentos, pero no sabe qué documentos son realmente necesarios. Por ejemplo, ¿debería este asset tener un FAT? ¿Una Factory Witness Test? ¿Un Vendor Install Checklist? ¿Una prueba IR? A menudo esta información solo existe en la cabeza de alguien o en otro documento. El resultado es un seguimiento inconsistente.',
    },
    { type: 'h3', text: '5. Para ver la documentación hay que abrir cada asset' },
    {
      type: 'paragraph',
      text: 'En algunos sistemas, la documentación está vinculada a los assets, pero para verla hay que abrir el asset, navegar hasta una pestaña de documentación y revisar la lista. Esto hace difícil entender rápidamente el estado de cientos de assets. Los trackers en Excel se popularizaron precisamente porque ofrecían una visión general visual simple.',
    },
    { type: 'h2', text: 'Diseñando un Tracker de Documentación Mejor' },
    {
      type: 'paragraph',
      text: 'Al construir Cx Assistant, queríamos mantener la claridad del enfoque de la hoja de cálculo, pero eliminar los problemas. El resultado es el Asset Documentation Tracker.',
    },
    {
      type: 'screenshot',
      src: `${BASE}/cx-assistant-tracker-overview.png`,
      alt: 'Asset Documentation Tracker de Cx Assistant mostrando assets con indicadores de estado y un panel de Placeholders',
      caption: 'El tracker de Cx Assistant mantiene el diseño de cuadrícula familiar pero añade placeholders de documentación estructurados.',
    },
    { type: 'paragraph', text: 'La idea es simple: cada fila representa un asset, cada columna representa un documento esperado. Pero en lugar de celdas vacías, usamos placeholders de documentación.' },
    { type: 'h3', text: 'Placeholders de Documentación' },
    { type: 'paragraph', text: 'Los placeholders definen qué documentación se espera para cada asset. Por ejemplo:' },
    {
      type: 'bullet-list',
      items: [
        'Nivel 1 — Factory Acceptance Test, Factory Witness Test, Technical Submittal, Vendor Install Checklist, O&M Manual',
        'Nivel 2 — Dead Test Report, Insulation Resistance Test, Earthing Test, Torque Report, Pre-Commissioning Checklist',
      ],
    },
    { type: 'paragraph', text: 'Estos placeholders se pueden configurar por proyecto. Los ingenieros ya no necesitan adivinar qué documentación es necesaria — el sistema lo define.' },
    {
      type: 'screenshot',
      src: `${BASE}/cx-assistant-tracker-edition-2.png`,
      alt: 'Tracker de Cx Assistant mostrando columnas de documentación L1 y L2 con el panel de placeholders configurables',
      caption: 'Los placeholders están organizados por nivel y son totalmente configurables por proyecto.',
    },
    { type: 'h3', text: 'Vincular Documentos se Vuelve Simple' },
    {
      type: 'paragraph',
      text: 'En lugar de pegar enlaces manualmente en hojas de cálculo, los documentos se pueden vincular directamente a los placeholders arrastrando placeholders a los assets, subiendo archivos o vinculando documentos existentes del proyecto. Una vez vinculado, el documento aparece inmediatamente visible en el tracker.',
    },
    {
      type: 'screenshot',
      src: `${BASE}/cx-assistant-tracker-linkdoc.png`,
      alt: 'Interfaz de arrastrar y soltar para vincular documentos a placeholders de assets en Cx Assistant',
      caption: 'Los documentos se pueden vincular arrastrando placeholders desde el panel directamente sobre una fila de asset.',
    },
    { type: 'h3', text: 'Seguimiento de Estado' },
    {
      type: 'paragraph',
      text: 'Cada placeholder de documento tiene un estado claro: Pending, Approved o Rejected. Esto da a los equipos una visión general inmediata del progreso de la documentación en cientos de assets.',
    },
    {
      type: 'screenshot',
      src: `${BASE}/cx-assistant-tracker-edition.png`,
      alt: 'Menú contextual en una celda de documento mostrando opciones Set Pending, Set Approved, Set Rejected',
      caption: 'Un menú contextual con clic derecho permite establecer el estado del documento, abrirlo o volver a vincularlo — todo desde el tracker.',
    },
    { type: 'h3', text: 'Acceso Directo a los Documentos' },
    {
      type: 'paragraph',
      text: 'Los documentos se pueden abrir directamente desde el tracker — sin buscar en carpetas, sin enlaces rotos, sin tener que adivinar dónde está el archivo. Todo está conectado directamente al asset.',
    },
    {
      type: 'screenshot',
      src: `${BASE}/cx-assistant-tracker-opendoc.png`,
      alt: 'Visor de PDF integrado en Cx Assistant mostrando un Factory Acceptance Test Report',
      caption: 'Al hacer clic en un documento se abre en un visor integrado. Sin salir del tracker.',
    },
    { type: 'h2', text: 'Haciendo la Documentación Accesible con IA' },
    {
      type: 'paragraph',
      text: 'Debido a que los documentos están estructurados y vinculados a los assets, también pueden ser utilizados por la IA de Cx Assistant. Por ejemplo, desde el móvil en obra podrías preguntar: "¿Puedes mostrarme el informe FAT del UPS45?" El asistente puede recuperar el documento correcto inmediatamente. En lugar de buscar en carpetas o hojas de cálculo, los ingenieros pueden acceder a la documentación en segundos.',
    },
    {
      type: 'callout',
      text: 'Esto solo funciona porque los documentos están correctamente estructurados y vinculados a los assets desde el principio. Los datos limpios habilitan funcionalidades potentes.',
    },
    { type: 'h2', text: 'Un Pequeño Cambio con un Gran Impacto' },
    {
      type: 'paragraph',
      text: 'El seguimiento de la documentación puede parecer una parte pequeña del commissioning. Pero en proyectos grandes con cientos o miles de assets, se convierte en un reto de coordinación importante.',
    },
    {
      type: 'paragraph',
      text: 'El objetivo del tracker de documentación de Cx Assistant es simple: mantener la claridad de los trackers tradicionales, eliminar los enlaces rotos, conectar la documentación directamente a los assets, definir claramente la documentación esperada y hacer que la información sea accesible al instante — sin añadir complejidad innecesaria.',
    },
    { type: 'h2', text: 'Construido por Ingenieros que Usan Estos Sistemas' },
    {
      type: 'paragraph',
      text: 'Cx Assistant fue diseñado a partir de flujos de trabajo de commissioning reales observados en múltiples proyectos y equipos. El objetivo no es reemplazar los procesos de ingeniería, sino proporcionar herramientas que los hagan más fáciles de gestionar.',
    },
    {
      type: 'paragraph',
      text: 'Si quieres explorar cómo Cx Assistant gestiona assets, issues y documentación, puedes visitar la plataforma en cx-assistant.com.',
    },
  ],
};

export default post;
