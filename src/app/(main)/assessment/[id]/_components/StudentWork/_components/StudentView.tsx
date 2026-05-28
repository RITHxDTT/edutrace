import { DAILY_REQUIRED, TIME_SPENT_TODAY, MOCK_SESSION_LOG } from "../mockupData";
import { useStudentStats } from "../hooks/useStudentStats";
import { Card, StatBox, RingChart, SessionBadge } from "../_components/SharedComponent";
import { ClockSvg, NotesSvg, InfoSvg, CalSvg, CheckCircleSvg } from "../_components/icon";

export function StudentView({ isSubmitted }: { isSubmitted: boolean }) {
    const { remaining, totalHrs, totalMins, avgSession, sessionCount } = useStudentStats();

    return (
        <div className="col-span-full grid grid-cols-2 gap-3.5 pb-6">
            <DailyTimeCard isSubmitted={isSubmitted} remaining={remaining} />
            <AssessmentTimeSummaryCard
                totalHrs={totalHrs} totalMins={totalMins}
                avgSession={avgSession} sessionCount={sessionCount}
            />
            <WorkSessionLogCard />
            <AssessmentOverviewCard isSubmitted={isSubmitted} />
        </div>
    );
}

function DailyTimeCard({ isSubmitted, remaining }: { isSubmitted: boolean; remaining: number }) {
    return (
        <Card icon={<ClockSvg />} iconBg="#eeedf8" iconColor="#6b5ef8" title="Daily Time Progress">
            {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                    <div className="w-11 h-11 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircleSvg />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">You have already submitted your work</p>
                </div>
            ) : (
                <div className="flex items-center gap-5">
                    <RingChart spent={TIME_SPENT_TODAY} total={DAILY_REQUIRED} />
                    <div className="flex-1 grid grid-cols-2 gap-2.5">
                        <StatBox label="Daily Required" value={`${DAILY_REQUIRED} min`} />
                        <StatBox label="Time Spent Today" value={`${TIME_SPENT_TODAY} min`} />
                        <StatBox label="Remaining" value={`${remaining} min`} />
                        <div className="bg-[#f8f8fc] rounded-xl px-3 py-2.5">
                            <p className="text-[11px] text-gray-400 mb-1.5">Current Status</p>
                            <span className="bg-green-500/10 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                                ✓ On Track
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}

function AssessmentTimeSummaryCard({ totalHrs, totalMins, avgSession, sessionCount }: {
    totalHrs: number; totalMins: number; avgSession: number; sessionCount: number;
}) {
    return (
        <Card icon={<ClockSvg />} iconBg="#eeedf8" iconColor="#6b5ef8" title="Assessment Time Summary">
            <div className="grid grid-cols-2 gap-2.5">
                <StatBox label="Total Time Spent" value={`${totalHrs}h ${totalMins}m`} />
                <StatBox label="Sessions Completed" value={`${sessionCount}`} />
                <StatBox label="Avg Session Length" value={`${avgSession} min`} />
                <StatBox label="Days Before Deadline" value="1 Day" />
            </div>
        </Card>
    );
}

const SESSION_TABLE_HEADERS = ["Date", "Start Time", "End Time", "Duration", "Status"];

function WorkSessionLogCard() {
    return (
        <Card icon={<NotesSvg />} iconBg="#fff8ec" iconColor="#f59e0b" title="Work Session Log">
            <table className="w-full border-collapse text-[13px]">
                <thead>
                    <tr>
                        {SESSION_TABLE_HEADERS.map((h) => (
                            <th key={h} className="text-left text-[11px] font-semibold text-gray-400 pb-2.5 border-b border-[#f0f1f8]">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {MOCK_SESSION_LOG.map((s, i) => {
                        const isLast = i === MOCK_SESSION_LOG.length - 1;
                        const rowBorder = isLast ? "" : "border-b border-[#f8f8fc]";
                        return (
                            <tr key={s.id}>
                                <td className={`py-2.5 ${rowBorder}`}>
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                        <CalSvg /> {s.date}
                                    </div>
                                </td>
                                <td className={`py-2.5 px-2 text-gray-700 ${rowBorder}`}>{s.start}</td>
                                <td className={`py-2.5 px-2 text-gray-700 ${rowBorder}`}>{s.end}</td>
                                <td className={`py-2.5 px-2 text-gray-700 ${rowBorder}`}>{s.duration} min</td>
                                <td className={`py-2.5 ${rowBorder}`}>
                                    <SessionBadge status={s.status} />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </Card>
    );
}

const OVERVIEW_ROWS = (isSubmitted: boolean) => [
    { label: "Due Date", value: "13th May 2026", type: "text" },
    { label: "Assessment Status", value: isSubmitted ? "Submitted" : "In Progress", type: "badge", submitted: isSubmitted },
    { label: "Required Daily Minutes", value: "60 min", type: "text" },
    { label: "Total Score", value: "100 Points", type: "text" },
] as const;

function AssessmentOverviewCard({ isSubmitted }: { isSubmitted: boolean }) {
    const rows = OVERVIEW_ROWS(isSubmitted);
    return (
        <Card icon={<InfoSvg />} iconBg="#eeedf8" iconColor="#6b5ef8" title="Assessment Overview">
            {rows.map((row, i) => (
                <div
                    key={row.label}
                    className={`flex justify-between items-center py-2.5 ${i < rows.length - 1 ? "border-b border-[#f8f8fc]" : ""}`}
                >
                    <span className="text-[13px] text-gray-500">{row.label}</span>
                    {row.type === "badge" ? (
                        <span className={`px-3 py-0.5 rounded-full text-xs font-semibold
              ${row.submitted
                                ? "bg-green-500/10 text-green-700"
                                : "bg-indigo-500/10 text-indigo-600"
                            }`}
                        >
                            {row.value}
                        </span>
                    ) : (
                        <span className="text-[13px] font-semibold text-gray-900">{row.value}</span>
                    )}
                </div>
            ))}
        </Card>
    );
}