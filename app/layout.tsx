import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./reset.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeDebug from "@/components/ThemeDebug";
import { ProductProvider } from '../context/ProductContext';

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
}: {
  children: React.ReactNode;
}) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <ProductProvider>
            <ErrorBoundary>
              {children}
              {isDevelopment && <ThemeDebug />}
            </ErrorBoundary>
          </ProductProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
