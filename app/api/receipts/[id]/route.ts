// src/app/api/receipts/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { del } from '@vercel/blob';

// GET a single receipt
export async function GET(request: Request, { params }: { params: { id: string } }) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const receipt = await prisma.receipt.findUnique({
			where: { id: params.id, userId: session.user.id },
		});

		if (!receipt) {
			return NextResponse.json({ error: 'Receipt not found' }, { status: 404 });
		}

		return NextResponse.json(receipt);
	} catch (error) {
		console.error('Error fetching receipt:', error);
		return NextResponse.json({ error: 'Failed to fetch receipt' }, { status: 500 });
	}
}

// PUT to update a receipt
export async function PUT(request: Request, { params }: { params: { id: string } }) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const body = await request.json();
		const updatedReceipt = await prisma.receipt.update({
			where: { id: params.id, userId: session.user.id },
			data: body,
		});

		return NextResponse.json(updatedReceipt);
	} catch (error) {
		console.error('Error updating receipt:', error);
		return NextResponse.json({ error: 'Failed to update receipt' }, { status: 500 });
	}
}

// DELETE a receipt
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const receipt = await prisma.receipt.findUnique({
			where: { id: params.id, userId: session.user.id },
		});

		if (!receipt) {
			return NextResponse.json({ error: 'Receipt not found' }, { status: 404 });
		}

		// Delete the image from Vercel Blob Storage
		await del(receipt.imageUrl);

		// Delete the receipt from the database
		await prisma.receipt.delete({
			where: { id: params.id },
		});

		return NextResponse.json({ message: 'Receipt deleted successfully' });
	} catch (error) {
		console.error('Error deleting receipt:', error);
		return NextResponse.json({ error: 'Failed to delete receipt' }, { status: 500 });
	}
}
