import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('payload-token')?.value
  if (token && !request.headers.get('authorization')) {
    const headers = new Headers(request.headers)
    headers.set('authorization', `Bearer ${token}`)
    return NextResponse.next({ request: { headers } })
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
