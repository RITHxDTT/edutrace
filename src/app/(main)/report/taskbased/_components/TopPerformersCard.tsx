import { Award } from "lucide-react";

type Performer = { rank: number; score: number; studentName: string };

type Props = { data: Performer[] };

export default function TopPerformersCard({ data }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award size={26} className="text-yellow-500" />
          <h3 className="text-2xl font-semibold">Top Performers</h3>
        </div>
        <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
          High Achievement
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {data.map((p) => (
          <div key={p.rank} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-semibold shrink-0">
              {p.studentName[0]}
            </div>
            <span className="flex-1 text-gray-700">{p.studentName}</span>
            <span className="font-bold text-gray-900">{p.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
