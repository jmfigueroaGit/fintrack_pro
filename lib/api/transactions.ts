// src/lib/api/transactions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { TransactionType, RecurrenceInterval } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export interface TransactionData {
	amount: number;
	description: string;
	date: Date;
	type: TransactionType;
	isRecurring: boolean;
	recurrenceInterval?: RecurrenceInterval;
}

export async function addTransaction(data: TransactionData) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			throw new Error('User not authenticated');
		}

		const transaction = await prisma.transaction.create({
			data: {
				...data,
				userId: session.user.id,
			},
		});
		return transaction;
	} catch (error) {
		console.error('Failed to add transaction:', error);
		throw new Error('Failed to add transaction');
	}
}

export async function getTransaction(id: string) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			throw new Error('User not authenticated');
		}

		const transaction = await prisma.transaction.findUnique({
			where: { id, userId: session.user.id },
		});
		return transaction;
	} catch (error) {
		console.error('Failed to get transaction:', error);
		throw new Error('Failed to get transaction');
	}
}

export async function getAllTransactions() {
	const session = await getServerSession(authOptions);

	if (!session) {
		throw new Error('Unauthorized');
	}

	try {
		const transactions = await prisma.transaction.findMany({
			where: { userId: session.user.id },
			orderBy: { date: 'desc' },
		});

		// Prisma automatically converts the date to a JavaScript Date object,
		// so we don't need to do any conversion here.
		return transactions;
	} catch (error) {
		console.error('Failed to fetch transactions:', error);
		throw new Error('Failed to fetch transactions');
	}
}

export async function updateTransaction(id: string, data: Partial<TransactionData>) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			throw new Error('User not authenticated');
		}

		const transaction = await prisma.transaction.update({
			where: { id, userId: session.user.id },
			data,
		});

		return transaction;
	} catch (error) {
		console.error('Failed to update transaction:', error);
		throw new Error('Failed to update transaction');
	}
}

export async function deleteTransaction(id: string) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			throw new Error('User not authenticated');
		}

		await prisma.transaction.delete({
			where: { id, userId: session.user.id },
		});
	} catch (error) {
		console.error('Failed to delete transaction:', error);
		throw new Error('Failed to delete transaction');
	}
}
