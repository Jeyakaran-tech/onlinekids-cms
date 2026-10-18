import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  admin: { group: 'Website' },
  upload: true,
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
}
