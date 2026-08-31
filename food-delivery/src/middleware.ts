import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
	const cookieHeader = request.headers.get('cookie') || ''
	const hasSession = /sb_session=/.test(cookieHeader)
	if (!hasSession) {
		const sessionId = crypto.randomUUID()
		const response = NextResponse.next()
		response.cookies.set('sb_session', sessionId, { path: '/', httpOnly: false, sameSite: 'lax' })
		return response
	}
	return NextResponse.next()
}

export const config = {
	matcher: [
		'/',
		'/restaurants/:path*',
		'/cart',
		'/api/:path*',
		'/orders/:path*',
	],
}