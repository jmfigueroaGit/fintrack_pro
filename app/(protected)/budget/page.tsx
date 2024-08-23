// src/app/budget/page.tsx
'use client';
import { withAuth } from '@/lib/auth/withAuth';
import { useState, useEffect } from 'react';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { addBudget, getAllBudgets, updateBudget, deleteBudget, BudgetData } from '@/lib/api/budgets';
import { TransactionType, BudgetPeriod } from '@prisma/client';
import { Card, CardContent } from '@/components/ui/card';

interface Budget extends BudgetData {
	id: string;
}

function BudgetPage() {
	const [budgets, setBudgets] = useState<Budget[]>([]);
	const [loading, setLoading] = useState(true);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);

	useEffect(() => {
		loadBudgets();
	}, []);

	async function loadBudgets() {
		try {
			setLoading(true);
			const data = await getAllBudgets();
			setBudgets(data);
		} catch (error) {
			console.error('Failed to load budgets:', error);
		} finally {
			setLoading(false);
		}
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const budgetData: BudgetData = {
			category: formData.get('category') as string,
			amount: Number(formData.get('amount')),
			type: formData.get('type') as TransactionType,
			period: formData.get('period') as BudgetPeriod,
		};

		try {
			if (currentBudget) {
				await updateBudget(currentBudget.id, budgetData);
			} else {
				await addBudget(budgetData);
			}
			setIsDialogOpen(false);
			loadBudgets();
		} catch (error) {
			console.error('Failed to save budget:', error);
		}
	}

	async function handleDelete(id: string) {
		try {
			await deleteBudget(id);
			loadBudgets();
		} catch (error) {
			console.error('Failed to delete budget:', error);
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
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6'>
				<h1 className='text-2xl font-bold mb-4 sm:mb-0'>Budget Planning</h1>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button onClick={() => setCurrentBudget(null)}>
							<Plus className='mr-2 h-4 w-4' /> Add Budget
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{currentBudget ? 'Edit' : 'Add'} Budget</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleSubmit} className='space-y-4'>
							<Input name='category' placeholder='Category' defaultValue={currentBudget?.category} required />
							<Input type='number' name='amount' placeholder='Amount' defaultValue={currentBudget?.amount} required />
							<Select name='type' defaultValue={currentBudget?.type || TransactionType.EXPENSE}>
								<SelectTrigger>
									<SelectValue placeholder='Select type' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={TransactionType.INCOME}>Income</SelectItem>
									<SelectItem value={TransactionType.EXPENSE}>Expense</SelectItem>
								</SelectContent>
							</Select>
							<Select name='period' defaultValue={currentBudget?.period || BudgetPeriod.MONTHLY}>
								<SelectTrigger>
									<SelectValue placeholder='Select period' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={BudgetPeriod.WEEKLY}>Weekly</SelectItem>
									<SelectItem value={BudgetPeriod.MONTHLY}>Monthly</SelectItem>
									<SelectItem value={BudgetPeriod.YEARLY}>Yearly</SelectItem>
								</SelectContent>
							</Select>
							<Button type='submit'>{currentBudget ? 'Update' : 'Add'} Budget</Button>
						</form>
					</DialogContent>
				</Dialog>
			</div>
			{/* Table for larger screens */}
			<div className='hidden md:block overflow-x-auto'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Category</TableHead>
							<TableHead>Amount</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Period</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{budgets.map((budget) => (
							<TableRow key={budget.id}>
								<TableCell>{budget.category}</TableCell>
								<TableCell>₱{budget.amount.toFixed(2)}</TableCell>
								<TableCell>{budget.type}</TableCell>
								<TableCell>{budget.period}</TableCell>
								<TableCell>
									<Button
										variant='ghost'
										size='icon'
										onClick={() => {
											setCurrentBudget(budget);
											setIsDialogOpen(true);
										}}
									>
										<Pencil className='h-4 w-4' />
									</Button>
									<Button variant='ghost' size='icon' onClick={() => handleDelete(budget.id)}>
										<Trash2 className='h-4 w-4' />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Cards for mobile view */}
			<div className='md:hidden grid gap-4'>
				{budgets.map((budget) => (
					<Card key={budget.id}>
						<CardContent className='pt-6'>
							<h3 className='font-bold mb-2'>{budget.category}</h3>
							<p>₱{budget.amount.toFixed(2)}</p>
							<p className='text-sm'>
								{budget.type} - {budget.period}
							</p>
							<div className='mt-4 flex justify-end space-x-2'>
								<Button
									variant='ghost'
									size='icon'
									onClick={() => {
										setCurrentBudget(budget);
										setIsDialogOpen(true);
									}}
								>
									<Pencil className='h-4 w-4' />
								</Button>
								<Button variant='ghost' size='icon' onClick={() => handleDelete(budget.id)}>
									<Trash2 className='h-4 w-4' />
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}

export default withAuth(BudgetPage);
