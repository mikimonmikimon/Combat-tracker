import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Cosmos Combat Tracker',
  description: 'Track combat statistics for your cosmic battles!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(
          `${geistSans.variable} ${geistMono.variable} antialiased`,
          "bg-background text-foreground"
        )}>
        <main className="min-h-screen container mx-auto py-8 px-4 flex flex-col items-center">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
