import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function HomePage() {
	const restaurants = await prisma.restaurant.findMany({
		orderBy: { name: 'asc' },
	})

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-semibold">Restaurants</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{restaurants.map(r => (
					<Link key={r.id} href={`/restaurants/${r.id}`} className="block rounded-lg border bg-white p-4 hover:shadow">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-lg font-medium">{r.name}</h2>
								<p className="text-sm text-gray-500">{r.cuisine}</p>
							</div>
							<span className="text-sm text-gray-600">{r.deliveryEstimateMins}-{r.deliveryEstimateMins + 10} min</span>
						</div>
					</Link>
				))}
			</div>
		</div>
	)
}