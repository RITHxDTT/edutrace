
import { useMemo } from 'react';
import { SubmissionTrend, ScoreTrend, SubmissionTrendData, ScoreTrendData } from '@/types/dashboard';

export const useTrendData = (role: 'student' | 'teacher', data?: SubmissionTrend | ScoreTrend) => {
  const xAxisData = useMemo(() => {
    if (!data || !data.data) return [];
    if (role === 'teacher') {
      const tData = data as SubmissionTrend;
      return tData.data.map(d => d.day);
    } else {
      const sData = data as ScoreTrend;
      return sData.data.map(d => d.taskName || 'Unknown');
    }
  }, [data, role]);

  const series = useMemo(() => {
    if (!data || !data.data || !data.legend) return [];
    if (role === 'teacher') {
      const tData = data as SubmissionTrend;
      return tData.legend.map((l, index) => ({
        id: `series-${l.key}`,
        data: tData.data.map(d => (d[l.key as keyof SubmissionTrendData] as number) || 0),
        label: l.label,
        area: true,
        stack: 'total',

        color: index === 0 ? '#E9B8FF' : '#8F7CFF',
      }));
    } else {
      const sData = data as ScoreTrend;
      return sData.legend.map((l, index) => ({
        id: `series-${l.key}`,
        data: sData.data.map(d => (d[l.key as keyof ScoreTrendData] as number) || 0),
        label: l.label,
        area: true,
        stack: 'total',

        color: index === 0 ? '#E9B8FF' : '#8F7CFF',
      }));
    }
  }, [data, role]);

  return { xAxisData, series };
};
