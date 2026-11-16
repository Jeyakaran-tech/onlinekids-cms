import config from '@payload-config'
import { getPayload } from 'payload'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'

async function syncSubscription(sub: Stripe.Subscription) {
  const stripe = getStripe()
  const payload = await getPayload({ config })
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id
  const customer = (await stripe.customers.retrieve(customerId)) as Stripe.Customer
  const item = sub.items.data[0]
  const periodEnd = (item as unknown as { current_period_end?: number }).current_period_end

  const data = {
    email: customer.email || undefined,
    name: customer.name || undefined,
    stripeCustomerId: customerId,
    stripeSubscriptionId: sub.id,
    priceId: item?.price.id,
    status: sub.status,
    currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000).toISOString() : undefined,
    cancelAtPeriodEnd: sub.cancel_at_period_end,
    canceledAt: sub.canceled_at ? new Date(sub.canceled_at * 1000).toISOString() : undefined,
  }

  const existing = await payload.find({
    collection: 'subscriptions',
    where: { stripeSubscriptionId: { equals: sub.id } },
    limit: 1,
    overrideAccess: true,
  })
  if (existing.docs[0]) {
    await payload.update({ collection: 'subscriptions', id: existing.docs[0].id, data, overrideAccess: true })
  } else {
    await payload.create({ collection: 'subscriptions', data, overrideAccess: true })
  }
}

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature')
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!signature || !secret) return new Response('Missing signature', { status: 400 })

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(await request.text(), signature, secret)
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      await syncSubscription(event.data.object as Stripe.Subscription)
      break
    case 'invoice.payment_failed': {
      // Stripe retries per Smart Retries settings; subscription.updated carries the past_due status.
      console.warn('[stripe] payment failed for invoice', (event.data.object as Stripe.Invoice).id)
      break
    }
  }
  return new Response('ok')
}
