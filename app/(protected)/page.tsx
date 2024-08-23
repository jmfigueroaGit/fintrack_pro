// src/app/dashboard/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
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
import { getTransactionsByDateRange } from '@/lib/api/transactions';
import { getAllBudgets } from '@/lib/api/budgets';
import { TransactionType, BudgetPeriod, RecurrenceInterval } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import { DateRange } from 'react-day-picker';

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

interface Budget {
	id: string;
	category: string;
	amount: number;
	type: TransactionType;
	period: BudgetPeriod;
}

export default function DashboardPage() {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [budgets, setBudgets] = useState<Budget[]>([]);
	const [loading, setLoading] = useState(false);
	const [dateRange, setDateRange] = useState<DateRange | undefined>({
		from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
		to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
	});

	useEffect(() => {
		if (dateRange?.from && dateRange?.to) {
			loadData();
		}
	}, []); // Empty dependency array, we'll manually trigger loadData

	async function loadData() {
		if (!dateRange?.from || !dateRange?.to) return;

		setLoading(true);
		try {
			const [transactionsData, budgetsData] = await Promise.all([
				getTransactionsByDateRange(dateRange.from, dateRange.to),
				getAllBudgets(),
			]);
			setTransactions(transactionsData);
			setBudgets(budgetsData);
		} catch (error) {
			console.error('Failed to load dashboard data:', error);
		} finally {
			setLoading(false);
		}
	}

	const handleDateRangeChange = (range: DateRange | undefined) => {
		setDateRange(range);
		if (range?.from && range?.to) {
			loadData();
		}
	};

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
			<h1 className='text-2xl font-bold mb-6'>Financial Dashboard</h1>

			<div className='mb-6'>
				<Calendar mode='range' selected={dateRange} onSelect={handleDateRangeChange} className='rounded-md border' />
				<div className='mt-2 text-sm text-gray-500'>
					{dateRange?.from ? (
						dateRange.to ? (
							<>
								{dateRange.from.toDateString()} - {dateRange.to.toDateString()}
							</>
						) : (
							'Select end date'
						)
					) : (
						'Select start date'
					)}
				</div>
			</div>

			{loading ? (
				<div className='flex justify-center items-center h-64'>
					<div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900'></div>
				</div>
			) : (
				<>
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
								<div className='h-[300px] w-full'>
									<ResponsiveContainer width='100%' height='100%'>
										<BarChart data={incomeVsExpensesData}>
											<CartesianGrid strokeDasharray='3 3' />
											<XAxis dataKey='name' />
											<YAxis />
											<Tooltip contentStyle={{ color: 'black' }} />
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
								<div className='h-[300px] w-full'>
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
											<Tooltip contentStyle={{ color: 'black' }} />
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
							<div className='h-[400px] w-full'>
								<ResponsiveContainer width='100%' height='100%'>
									<BarChart data={budgetComparisonData}>
										<CartesianGrid strokeDasharray='3 3' />
										<XAxis dataKey='category' />
										<YAxis />
										<Tooltip contentStyle={{ color: 'black' }} />
										<Legend />
										<Bar dataKey='budgeted' fill='#8884d8' name='Budgeted' />
										<Bar dataKey='actual' fill='#82ca9d' name='Actual' />
									</BarChart>
								</ResponsiveContainer>
							</div>
						</CardContent>
					</Card>
				</>
			)}
		</div>
	);
}
