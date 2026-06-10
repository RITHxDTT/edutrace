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
  isExportMode?: boolean;
};

const VIEWBOX_SIZE = 200;
const CIRCLE_CENTER = VIEWBOX_SIZE / 2;

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
  isExportMode
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
    <div
  className={`w-full ${isExportMode ? " h-[160px]" : "p-2 sm:p-6"}`}>
      <p className="text-sm sm:text-md font-medium text-gray-400 uppercase tracking-widest mb-1">
        Submission Behavior
      </p>

      <p className="text-lg sm:text-2xl font-semibold text-gray-900 mb-5">
        On-Time, Late, and Missing Submission
      </p>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10 p-10">
        <div className="w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[320px]">
          <svg
            viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
            className="w-full h-auto"
          >
            {submissionRings.map((ring) => (
              <DonutProgressRing key={ring.label} {...ring} />
            ))}
          </svg>
        </div>

        <div className="w-full lg:w-auto">
          <p className="text-lg sm:text-2xl font-medium text-gray-900 tracking-tight mb-4 sm:mb-5">
            Submission
          </p>

          <div className="space-y-3">
            {submissionRings.map(({ progressColor, label, count }) => (
              <div key={label} className="flex items-center gap-2.5">
                <span
                  className="w-4 h-4 rounded-full shrink-0"
                  style={{ background: progressColor }}
                />
                <span className="text-[18px] text-gray-700 flex-1">{label}</span>
                <span className="text-[18px] font-medium text-gray-900">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
