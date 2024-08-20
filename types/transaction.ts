import { TransactionType, RecurrenceInterval } from '@prisma/client';

export interface Transaction {
	id: string;
	amount: number;
	description: string;
	date: Date; // Changed from string to Date
	type: TransactionType;
	isRecurring: boolean;
	recurrenceInterval: RecurrenceInterval | null;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
}
