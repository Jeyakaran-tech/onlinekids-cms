import { jwtVerify } from 'jose'
import type { PayloadRequest } from 'payload'

export async function isAuthenticated(req: PayloadRequest): Promise<boolean> {
  if (req.user) return true
  const cookie = req.headers.get?.('cookie') ?? ''
  const token = cookie.match(/payload-token=([^;]+)/)?.[1]
  if (!token) return false
  try {
    const secret = new TextEncoder().encode(process.env.PAYLOAD_SECRET || '')
    const { payload } = await jwtVerify(token, secret)
    return payload['collection'] === 'users' && Boolean(payload['id'])
  } catch {
    return false
  }
}
