
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refreshing the auth token
  const { data: { session } } = await supabase.auth.getSession()

  const pathname = request.nextUrl.pathname

  // 1. Admin route protection
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return supabaseResponse
    }
    
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    // Ensure you set this environment variable in Vercel
    if (session.user.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // 2. Protected Student routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/course')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/admin',
    '/admin/(.*)',
    '/dashboard',
    '/dashboard/(.*)',
    '/course',
    '/course/(.*)'
  ],
}
