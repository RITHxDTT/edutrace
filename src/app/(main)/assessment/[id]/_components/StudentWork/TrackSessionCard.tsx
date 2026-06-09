import {
  WorkSession,
} from "@/types/assessment";
import { PieChart } from "@mui/x-charts";
import { Calendar, Clock, TimerStart } from "iconsax-react";
import { formatWorkMinutes } from "./MyStudentWorkPage";

type Props = {
  activeSession: WorkSession | null;
  message?: string;
  isPending?: boolean;
  progressPercent: number;
  progressLabel: string;
  remainingMinutes: number;
  currentStatus: string;
  requiredDailyMinutes: number;
  liveTodayMinutes: number;
};

export default function TrackSessionCard({
  activeSession,
  isPending,
  progressPercent,
  progressLabel,
  remainingMinutes,
  currentStatus,
  requiredDailyMinutes,
  liveTodayMinutes,
  message,
}: Props) {
  return (
    <div className="rounded-[20px] bg-white p-7.5 flex flex-col justify-between">
      <div>
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[24px] font-semibold text-primary">
              Student Work
            </p>
            <p className="text-sm text-tertiary">
              Tracking starts automatically while this assessment page is open.
            </p>
          </div>

          <div className="rounded-full bg-light-green px-4 py-2 text-sm font-medium text-[#009F15]">
            {activeSession
              ? "Tracking"
              : isPending
                ? "Starting tracker"
                : "Preparing tracker"}
          </div>
        </div>

        {/* Gauge & Stats Cards */}
        <div className="flex flex-col md:flex-row items-stretch gap-6">
          {/* Circular Gauge Card */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="relative w-[200px] h-[200px]">
              <PieChart
                width={200}
                height={200}
                series={[
                  {
                    data: [
                      { value: progressPercent, color: "#5B5EDD" },
                      { value: 100 - progressPercent, color: "#E8E9FB" },
                    ],
                    innerRadius: 65,
                    outerRadius: 90,
                    cx: 100,
                    cy: 100,
                  },
                ]}
                slotProps={{ legend: { direction: "vertical" } }}
                margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-[24px] font-bold text-primary leading-none">
                  {progressLabel}
                </p>
                <p className="text-[11px] text-tertiary font-medium mt-1">
                  Completed
                </p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-tertiary">
                Daily Required
              </p>
              <p className="text-sm font-bold text-[#5B5EDD] mt-0.5">
                {formatWorkMinutes(requiredDailyMinutes)}
              </p>
            </div>
          </div>
          {/* Other 3 Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 w-full">
            {/* Time Spent Today */}
            <div className="rounded-[16px] bg-[#E9F6FF]/60 p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                <TimerStart size={20} color="#20AEE6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-tertiary">
                  Time Spent Today
                </p>
                <p className="text-[22px] font-bold text-[#20AEE6] mt-1">
                  {formatWorkMinutes(liveTodayMinutes)}
                </p>
              </div>
            </div>

            {/* Remaining Today */}
            <div className="rounded-[16px] bg-[#EEF9F0]/70 p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                <Calendar size={20} color="#009F15" />
              </div>
              <div>
                <p className="text-xs font-semibold text-tertiary">
                  Remaining Today
                </p>
                <p className="text-[22px] font-bold text-[#009F15] mt-1">
                  {formatWorkMinutes(remainingMinutes)}
                </p>
              </div>
            </div>

            {/* Current Status */}
            <div className="rounded-[16px] bg-[#F5F3FF]/70 p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                <Clock size={20} color="#5B5EDD" />
              </div>
              <div>
                <p className="text-xs font-semibold text-tertiary">
                  Current Status
                </p>
                <p className="text-[20px] font-bold text-[#5B5EDD] mt-1 uppercase">
                  {currentStatus}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <p className="mt-5 rounded-[10px] bg-light-lavendar px-4 py-3 text-sm font-medium text-menta">
          {message}
        </p>
      )}
    </div>
  );
}
