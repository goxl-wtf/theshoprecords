import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
} 