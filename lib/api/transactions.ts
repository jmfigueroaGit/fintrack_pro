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
	paid: boolean;
}

export async function getTransactionsByDateRange(startDate: Date, endDate: Date) {
	const session = await getServerSession(authOptions);

	if (!session) {
		throw new Error('Unauthorized');
	}

	try {
		const transactions = await prisma.transaction.findMany({
			where: {
				userId: session.user.id,
				date: {
					gte: startDate,
					lte: endDate,
				},
			},
			orderBy: { date: 'desc' },
		});
		return transactions;
	} catch (error) {
		console.error('Error fetching transactions:', error);
		throw new Error('Failed to fetch transactions');
	}
}

export async function updateTransaction(id: string, data: Partial<TransactionData>) {
	const session = await getServerSession(authOptions);

	if (!session) {
		throw new Error('Unauthorized');
	}

	try {
		const updatedTransaction = await prisma.transaction.update({
			where: { id, userId: session.user.id },
			data: {
				...data,
				recurrenceInterval: data.isRecurring ? data.recurrenceInterval : null,
			},
		});

		return updatedTransaction;
	} catch (error) {
		console.error('Error updating transaction:', error);
		throw new Error('Failed to update transaction');
	}
}

export async function deleteTransaction(id: string) {
	const session = await getServerSession(authOptions);

	if (!session) {
		throw new Error('Unauthorized');
	}

	try {
		await prisma.transaction.delete({
			where: { id, userId: session.user.id },
		});
	} catch (error) {
		console.error('Error deleting transaction:', error);
		throw new Error('Failed to delete transaction');
	}
}

export async function markTransactionAsPaid(id: string) {
	const session = await getServerSession(authOptions);

	if (!session) {
		throw new Error('Unauthorized');
	}

	try {
		const updatedTransaction = await prisma.transaction.update({
			where: { id, userId: session.user.id },
			data: { paid: true },
		});

		return updatedTransaction;
	} catch (error) {
		console.error('Error marking transaction as paid:', error);
		throw new Error('Failed to mark transaction as paid');
	}
}

export async function addTransaction(data: Omit<TransactionData, 'id'>) {
	const session = await getServerSession(authOptions);

	if (!session) {
		throw new Error('Unauthorized');
	}

	try {
		const newTransaction = await prisma.transaction.create({
			data: {
				...data,
				userId: session.user.id,
				recurrenceInterval: data.isRecurring ? data.recurrenceInterval : null,
			},
		});

		return newTransaction;
	} catch (error) {
		console.error('Error adding transaction:', error);
		throw new Error('Failed to add transaction');
	}
}
