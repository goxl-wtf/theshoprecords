import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
} 