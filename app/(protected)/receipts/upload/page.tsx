// src/app/receipts/upload/page.tsx
'use client';
import { withAuth } from '@/lib/auth/withAuth';
import { useState } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createWorker } from 'tesseract.js';
import { uploadReceipt } from '@/lib/api/receipts';

function ReceiptUploadPage() {
	const [file, setFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [extractedData, setExtractedData] = useState<any>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setFile(event.target.files[0]);
		}
	};

	const processReceipt = async (file: File) => {
		const worker = await createWorker('eng');
		const {
			data: { text },
		} = await worker.recognize(file);
		await worker.terminate();

		const lines = text.split('\n');

		// Helper function to find a line containing a specific text
		const findLine = (keyword: string) => lines.find((line) => line.toLowerCase().includes(keyword.toLowerCase()));

		// Extract data
		const transactionType = findLine('Paid bill')
			? 'Paid Bill'
			: findLine('transfer was successful')
			? 'Transfer'
			: 'Send Money';

		const amountLine = findLine('amount') || findLine('total amount sent') || findLine('transfer amount');
		const amount = amountLine ? parseFloat(amountLine.match(/\d+([,.]\d+)?/)?.[0] || '0') : 0;

		const currency = amountLine?.includes('₱') ? 'PHP' : 'Unknown';

		const dateLine = findLine('Aug') || findLine('2024');
		const date = dateLine ? new Date(dateLine).toISOString() : new Date().toISOString();

		const referenceNumber = (findLine('Ref No.') || findLine('Confirmation No.') || '')
			.replace(/Ref No\.|Confirmation No\./, '')
			.trim();

		const paymentMethod = findLine('Sent via') || findLine('Paid using') || 'Unknown';

		const recipientName = findLine('Consumer Name') || findLine('to') || 'Unknown';

		const accountNumber = (findLine('Credit Card') || '').match(/\d+/)?.[0] || null;

		const additionalDetails = {
			billersName: findLine('BPI') || null,
			cardNumber: accountNumber,
			// Add more details as needed
		};

		return {
			transactionType,
			recipientName,
			amount,
			currency,
			date,
			referenceNumber,
			paymentMethod,
			accountNumber,
			additionalDetails: JSON.stringify(additionalDetails),
		};
	};

	const handleUpload = async () => {
		if (!file) return;

		setLoading(true);
		try {
			const extractedData = await processReceipt(file);
			setExtractedData(extractedData);

			// Create a FormData object to send the file
			const formData = new FormData();
			formData.append('file', file);

			// Append extracted data as JSON string
			formData.append('extractedData', JSON.stringify(extractedData));

			// Upload file and extracted data to server
			const response = await fetch('/api/receipts/upload', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				throw new Error('Failed to upload receipt');
			}

			const result = await response.json();
			console.log('Server response:', result);
		} catch (error) {
			console.error('Error processing receipt:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-2xl font-bold mb-6'>Upload Receipt</h1>
			<Card>
				<CardHeader>
					<CardTitle>Upload and Process Receipt</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						<Input type='file' onChange={handleFileChange} accept='image/*' />
						<Button onClick={handleUpload} disabled={!file || loading}>
							{loading ? (
								<>
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									Processing
								</>
							) : (
								<>
									<Upload className='mr-2 h-4 w-4' />
									Upload and Process
								</>
							)}
						</Button>
					</div>
					{file && <p className='mt-4'>Selected file: {file.name}</p>}
					{extractedData && (
						<div className='mt-4'>
							<h2 className='text-lg font-semibold'>Extracted Data:</h2>
							<pre>{JSON.stringify(extractedData, null, 2)}</pre>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

export default withAuth(ReceiptUploadPage);
