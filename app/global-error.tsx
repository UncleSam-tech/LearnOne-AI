// app/global-error.tsx (root-level)
'use client';
export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body className="min-h-screen grid place-items-center p-6">
        <div className="max-w-md rounded-2xl border p-6 shadow">
          <h1 className="text-xl font-semibold mb-2">App crashed</h1>
          <p className="text-sm opacity-80 mb-4">{error.message}</p>
          <button className="rounded-xl px-4 py-2 bg-black text-white" onClick={() => reset()}>
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
