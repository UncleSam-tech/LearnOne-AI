type Lesson = { id: string; title: string; content: string };

type Props = {
  lessons: Lesson[];
  currentId?: string;
  onMarkDone?: (id: string) => void;
};

export function CoursePlayer({ lessons, currentId, onMarkDone }: Props) {
  const current = lessons.find((l) => l.id === currentId) || lessons[0];
  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4">
      <aside className="border rounded p-3 space-y-2">
        {lessons.map((l) => (
          <a key={l.id} href={`#${l.id}`} className="block text-sm hover:underline">
            {l.title}
          </a>
        ))}
      </aside>
      <section className="border rounded p-4">
        <h2 className="text-lg font-semibold" id={current.id}>{current.title}</h2>
        <p className="mt-2 whitespace-pre-wrap text-gray-700">{current.content}</p>
        {onMarkDone && (
          <button className="mt-4 px-3 py-1.5 rounded bg-black text-white" onClick={() => onMarkDone(current.id)}>
            Mark done
          </button>
        )}
      </section>
    </div>
  );
}


