interface Props {
  label: string;
}

export default function CategoryBadge({ label }: Props) {
  return (
    <div className="bg-indigo-50 text-indigo-600 font-semibold rounded-lg px-4 h-9 flex items-center justify-center w-fit text-sm">
      {label}
    </div>
  );
}
