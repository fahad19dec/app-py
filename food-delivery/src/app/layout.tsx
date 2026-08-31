import './globals.css'
import type { ReactNode } from 'react'
import Link from 'next/link'

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body className="min-h-screen bg-gray-50 text-gray-900">
				<header className="border-b bg-white">
					<div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
						<Link href="/" className="text-xl font-semibold">SwiftBites</Link>
						<nav className="flex items-center gap-4">
							<Link href="/cart" className="hover:underline">Cart</Link>
							<Link href="/orders" className="hover:underline">Orders</Link>
						</nav>
					</div>
				</header>
				<main className="mx-auto max-w-5xl px-4 py-6">
					{children}
				</main>
			</body>
		</html>
	)
}