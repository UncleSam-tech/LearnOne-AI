type Props = {
  id: string;
  name: string;
  description: string;
  onSelect?: () => void;
};

export function SkillCard({ id, name, description, onSelect }: Props) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-sm">
      <h3 className="font-semibold">{name}</h3>
      <p className="text-sm text-gray-600 mt-1 line-clamp-3">{description}</p>
      <div className="mt-3">
        <a href={`/skill/${id}`} className="text-blue-600 text-sm mr-3">View</a>
        {onSelect && (
          <button onClick={onSelect} className="text-sm px-3 py-1 rounded bg-black text-white">Start</button>
        )}
      </div>
    </div>
  );
}


