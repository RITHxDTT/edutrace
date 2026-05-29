import { StudentView } from "./_components/StudentView";
import { TeacherView } from "./_components/TeacherView";

interface StudentworkProps {
  isStudent: boolean;
}

export default function Studentwork({ isStudent }: StudentworkProps) {
  return (
    <div className="grid grid-cols-[1fr_320px] gap-4 p-6 font-sans">
      {isStudent ? <StudentView isSubmitted={true} /> : <TeacherView />}
    </div>
  );
}
