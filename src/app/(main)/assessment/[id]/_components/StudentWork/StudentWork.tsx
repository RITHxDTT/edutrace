"use client";

import { useRole } from "../../../hook/useRole";
import { StudentView } from "../StudentWork/_components/StudentView";
import { TeacherView } from "../StudentWork/_components/TeacherView";

export default function Studentwork() {
  const { isStudent } = useRole();

  return (
    <div className="grid grid-cols-[1fr_320px] gap-4 p-6 font-sans">
      {isStudent ? <StudentView isSubmitted={false} /> : <TeacherView />}
    </div>
  );
}