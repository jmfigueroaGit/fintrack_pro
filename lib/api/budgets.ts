// src/lib/api/budgets.ts
'use server';

import { prisma } from '@/lib/prisma';
import { TransactionType, BudgetPeriod } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export interface BudgetData {
	category: string;
	amount: number;
	type: TransactionType;
	period: BudgetPeriod;
}

export async function addBudget(data: BudgetData) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			throw new Error('User not authenticated');
		}

		const budget = await prisma.budget.create({
			data: {
				...data,
				userId: session.user.id,
			},
		});
		return budget;
	} catch (error) {
		console.error('Failed to add budget:', error);
		throw new Error('Failed to add budget');
	}
}

export async function getBudget(id: string) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			throw new Error('User not authenticated');
		}

		const budget = await prisma.budget.findUnique({
			where: { id, userId: session.user.id },
		});
		return budget;
	} catch (error) {
		console.error('Failed to get budget:', error);
		throw new Error('Failed to get budget');
	}
}

export async function getAllBudgets() {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			throw new Error('User not authenticated');
		}

		const budgets = await prisma.budget.findMany({
			where: { userId: session.user.id },
			orderBy: { category: 'asc' },
		});
		return budgets;
	} catch (error) {
		console.error('Failed to get all budgets:', error);
		throw new Error('Failed to get all budgets');
	}
}

export async function updateBudget(id: string, data: Partial<BudgetData>) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			throw new Error('User not authenticated');
		}

		const budget = await prisma.budget.update({
			where: { id, userId: session.user.id },
			data,
		});

		return budget;
	} catch (error) {
		console.error('Failed to update budget:', error);
		throw new Error('Failed to update budget');
	}
}

export async function deleteBudget(id: string) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			throw new Error('User not authenticated');
		}

		await prisma.budget.delete({
			where: { id, userId: session.user.id },
		});
	} catch (error) {
		console.error('Failed to delete budget:', error);
		throw new Error('Failed to delete budget');
	}
}
