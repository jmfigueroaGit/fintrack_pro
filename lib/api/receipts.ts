// src/lib/api/receipts.ts
'use server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { put, del } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { Receipt } from '@prisma/client';

export async function getReceipts() {
	const session = await getServerSession(authOptions);

	if (!session) {
		throw new Error('Unauthorized');
	}

	try {
		const receipts = await prisma.receipt.findMany({
			where: { userId: session.user.id },
			orderBy: { date: 'desc' },
		});

		return receipts;
	} catch (error) {
		console.error('Error fetching receipts:', error);
		throw new Error('Failed to fetch receipts');
	}
}

export async function getReceipt(id: string) {
	const session = await getServerSession(authOptions);

	if (!session) {
		throw new Error('Unauthorized');
	}

	try {
		const receipt = await prisma.receipt.findUnique({
			where: { id, userId: session.user.id },
		});

		if (!receipt) {
			throw new Error('Receipt not found');
		}

		return receipt;
	} catch (error) {
		console.error('Error fetching receipt:', error);
		throw new Error('Failed to fetch receipt');
	}
}

export async function updateReceipt(id: string, data: Partial<any>) {
	const session = await getServerSession(authOptions);

	if (!session) {
		throw new Error('Unauthorized');
	}

	try {
		const updatedReceipt = await prisma.receipt.update({
			where: { id, userId: session.user.id },
			data: {
				transactionType: data.transactionType,
				recipientName: data.recipientName,
				amount: data.amount,
				currency: data.currency,
				date: data.date ? new Date(data.date) : undefined,
				referenceNumber: data.referenceNumber,
				paymentMethod: data.paymentMethod,
				accountNumber: data.accountNumber,
				additionalDetails: data.additionalDetails,
			},
		});

		revalidatePath('/receipts');
		return updatedReceipt;
	} catch (error) {
		console.error('Error updating receipt:', error);
		throw new Error('Failed to update receipt');
	}
}

export async function deleteReceipt(id: string) {
	const session = await getServerSession(authOptions);

	if (!session) {
		throw new Error('Unauthorized');
	}

	try {
		const receipt = await prisma.receipt.findUnique({
			where: { id, userId: session.user.id },
		});

		if (!receipt) {
			throw new Error('Receipt not found');
		}

		// Delete the image from Vercel Blob Storage
		await del(receipt.imageUrl);

		// Delete the receipt from the database
		await prisma.receipt.delete({
			where: { id },
		});

		revalidatePath('/receipts');
		return { message: 'Receipt deleted successfully' };
	} catch (error) {
		console.error('Error deleting receipt:', error);
		throw new Error('Failed to delete receipt');
	}
}

export async function uploadReceipt(formData: FormData) {
	const session = await getServerSession(authOptions);

	if (!session) {
		throw new Error('Unauthorized');
	}

	try {
		const file = formData.get('file') as File;
		const extractedDataString = formData.get('extractedData') as string;

		if (!file) {
			throw new Error('No file uploaded');
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

		revalidatePath('/receipts');
		return {
			success: true,
			blobUrl: blob.url,
			receiptId: receipt.id,
		};
	} catch (error) {
		console.error('Error processing receipt:', error);
		throw new Error('Failed to process receipt');
	}
}
