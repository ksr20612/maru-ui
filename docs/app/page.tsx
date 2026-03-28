import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  return redirect('/docs');
}

export function generateMetadata(): Metadata {
  return {
    title: 'Maru UI',
    description: 'Maru UI Docs',
  };
}
