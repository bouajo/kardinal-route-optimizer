import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kardinal Route Optimizer',
  description: 'Optimize your routes with Excel uploads and Kardinal API',
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