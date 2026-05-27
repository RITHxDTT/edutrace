"use client";

type SubmissionRing = {
  radius: number;
  strokeWidth: number;
  percentage: number;
  progressColor: string;
  trackColor: string;
  label: string;
  count: number;
};

type SubmissionDonutChartProps = {
  onTime: number;
  late: number;
  missing: number;
  total: number;
};

const SVG_SIZE = 200;
const CIRCLE_CENTER = SVG_SIZE / 2;

function DonutProgressRing({
  radius,
  strokeWidth,
  percentage,
  progressColor,
  trackColor,
}: SubmissionRing) {
  const circumference = 2 * Math.PI * radius;
  const progressLength = percentage * circumference;

  return (
    <g transform={`rotate(-90 ${CIRCLE_CENTER} ${CIRCLE_CENTER})`}>
      <circle
        cx={CIRCLE_CENTER}
        cy={CIRCLE_CENTER}
        r={radius}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={CIRCLE_CENTER}
        cy={CIRCLE_CENTER}
        r={radius}
        fill="none"
        stroke={progressColor}
        strokeWidth={strokeWidth}
        strokeDasharray={`${progressLength} ${circumference}`}
        strokeLinecap="round"
      />
    </g>
  );
}

export function SubmissionDonutChart({
  onTime,
  late,
  missing,
  total,
}: SubmissionDonutChartProps) {
  const safeTotal = total > 0 ? total : 1;

  const submissionRings: SubmissionRing[] = [
    {
      radius: 80,
      strokeWidth: 14,
      percentage: onTime / safeTotal,
      progressColor: "#7B5CF6",
      trackColor: "#EDE9FE",
      label: "On-Time",
      count: onTime,
    },
    {
      radius: 60,
      strokeWidth: 14,
      percentage: late / safeTotal,
      progressColor: "#C4B5FD",
      trackColor: "#F3F0FF",
      label: "Late",
      count: late,
    },
    {
      radius: 40,
      strokeWidth: 14,
      percentage: missing / safeTotal,
      progressColor: "#1E3A8A",
      trackColor: "#EEF2FF",
      label: "Missing",
      count: missing,
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 h-full w-full flex flex-col justify-center shadow-sm">
      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-1">
        Submission Behavior
      </p>

      <p className="text-sm font-semibold text-gray-900 mb-5">
        On-Time, Late, and Missing Submission
      </p>

      <div className="flex items-center gap-7">
        <svg
          width={SVG_SIZE}
          height={SVG_SIZE}
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          className="shrink-0"
        >
          {submissionRings.map((ring) => (
            <DonutProgressRing key={ring.label} {...ring} />
          ))}
        </svg>

        <div>
          <p className="text-2xl font-bold text-gray-900 tracking-tight mb-5">
            Submission
          </p>

          {submissionRings.map(({ progressColor, label, count }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 mb-3 last:mb-0"
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: progressColor }}
              />

              <span className="text-sm text-gray-700 flex-1">{label}</span>

              <span className="text-sm font-semibold text-gray-900">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
