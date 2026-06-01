
import React from 'react';
import NavbarTitle from '@/components/Topbar/NavbarTitle';
import { auth } from '@/auth';
import { getDashboardData } from '@/services/dashboard.service';
import { DashboardTeacherPayload, DashboardStudentPayload } from '@/types/dashboard';
import TeacherDashboard from './_components/TeacherDashboard';
import StudentDashboard from './_components/StudentDashboard';

export default async function Page() {
  const session = await auth();
  const role = session?.user?.role as 'teacher' | 'student';
  const userName = session?.user?.name || (role === 'teacher' ? 'Teacher' : 'Student');

  const dashboardDataPromise = getDashboardData().then(res => res?.payload);

  console.log(await dashboardDataPromise)

  return (
    <div>
      <NavbarTitle title="Dashboard" override />
      
      <React.Suspense fallback={<DashboardSkeleton />}>
        {role === 'teacher' ? (
          <TeacherDashboard 
            dataPromise={dashboardDataPromise as Promise<DashboardTeacherPayload>} 
            userName={userName} 
          />
        ) : (
          <StudentDashboard 
            dataPromise={dashboardDataPromise as Promise<DashboardStudentPayload>} 
            userName={userName} 
          />
        )}
      </React.Suspense>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col space-y-5 p-5">
      <div className="h-8 w-64 bg-gray-200 animate-pulse rounded" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-xl" />
        ))}
      </div>
      <div className="flex flex-col w-full gap-6 lg:flex-row">
        <div className="flex-1 h-64 bg-gray-200 animate-pulse rounded-2xl" />
        <div className="flex-1 h-64 bg-gray-200 animate-pulse rounded-2xl" />
      </div>
    </div>
  );
}
