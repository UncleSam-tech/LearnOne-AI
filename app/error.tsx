// app/error.tsx  (route-level)
'use client';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="max-w-md rounded-2xl border p-6 shadow">
        <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
        <p className="text-sm opacity-80 mb-4">{error.message}</p>
        <button className="rounded-xl px-4 py-2 bg-black text-white" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </main>
  );
}
