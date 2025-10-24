import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Plant CRM - Customer Relations Management',
  description: 'Track your plant business customers across PalmStreet and Etsy',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
