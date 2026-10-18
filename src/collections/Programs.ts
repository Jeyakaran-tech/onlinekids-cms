import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { revalidateFrontend } from '../lib/revalidateFrontend'
import { isAuthenticated } from '../lib/isAuthenticated'
import { programPreviewUrl } from '../lib/previewUrl'
import { pageContentFields } from '../fields/pageContent'

export const Programs: CollectionConfig = {
  slug: 'programs',
  access: {
    read: () => true,
    create: ({ req }) => isAuthenticated(req),
    update: ({ req }) => isAuthenticated(req),
    delete: ({ req }) => isAuthenticated(req),
  },
  hooks: { afterChange: [() => revalidateFrontend()] },
  admin: {
    useAsTitle: 'title',
    livePreview: {
      url: programPreviewUrl,
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 820, height: 1180 },
      ],
    },
    group: 'Website',
    defaultColumns: ['title', 'details.grade', 'details.duration', 'featured', 'order'],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL-friendly identifier, e.g. speed-maths' },
    },
    { name: 'tagline', type: 'text' },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({}),
    },
    {
      name: 'details',
      type: 'group',
      label: 'Quick Facts (shown on homepage card & program page)',
      admin: { hidden: true, description: 'Moved to Home Page → Our Core Programs Section.' },
      fields: [
        { name: 'grade', type: 'text', label: 'Grade', admin: { description: 'e.g. Grade 3–9' } },
        { name: 'duration', type: 'text', admin: { description: 'e.g. 1 Year, or 3 Years (4 Levels)' } },
        { name: 'classSize', type: 'text', label: 'Class Size', admin: { description: 'e.g. 10 students' } },
        { name: 'seatsLeft', type: 'text', label: 'Seats Left', admin: { description: 'e.g. 4 available. Leave empty to hide.' } },
        { name: 'price', type: 'text', admin: { description: 'e.g. $35/class' } },
        { name: 'schedule', type: 'text', admin: { description: 'e.g. Weekends 10am–11am' } },
        { name: 'ageRange', type: 'text', label: 'Age Range (optional)', admin: { description: 'Optional. Not shown on the site yet — use Grade instead.' } },
      ],
    },
    {
      name: 'page',
      type: 'group',
      label: 'Program Page Content',
      admin: {
        description: 'Content of the program detail page. Leave a field empty to keep the page default.',
      },
      fields: pageContentFields,
    },
    {
      name: 'subPages',
      type: 'array',
      label: 'Programs inside Selective Entry Victoria',
      admin: {
        condition: (data) => data?.slug === 'selective-entry-victoria',
        initCollapsed: true,
        description: 'Super 15 Batch, Exam Jump Start, Crash Course and Test Series — open one to edit its page.',
        components: { RowLabel: '/src/components/TitleRowLabel' },
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'key', type: 'text', required: true, label: 'Page ID', admin: { readOnly: true, description: 'Identifies which website page this is.' } },
        ...pageContentFields,
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { hidden: true }, // not used by the website
    },
    {
      name: 'features',
      type: 'array',
      label: 'Key Features',
      fields: [
        { name: 'feature', type: 'text' },
      ],
    },
    {
      name: 'display',
      type: 'group',
      label: 'Display Settings',
      admin: { description: 'Controls how this program appears on the website' },
      fields: [
        {
          name: 'icon',
          type: 'select',
          label: 'Icon',
          options: [
            { label: 'Graduation Cap', value: 'graduation-cap' },
            { label: 'Trophy', value: 'trophy' },
            { label: 'Calculator', value: 'calculator' },
            { label: 'Book Open', value: 'book-open' },
            { label: 'Flask', value: 'flask-conical' },
            { label: 'Star', value: 'star' },
            { label: 'Brain', value: 'brain' },
            { label: 'Zap', value: 'zap' },
          ],
          defaultValue: 'graduation-cap',
        },
        {
          name: 'colorTheme',
          type: 'select',
          label: 'Color Theme',
          options: [
            { label: 'Purple', value: 'purple' },
            { label: 'Amber', value: 'amber' },
            { label: 'Emerald', value: 'emerald' },
            { label: 'Blue', value: 'blue' },
            { label: 'Rose', value: 'rose' },
            { label: 'Cyan', value: 'cyan' },
            { label: 'Orange', value: 'orange' },
            { label: 'Pink', value: 'pink' },
          ],
          defaultValue: 'purple',
        },
        {
          name: 'tag',
          type: 'text',
          label: 'Badge Text',
          admin: { description: 'Short label shown on the card, e.g. "100% Success" or "Grade 4–6"' },
        },
        {
          name: 'href',
          type: 'text',
          label: 'Page URL',
          admin: { description: 'Link to the program detail page, e.g. /programs/speed-maths' },
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Show on homepage courses section' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Display order (lower = first)' },
    },
  ],
}
