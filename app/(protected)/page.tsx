// src/app/dashboard/page.tsx
'use client';
import { withAuth } from '@/lib/auth/withAuth';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from 'recharts';
import { getAllTransactions } from '@/lib/api/transactions';
import { getAllBudgets } from '@/lib/api/budgets';
import { TransactionType, BudgetPeriod, RecurrenceInterval } from '@prisma/client';

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

interface Budget {
	id: string;
	category: string;
	amount: number;
	type: TransactionType;
	period: BudgetPeriod;
}

function DashboardPage() {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [budgets, setBudgets] = useState<Budget[]>([]);
	const [loading, setLoading] = useState(true);
	const [filterPeriod, setFilterPeriod] = useState<'week' | 'month' | 'year'>('month');
	const [filterDate, setFilterDate] = useState<Date>(new Date());

	useEffect(() => {
		loadData();
	}, [filterPeriod, filterDate]);

	async function loadData() {
		setLoading(true);
		try {
			const [transactionsData, budgetsData] = await Promise.all([getAllTransactions(), getAllBudgets()]);
			setTransactions(filterTransactionsByDate(transactionsData));
			setBudgets(budgetsData);
		} catch (error) {
			console.error('Failed to load dashboard data:', error);
		} finally {
			setLoading(false);
		}
	}

	function filterTransactionsByDate(allTransactions: Transaction[]): Transaction[] {
		const startDate = getStartDate();
		return allTransactions.filter((t) => t.date >= startDate && t.date <= filterDate);
	}

	function getStartDate(): Date {
		const start = new Date(filterDate);
		switch (filterPeriod) {
			case 'week':
				start.setDate(start.getDate() - 7);
				break;
			case 'month':
				start.setMonth(start.getMonth() - 1);
				break;
			case 'year':
				start.setFullYear(start.getFullYear() - 1);
				break;
		}
		return start;
	}

	const totalIncome = transactions
		.filter((t) => t.type === TransactionType.INCOME)
		.reduce((sum, t) => sum + t.amount, 0);
	const totalExpenses = transactions
		.filter((t) => t.type === TransactionType.EXPENSE)
		.reduce((sum, t) => sum + t.amount, 0);
	const balance = totalIncome - totalExpenses;

	const incomeVsExpensesData = [
		{ name: 'Income', amount: totalIncome },
		{ name: 'Expenses', amount: totalExpenses },
	];

	const expensesByCategory = transactions
		.filter((t) => t.type === TransactionType.EXPENSE)
		.reduce((acc, t) => {
			acc[t.description] = (acc[t.description] || 0) + t.amount;
			return acc;
		}, {} as Record<string, number>);

	const expensesPieChartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
		name: category,
		value: amount,
	}));

	const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'];

	const budgetComparisonData = budgets.map((budget) => {
		const actualSpending = transactions
			.filter((t) => t.type === budget.type && t.description === budget.category)
			.reduce((sum, t) => sum + t.amount, 0);
		return {
			category: budget.category,
			budgeted: budget.amount,
			actual: actualSpending,
		};
	});

	if (loading) {
		return (
			<div className='flex justify-center items-center h-64'>
				<Loader2 className='h-8 w-8 animate-spin' />
			</div>
		);
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-2xl font-bold mb-6'>Financial Dashboard</h1>

			<div className='mb-6 flex space-x-4'>
				<Select value={filterPeriod} onValueChange={(value: 'week' | 'month' | 'year') => setFilterPeriod(value)}>
					<SelectTrigger>
						<SelectValue placeholder='Select period' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='week'>Week</SelectItem>
						<SelectItem value='month'>Month</SelectItem>
						<SelectItem value='year'>Year</SelectItem>
					</SelectContent>
				</Select>
				<input
					type='date'
					value={filterDate ? filterDate.toISOString().split('T')[0] : ''}
					onChange={(e) => {
						const date: any = e.target.value ? new Date(e.target.value) : null;
						setFilterDate(date);
					}}
					className='border rounded px-2 py-1'
				/>
			</div>

			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8'>
				<Card>
					<CardHeader>
						<CardTitle>Total Income</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-2xl font-bold text-green-600'>${totalIncome.toFixed(2)}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Total Expenses</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-2xl font-bold text-red-600'>${totalExpenses.toFixed(2)}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Balance</CardTitle>
					</CardHeader>
					<CardContent>
						<p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
							${balance.toFixed(2)}
						</p>
					</CardContent>
				</Card>
			</div>

			<div className='grid gap-4 md:grid-cols-2 mb-8'>
				<Card>
					<CardHeader>
						<CardTitle>Income vs Expenses</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='h-[300px]'>
							<ResponsiveContainer width='100%' height='100%'>
								<BarChart data={incomeVsExpensesData}>
									<CartesianGrid strokeDasharray='3 3' />
									<XAxis dataKey='name' />
									<YAxis />
									<Tooltip />
									<Legend />
									<Bar dataKey='amount' fill='#8884d8' />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Expenses by Category</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='h-[300px]'>
							<ResponsiveContainer width='100%' height='100%'>
								<PieChart>
									<Pie
										data={expensesPieChartData}
										cx='50%'
										cy='50%'
										labelLine={false}
										outerRadius={80}
										fill='#8884d8'
										dataKey='value'
										label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
									>
										{expensesPieChartData.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
										))}
									</Pie>
									<Tooltip />
								</PieChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Budget vs Actual Spending</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='h-[400px]'>
						<ResponsiveContainer width='100%' height='100%'>
							<BarChart data={budgetComparisonData}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='category' />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar dataKey='budgeted' fill='#8884d8' name='Budgeted' />
								<Bar dataKey='actual' fill='#82ca9d' name='Actual' />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default withAuth(DashboardPage);
