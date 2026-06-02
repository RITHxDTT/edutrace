import KpiCardComponent from "../_components/KpiCardComponent";
import KpiCardTaskBased from "../_components/_taskBase/KpiCardTaskBased";
import ClassSubmissionCard from "../_components/_classBase/classCardForCompare";
import AllClassesActions from "../_components/_classBase/AllClassesAction";
import BasicBars from "../_components/_classBase/barChartThreeLine";
import HorizontalBars from "../_components/_classBase/barChartAxis";
import AiChatWrapper from "../AI/AiChatWrapper";

const reportPayload = {
  reportName: "All Classes Performance Report",
  reportData: {
    summary: {
      late: 6,
      onTime: 51,
      missing: 13,
      averageScore: 79,
      totalStudents: 70,
      submissionRate: 81,
      totalSubmissions: 57,
    },

    viewingLabel: "All Classes Overview",

    classrooms: [
      {
        className: "Siem Reap Class",
        classroomId: "61dc18eb-f3c4-48b1-99d6-c0978146f367",
        totalStudents: 22,
        classroomAbbre: "SR",
      },
      {
        className: "Phnom Penh Class",
        classroomId: "17b9bf75-be58-49c1-9a49-4fd5a4199dae",
        totalStudents: 28,
        classroomAbbre: "PP",
      },
      {
        className: "Preah Vihear Class",
        classroomId: "17b9bf75-be58-49c1-9a49-4fd5a4199dff",
        totalStudents: 20,
        classroomAbbre: "PVH",
      },
    ],

    scoreAnalysis: {
      data: [
        {
          className: "Siem Reap Class",
          classroomId: "61dc18eb-f3c4-48b1-99d6-c0978146f367",
          averageScore: 78,
          classroomAbbre: "SR",
          secondAverageScore: 81,
          submissionBreakdown: 19,
        },
        {
          className: "Phnom Penh Class",
          classroomId: "17b9bf75-be58-49c1-9a49-4fd5a4199dae",
          averageScore: 83,
          classroomAbbre: "PP",
          secondAverageScore: 85,
          submissionBreakdown: 23,
        },
        {
          className: "Preah Vihear Class",
          classroomId: "17b9bf75-be58-49c1-9a49-4fd5a4199dff",
          averageScore: 75,
          classroomAbbre: "PVH",
          secondAverageScore: 78,
          submissionBreakdown: 15,
        },
      ],
    },

    classComparison: {
      data: [
        {
          late: 3,
          onTime: 16,
          missing: 3,
          className: "Siem Reap Class",
          submitted: 19,
          classroomId: "61dc18eb-f3c4-48b1-99d6-c0978146f367",
          totalStudents: 22,
          classroomAbbre: "SR",
          submissionRate: 86,
        },
        {
          late: 2,
          onTime: 21,
          missing: 5,
          className: "Phnom Penh Class",
          submitted: 23,
          classroomId: "17b9bf75-be58-49c1-9a49-4fd5a4199dae",
          totalStudents: 28,
          classroomAbbre: "PP",
          submissionRate: 82,
        },
        {
          late: 1,
          onTime: 14,
          missing: 5,
          className: "Preah Vihear Class",
          submitted: 15,
          classroomId: "17b9bf75-be58-49c1-9a49-4fd5a4199dff",
          totalStudents: 20,
          classroomAbbre: "PVH",
          submissionRate: 75,
        },
      ],
    },

    submissionBreakdownByClass: {
      data: [
        {
          late: 14,
          onTime: 73,
          missing: 13,
          className: "Siem Reap Class",
          classroomId: "61dc18eb-f3c4-48b1-99d6-c0978146f367",
          classroomAbbre: "SR",
        },
        {
          late: 7,
          onTime: 75,
          missing: 18,
          className: "Phnom Penh Class",
          classroomId: "17b9bf75-be58-49c1-9a49-4fd5a4199dae",
          classroomAbbre: "PP",
        },
        {
          late: 5,
          onTime: 70,
          missing: 25,
          className: "Preah Vihear Class",
          classroomId: "17b9bf75-be58-49c1-9a49-4fd5a4199dff",
          classroomAbbre: "PVH",
        },
      ],
    },
  },
};

export default async function AllClassesPage({
  searchParams,
}: {
  searchParams: Promise<{ reportName?: string; period?: string }>;
}) {
  const { reportName = reportPayload.reportName, period = "" } =
    await searchParams;

  const {
    summary,
    viewingLabel,
    classComparison,
    submissionBreakdownByClass,
    scoreAnalysis,
  } = reportPayload.reportData;

  const kpiCards = [
    { title: "Total Submitted", value: summary.totalSubmissions },
    { title: "Submission Rate", value: `${summary.submissionRate}%` },
    { title: "Avg. Score", value: `${summary.averageScore}%` },
    { title: "On-Time", value: summary.onTime },
    { title: "Late", value: summary.late },
    { title: "Missing", value: summary.missing },
  ];

  return (
    <div className="pb-8 p-6">
      <div className="flex justify-between">
        <div>
          <p className="text-[24px] font-medium">{reportName}</p>
          <p>
            {period} - Viewing:{" "}
            <span className="text-blue-600">{viewingLabel}</span>
          </p>
        </div>
        <AllClassesActions />
      </div>

      <div className="flex items-start mt-6">
        <div className="w-111 h-111">
          <KpiCardTaskBased
            totalStudents={summary.totalStudents}
            className="All Classes"
          />
        </div>

        <div className="flex-1 grid grid-cols-3 gap-4 ml-4">
          {kpiCards.map((card) => (
            <KpiCardComponent
              key={card.title}
              title={card.title}
              value={card.value}
            />
          ))}
        </div>
      </div>
      <section className="mt-5 grid grid-cols-4 gap-4">
        <div className="col-span-3 flex flex-col gap-4">
          <div className="bg-white p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold">Submission Breakdown</h3>
              </div>
              <div className="flex items-center justify-evenly gap-6 w-100">
                <div className="flex items-center gap-2">
                  <p className="bg-purple w-4 h-4 rounded-full inline-block"></p>
                  <p>On-Time</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="bg-accent-purple w-4 h-4 rounded-full inline-block"></p>
                  <p>Late</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="bg-light-purple w-4 h-4 rounded-full inline-block"></p>
                  <p>Missing</p>
                </div>
              </div>
            </div>
            <BasicBars data={submissionBreakdownByClass.data} />
          </div>
          <div className="mt-4 bg-white p-6 rounded-2xl w-full">
            <h3 className="text-2xl font-semibold">Score Analysis</h3>
            <HorizontalBars data={scoreAnalysis.data} />
            <div className="flex items-center justify-evenly gap-6 w-100">
              <div className="flex items-center gap-2">
                <p className="bg-purple w-4 h-4 rounded-full inline-block"></p>
                <p>Avg. Score</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="bg-accent-purple w-4 h-4 rounded-full inline-block"></p>
                <p>Submission Rate</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {classComparison.data.map((cls) => (
            <ClassSubmissionCard
              lateSubmission={cls.late}
              key={cls.classroomId}
              className={cls.className}
              submitted={cls.submitted}
              total={cls.totalStudents}
            />
          ))}
        </div>
        <div className="fixed bottom-0 right-0 pointer-events-none z-50">
          <AiChatWrapper />
        </div>
      </section>
    </div>
  );
}
