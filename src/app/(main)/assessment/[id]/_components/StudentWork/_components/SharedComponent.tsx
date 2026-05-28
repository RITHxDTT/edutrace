import { SESSION_STATUS_MAP } from "../constant";
import type { SessionStatus } from "../types";

interface CardProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  children: React.ReactNode;
}

export function Card({ icon, iconBg, iconColor, title, children }: CardProps) {
  return (
    <div className="bg-white rounded-[18px] border border-[#e8eaf2] p-5">
      <div className="flex items-center gap-2.5 pb-3.5 border-b border-[#f0f1f8] mb-4">
        <div
          className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
          style={{ background: iconBg, color: iconColor }}
        >
          {icon}
        </div>
        <span className="text-[15px] font-bold text-gray-900">{title}</span>
      </div>
      {children}
    </div>
  );
}

export function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#f8f8fc] rounded-xl px-3.5 py-3">
      <p className="text-[11px] text-gray-400 mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export function RingChart({ spent, total }: { spent: number; total: number }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(spent / total, 1));

  return (
    <svg width="100" height="100" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#e8eaf2" strokeWidth="10" />
      <circle
        cx="50" cy="50" r={r}
        fill="none" stroke="#5b52e8" strokeWidth="10"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 50 50)"
      />
      <text x="50" y="47" textAnchor="middle" fontSize="16" fontWeight="600" fill="#111827">
        {spent}
        <tspan fontSize="11" fill="#9ca3af">/{total}</tspan>
      </text>
      <text x="50" y="60" textAnchor="middle" fontSize="10" fill="#9ca3af">
        min · today
      </text>
    </svg>
  );
}

export function SessionBadge({ status }: { status: SessionStatus }) {
  const s = SESSION_STATUS_MAP[status] ?? SESSION_STATUS_MAP["In Progress"];
  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.color }}
    >
      {s.icon} {status}
    </span>
  );
}