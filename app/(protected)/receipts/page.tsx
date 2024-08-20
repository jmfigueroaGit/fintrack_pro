// src/app/receipts/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { getReceipts, deleteReceipt, updateReceipt, uploadReceipt } from '@/lib/api/receipts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Receipt {
	id: string;
	transactionType: string;
	recipientName: string;
	amount: number;
	currency: string;
	date: string | Date;
	referenceNumber: string;
	paymentMethod: string;
	accountNumber?: string;
	additionalDetails: string;
}

export default function ReceiptsPage() {
	const [receipts, setReceipts] = useState<Receipt[]>([]);
	const [file, setFile] = useState<File | null>(null);
	const [editingReceipt, setEditingReceipt] = useState<Receipt | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	useEffect(() => {
		loadReceipts();
	}, []);

	async function loadReceipts() {
		try {
			const data: any = await getReceipts();
			setReceipts(data);
		} catch (error) {
			console.error('Failed to load receipts:', error);
		}
	}

	const formatDateForInput = (date: string | Date): string => {
		if (typeof date === 'string') {
			// If it's an ISO string, we can split it directly
			return date.split('T')[0];
		} else if (date instanceof Date) {
			// If it's a Date object, we format it to YYYY-MM-DD
			return date.toISOString().split('T')[0];
		}
		// If it's neither, return today's date as a fallback
		return new Date().toISOString().split('T')[0];
	};

	async function handleDelete(id: string) {
		try {
			await deleteReceipt(id);
			loadReceipts();
		} catch (error) {
			console.error('Failed to delete receipt:', error);
		}
	}

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setFile(event.target.files[0]);
		}
	};

	const handleUpload = async () => {
		if (!file) return;

		const formData = new FormData();
		formData.append('file', file);

		// In a real application, you'd process the image here to extract data
		// For this example, we'll just use some dummy data
		const dummyExtractedData = {
			transactionType: 'expense',
			recipientName: 'Sample Store',
			amount: 100,
			currency: 'PHP',
			date: new Date().toISOString(),
			referenceNumber: '1234567890',
			paymentMethod: 'credit card',
			accountNumber: '1234',
			additionalDetails: JSON.stringify({ category: 'groceries' }),
		};

		formData.append('extractedData', JSON.stringify(dummyExtractedData));

		try {
			await uploadReceipt(formData);
			loadReceipts();
			setFile(null);
		} catch (error) {
			console.error('Failed to upload receipt:', error);
		}
	};

	const handleEditClick = (receipt: Receipt) => {
		setEditingReceipt(receipt);
		setIsEditModalOpen(true);
	};

	const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!editingReceipt) return;

		const formData = new FormData(event.currentTarget);
		const updatedData = {
			transactionType: formData.get('transactionType') as string,
			recipientName: formData.get('recipientName') as string,
			amount: parseFloat(formData.get('amount') as string),
			currency: formData.get('currency') as string,
			date: formData.get('date') as string,
			referenceNumber: formData.get('referenceNumber') as string,
			paymentMethod: formData.get('paymentMethod') as string,
			accountNumber: formData.get('accountNumber') as string,
			additionalDetails: formData.get('additionalDetails') as string,
		};

		try {
			await updateReceipt(editingReceipt.id, updatedData);
			loadReceipts();
			setIsEditModalOpen(false);
		} catch (error) {
			console.error('Failed to update receipt:', error);
		}
	};

	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-2xl font-bold mb-6'>Receipts</h1>

			<Card className='mb-6'>
				<CardHeader>
					<CardTitle>Upload New Receipt</CardTitle>
				</CardHeader>
				<CardContent>
					<Input type='file' onChange={handleFileChange} accept='image/*' className='mb-4' />
					<Button onClick={handleUpload} disabled={!file}>
						Upload Receipt
					</Button>
				</CardContent>
			</Card>

			{receipts.map((receipt) => (
				<Card key={receipt.id} className='pt-6 mb-2'>
					<CardContent className='flex justify-between items-center'>
						<div>
							<p>
								{receipt.recipientName} - {receipt.amount} {receipt.currency}
							</p>
							<p className='text-sm text-gray-500'>{new Date(receipt.date).toLocaleDateString()}</p>
						</div>
						<div>
							<Button variant='outline' className='mr-2' onClick={() => handleEditClick(receipt)}>
								Edit
							</Button>
							<Button variant='destructive' onClick={() => handleDelete(receipt.id)}>
								Delete
							</Button>
						</div>
					</CardContent>
				</Card>
			))}

			<Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Receipt</DialogTitle>
					</DialogHeader>
					{editingReceipt && (
						<form onSubmit={handleEditSubmit} className='space-y-4'>
							<div>
								<Label htmlFor='transactionType'>Transaction Type</Label>
								<Select name='transactionType' defaultValue={editingReceipt.transactionType}>
									<SelectTrigger>
										<SelectValue placeholder='Select transaction type' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='income'>Income</SelectItem>
										<SelectItem value='expense'>Expense</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor='recipientName'>Recipient Name</Label>
								<Input name='recipientName' defaultValue={editingReceipt.recipientName} />
							</div>
							<div>
								<Label htmlFor='amount'>Amount</Label>
								<Input name='amount' type='number' step='0.01' defaultValue={editingReceipt.amount} />
							</div>
							<div>
								<Label htmlFor='currency'>Currency</Label>
								<Input name='currency' defaultValue={editingReceipt.currency} />
							</div>
							<div>
								<Label htmlFor='date'>Date</Label>
								<Input name='date' type='date' defaultValue={formatDateForInput(editingReceipt.date)} />
							</div>
							<div>
								<Label htmlFor='referenceNumber'>Reference Number</Label>
								<Input name='referenceNumber' defaultValue={editingReceipt.referenceNumber} />
							</div>
							<div>
								<Label htmlFor='paymentMethod'>Payment Method</Label>
								<Input name='paymentMethod' defaultValue={editingReceipt.paymentMethod} />
							</div>
							<div>
								<Label htmlFor='accountNumber'>Account Number</Label>
								<Input name='accountNumber' defaultValue={editingReceipt.accountNumber} />
							</div>
							<div>
								<Label htmlFor='additionalDetails'>Additional Details</Label>
								<Input name='additionalDetails' defaultValue={editingReceipt.additionalDetails} />
							</div>
							<Button type='submit'>Save Changes</Button>
						</form>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
