import type { CollectionConfig } from 'payload'
import { revalidateFrontend } from '../lib/revalidateFrontend'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  access: { read: () => true, create: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user), delete: ({ req }) => Boolean(req.user) },
  hooks: { afterChange: [() => revalidateFrontend()] },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'order'],
  },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Programs', value: 'programs' },
        { label: 'Pricing', value: 'pricing' },
        { label: 'Technical', value: 'technical' },
      ],
      defaultValue: 'general',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Display order (lower = first)' },
    },
  ],
}
