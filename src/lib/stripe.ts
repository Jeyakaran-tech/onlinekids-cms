import Stripe from 'stripe'

let client: Stripe | null = null

export function getStripe(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
    client = new Stripe(key)
  }
  return client
}

const allowedOrigin = () => process.env.FRONTEND_URL || 'http://localhost:3000'

export function corsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': allowedOrigin(),
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: corsHeaders() })
}

export function preflight() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}
