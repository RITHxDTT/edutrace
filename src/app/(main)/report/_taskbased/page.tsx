// import dynamic from "next/dynamic";
// import KpiCardTaskBased from "./_components/KpiCardTaskBased";
// import KpiCardComponent from "../_components/KpiCardComponent";
// import TopPerformersCard from "./_components/TopPerformersCard";
// import AtRiskStudentsCard from "./_components/AtRiskStudentsCard";
// import TaskBasedActions from "./_components/TaskBasedAction";
// import AiChatWrapper from "../AI/AiChatWrapper";
// import { getReportSummaryById, reportMetadata } from "@/services/reportService";

// const TickPlacementBars = dynamic(() => import("./_components/BarChart"));
// const SubmissionDonutChart = dynamic(() =>
//   import("./_components/SubmissionDonutChart").then((m) => m.SubmissionDonutChart),
// );

// // Explicitly match Next.js dynamic routing signatures
// interface PageProps {
//   params: Promise<{
//     reportId: string;
//   }>;
// }

// export default async function IndividualReportPage({ params }: PageProps) {
//   // 1. CRITICAL FIX: Destructure after safely awaiting the promise parameter block
//   const resolvedParams = await params;
//   const reportId = resolvedParams.reportId;

//   // 2. Fire APIs with valid, evaluated strings
//   const [summary, metadata] = await Promise.all([
//     getReportSummaryById(reportId).catch((err) => {
//       console.error("DEBUG -> Single summary fetch failed:", err);
//       return null;
//     }),
//     reportMetadata(reportId).catch(() => null),
//   ]);

//   const reportName = metadata?.reportName || "Report Analysis Detail";
//   const viewingLabel = metadata?.reportType === "CLASS" ? "Class Performance" : "Assessment Performance";
  
//   const displayPeriod = metadata?.generatedAt
//     ? new Date(metadata.generatedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
//     : "Active Analysis";

//   // If your endpoint has a nested envelope wrapper, extract from 'summary.payload' or 'summary'
//   const realSummary = summary?.payload ? summary.payload : summary;

//   const totalStudents = realSummary?.totalStudents ?? 0;
//   const totalSubmitted = realSummary?.totalSubmitted ?? 0;
//   const totalSubmissionRate = realSummary?.totalSubmissionRate ?? 0;
//   const averageScore = realSummary?.averageScore ?? 0;
//   const onTime = realSummary?.onTime ?? 0;
//   const late = realSummary?.late ?? 0;
//   const missing = realSummary?.missing ?? 0;

//   const kpiCards = [
//     { title: "Total Submitted", value: totalSubmitted },
//     { title: "Submission Rate", value: `${totalSubmissionRate}%` },
//     { title: "Avg. Score", value: averageScore },
//     { title: "On-Time", value: onTime },
//     { title: "Late", value: late },
//     { title: "Missing", value: missing },
//   ];

//   return (
//     <div className="pb-8">
//       <div className="flex justify-between">
//         <div>
//           <p className="text-[24px] font-medium">{reportName}</p>
//           <p className="text-sm text-gray-500">
//             {displayPeriod} - Viewing: <span className="text-blue-600 font-medium">{viewingLabel}</span>
//           </p>
//         </div>
//         <TaskBasedActions />
//       </div>

//       <div className="flex items-start mt-6">
//         <div className="w-111 h-111">
//           <KpiCardTaskBased
//             totalStudents={totalStudents}
//             className={viewingLabel}
//           />
//         </div>
//         <div className="flex-1 grid grid-cols-3 gap-4 ml-4">
//           {kpiCards.map((card) => (
//             <KpiCardComponent
//               key={card.title}
//               title={card.title}
//               value={card.value}
//             />
//           ))}
//         </div>
//       </div>

//       <div className="mt-6 grid grid-cols-2 gap-4">
//         <div className="p-5 bg-white rounded-2xl shadow border border-gray-50">
//           <h3 className="font-medium mb-2 text-gray-700">Average Scores</h3>
//           <TickPlacementBars data={scoreDistributionMock} />
//         </div>
//         <div className="h-full">
//           <SubmissionDonutChart
//             onTime={onTime}
//             late={late}
//             missing={missing}
//             total={totalStudents}
//           />
//         </div>
//       </div>

//       <div className="mt-4 grid grid-cols-2 gap-4">
//         <TopPerformersCard data={topPerformersMock} />
//         <AtRiskStudentsCard data={atRiskStudentsMock} />
//       </div>

//       <div className="fixed bottom-0 right-0 pointer-events-none z-50">
//         <AiChatWrapper />
//       </div>
//     </div>
//   );
// }

// // Temporary fallback components
// const scoreDistributionMock = [
//   { range: "90-100", count: 60 }, { range: "80-89", count: 45 },
//   { range: "70-79", count: 56 }, { range: "60-69", count: 23 }, { range: "60>", count: 10 }
// ];
// const topPerformersMock = [{ rank: 1, score: 94, studentName: "Dara Sok" }];
// const atRiskStudentsMock = [{ score: 66, riskLevel: "MEDIUM" as const, studentName: "Ratha Tep" }];