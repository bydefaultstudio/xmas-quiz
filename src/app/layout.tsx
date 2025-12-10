import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: '2025 Quiz',
  description: 'By Default Pub Quiz',
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

