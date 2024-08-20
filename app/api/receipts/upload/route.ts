// src/app/api/receipts/upload/route.ts
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;
		const extractedDataString = formData.get('extractedData') as string;

		if (!file) {
			return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
		}

		// Upload file to Vercel Blob Storage
		const blob = await put(`receipts/${file.name}`, file, {
			access: 'public',
		});

		// Parse the extracted data
		const extractedData = JSON.parse(extractedDataString);

		// Save the receipt data to the database
		const receipt = await prisma.receipt.create({
			data: {
				userId: session.user.id,
				transactionType: extractedData.transactionType,
				recipientName: extractedData.recipientName,
				amount: extractedData.amount,
				currency: extractedData.currency,
				date: new Date(extractedData.date),
				referenceNumber: extractedData.referenceNumber,
				paymentMethod: extractedData.paymentMethod,
				accountNumber: extractedData.accountNumber,
				additionalDetails: extractedData.additionalDetails,
				imageUrl: blob.url,
			},
		});

		return NextResponse.json({
			success: true,
			blobUrl: blob.url,
			receiptId: receipt.id,
		});
	} catch (error) {
		console.error('Error processing receipt:', error);
		return NextResponse.json({ error: 'Failed to process receipt' }, { status: 500 });
	}
}
