import { jwtVerify } from 'jose'
import type { PayloadRequest } from 'payload'

export async function isAuthenticated(req: PayloadRequest): Promise<boolean> {
  if (req.user) return true
  const cookie = req.headers.get?.('cookie') ?? ''
  const raw = cookie.match(/payload-token=([^;]+)/)?.[1]
  if (!raw) return false
  const token = decodeURIComponent(raw)
  try {
    const secret = new TextEncoder().encode(process.env.PAYLOAD_SECRET || '')
    const { payload } = await jwtVerify(token, secret)
    console.log('[isAuthenticated] JWT payload keys:', Object.keys(payload).join(','), '| id:', payload['id'])
    return Boolean(payload['id'])
  } catch (err) {
    console.log('[isAuthenticated] jwtVerify failed:', (err as Error).message)
    return false
  }
}
