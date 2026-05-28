import { MOCK_SESSION_LOG, DAILY_REQUIRED, TIME_SPENT_TODAY } from "../mockupData";

export function useStudentStats() {
  const totalMinutes = MOCK_SESSION_LOG.reduce((a, s) => a + s.duration, 0);

  return {
    remaining: DAILY_REQUIRED - TIME_SPENT_TODAY,
    totalHrs: Math.floor(totalMinutes / 60),
    totalMins: totalMinutes % 60,
    avgSession: Math.round(totalMinutes / MOCK_SESSION_LOG.length),
    sessionCount: MOCK_SESSION_LOG.length,
  };
}