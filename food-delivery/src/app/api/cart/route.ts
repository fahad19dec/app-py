import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

async function getOrCreateCart(sessionId: string) {
	let cart = await prisma.cart.findUnique({ where: { sessionId }, include: { items: { include: { menuItem: true } } } })
	if (!cart) {
		cart = await prisma.cart.create({ data: { sessionId }, include: { items: { include: { menuItem: true } } } })
	}
	return cart
}

export async function GET() {
	const sessionId = (await cookies()).get('sb_session')?.value
	if (!sessionId) return NextResponse.json({ items: [] })
	const cart = await prisma.cart.findUnique({ where: { sessionId }, include: { items: { include: { menuItem: true } } } })
	return NextResponse.json(cart ?? { items: [] })
}

export async function POST(request: Request) {
	const sessionId = (await cookies()).get('sb_session')?.value
	if (!sessionId) return NextResponse.json({ error: 'no session' }, { status: 400 })
	const { menuItemId, quantity } = await request.json()
	const menuItem = await prisma.menuItem.findUnique({ where: { id: menuItemId } })
	if (!menuItem || !menuItem.isAvailable) return NextResponse.json({ error: 'invalid item' }, { status: 400 })
	const cart = await getOrCreateCart(sessionId)
	const existing = cart.items.find(i => i.menuItemId === menuItemId)
	if (existing) {
		await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity + (quantity ?? 1) } })
	} else {
		await prisma.cartItem.create({ data: { cartId: cart.id, menuItemId, quantity: quantity ?? 1 } })
	}
	return NextResponse.json({ ok: true })
}

export async function DELETE() {
	const sessionId = (await cookies()).get('sb_session')?.value
	if (!sessionId) return NextResponse.json({ ok: true })
	const cart = await prisma.cart.findUnique({ where: { sessionId } })
	if (cart) {
		await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
	}
	return NextResponse.json({ ok: true })
}