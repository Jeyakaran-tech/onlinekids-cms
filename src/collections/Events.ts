import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Event', plural: 'Events' },
  access: { read: () => true },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', 'publishedDate', 'featured'] },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL-friendly identifier, e.g. super-15-selectathon-may-2025' },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Exam / Test', value: 'exam' },
        { label: 'News', value: 'news' },
        { label: 'Announcement', value: 'announcement' },
        { label: 'Workshop', value: 'workshop' },
      ],
    },
    { name: 'excerpt', type: 'textarea', admin: { description: 'Short summary shown on the listing page' } },
    { name: 'targetGrade', type: 'text', label: 'Target Grade / Year', admin: { description: 'e.g. Grade 7, Year 6–7' } },
    {
      name: 'dates',
      type: 'array',
      label: 'Available Dates',
      fields: [
        { name: 'label', type: 'text', required: true, admin: { placeholder: 'e.g. Friday 30 May' } },
        { name: 'date', type: 'date' },
      ],
    },
    { name: 'testTime', type: 'text', label: 'Time', admin: { placeholder: 'e.g. 10 am – 2 pm' } },
    { name: 'feeAud', type: 'number', label: 'Fee (AUD)' },
    { name: 'whatsappContact', type: 'text', label: 'WhatsApp Number', admin: { description: 'Number to register via WhatsApp' } },
    { name: 'location', type: 'text', admin: { placeholder: 'e.g. From Home (Online)' } },
    {
      name: 'testSchedule',
      type: 'array',
      label: 'Test / Session Schedule',
      fields: [
        { name: 'session', type: 'text', required: true, admin: { placeholder: 'e.g. Writing' } },
        { name: 'duration', type: 'text', admin: { placeholder: 'e.g. 40 minutes' } },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Session', value: 'session' },
            { label: 'Break', value: 'break' },
          ],
          defaultValue: 'session',
        },
      ],
    },
    { name: 'content', type: 'richText', label: 'Additional Details' },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'publishedDate', type: 'date', required: true },
  ],
}
