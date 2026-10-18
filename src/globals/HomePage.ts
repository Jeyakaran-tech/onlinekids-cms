import type { GlobalConfig } from 'payload'
import { revalidateFrontend } from '../lib/revalidateFrontend'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  hooks: { afterChange: [() => revalidateFrontend()] },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Hero Section',
      fields: [
        { name: 'heading', type: 'textarea', admin: { description: 'Wrap words in *stars* to highlight them, e.g. Help your child prepare for *Selective, Scholarship*.' } },
        { name: 'subheading', type: 'textarea' },
        // Unused by the website; kept (hidden) so the stored columns are not dropped.
        { name: 'ctaText', type: 'text', admin: { hidden: true } },
        { name: 'ctaLink', type: 'text', admin: { hidden: true } },
        { name: 'backgroundImage', type: 'upload', relationTo: 'media', admin: { hidden: true } },
        {
          name: 'programButtons',
          type: 'array',
          label: 'Free Trial Buttons',
          admin: { description: 'The program buttons inside the "Book a Free Trial Lesson" box.' },
          fields: [
            { name: 'emoji', type: 'text' },
            { name: 'label', type: 'text', required: true },
          ],
        },
        {
          name: 'ratings',
          type: 'array',
          label: 'Social Proof (ratings row)',
          maxRows: 4,
          fields: [
            { name: 'score', type: 'text', required: true, admin: { description: 'e.g. 4.9★ or 98%' } },
            { name: 'reviews', type: 'text', admin: { description: 'e.g. from 2,500+ parents' } },
            { name: 'source', type: 'text', admin: { description: 'e.g. Google' } },
          ],
        },
      ],
    },
    {
      name: 'courses',
      type: 'group',
      label: 'Our Core Programs Section',
      admin: { description: 'Program cards come from Programs (the ones marked Featured). Set the quick facts shown on each card here.' },
      fields: [
        { name: 'badge', type: 'text' },
        { name: 'heading', type: 'text', admin: { description: 'Wrap words in *stars* to highlight them, e.g. Focused on What *Matters Most*.' } },
        { name: 'description', type: 'textarea' },
        {
          name: 'cards',
          type: 'array',
          label: 'Quick Facts per Program Card',
          admin: { initCollapsed: true, components: { RowLabel: '/src/components/CardRowLabel' } },
          fields: [
            { name: 'program', type: 'relationship', relationTo: 'programs', required: true },
            { name: 'grade', type: 'text', admin: { description: 'e.g. Grade 3–9' } },
            { name: 'duration', type: 'text', admin: { description: 'e.g. 1 Year' } },
            { name: 'classSize', type: 'text', label: 'Class Size', admin: { description: 'e.g. 10 students' } },
            { name: 'seatsLeft', type: 'text', label: 'Seats Left', admin: { description: 'e.g. 4. Leave empty to hide.' } },
          ],
        },
      ],
    },
    {
      name: 'whyUs',
      type: 'group',
      label: 'Why Us Section',
      fields: [
        { name: 'heading', type: 'text', admin: { description: 'Wrap words in *stars* to highlight them, e.g. Why Parents *Trust* The Online Kids.' } },
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
      name: 'testimonials',
      type: 'group',
      label: 'Testimonials Section',
      admin: { description: 'The testimonials themselves are managed under Testimonials.' },
      fields: [
        { name: 'badge', type: 'text' },
        { name: 'heading', type: 'text', admin: { description: 'e.g. What Parents Are *Saying*' } },
      ],
    },
    {
      name: 'team',
      type: 'group',
      label: 'Our Mentors Section',
      fields: [
        { name: 'badge', type: 'text' },
        { name: 'heading', type: 'text', admin: { description: 'e.g. Learn from the *Best* Tutors' } },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'freeTrial',
      type: 'group',
      label: 'Free Trial Section',
      fields: [
        { name: 'heading', type: 'text', admin: { description: 'e.g. Register for a Free *Trial Class*' } },
        { name: 'description', type: 'textarea' },
        { name: 'ctaText', type: 'text', label: 'Button Text' },
        { name: 'ctaLink', type: 'text', label: 'Button Link (Calendly or form URL)' },
      ],
    },
  ],
}
