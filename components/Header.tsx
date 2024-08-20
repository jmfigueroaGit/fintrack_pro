// src/components/Header.tsx
'use client';

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

const Header = () => {
	const { data: session, status } = useSession();

	return (
		<header className='top-0 right-0 left-0 p-4 flex items-center justify-between z-10'>
			<nav className='container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center'>
				<Link href='/' className='text-xl font-bold'>
					FinTrack Pro
				</Link>
				<div className='flex space-x-4'>
					{status === 'authenticated' ? (
						<>
							<Link href='/'>
								<Button variant='ghost'>Dashboard</Button>
							</Link>
							<Link href='/transactions'>
								<Button variant='ghost'>Transactions</Button>
							</Link>
							<Link href='/budget'>
								<Button variant='ghost'>Budget</Button>
							</Link>
							<Link href='/receipts'>
								<Button variant='ghost'>Upload Receipt</Button>
							</Link>
							{session?.user && (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant='ghost' className='relative h-8 w-8 rounded-full'>
											<Avatar className='h-8 w-8'>
												<AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
												<AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
											</Avatar>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className='w-56' align='end' forceMount>
										<DropdownMenuLabel className='font-normal'>
											<div className='flex flex-col space-y-1'>
												<p className='text-sm font-medium leading-none'>{session.user.name}</p>
												<p className='text-xs leading-none text-muted-foreground'>{session.user.email}</p>
											</div>
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							)}
						</>
					) : status === 'loading' ? (
						<Button disabled>Loading...</Button>
					) : (
						<Button onClick={() => signIn()}>Sign In</Button>
					)}
					<ModeToggle />
				</div>
			</nav>
		</header>
	);
};

export default Header;
