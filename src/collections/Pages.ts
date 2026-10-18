import type { CollectionConfig } from 'payload'
import { revalidateFrontend } from '../lib/revalidateFrontend'
import { isAuthenticated } from '../lib/isAuthenticated'
import { pagePreviewUrl } from '../lib/previewUrl'
import { pageContentFields } from '../fields/pageContent'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Program Page', plural: 'Program Pages' },
  access: {
    read: () => true,
    create: ({ req }) => isAuthenticated(req),
    update: ({ req }) => isAuthenticated(req),
    delete: ({ req }) => isAuthenticated(req),
  },
  hooks: { afterChange: [() => revalidateFrontend()], afterDelete: [() => revalidateFrontend()] },
  admin: {
    useAsTitle: 'title',
    livePreview: {
      url: pagePreviewUrl,
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 820, height: 1180 },
      ],
    },
    group: 'Website',
    baseListFilter: () => ({
      or: [
        { slug: { equals: 'vic-selective-entry' } },
        { slug: { equals: 'nsw-selective-entry' } },
        { slug: { equals: 'vedic-maths' } },
      ],
    }),
    listSearchableFields: ['title', 'slug'],
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'Open Selective Entry VIC or NSW — all of its programs are one click away at the top of the page.',
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
