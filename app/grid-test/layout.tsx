import type { Metadata } from 'next';
import { Inter } from 'next/font/google';


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
            <body className={`${inter.className}`}>
                <main className='flex flex-col min-h-screen min-w-screen w-full items-center justify-center bg-slate-500'>
                    {children}
                </main>
            </body>
        </html>
    );
}