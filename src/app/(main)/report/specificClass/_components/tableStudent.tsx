export default function TableStudent() {
  const mockData = [
    {
      students: {
        data: [
          {
            studentName: "Ratha Tep",
            gender: "M",
            Email: "ratha.tep@example.com",
            DOB: "2005-08-15",
          },
          {
            studentName: "Sophea Chan",
            gender: "F",
            Email: "sophea.chan@example.com",
            DOB: "2005-03-22",
          },
          {
            studentName: "Dara Sok",
            gender: "M",
            Email: "dara.sok@example.com",
            DOB: "2004-11-08",
          },
          {
            studentName: "Malis Heng",
            gender: "F",
            Email: "malis.heng@example.com",
            DOB: "2005-06-30",
          },
          {
            studentName: "Vicheka Lim",
            gender: "M",
            Email: "vicheka.lim@example.com",
            DOB: "2004-09-17",
          },
          {
            studentName: "Sreynich Kim",
            gender: "F",
            Email: "sreynich.kim@example.com",
            DOB: "2005-12-04",
          },
          {
            studentName: "Borey Phan",
            gender: "M",
            Email: "borey.phan@example.com",
            DOB: "2004-04-19",
          },
          {
            studentName: "Nita Chea",
            gender: "F",
            Email: "nita.chea@example.com",
            DOB: "2005-01-25",
          },
          {
            studentName: "Sovann Reach",
            gender: "M",
            Email: "sovann.reach@example.com",
            DOB: "2004-07-13",
          },
          {
            studentName: "Kanika Mao",
            gender: "F",
            Email: "kanika.mao@example.com",
            DOB: "2005-10-09",
          },
          {
            studentName: "Visal Chhouk",
            gender: "M",
            Email: "visal.chhouk@example.com",
            DOB: "2004-02-28",
          },
        ],
      },
    },
  ];

  const students = mockData[0].students.data;

  function formatDOB(dob: string) {
    const [year, month, day] = dob.split("-");
    return `${day}/${month}/${year}`;
  }

  function getInitials(name: string) {
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

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="w-12 px-4 py-4 text-left text-sm font-medium text-gray-400"></th>
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
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${avatarColors[index % avatarColors.length]}`}
                  >
                    {getInitials(student.studentName)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {student.studentName}
                    </p>
                    <p className="text-xs text-gray-400">SR Class</p>
                  </div>
                </div>
              </td>
              <td className="px-32 py-4">
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-semibold ${
                    student.gender === "M"
                      ? "bg-green-100 text-green-600"
                      : "bg-pink-100 text-pink-500"
                  }`}
                >
                  {student.gender}
                </span>
              </td>
              <td className="px-56 py-4 text-sm text-gray-600">
                {student.Email}
              </td>
              <td className="px-4 py-4 text-sm text-gray-600">
                {formatDOB(student.DOB)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
