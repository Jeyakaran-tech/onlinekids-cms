import type { CollectionConfig } from 'payload'
import { isAuthenticated } from '../lib/isAuthenticated'

// Written only by the Stripe webhook (local API); admins can view but not edit.
export const Subscriptions: CollectionConfig = {
  slug: 'subscriptions',
  access: {
    read: ({ req }) => isAuthenticated(req),
    create: () => false,
    update: () => false,
    delete: ({ req }) => isAuthenticated(req),
  },
  admin: {
    group: 'Payments',
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'cancelAtPeriodEnd', 'currentPeriodEnd'],
  },
  fields: [
    { name: 'email', type: 'email', index: true },
    { name: 'name', type: 'text' },
    { name: 'stripeCustomerId', type: 'text', index: true },
    { name: 'stripeSubscriptionId', type: 'text', unique: true, index: true },
    { name: 'priceId', type: 'text' },
    {
      name: 'status',
      type: 'select',
      options: ['incomplete', 'trialing', 'active', 'past_due', 'unpaid', 'canceled', 'incomplete_expired', 'paused'],
    },
    { name: 'currentPeriodEnd', type: 'date' },
    {
      name: 'cancelAtPeriodEnd',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Customer cancelled; no further debits after the current period.' },
    },
    { name: 'canceledAt', type: 'date' },
  ],
}
