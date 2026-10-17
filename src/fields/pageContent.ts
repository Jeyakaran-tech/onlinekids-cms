import type { Field } from 'payload'

/**
 * Editable content shared by Programs (main program pages) and Pages (every other page).
 * Anything left empty falls back to the page's built-in default on the website.
 */
export const pageContentFields: Field[] = [
  { name: 'intro', type: 'textarea', label: 'Intro paragraph', admin: { description: 'Paragraph under the page title.' } },
  { name: 'leadInstructor', type: 'text', label: 'Lead Instructor', admin: { description: 'e.g. Mr. Nitesh' } },
  {
    name: 'stats',
    type: 'array',
    label: 'Header Stat Cards',
    admin: { description: 'The cards in the page header and sidebar, in order (e.g. Duration, Grade, Class Size, Seats Left).' },
    maxRows: 6,
    fields: [
      { name: 'label', type: 'text', required: true },
      { name: 'value', type: 'text', required: true },
    ],
  },
  {
    name: 'highlights',
    type: 'array',
    label: 'Highlights / Topics',
    admin: { description: 'The main cards on the Overview tab (techniques, subjects, program highlights, etc.).' },
    fields: [
      { name: 'title', type: 'text', required: true },
      { name: 'tag', type: 'text', label: 'Small label', admin: { description: 'Optional, e.g. India' } },
      { name: 'description', type: 'textarea' },
    ],
  },
  {
    name: 'levels',
    type: 'array',
    label: 'Levels',
    admin: { description: 'Optional level breakdown, e.g. Level 1 — Grade 3–4.' },
    fields: [
      { name: 'level', type: 'text', required: true },
      { name: 'grade', type: 'text' },
      { name: 'focus', type: 'textarea' },
    ],
  },
  {
    name: 'admissionSteps',
    type: 'array',
    label: 'Admission Steps',
    fields: [
      { name: 'title', type: 'text', required: true },
      { name: 'description', type: 'textarea' },
    ],
  },
  {
    name: 'sections',
    type: 'array',
    label: 'Other Content Blocks',
    admin: {
      description:
        'Extra content blocks on this page (schools, test structure, instructors, FAQs, benefits, lists…). Edit text freely; do not change the Block ID.',
    },
    fields: [
      { name: 'key', type: 'text', required: true, label: 'Block ID', admin: { description: 'Identifies where this block appears. Do not change.' } },
      { name: 'heading', type: 'text' },
      { name: 'body', type: 'textarea' },
      {
        name: 'items',
        type: 'array',
        label: 'Items',
        fields: [
          { name: 'title', type: 'text' },
          { name: 'tag', type: 'text', label: 'Small label' },
          { name: 'description', type: 'textarea' },
          { name: 'group', type: 'text', label: 'Group / category / role', admin: { description: 'e.g. course category or instructor role' } },
          { name: 'link', type: 'text', label: 'Link URL' },
          {
            name: 'bullets',
            type: 'array',
            label: 'Bullet points',
            fields: [{ name: 'text', type: 'text' }],
          },
          {
            name: 'cells',
            type: 'array',
            label: 'Table cells (in column order)',
            fields: [{ name: 'value', type: 'text' }],
          },
        ],
      },
    ],
  },
  {
    name: 'copy',
    type: 'array',
    label: 'Page Text (headings, paragraphs, buttons)',
    admin: {
      description:
        'Every piece of text on this page. Edit "Text on website" to change it. "Original text" identifies the line — do not change it.',
    },
    fields: [
      { name: 'key', type: 'textarea', required: true, label: 'Original text (do not change)' },
      { name: 'value', type: 'textarea', required: true, label: 'Text on website' },
    ],
  },
]
