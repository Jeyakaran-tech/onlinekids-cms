import { jwtVerify } from 'jose'
import type { PayloadRequest } from 'payload'

export async function isAuthenticated(req: PayloadRequest): Promise<boolean> {
  if (req.user) return true

  const secret = new TextEncoder().encode(process.env.PAYLOAD_SECRET || '')

  // Middleware forwards payload-token cookie as Bearer – Payload should populate
  // req.user from it, but we also verify directly as a fallback.
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const { payload } = await jwtVerify(authHeader.slice(7), secret)
      return Boolean(payload['id'])
    } catch (err) {
      console.log('[isAuthenticated] Bearer JWT failed:', (err as Error).message)
    }
  }

  // Last resort: parse cookie header directly
  const cookieHeader = req.headers.get('cookie')
  if (cookieHeader) {
    const match = cookieHeader.match(/payload-token=([^;]+)/)
    if (match) {
      try {
        const { payload } = await jwtVerify(decodeURIComponent(match[1]), secret)
        return Boolean(payload['id'])
      } catch {}
    }
  }

  console.log('[isAuthenticated] all methods failed')
  return false
}
