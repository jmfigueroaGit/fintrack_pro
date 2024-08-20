// src/app/api/receipts/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { del } from '@vercel/blob';

// GET all receipts
export async function GET(request: Request) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const receipts = await prisma.receipt.findMany({
			where: { userId: session.user.id },
			orderBy: { date: 'desc' },
		});

		return NextResponse.json(receipts);
	} catch (error) {
		console.error('Error fetching receipts:', error);
		return NextResponse.json({ error: 'Failed to fetch receipts' }, { status: 500 });
	}
}
