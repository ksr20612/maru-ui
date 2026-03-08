import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="mb-4 text-2xl font-bold">Maru UI</h1>
      <p className="mb-6 text-neutral-600">디자인 시스템 문서</p>
      <Link
        href="/docs"
        className="rounded-lg bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-800"
      >
        문서 보기
      </Link>
    </main>
  );
}
