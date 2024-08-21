import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';

import { cn } from '@/lib/utils';
import { SessionProvider } from './providers';

const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans',
});

export const metadata: Metadata = {
	title: 'Fintrack Pro',
	description: 'Fintrack Pro is a personal finance tracker. Track your income, expenses, and budgets.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
				<SessionProvider>{children}</SessionProvider>
			</body>
		</html>
	);
}
