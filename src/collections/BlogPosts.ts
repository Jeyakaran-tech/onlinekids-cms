import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { revalidateFrontend } from '../lib/revalidateFrontend'
import { isAuthenticated } from '../lib/isAuthenticated'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  access: {
    read: () => true,
    create: ({ req }) => isAuthenticated(req),
    update: ({ req }) => isAuthenticated(req),
    delete: ({ req }) => isAuthenticated(req),
  },
  hooks: {
    afterChange: [() => revalidateFrontend()],
    afterDelete: [() => revalidateFrontend()],
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedDate', 'featured'],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL-friendly identifier, e.g. how-to-ace-selective-entry' },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: { description: 'Short summary shown on the blog listing page' },
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({}),
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyy' },
        description: 'Date shown on the post',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Maths', value: 'maths' },
        { label: 'Arts', value: 'arts' },
        { label: 'Coding For Kids', value: 'coding-for-kids' },
      ],
      defaultValue: 'maths',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Pin to top of blog listing' },
    },
  ],
}
