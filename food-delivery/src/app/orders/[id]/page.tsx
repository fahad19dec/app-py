import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import StatusBadge from '@/components/StatusBadge'

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const order = await prisma.order.findUnique({
		where: { id },
		include: { items: { include: { menuItem: true } }, restaurant: true },
	})
	if (!order) return notFound()

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-semibold">Order at {order.restaurant.name}</h1>
			<p className="text-gray-600 flex items-center gap-2">Status: <StatusBadge status={order.status} /></p>
			<ul className="divide-y rounded-lg border bg-white">
				{order.items.map(i => (
					<li key={i.id} className="flex items-center justify-between p-3">
						<span>{i.menuItem.title} × {i.quantity}</span>
						<span className="font-medium">${((i.priceCents * i.quantity)/100).toFixed(2)}</span>
					</li>
				))}
			</ul>
			<div className="flex items-center justify-between">
				<span className="text-lg font-semibold">Total</span>
				<span className="text-lg font-semibold">${(order.totalCents/100).toFixed(2)}</span>
			</div>
		</div>
	)
}