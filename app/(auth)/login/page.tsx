'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
	const handleSignIn = (provider: string) => {
		signIn(provider, { callbackUrl: '/' });
	};

	return (
		<div className='flex min-h-screen bg-[#020817] text-white'>
			<div className='flex-1 flex items-center justify-center space-x-5'>
				<h1 className='text-5xl font-bold'>FinTech Pro.</h1>
			</div>
			<div className='flex-1 flex items-center justify-center'>
				<Card className='w-[350px] bg-gray-800 border-gray-700'>
					<CardHeader>
						<CardTitle className='text-center text-white'>Sign in to Fintrack Pro</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-center text-sm text-gray-400 mb-4'>Welcome back! Please sign in to continue</p>
						<Button
							onClick={() => handleSignIn('google')}
							variant='outline'
							className='w-full mb-2 bg-white text-black hover:bg-gray-200'
						>
							<svg className='w-5 h-5 mr-2' viewBox='0 0 24 24'>
								<path
									fill='currentColor'
									d='M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z'
								/>
							</svg>
							Continue with Google
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
