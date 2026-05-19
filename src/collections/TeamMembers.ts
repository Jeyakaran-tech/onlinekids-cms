import type { CollectionConfig } from 'payload'
import { revalidateFrontend } from '../lib/revalidateFrontend'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  access: { read: () => true },
  hooks: { afterChange: [() => revalidateFrontend()] },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'order'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    { name: 'bio', type: 'textarea' },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Display order (lower = first)' },
    },
  ],
}
