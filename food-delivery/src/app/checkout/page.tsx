"use client"

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
	const router = useRouter()
	const [cart, setCart] = useState<any>(null)
	const [placing, setPlacing] = useState(false)

	useEffect(() => {
		fetch('/api/cart').then(r => r.json()).then(setCart)
	}, [])

	const totalCents = useMemo(() => (cart?.items ?? []).reduce((s: number, i: any) => s + i.quantity * i.menuItem.priceCents, 0), [cart])

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-semibold">Checkout</h1>
			{!cart || !cart.items?.length ? (
				<p>Nothing to checkout.</p>
			) : (
				<div className="space-y-4">
					<ul className="divide-y rounded-lg border bg-white">
						{cart.items.map((ci: any) => (
							<li key={ci.id} className="flex items-center justify-between p-3">
								<span>{ci.menuItem.title} × {ci.quantity}</span>
								<span className="font-medium">${((ci.menuItem.priceCents * ci.quantity)/100).toFixed(2)}</span>
							</li>
						))}
					</ul>
					<div className="flex items-center justify-between">
						<span className="text-lg font-semibold">Total</span>
						<span className="text-lg font-semibold">${(totalCents/100).toFixed(2)}</span>
					</div>
					<button
						className="rounded bg-black px-4 py-2 text-white disabled:opacity-60"
						disabled={placing}
						onClick={async () => {
							setPlacing(true)
							const res = await fetch('/api/orders', { method: 'POST' })
							if (res.ok) {
								const data = await res.json()
								router.push(`/orders/${data.id}`)
							} else {
								setPlacing(false)
							}
						}}
					>
						{placing ? 'Placing…' : 'Place order'}
					</button>
				</div>
			)}
		</div>
	)
}