import { ThemeProvider } from '@/components/common/theme-provider';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';
import React from 'react';

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
	return (
		<ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
			<div className='hidden md:block '>
				<div className='border-t'>
					<Header />
					<div className='bg-background '>
						<div className='col-span-3 lg:col-span-4 lg:border-l px-4 py-6 lg:px-8'>{children}</div>
					</div>
					<Toaster />
				</div>
			</div>
		</ThemeProvider>
	);
};

export default ProtectedLayout;
