export default function Landing() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Find your perfect skill in 2 minutes</h1>
      <p className="mt-4 text-gray-600">Answer 10 deep-but-quick questions. Get a tailored learning path with built-in mini-courses and assessments.</p>
      <div className="mt-8 flex justify-center">
        <a href="/wizard" className="inline-flex items-center rounded-lg bg-black text-white px-6 py-3 font-medium hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-black" aria-label="Start the 10-step wizard">Get Started</a>
      </div>
    </main>
  );
}

