// app/layout.tsx
import ErrorBoundary from '@/components/ErrorBoundary';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css'
import {  arabicFont, headingDhivehi, yourFont } from './fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="dv" dir="rtl" className={`${headingDhivehi.variable}, ${arabicFont.variable}`}>
        <body className={`${yourFont.variable}`}>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  );
}