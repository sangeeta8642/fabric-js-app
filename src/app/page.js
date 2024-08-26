import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold mb-4">Fabric.js Shapes App</h1>
      <Link href="/canvas" className="text-blue-500 hover:underline">
        Go to Canvas
      </Link>
    </main>
  );
}
