import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider"
import Navigation from '@/components/Navigation';
import { PatientProvider } from '@/contexts/PatientContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mental Health Billing App',
  description: 'A comprehensive mental health billing application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PatientProvider>
            <div className="flex h-screen">
              <Navigation />
              <main className="flex-1 overflow-y-auto p-8">
                {children}
              </main>
            </div>
          </PatientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}