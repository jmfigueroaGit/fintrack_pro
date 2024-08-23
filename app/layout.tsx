import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';

import { cn } from '@/lib/utils';
import { SessionProvider } from './providers';

const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans',
});

export const metadata: Metadata = {
	title: 'Fintrack Pro',
	description: 'Fintrack Pro is a personal finance tracker. Track your income, expenses, and budgets.',
	manifest: '/manifest.json',
	appleWebApp: {
		capable: true,
		statusBarStyle: 'default',
		title: 'FinTrack Pro',
	},
	formatDetection: {
		telephone: false,
	},
	icons: {
		icon: '/192x192.jpg',
		apple: '/192x192.jpg',
	},
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
