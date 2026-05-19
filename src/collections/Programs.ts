import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { revalidateFrontend } from '../lib/revalidateFrontend'

export const Programs: CollectionConfig = {
  slug: 'programs',
  access: {
    read: () => true,
    create: ({ req }) => { console.log('[Programs] create – user:', req.user?.id ?? 'null'); return Boolean(req.user) },
    update: ({ req }) => { console.log('[Programs] update – user:', req.user?.id ?? 'null', '– cookie:', req.headers.get?.('cookie')?.includes('payload-token') ? 'present' : 'missing'); return true },
    delete: ({ req }) => { console.log('[Programs] delete – user:', req.user?.id ?? 'null'); return Boolean(req.user) },
  },
  hooks: { afterChange: [() => revalidateFrontend()] },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'ageRange', 'price', 'featured'],
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
      fields: [
        { name: 'ageRange', type: 'text', label: 'Age Range', admin: { description: 'e.g. Ages 6–12' } },
        { name: 'duration', type: 'text', admin: { description: 'e.g. 1 hour/week' } },
        { name: 'classSize', type: 'text', label: 'Class Size', admin: { description: 'e.g. Max 6 students' } },
        { name: 'price', type: 'text', admin: { description: 'e.g. $35/class' } },
        { name: 'schedule', type: 'text', admin: { description: 'e.g. Weekends 10am–11am' } },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
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
