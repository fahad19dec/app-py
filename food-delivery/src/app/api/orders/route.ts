import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET() {
	const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' }, include: { items: { include: { menuItem: true } }, restaurant: true } })
	return NextResponse.json(orders)
}

export async function POST() {
	const sessionId = (await cookies()).get('sb_session')?.value
	if (!sessionId) return NextResponse.json({ error: 'no session' }, { status: 400 })
	const cart = await prisma.cart.findUnique({ where: { sessionId }, include: { items: { include: { menuItem: true } } } })
	if (!cart || cart.items.length === 0) return NextResponse.json({ error: 'empty cart' }, { status: 400 })
	const restaurantId = cart.items[0].menuItem.restaurantId
	const totalCents = cart.items.reduce((s, i) => s + i.quantity * i.menuItem.priceCents, 0)
	const order = await prisma.order.create({
		data: {
			restaurantId,
			totalCents: totalCents,
			items: { create: cart.items.map(ci => ({ menuItemId: ci.menuItemId, quantity: ci.quantity, priceCents: ci.menuItem.priceCents })) },
		},
	})
	await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
	return NextResponse.json({ id: order.id })
}