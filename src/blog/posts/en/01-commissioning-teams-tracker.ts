import type { BlogPostMeta } from '../../types';

const BASE = '/blog-images/commissioning-teams-tracker';

const post: BlogPostMeta = {
  slug: 'why-commissioning-teams-still-track-documentation-in-excel',
  title: 'Why Commissioning Teams Still Track Documentation in Excel — And Why We Built Something Better',
  description:
    'Excel-based documentation trackers are still the norm in commissioning. Discover the real problems they create — broken links, unclear requirements, no asset connection — and how Cx Assistant was designed to solve them.',
  date: '2026-03-08',
  author: 'Cx Assistant Team',
  category: 'Product',
  tags: ['commissioning', 'documentation', 'asset-management', 'data-center'],
  readTime: 6,
  ogImage: `${BASE}/cx-assistant-tracker-overview.png`,
  content: [
    { type: 'paragraph', text: 'In many commissioning projects today, documentation tracking is still handled using large Excel spreadsheets.' },
    { type: 'paragraph', text: 'If you have worked on data center or industrial commissioning projects, you have probably seen trackers like this:' },
    {
      type: 'screenshot',
      src: `${BASE}/excel-example.png`,
      alt: 'Excel-based asset documentation tracker used on a commissioning project',
      caption: 'A typical Excel-based documentation tracker. Rows are assets, columns are documents or tests.',
    },
    {
      type: 'bullet-list',
      items: [
        'Rows represent assets.',
        'Columns represent expected documentation or tests.',
        'FAT, SAT, IR tests, earthing reports, calibration certificates, vendor checklists — everything tracked in a large grid of cells.',
      ],
    },
    { type: 'paragraph', text: 'In theory, this works. In practice, it creates several problems that teams deal with on almost every project.' },
    { type: 'h2', text: 'The Problems with Traditional Excel Documentation Trackers' },
    { type: 'paragraph', text: 'Across multiple projects and countries, we repeatedly encountered the same issues.' },
    { type: 'h3', text: '1. Documents are often not linked' },
    { type: 'paragraph', text: 'In many trackers, the spreadsheet only shows status. But the actual document lives somewhere else:' },
    {
      type: 'bullet-list',
      items: ['SharePoint or BIM360', 'Datascope or similar platforms', 'Email threads', 'Local folders and vendor portals'],
    },
    { type: 'paragraph', text: 'The tracker tells you the document exists, but not where it is. You still need to search for it.' },
    { type: 'h3', text: '2. Links are added manually' },
    { type: 'paragraph', text: 'In the best cases, teams paste links manually into Excel. This creates new problems: links break, permissions change, documents move, versions change. Very often the link points to an outdated file or stops working completely.' },
    { type: 'h3', text: '3. Documentation is not tied to assets' },
    { type: 'paragraph', text: 'Some commissioning platforms store documentation, but not connected to a specific asset. So documents exist in the system, but you cannot easily answer questions like:' },
    {
      type: 'bullet-list',
      items: ['Do we have the FAT for this UPS?', 'Where is the IR test for this panel?', 'Which CRAC units are missing the O&M manual?'],
    },
    { type: 'paragraph', text: 'Without a strong asset link, documentation quickly becomes difficult to track.' },
    { type: 'h3', text: '4. Documentation expectations are unclear' },
    {
      type: 'paragraph',
      text: "Another common problem: people upload documents, but they don't know what documents are actually required. For example, should this asset have a FAT? A Factory Witness Test? A Vendor Install Checklist? An IR Test? Often this information only exists in someone's head or in another document. The result is inconsistent tracking.",
    },
    { type: 'h3', text: '5. To see documentation, you must open each asset' },
    {
      type: 'paragraph',
      text: 'In some systems, documentation is linked to assets — but to see it, you must open the asset, navigate to a documentation tab, and review the list. This makes it difficult to quickly understand the status of hundreds of assets. Excel trackers became popular precisely because they provided a simple visual overview.',
    },
    { type: 'h2', text: 'Designing a Better Documentation Tracker' },
    {
      type: 'paragraph',
      text: 'When building Cx Assistant, we wanted to keep the clarity of the spreadsheet approach, but remove the problems. The result is the Asset Documentation Tracker.',
    },
    {
      type: 'screenshot',
      src: `${BASE}/cx-assistant-tracker-overview.png`,
      alt: 'Cx Assistant Asset Documentation Tracker showing assets with documentation status badges and a Placeholders panel',
      caption: 'The Cx Assistant tracker keeps the familiar grid layout but adds structured documentation placeholders.',
    },
    { type: 'paragraph', text: 'The idea is simple: each row represents an asset, each column represents an expected document. But instead of empty cells, we use documentation placeholders.' },
    { type: 'h3', text: 'Documentation Placeholders' },
    { type: 'paragraph', text: 'Placeholders define what documentation is expected for each asset. For example:' },
    {
      type: 'bullet-list',
      items: [
        'Level 1 — Factory Acceptance Test, Factory Witness Test, Technical Submittal, Vendor Install Checklist, O&M Manual',
        'Level 2 — Dead Test Report, Insulation Resistance Test, Earthing Test, Torque Report, Pre-Commissioning Checklist',
      ],
    },
    { type: 'paragraph', text: 'These placeholders can be configured per project. Engineers no longer need to guess what documentation is required — the system defines it.' },
    {
      type: 'screenshot',
      src: `${BASE}/cx-assistant-tracker-edition-2.png`,
      alt: 'Cx Assistant tracker showing L1 and L2 documentation columns with configurable placeholders panel',
      caption: 'Placeholders are organised by level and fully configurable per project.',
    },
    { type: 'h3', text: 'Linking Documents Becomes Simple' },
    {
      type: 'paragraph',
      text: 'Instead of manually pasting links into spreadsheets, documents can be linked directly to the placeholders by dragging placeholders to assets, uploading files, or linking existing project documents. Once linked, the document becomes immediately visible in the tracker.',
    },
    {
      type: 'screenshot',
      src: `${BASE}/cx-assistant-tracker-linkdoc.png`,
      alt: 'Drag-and-drop interface for linking documents to asset placeholders in Cx Assistant',
      caption: 'Documents can be linked by dragging placeholders from the panel directly onto an asset row.',
    },
    { type: 'h3', text: 'Status Tracking' },
    {
      type: 'paragraph',
      text: 'Each document placeholder has a clear status: Pending, Approved, or Rejected. This gives teams an immediate overview of documentation progress across hundreds of assets.',
    },
    {
      type: 'screenshot',
      src: `${BASE}/cx-assistant-tracker-edition.png`,
      alt: 'Context menu on a document cell showing Set Pending, Set Approved, Set Rejected options',
      caption: 'A right-click context menu lets you set document status, open the file, or relink it — all from the tracker.',
    },
    { type: 'h3', text: 'Direct Access to Documents' },
    {
      type: 'paragraph',
      text: 'Documents can be opened directly from the tracker — no searching across folders, no broken links, no guessing where the file lives. Everything is connected directly to the asset.',
    },
    {
      type: 'screenshot',
      src: `${BASE}/cx-assistant-tracker-opendoc.png`,
      alt: 'Built-in PDF viewer in Cx Assistant showing a Factory Acceptance Test Report',
      caption: 'Clicking a document opens it in a built-in viewer. No navigating away from the tracker.',
    },
    { type: 'h2', text: 'Making Documentation Accessible with AI' },
    {
      type: 'paragraph',
      text: 'Because documents are structured and linked to assets, they also become usable by the Cx Assistant AI. For example, from a phone on site you could ask: "Can you show me the FAT report for UPS45?" The assistant can immediately retrieve the correct document. Instead of searching through folders or spreadsheets, engineers can access documentation in seconds.',
    },
    {
      type: 'callout',
      text: 'This only works because the documents are properly structured and linked to assets in the first place. Clean data enables powerful features.',
    },
    { type: 'h2', text: 'A Small Change with a Big Impact' },
    {
      type: 'paragraph',
      text: 'Documentation tracking may seem like a small part of commissioning. But on large projects with hundreds or thousands of assets, it becomes a major coordination challenge.',
    },
    {
      type: 'paragraph',
      text: 'The goal of the Cx Assistant documentation tracker is simple: keep the clarity of traditional trackers, eliminate broken links, connect documentation directly to assets, define expected documentation clearly, and make information accessible instantly — without adding unnecessary complexity.',
    },
    { type: 'h2', text: 'Built by Engineers Who Use These Systems' },
    {
      type: 'paragraph',
      text: 'Cx Assistant was designed based on real commissioning workflows observed across multiple projects and teams. The goal is not to replace engineering processes, but to provide tools that make them easier to manage.',
    },
    {
      type: 'paragraph',
      text: "If you'd like to explore how Cx Assistant manages assets, issues, and documentation, you can visit the platform at cx-assistant.com.",
    },
  ],
};

export default post;
