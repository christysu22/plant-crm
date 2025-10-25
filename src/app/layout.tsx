import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import './globals.css';

export const metadata: Metadata = {
  title: 'Plant Business Management System',
  description: 'Complete business management for plant sellers - CRM, inventory, invoices, and more',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main className="main-wrapper">{children}</main>
      </body>
    </html>
  );
}
