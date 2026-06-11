import { AlertCircle } from "lucide-react";

type AtRiskStudent = {
  studentName: string;
  riskLevel: "HIGH" | "MEDIUM" | "LOW";
  score?: number;
  status?: string;
};

type Props = { data: AtRiskStudent[] };

const badgeColor: Record<string, string> = {
  HIGH: "bg-red-100 text-red-600",
  MEDIUM: "bg-orange-100 text-orange-600",
  LOW: "bg-yellow-100 text-yellow-600",
};

export default function AtRiskStudentsCard({ data }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle size={26} className="text-red-500" />
        <h3 className="text-2xl font-semibold text-red-500">
          At-Risk Students
        </h3>
      </div>
      <div className="flex flex-col gap-3">
        {data?.map((risk) => (
          <div
            key={risk.studentName}
            className="flex items-center justify-between"
          >
            <span className="text-gray-700">{risk.studentName}</span>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeColor[risk.riskLevel] ?? "bg-gray-100 text-gray-600"}`}
            >
              {risk.status === "MISSING" ? "Missing" : `${risk.score}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
