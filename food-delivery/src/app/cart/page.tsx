import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export default async function CartPage() {
	const sessionId = (await cookies()).get('sb_session')?.value
	let items: { id: string, quantity: number, priceCents: number, title: string, restaurantId: string }[] = []
	if (sessionId) {
		const cart = await prisma.cart.findUnique({ where: { sessionId }, include: { items: { include: { menuItem: true } } } })
		items = cart?.items.map(ci => ({ id: ci.id, quantity: ci.quantity, priceCents: ci.menuItem.priceCents, title: ci.menuItem.title, restaurantId: ci.menuItem.restaurantId })) ?? []
	}
	const totalCents = items.reduce((sum, i) => sum + i.quantity * i.priceCents, 0)
	const restaurantId = items[0]?.restaurantId

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-semibold">Cart</h1>
			{items.length === 0 ? (
				<p>Your cart is empty.</p>
			) : (
				<div className="space-y-4">
					<ul className="divide-y rounded-lg border bg-white">
						{items.map(i => (
							<li key={i.id} className="flex items-center justify-between p-3">
								<span>{i.title} × {i.quantity}</span>
								<span className="font-medium">${((i.priceCents * i.quantity)/100).toFixed(2)}</span>
							</li>
						))}
					</ul>
					<div className="flex items-center justify-between">
						<span className="text-lg font-semibold">Total</span>
						<span className="text-lg font-semibold">${(totalCents/100).toFixed(2)}</span>
					</div>
					<Link href={`/checkout${restaurantId ? `?restaurantId=${restaurantId}` : ''}`} className="inline-block rounded bg-black px-4 py-2 text-white">Checkout</Link>
				</div>
			)}
		</div>
	)
}