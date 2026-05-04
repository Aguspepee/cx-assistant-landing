import type { BlogPostMeta } from '../types';

const BASE = '/blog-images/plan-vs-actual';

const post: BlogPostMeta = {
  slug: 'plan-vs-actual-in-commissioning-why-its-harder-than-it-looks',
  title: 'Plan vs Actual in Commissioning: Why It\'s Harder Than It Looks',
  description:
    'Plan vs Actual tracking is used in every commissioning project — but the process behind it is surprisingly complex. Learn what makes it hard, and how Cx Assistant simplifies it.',
  date: '2026-03-15',
  author: 'Cx Assistant Team',
  category: 'Product',
  tags: ['commissioning', 'planning', 'progress-tracking', 'data-center'],
  readTime: 7,
  ogImage: `${BASE}/plan-vs-actual-overview-1.png`,
  content: [
    {
      type: 'paragraph',
      text: 'In almost every commissioning project, one question comes up repeatedly:',
    },
    {
      type: 'paragraph',
      text: 'Are we on schedule?',
    },
    {
      type: 'paragraph',
      text: 'To answer that, teams usually look at a Plan vs Actual chart. The idea is simple:',
    },
    {
      type: 'bullet-list',
      items: [
        'How many assets were planned to be completed by a certain date.',
        'How many assets were actually completed.',
      ],
    },
    {
      type: 'paragraph',
      text: 'This metric is used constantly during commissioning meetings, daily reviews, and project reporting.',
    },
    {
      type: 'paragraph',
      text: 'In many projects, it looks something like this:',
    },
    {
      type: 'screenshot',
      src: `${BASE}/plan-vs-actual-excel.jpg`,
      alt: 'Excel-based Plan vs Actual chart used in a commissioning project',
      caption: 'A typical Excel-based Plan vs Actual chart. Often built from manually updated data.',
    },
    {
      type: 'paragraph',
      text: 'At first glance, it seems straightforward. But behind this chart there is usually a surprisingly complicated and fragile process.',
    },
    {
      type: 'h2',
      text: 'The Hidden Complexity Behind Plan vs Actual',
    },
    {
      type: 'paragraph',
      text: 'To generate a simple Plan vs Actual chart, several things must work correctly. In practice, this is where many projects struggle.',
    },
    {
      type: 'h3',
      text: '1. You Need a Clean Asset Database',
    },
    {
      type: 'paragraph',
      text: 'Everything starts with a complete list of assets.',
    },
    {
      type: 'bullet-list',
      items: ['UPS', 'CRAC', 'MDB', 'MLDB', 'TPDU', 'Generators', 'etc.'],
    },
    {
      type: 'paragraph',
      text: 'Each asset needs to exist in a structured database. Some commissioning platforms include this, but when teams try to manage this in Excel it quickly becomes difficult:',
    },
    {
      type: 'bullet-list',
      items: [
        'Duplicate assets',
        'Inconsistent naming',
        'Missing equipment',
        'Manual corrections',
      ],
    },
    {
      type: 'paragraph',
      text: 'Without a clean asset database, Plan vs Actual becomes unreliable.',
    },
    {
      type: 'h3',
      text: '2. You Need Planned Dates for Every Asset',
    },
    {
      type: 'paragraph',
      text: 'To calculate the "Plan" line, every asset must have expected commissioning dates. For example:',
    },
    {
      type: 'bullet-list',
      items: [
        'L3 for UPS01 → Week 34',
        'L3 for UPS02 → Week 34',
        'L3 for CRAC units → Week 36',
      ],
    },
    {
      type: 'paragraph',
      text: 'When a project has hundreds of assets, assigning these dates manually becomes a large task. In many existing tools this requires opening each asset, navigating to a planning section, and manually entering dates. This quickly becomes tedious and error-prone.',
    },
    {
      type: 'h3',
      text: '3. Updating Actual Execution Dates',
    },
    {
      type: 'paragraph',
      text: 'The second part of the chart is the Actual line. This requires recording when a commissioning activity is completed. Typical problems include:',
    },
    {
      type: 'bullet-list',
      items: [
        'Engineers forget to update the system.',
        'Dates are entered manually and incorrectly.',
        'Updates are delayed until later.',
        'Updates are done in spreadsheets after the fact.',
      ],
    },
    {
      type: 'paragraph',
      text: 'Even when the system records the date automatically, updating the status itself can still be slow.',
    },
    {
      type: 'h3',
      text: '4. Understanding What Happened on a Given Day',
    },
    {
      type: 'paragraph',
      text: 'Even when the chart exists, answering basic questions is often difficult. For example: which assets were actually completed on December 14? Or which assets were supposed to be completed that day but were not? In Excel this usually requires filtering tables, searching rows, and manual investigation — which makes real-time analysis difficult.',
    },
    {
      type: 'h2',
      text: 'Designing a Simpler Plan vs Actual System',
    },
    {
      type: 'paragraph',
      text: 'When building Cx Assistant, we wanted Plan vs Actual to be easy to configure, easy to update, and easy to analyze. The result is a system that connects assets, planning, and execution in one place.',
    },
    {
      type: 'h3',
      text: 'A Structured Asset Database',
    },
    {
      type: 'paragraph',
      text: 'Everything starts with a clean asset database. Each asset contains:',
    },
    {
      type: 'bullet-list',
      items: [
        'Asset type and category',
        'Location',
        'Vendor and model information',
        'Commissioning status',
      ],
    },
    {
      type: 'screenshot',
      src: `${BASE}/structured-asset-database.png`,
      alt: 'Asset detail modal in Cx Assistant showing type, category, location, model and commissioning status',
      caption: 'Each asset has structured data including type, location, model, and commissioning status.',
    },
    {
      type: 'paragraph',
      text: 'This structured foundation allows the system to reliably calculate project progress.',
    },
    {
      type: 'h3',
      text: 'Planning with Drag and Drop',
    },
    {
      type: 'paragraph',
      text: 'Setting planned dates should not require editing hundreds of assets individually. In Cx Assistant, commissioning activities can be scheduled by dragging assets into a commissioning calendar, assigning activities by week, or even asking the assistant in chat. For example:',
    },
    {
      type: 'callout',
      text: '"Schedule the L3 commissioning of the UPS systems for week 34." — The system updates the expected dates automatically.',
    },
    {
      type: 'h3',
      text: 'Automatic Recording of Execution',
    },
    {
      type: 'paragraph',
      text: 'When a commissioning status changes, Cx Assistant automatically records the execution date. But engineers also have simpler ways to update status — for example, from a phone on site:',
    },
    {
      type: 'callout',
      text: '"UPS45 completed L3." — The assistant updates the asset status and records the timestamp.',
    },
    {
      type: 'paragraph',
      text: 'This allows teams to update progress from anywhere, without opening multiple screens.',
    },
    {
      type: 'h3',
      text: 'Visualizing Plan vs Actual',
    },
    {
      type: 'paragraph',
      text: 'Once planning and execution data exist, the system generates the Plan vs Actual chart automatically. The blue line represents planned progress. The green line represents actual execution. Teams can immediately see if commissioning is ahead or behind schedule.',
    },
    {
      type: 'screenshot',
      src: `${BASE}/plan-vs-actual-overview-1.png`,
      alt: 'Cx Assistant Plan vs Actual chart showing planned progress in blue and actual execution in green',
      caption: 'The Plan vs Actual chart in Cx Assistant. Blue is the expected plan, green is actual execution.',
    },
    {
      type: 'h3',
      text: 'Drilling Down Into the Data',
    },
    {
      type: 'paragraph',
      text: 'Charts are useful, but understanding the details behind them is even more important. In Cx Assistant, the Plan vs Actual chart is interactive. Clicking on any point in the chart shows which assets were expected to be completed and which assets were actually completed.',
    },
    {
      type: 'screenshot',
      src: `${BASE}/plan-vs-actual-click-see-assets.png`,
      alt: 'Cx Assistant Plan vs Actual chart with a data point selected, showing a list of assets for that date',
      caption: 'Clicking any point on the chart reveals the assets planned or completed on that date.',
    },
    {
      type: 'paragraph',
      text: 'From there, you can click an asset and immediately view its details.',
    },
    {
      type: 'screenshot',
      src: `${BASE}/plan-vs-actual-click-asset-dialog-detail.png`,
      alt: 'Asset detail panel opened from the Plan vs Actual chart drill-down in Cx Assistant',
      caption: 'Clicking an asset from the drill-down opens its full detail view. Easy to investigate delays.',
    },
    {
      type: 'paragraph',
      text: 'This makes it easy to investigate delays and identify where attention is needed.',
    },
    {
      type: 'h2',
      text: 'Plan vs Actual by Commissioning Level',
    },
    {
      type: 'paragraph',
      text: 'Commissioning progress often needs to be analyzed by level:',
    },
    {
      type: 'bullet-list',
      items: ['Red Tag', 'Yellow Tag', 'Green Tag', 'Blue Tag', 'White Tag'],
    },
    {
      type: 'paragraph',
      text: 'Cx Assistant allows filtering Plan vs Actual by commissioning level. This helps teams understand where bottlenecks exist in the commissioning workflow.',
    },
    {
      type: 'screenshot',
      src: `${BASE}/plan-vs-actual-filter-per-status.png`,
      alt: 'Cx Assistant Plan vs Actual chart filtered by Red Tag commissioning level',
      caption: 'Filtering by commissioning level reveals where specific bottlenecks exist across the project.',
    },
    {
      type: 'h2',
      text: 'Making Commissioning Progress Easier to Understand',
    },
    {
      type: 'paragraph',
      text: 'Plan vs Actual reporting should not require complex spreadsheets or manual analysis. By connecting structured asset data, commissioning planning, and real-time execution updates, Cx Assistant allows teams to track commissioning progress in a much simpler way.',
    },
    {
      type: 'h2',
      text: 'Built for Real Commissioning Workflows',
    },
    {
      type: 'paragraph',
      text: 'Plan vs Actual tracking is something every commissioning team relies on. But the tools used to generate it have often remained overly manual.',
    },
    {
      type: 'paragraph',
      text: 'Cx Assistant was designed to simplify this process while keeping the information engineers actually need. If you\'d like to explore how Cx Assistant handles progress tracking, you can visit the platform at cx-assistant.com.',
    },
  ],
};

export default post;
