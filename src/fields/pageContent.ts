import type { Field } from 'payload'

/**
 * Editable content shared by Programs (main program pages) and Pages (every other page).
 * Laid out like the website: header first, then the Overview / Curriculum / Instructor tabs.
 * Anything left empty falls back to the page's built-in default on the website.
 */
// "You May Like" is managed automatically on the website, so it is not offered in the admin.
// The stored rows are left untouched: filtered out when the form loads, put back when it saves.
const HIDDEN_SECTION_KEYS = ['related']
type SectionRow = { key?: string }

export const pageContentFields: Field[] = [
  { name: 'intro', type: 'textarea', label: 'Intro paragraph', admin: { description: 'Paragraph under the page title.' } },
  { name: 'leadInstructor', type: 'text', label: 'Lead Instructor', admin: { description: 'e.g. Mr. Nitesh' } },
  {
    name: 'stats',
    type: 'array',
    label: 'Header Stat Cards',
    admin: {
      description: 'The 5 cards in the page header and sidebar, in order (e.g. Starts, Program, Class Size, Success Rate, Seats Left).',
      components: { RowLabel: '/src/components/StatRowLabel' },
    },
    maxRows: 6,
    fields: [
      { name: 'label', type: 'text', required: true },
      { name: 'value', type: 'text', required: true },
    ],
  },
  {
    type: 'tabs',
    tabs: [
      {
        label: 'Overview',
        fields: [
          {
            name: 'sections',
            type: 'array',
            label: 'Overview Sections',
            hooks: {
              afterRead: [
                ({ value, req }) =>
                  req.pathname?.startsWith('/api') || req.context.rawRead
                    ? value
                    : (value as SectionRow[] | undefined)?.filter((r) => !HIDDEN_SECTION_KEYS.includes(r.key ?? '')),
              ],
              beforeChange: [
                async ({ value, originalDoc, req, collection }) => {
                  if (!originalDoc?.id || !collection) return value
                  const stored = await req.payload.findByID({
                    collection: collection.slug,
                    id: originalDoc.id,
                    depth: 0,
                    overrideAccess: true,
                    context: { rawRead: true },
                  })
                  const kept = ((stored?.sections ?? []) as SectionRow[]).filter((r) => HIDDEN_SECTION_KEYS.includes(r.key ?? ''))
                  const rows = (value ?? []) as SectionRow[]
                  return [...rows, ...kept.filter((k) => !rows.some((r) => r.key === k.key))]
                },
              ],
            },
            admin: {
              initCollapsed: true,
              description: 'Each row is a section of the page, named as it appears on the website (e.g. Choose Your Program, Participating Schools).',
              components: { RowLabel: '/src/components/SectionRowLabel' },
            },
            fields: [
              { name: 'key', type: 'text', required: true, label: 'Section ID', admin: { readOnly: true, description: 'Identifies where this section appears.' } },
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
                  { name: 'bullets', type: 'array', label: 'Bullet points', fields: [{ name: 'text', type: 'text' }] },
                  { name: 'cells', type: 'array', label: 'Table cells (in column order)', fields: [{ name: 'value', type: 'text' }] },
                ],
              },
            ],
          },
          {
            name: 'highlights',
            type: 'array',
            label: "What's Included / Highlights",
            admin: { initCollapsed: true, description: 'The highlight cards on the Overview tab (program highlights, techniques, subjects…).' },
            fields: [
              { name: 'title', type: 'text', required: true },
              { name: 'tag', type: 'text', label: 'Small label', admin: { description: 'Optional, e.g. India' } },
              { name: 'description', type: 'textarea' },
            ],
          },
          {
            name: 'admissionSteps',
            type: 'array',
            label: 'Admission Process',
            admin: { initCollapsed: true, description: 'The numbered steps, in order.' },
            fields: [
              { name: 'title', type: 'text', required: true },
              { name: 'description', type: 'textarea' },
            ],
          },
        ],
      },
      {
        label: 'Curriculum',
        fields: [
          { name: 'curriculumHeading', type: 'text', label: 'Heading', admin: { description: 'Shown on the Curriculum tab. Leave empty for "Curriculum details coming soon".' } },
          { name: 'curriculumText', type: 'textarea', label: 'Text', admin: { description: 'Course outline / schedule details shown under the heading.' } },
          {
            name: 'levels',
            type: 'array',
            label: 'Levels',
            admin: { initCollapsed: true, description: 'Optional level breakdown, e.g. Level 1 — Grade 3–4.' },
            fields: [
              { name: 'level', type: 'text', required: true },
              { name: 'grade', type: 'text' },
              { name: 'focus', type: 'textarea' },
            ],
          },
        ],
      },
      {
        label: 'Instructor',
        fields: [
          { name: 'instructorBio', type: 'textarea', label: 'Instructor bio', admin: { description: 'Shown on the Instructor tab, under the lead instructor name.' } },
        ],
      },
    ],
  },
  // Kept in the database (the website's text overrides) but not shown in the admin.
  {
    name: 'copy',
    type: 'array',
    label: 'Page Text',
    admin: { hidden: true },
    fields: [
      { name: 'key', type: 'textarea', required: true },
      { name: 'value', type: 'textarea', required: true },
    ],
  },
]
