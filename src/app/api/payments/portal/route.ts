import { getStripe, json, preflight } from '@/lib/stripe'

export const OPTIONS = preflight

// Body: { sessionId }. The checkout session id (from the success-page URL) proves the
// caller is the customer; returns a Stripe Customer Portal link where they can cancel
// or update payment details. For later visits, send customers to STRIPE_PORTAL_LOGIN_URL
// (Stripe's email-OTP portal login page).
export async function POST(request: Request) {
  const { sessionId } = await request.json().catch(() => ({}))
  if (typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) {
    return json({ error: 'sessionId required' }, 400)
  }
  const stripe = getStripe()
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  const customer = typeof session.customer === 'string' ? session.customer : session.customer?.id
  if (!customer) return json({ error: 'No customer for session' }, 404)

  const portal = await stripe.billingPortal.sessions.create({
    customer,
    return_url: process.env.FRONTEND_URL || 'http://localhost:3000',
  })
  return json({ url: portal.url, loginUrl: process.env.STRIPE_PORTAL_LOGIN_URL || null })
}
