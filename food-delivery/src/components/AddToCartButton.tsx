"use client"

import { useState, useTransition } from 'react'

export default function AddToCartButton({ menuItemId }: { menuItemId: string }) {
	const [isPending, startTransition] = useTransition()
	const [ok, setOk] = useState<boolean | null>(null)

	return (
		<button
			className="rounded bg-black px-3 py-1.5 text-white disabled:opacity-60"
			disabled={isPending}
			onClick={() => {
				startTransition(async () => {
					setOk(null)
					const res = await fetch('/api/cart', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ menuItemId, quantity: 1 }),
					})
					setOk(res.ok)
				})
			}}
		>
			{isPending ? 'Adding…' : ok === true ? 'Added!' : 'Add to cart'}
		</button>
	)
}