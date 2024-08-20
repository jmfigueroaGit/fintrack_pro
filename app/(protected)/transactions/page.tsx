// src/app/transactions/page.tsx
'use client';
import { withAuth } from '@/lib/auth/withAuth';
import { useState, useEffect } from 'react';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
	addTransaction,
	getAllTransactions,
	updateTransaction,
	deleteTransaction,
	TransactionData,
} from '@/lib/api/transactions';
import { TransactionType, RecurrenceInterval } from '@prisma/client';

interface Transaction extends TransactionData {
	id: string;
}

function TransactionsPage() {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(true);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);

	useEffect(() => {
		loadTransactions();
	}, []);

	async function loadTransactions() {
		try {
			setLoading(true);
			const data = await getAllTransactions();
			setTransactions(data);
		} catch (error) {
			console.error('Failed to load transactions:', error);
		} finally {
			setLoading(false);
		}
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const transactionData: TransactionData = {
			amount: Number(formData.get('amount')),
			description: formData.get('description') as string,
			date: new Date(formData.get('date') as string),
			type: formData.get('type') as TransactionType,
			isRecurring: formData.get('isRecurring') === 'on',
			recurrenceInterval: (formData.get('recurrenceInterval') as RecurrenceInterval | 'NONE') || 'NONE',
		};

		try {
			if (currentTransaction) {
				await updateTransaction(currentTransaction.id, transactionData);
			} else {
				await addTransaction(transactionData);
			}
			setIsDialogOpen(false);
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

	if (loading) {
		return (
			<div className='flex justify-center items-center h-64'>
				<Loader2 className='h-8 w-8 animate-spin' />
			</div>
		);
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl font-bold'>Transactions</h1>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button onClick={() => setCurrentTransaction(null)}>
							<Plus className='mr-2 h-4 w-4' /> Add Transaction
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{currentTransaction ? 'Edit' : 'Add'} Transaction</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleSubmit} className='space-y-4'>
							<Input
								type='number'
								name='amount'
								placeholder='Amount'
								defaultValue={currentTransaction?.amount}
								required
							/>
							<Input
								type='text'
								name='description'
								placeholder='Description'
								defaultValue={currentTransaction?.description}
								required
							/>
							<Input
								type='date'
								name='date'
								defaultValue={
									currentTransaction
										? new Date(currentTransaction.date).toISOString().split('T')[0]
										: new Date().toISOString().split('T')[0]
								}
								required
							/>
							<Select name='type' defaultValue={currentTransaction?.type || TransactionType.EXPENSE}>
								<SelectTrigger>
									<SelectValue placeholder='Select type' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={TransactionType.INCOME}>Income</SelectItem>
									<SelectItem value={TransactionType.EXPENSE}>Expense</SelectItem>
								</SelectContent>
							</Select>
							<div className='flex items-center space-x-2'>
								<Switch id='isRecurring' name='isRecurring' defaultChecked={currentTransaction?.isRecurring} />
								<Label htmlFor='isRecurring'>Recurring Transaction</Label>
							</div>
							<Select name='recurrenceInterval' defaultValue={currentTransaction?.recurrenceInterval || 'NONE'}>
								<SelectTrigger>
									<SelectValue placeholder='Select recurrence interval' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='NONE'>None</SelectItem>
									<SelectItem value={RecurrenceInterval.WEEKLY}>Weekly</SelectItem>
									<SelectItem value={RecurrenceInterval.BIWEEKLY}>Bi-weekly</SelectItem>
									<SelectItem value={RecurrenceInterval.MONTHLY}>Monthly</SelectItem>
								</SelectContent>
							</Select>
							<Button type='submit'>{currentTransaction ? 'Update' : 'Add'} Transaction</Button>
						</form>
					</DialogContent>
				</Dialog>
			</div>
			<div className='overflow-x-auto'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Date</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>Amount</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Recurring</TableHead>
							<TableHead>Interval</TableHead>
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
								<TableCell>{transaction.recurrenceInterval}</TableCell>
								<TableCell>
									<Button
										variant='ghost'
										size='icon'
										onClick={() => {
											setCurrentTransaction(transaction);
											setIsDialogOpen(true);
										}}
									>
										<Pencil className='h-4 w-4' />
									</Button>
									<Button variant='ghost' size='icon' onClick={() => handleDelete(transaction.id)}>
										<Trash2 className='h-4 w-4' />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

export default withAuth(TransactionsPage);
