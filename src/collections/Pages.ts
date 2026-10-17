import type { CollectionConfig } from 'payload'
import { revalidateFrontend } from '../lib/revalidateFrontend'
import { isAuthenticated } from '../lib/isAuthenticated'
import { pageContentFields } from '../fields/pageContent'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  access: {
    read: () => true,
    create: ({ req }) => isAuthenticated(req),
    update: ({ req }) => isAuthenticated(req),
    delete: ({ req }) => isAuthenticated(req),
  },
  hooks: { afterChange: [() => revalidateFrontend()], afterDelete: [() => revalidateFrontend()] },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'Content for program sub-pages and other site pages.',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Identifies the page on the website. Do not change for existing pages.' },
    },
    ...pageContentFields,
  ],
}
