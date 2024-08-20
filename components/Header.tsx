// src/components/Header.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from './common/mode-toggle';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, X } from 'lucide-react';

const Header = () => {
	const { data: session, status } = useSession();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

	const menuItems = [
		{ href: '/', label: 'Dashboard' },
		{ href: '/transactions', label: 'Transactions' },
		{ href: '/budget', label: 'Budget' },
		{ href: '/receipts', label: 'Upload Receipt' },
	];

	return (
		<header className='sticky top-0 right-0 left-0 bg-background shadow-sm z-10'>
			<nav className='container mx-auto px-4 sm:px-6 lg:px-8 py-4'>
				<div className='flex justify-between items-center'>
					<Link href='/' className='text-xl font-bold'>
						FinTrack Pro
					</Link>
					<div className='hidden md:flex space-x-4 items-center'>
						{status === 'authenticated' &&
							menuItems.map((item) => (
								<Link key={item.href} href={item.href}>
									<Button variant='ghost'>{item.label}</Button>
								</Link>
							))}
						{status === 'authenticated' ? (
							<UserMenu session={session} />
						) : status === 'loading' ? (
							<Button disabled>Loading...</Button>
						) : (
							<Button onClick={() => signIn()}>Sign In</Button>
						)}
						<ModeToggle />
					</div>
					<div className='md:hidden flex items-center'>
						<ModeToggle />
						<Button variant='ghost' onClick={toggleMenu} className='ml-2'>
							{isMenuOpen ? <X /> : <Menu />}
						</Button>
					</div>
				</div>
				{isMenuOpen && (
					<div className='mt-4 md:hidden'>
						{status === 'authenticated' ? (
							<>
								{menuItems.map((item) => (
									<Link key={item.href} href={item.href}>
										<Button variant='ghost' className='w-full text-left justify-start my-1'>
											{item.label}
										</Button>
									</Link>
								))}
								<Button variant='ghost' className='w-full text-left justify-start my-1' onClick={() => signOut()}>
									Log out
								</Button>
							</>
						) : status === 'loading' ? (
							<Button disabled className='w-full my-1'>
								Loading...
							</Button>
						) : (
							<Button onClick={() => signIn()} className='w-full my-1'>
								Sign In
							</Button>
						)}
					</div>
				)}
			</nav>
		</header>
	);
};

const UserMenu = ({ session }: { session: any }) => (
	<DropdownMenu>
		<DropdownMenuTrigger asChild>
			<Button variant='ghost' className='relative h-8 w-8 rounded-full'>
				<Avatar className='h-8 w-8'>
					<AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
					<AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
				</Avatar>
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent className='w-56' align='end' forceMount>
			<DropdownMenuLabel className='font-normal'>
				<div className='flex flex-col space-y-1'>
					<p className='text-sm font-medium leading-none'>{session?.user?.name}</p>
					<p className='text-xs leading-none text-muted-foreground'>{session?.user?.email}</p>
				</div>
			</DropdownMenuLabel>
			<DropdownMenuSeparator />
			<DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
);

export default Header;
