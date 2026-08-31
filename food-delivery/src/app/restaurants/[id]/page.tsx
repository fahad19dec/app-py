import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import AddToCartButton from '@/components/AddToCartButton'

export default async function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	const restaurant = await prisma.restaurant.findUnique({
		where: { id },
		include: { menuItems: { where: { isAvailable: true }, orderBy: { title: 'asc' } } },
	})
	if (!restaurant) return notFound()

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-semibold">{restaurant.name}</h1>
			<p className="text-gray-600">{restaurant.cuisine} • {restaurant.deliveryEstimateMins}-{restaurant.deliveryEstimateMins + 10} min</p>
			<div className="grid grid-cols-1 gap-4">
				{restaurant.menuItems.map(item => (
					<div key={item.id} className="rounded-lg border bg-white p-4 flex items-start justify-between gap-4">
						<div>
							<h3 className="font-medium">{item.title}</h3>
							<p className="text-sm text-gray-600">{item.description}</p>
							<p className="mt-1 font-semibold">${(item.priceCents/100).toFixed(2)}</p>
						</div>
						<AddToCartButton menuItemId={item.id} />
					</div>
				))}
			</div>
		</div>
	)
}