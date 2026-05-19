import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { PayloadRequest } from 'payload'

export async function isAuthenticated(req: PayloadRequest): Promise<boolean> {
  if (req.user) return true
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value
    console.log('[isAuthenticated] token via next/headers:', token ? 'found' : 'missing')
    if (!token) return false
    const secret = new TextEncoder().encode(process.env.PAYLOAD_SECRET || '')
    const { payload } = await jwtVerify(token, secret)
    console.log('[isAuthenticated] JWT ok – id:', payload['id'])
    return Boolean(payload['id'])
  } catch (err) {
    console.log('[isAuthenticated] failed:', (err as Error).message)
    return false
  }
}
