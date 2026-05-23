import type { GlobalConfig } from 'payload'

export const Pricing: GlobalConfig = {
  slug: 'pricing',
  label: 'Pricing',
  access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  fields: [
    {
      name: 'termPriceAud',
      type: 'number',
      label: 'Term Price (AUD)',
      defaultValue: 25,
      required: true,
      admin: { description: 'Price charged per term' },
    },
    {
      name: 'termsPerYear',
      type: 'number',
      label: 'Terms Per Year',
      defaultValue: 4,
      required: true,
      admin: { description: 'Number of terms in a full year' },
    },
    {
      name: 'yearlyDiscountPercent',
      type: 'number',
      label: 'Yearly Discount (%)',
      defaultValue: 15,
      required: true,
      admin: { description: 'Discount applied when paying for a full year (e.g. 15 = 15% off)' },
    },
  ],
}
