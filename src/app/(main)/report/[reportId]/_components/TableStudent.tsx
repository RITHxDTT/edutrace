"use client";

import { StudentProps } from "@/types/report";

interface TableStudentProps {
  students: StudentProps[];
  classroomAbbre?: string;
}

export default function TableStudent({
  students,
  classroomAbbre = "Class",
}: TableStudentProps) {
  function formatDOB(dob: string | null) {
    if (!dob) return "N/A";
    const [year, month, day] = dob.split("-");
    return `${day}/${month}/${year}`;
  }

  function getInitials(name: string) {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  const avatarColors = [
    "bg-blue-400",
    "bg-gray-400",
    "bg-green-400",
    "bg-orange-400",
    "bg-slate-700",
    "bg-purple-400",
    "bg-blue-500",
    "bg-rose-400",
    "bg-teal-400",
    "bg-amber-400",
    "bg-indigo-400",
  ];

  if (!students || students.length === 0) {
    return <p className="text-gray-500">No students found.</p>;
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="w-12 px-4 py-4 text-left text-sm font-medium text-gray-400">
              #
            </th>
            <th className="w-64 px-4 py-4 text-left text-sm font-medium text-gray-500">
              FullName
            </th>
            <th className="w-32 px-32 py-4 text-left text-sm font-medium text-gray-500">
              Gender
            </th>
            <th className="px-56 py-4 text-left text-sm font-medium text-gray-500">
              Email
            </th>
            <th className="w-40 px-4 py-4 text-left text-sm font-medium text-gray-500">
              DOB
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr
              key={index}
              className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
            >
              <td className="px-4 py-4 text-sm text-gray-400">{index + 1}</td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  {student.profileImage ? (
                    <img
                      src={student.profileImage}
                      alt={student.fullName}
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${avatarColors[index % avatarColors.length]}`}
                    >
                      {getInitials(student.fullName)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {student.fullName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {classroomAbbre} Class
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-32 py-4">
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-semibold ${
                    student.gender === "MALE" || student.gender === "M"
                      ? "bg-green-100 text-green-600"
                      : "bg-pink-100 text-pink-500"
                  }`}
                >
                  {student.gender === "MALE"
                    ? "M"
                    : student.gender === "FEMALE"
                      ? "F"
                      : "?"}
                </span>
              </td>
              <td className="px-56 py-4 text-sm text-gray-600">
                {student.email}
              </td>
              <td className="px-4 py-4 text-sm text-gray-600">
                {formatDOB(student.dob)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
