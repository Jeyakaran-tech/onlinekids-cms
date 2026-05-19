import { jwtVerify } from 'jose'
import type { PayloadRequest } from 'payload'

export async function isAuthenticated(req: PayloadRequest): Promise<boolean> {
  console.log('[isAuthenticated] called – req.user:', req.user?.id ?? 'null')
  if (req.user) return true
  const cookie = req.headers.get?.('cookie') ?? ''
  const raw = cookie.match(/payload-token=([^;]+)/)?.[1]
  console.log('[isAuthenticated] token raw:', raw ? 'found' : 'missing')
  if (!raw) return false
  try {
    const token = decodeURIComponent(raw)
    const secret = new TextEncoder().encode(process.env.PAYLOAD_SECRET || '')
    const { payload } = await jwtVerify(token, secret)
    console.log('[isAuthenticated] JWT ok – id:', payload['id'])
    return Boolean(payload['id'])
  } catch (err) {
    console.log('[isAuthenticated] failed:', (err as Error).message)
    return false
  }
}
