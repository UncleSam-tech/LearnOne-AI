type Props = { params: { id: string } };

export default function SkillPage({ params }: Props) {
  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="text-2xl font-semibold">Skill: {params.id}</h1>
      <p className="text-gray-600 mt-2">Overview, outcomes, prerequisites, projects, signals.</p>
    </main>
  );
}

