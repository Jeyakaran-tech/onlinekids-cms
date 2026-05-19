import type { CollectionConfig } from 'payload'
import { revalidateFrontend } from '../lib/revalidateFrontend'
import { isAuthenticated } from '../lib/isAuthenticated'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  access: { read: () => true, create: ({ req }) => isAuthenticated(req), update: ({ req }) => isAuthenticated(req), delete: ({ req }) => isAuthenticated(req) },
  hooks: { afterChange: [() => revalidateFrontend()] },
  admin: {
    useAsTitle: 'studentName',
    defaultColumns: ['studentName', 'program', 'rating', 'featured'],
  },
  fields: [
    { name: 'studentName', type: 'text', required: true },
    { name: 'parentName', type: 'text' },
    { name: 'content', type: 'textarea', required: true },
    {
      name: 'rating',
      type: 'select',
      options: [
        { label: '5 Stars', value: '5' },
        { label: '4 Stars', value: '4' },
        { label: '3 Stars', value: '3' },
        { label: '2 Stars', value: '2' },
        { label: '1 Star', value: '1' },
      ],
      defaultValue: '5',
    },
    {
      name: 'program',
      type: 'relationship',
      relationTo: 'programs',
      hasMany: false,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Show on homepage testimonials section' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
