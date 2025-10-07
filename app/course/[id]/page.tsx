type Props = { params: { id: string } };

export default function CoursePage({ params }: Props) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-semibold">Course: {params.id}</h1>
      <p className="text-gray-600 mt-2">Lessons sidebar and content viewer.</p>
    </main>
  );
}

