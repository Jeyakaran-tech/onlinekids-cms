import type { CollectionConfig } from 'payload'
import { revalidateFrontend } from '../lib/revalidateFrontend'
import { isAuthenticated } from '../lib/isAuthenticated'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  access: { read: () => true, create: ({ req }) => isAuthenticated(req), update: ({ req }) => isAuthenticated(req), delete: ({ req }) => isAuthenticated(req) },
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
      name: 'subjects',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Maths', value: 'maths' },
        { label: 'Speed Maths', value: 'speed-maths' },
        { label: 'English', value: 'english' },
        { label: 'Science', value: 'science' },
        { label: 'VCE (Yr 10–12)', value: 'vce' },
        { label: 'Scholarship Prep', value: 'scholarship' },
        { label: 'Selective School Prep', value: 'selective' },
        { label: 'Coding & Robotics', value: 'coding' },
      ],
      admin: { description: 'Subjects this staff member can teach' },
    },
    {
      name: 'bookingUrls',
      type: 'array',
      admin: { description: 'One Cal.com event URL per subject' },
      fields: [
        {
          name: 'subject',
          type: 'select',
          required: true,
          options: [
            { label: 'Maths', value: 'maths' },
            { label: 'Speed Maths', value: 'speed-maths' },
            { label: 'English', value: 'english' },
            { label: 'Science', value: 'science' },
            { label: 'VCE (Yr 10–12)', value: 'vce' },
            { label: 'Scholarship Prep', value: 'scholarship' },
            { label: 'Selective School Prep', value: 'selective' },
            { label: 'Coding & Robotics', value: 'coding' },
          ],
        },
        { name: 'url', type: 'text', required: true, admin: { description: 'Cal.com event link for this subject' } },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Display order (lower = first)' },
    },
  ],
}
