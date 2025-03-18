import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./reset.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeDebug from "@/components/ThemeDebug";
import { ProductProvider } from '../context/ProductContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TheShopRecords | Vinyl Record Marketplace",
  description: "Buy and sell vinyl records from collectors and enthusiasts around the world",
  keywords: "vinyl, records, music, marketplace, albums, collection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ToastProvider>
          <CartProvider>
            <ThemeProvider>
              <ProductProvider>
                <ErrorBoundary>
                  {children}
                  {isDevelopment && <ThemeDebug />}
                </ErrorBoundary>
              </ProductProvider>
            </ThemeProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
