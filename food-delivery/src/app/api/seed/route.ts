import { prisma } from '@/lib/prisma'

export async function POST() {
	await prisma.orderItem.deleteMany()
	await prisma.order.deleteMany()
	await prisma.cartItem.deleteMany()
	await prisma.cart.deleteMany()
	await prisma.menuItem.deleteMany()
	await prisma.restaurant.deleteMany()

	await prisma.restaurant.create({
		data: {
			name: 'Pasta Palace',
			cuisine: 'Italian',
			deliveryEstimateMins: 25,
			menuItems: {
				create: [
					{ title: 'Spaghetti Bolognese', description: 'Classic meat sauce', priceCents: 1299 },
					{ title: 'Fettuccine Alfredo', description: 'Creamy parmesan sauce', priceCents: 1199 },
				],
			},
		},
	})

	await prisma.restaurant.create({
		data: {
			name: 'Sushi Central',
			cuisine: 'Japanese',
			deliveryEstimateMins: 35,
			menuItems: {
				create: [
					{ title: 'California Roll', description: 'Crab, avocado, cucumber', priceCents: 899 },
					{ title: 'Salmon Nigiri', description: 'Fresh salmon over rice', priceCents: 1099 },
				],
			},
		},
	})

	return new Response('seeded')
}