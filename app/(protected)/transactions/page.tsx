// src/app/transactions/page.tsx
'use client';
import { useState, useEffect } from 'react';
import {
	getTransactionsByDateRange,
	updateTransaction,
	deleteTransaction,
	markTransactionAsPaid,
	addTransaction,
} from '@/lib/api/transactions';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TransactionType, RecurrenceInterval } from '@prisma/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DateRange } from 'react-day-picker';
import { Loader2 } from 'lucide-react';

interface Transaction {
	id: string;
	amount: number;
	description: string;
	date: Date;
	type: TransactionType;
	isRecurring: boolean;
	recurrenceInterval: RecurrenceInterval | null;
	paid: boolean;
}

export default function TransactionsPage() {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(true);
	const [dateRange, setDateRange] = useState<DateRange | undefined>({
		from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
		to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
	});
	const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
	const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);

	useEffect(() => {
		if (dateRange?.from && dateRange?.to) {
			loadTransactions();
		}
	}, [dateRange]);

	async function loadTransactions() {
		if (!dateRange?.from || !dateRange?.to) return;
		setLoading(true);
		try {
			const data = await getTransactionsByDateRange(dateRange.from, dateRange.to);
			setTransactions(data);
		} catch (error) {
			console.error('Failed to load transactions:', error);
		} finally {
			setLoading(false);
		}
	}

	const handleDateRangeChange = (range: DateRange | undefined) => {
		setDateRange(range);
	};

	function handleAdd() {
		setEditingTransaction(null);
		setIsTransactionDialogOpen(true);
	}

	function handleEdit(transaction: Transaction) {
		setEditingTransaction(transaction);
		setIsTransactionDialogOpen(true);
	}

	async function handleTransactionSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const isRecurring = formData.get('isRecurring') === 'on';
		const transactionData: Partial<any> = {
			amount: Number(formData.get('amount')),
			description: formData.get('description') as string,
			date: new Date(formData.get('date') as string),
			type: formData.get('type') as TransactionType,
			isRecurring: isRecurring,
			paid: formData.get('paid') === 'on',
			recurrenceInterval: isRecurring ? (formData.get('recurrenceInterval') as RecurrenceInterval) : null,
		};

		try {
			if (editingTransaction) {
				await updateTransaction(editingTransaction.id, transactionData);
			} else {
				await addTransaction(transactionData as any);
			}
			setIsTransactionDialogOpen(false);
			loadTransactions();
		} catch (error) {
			console.error('Failed to save transaction:', error);
		}
	}

	async function handleDelete(id: string) {
		try {
			await deleteTransaction(id);
			loadTransactions();
		} catch (error) {
			console.error('Failed to delete transaction:', error);
		}
	}

	async function handleMarkAsPaid(id: string) {
		try {
			await markTransactionAsPaid(id);
			loadTransactions();
		} catch (error) {
			console.error('Failed to mark transaction as paid:', error);
		}
	}

	if (loading) {
		return (
			<div>
				<Loader2
					className='
				text-blue-600
				w-16 h-16
				mx-auto
				animate-spin
				animate-spin-slow
				animate-spin-reverse
			'
				/>
			</div>
		);
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl font-bold'>Transactions</h1>
				<Button onClick={handleAdd}>Add Transaction</Button>
			</div>

			<div className='mb-6'>
				<Calendar mode='range' selected={dateRange} onSelect={handleDateRangeChange} className='rounded-md border' />
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Date</TableHead>
						<TableHead>Description</TableHead>
						<TableHead>Amount</TableHead>
						<TableHead>Type</TableHead>
						<TableHead>Recurring</TableHead>
						<TableHead>Paid</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{transactions.map((transaction) => (
						<TableRow key={transaction.id}>
							<TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
							<TableCell>{transaction.description}</TableCell>
							<TableCell>${transaction.amount.toFixed(2)}</TableCell>
							<TableCell>{transaction.type}</TableCell>
							<TableCell>{transaction.isRecurring ? 'Yes' : 'No'}</TableCell>
							<TableCell>{transaction.paid ? 'Yes' : 'No'}</TableCell>
							<TableCell>
								<Button variant='outline' size='sm' className='mr-2' onClick={() => handleEdit(transaction)}>
									Edit
								</Button>
								<Button variant='destructive' size='sm' className='mr-2' onClick={() => handleDelete(transaction.id)}>
									Delete
								</Button>
								{!transaction.paid && (
									<Button variant='secondary' size='sm' onClick={() => handleMarkAsPaid(transaction.id)}>
										Mark as Paid
									</Button>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{editingTransaction ? 'Edit' : 'Add'} Transaction</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleTransactionSubmit}>
						<div className='grid gap-4 py-4'>
							<div className='grid grid-cols-4 items-center gap-4'>
								<Label htmlFor='amount' className='text-right'>
									Amount
								</Label>
								<Input
									id='amount'
									name='amount'
									type='number'
									defaultValue={editingTransaction?.amount}
									className='col-span-3'
									required
								/>
							</div>
							<div className='grid grid-cols-4 items-center gap-4'>
								<Label htmlFor='description' className='text-right'>
									Description
								</Label>
								<Input
									id='description'
									name='description'
									defaultValue={editingTransaction?.description}
									className='col-span-3'
									required
								/>
							</div>
							<div className='grid grid-cols-4 items-center gap-4'>
								<Label htmlFor='date' className='text-right'>
									Date
								</Label>
								<Input
									id='date'
									name='date'
									type='date'
									defaultValue={
										editingTransaction?.date.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
									}
									className='col-span-3'
									required
								/>
							</div>
							<div className='grid grid-cols-4 items-center gap-4'>
								<Label htmlFor='type' className='text-right'>
									Type
								</Label>
								<Select name='type' defaultValue={editingTransaction?.type || TransactionType.EXPENSE}>
									<SelectTrigger className='col-span-3'>
										<SelectValue placeholder='Select type' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value={TransactionType.INCOME}>Income</SelectItem>
										<SelectItem value={TransactionType.EXPENSE}>Expense</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className='grid grid-cols-4 items-center gap-4'>
								<Label htmlFor='isRecurring' className='text-right'>
									Recurring
								</Label>
								<Switch id='isRecurring' name='isRecurring' defaultChecked={editingTransaction?.isRecurring} />
							</div>
							<div className='grid grid-cols-4 items-center gap-4'>
								<Label htmlFor='recurrenceInterval' className='text-right'>
									Recurrence
								</Label>
								<Select
									name='recurrenceInterval'
									defaultValue={editingTransaction?.recurrenceInterval || undefined}
									disabled={!editingTransaction?.isRecurring}
								>
									<SelectTrigger className='col-span-3'>
										<SelectValue placeholder='Select interval' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value={RecurrenceInterval.WEEKLY}>Weekly</SelectItem>
										<SelectItem value={RecurrenceInterval.BIWEEKLY}>Bi-weekly</SelectItem>
										<SelectItem value={RecurrenceInterval.MONTHLY}>Monthly</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className='grid grid-cols-4 items-center gap-4'>
								<Label htmlFor='paid' className='text-right'>
									Paid
								</Label>
								<Switch id='paid' name='paid' defaultChecked={editingTransaction?.paid} />
							</div>
						</div>
						<DialogFooter>
							<Button type='submit'>Save</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
