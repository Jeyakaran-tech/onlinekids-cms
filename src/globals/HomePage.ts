import type { GlobalConfig } from 'payload'
import { revalidateFrontend } from '../lib/revalidateFrontend'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  access: { read: () => true },
  hooks: { afterChange: [() => revalidateFrontend()] },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Hero Section',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'subheading', type: 'textarea' },
        { name: 'ctaText', type: 'text', label: 'CTA Button Text' },
        { name: 'ctaLink', type: 'text', label: 'CTA Button Link' },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'whyUs',
      type: 'group',
      label: 'Why Us Section',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'subheading', type: 'textarea' },
        {
          name: 'features',
          type: 'array',
          fields: [
            { name: 'title', type: 'text' },
            { name: 'description', type: 'textarea' },
            {
              name: 'icon',
              type: 'text',
              admin: { description: 'Lucide icon name, e.g. "star", "book", "users"' },
            },
          ],
        },
      ],
    },
    {
      name: 'freeTrial',
      type: 'group',
      label: 'Free Trial Section',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'ctaText', type: 'text', label: 'Button Text' },
        { name: 'ctaLink', type: 'text', label: 'Button Link (Calendly or form URL)' },
      ],
    },
  ],
}
