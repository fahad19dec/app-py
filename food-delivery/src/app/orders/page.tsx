import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import StatusBadge from '@/components/StatusBadge'

export default async function OrdersPage() {
	const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' }, include: { restaurant: true } })
	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-semibold">Orders</h1>
			<ul className="space-y-3">
				{orders.map(o => (
					<li key={o.id} className="rounded-lg border bg-white p-4 flex items-center justify-between">
						<div>
							<p className="font-medium">{o.restaurant.name}</p>
							<p className="text-sm text-gray-600 flex items-center gap-2"><StatusBadge status={o.status} /> ${(o.totalCents/100).toFixed(2)}</p>
						</div>
						<Link href={`/orders/${o.id}`} className="text-sm underline">View</Link>
					</li>
				))}
			</ul>
		</div>
	)
}