import { getStripe, json, preflight } from '@/lib/stripe'

export const OPTIONS = preflight

// Body: { email?: string, priceId?: string }. Starts a recurring subscription;
// the customer enters card or AU bank details on Stripe (enable Card + BECS Direct Debit
// in the Stripe dashboard) and is auto-debited each period.
export async function POST(request: Request) {
  const { email, priceId } = await request.json().catch(() => ({}))

  const allowed = (process.env.STRIPE_ALLOWED_PRICE_IDS || process.env.STRIPE_PRICE_ID || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const price = priceId || allowed[0]
  if (!price || !allowed.includes(price)) return json({ error: 'Invalid price' }, 400)

  const frontend = process.env.FRONTEND_URL || 'http://localhost:3000'
  const session = await getStripe().checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price, quantity: 1 }],
    customer_email: typeof email === 'string' && email ? email : undefined,
    success_url: `${frontend}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${frontend}/payment/cancelled`,
  })
  return json({ url: session.url })
}
