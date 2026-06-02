import { auth } from "@/auth";

import {
  ApiResponse,
  ReportResponse,
  CreateTaskReportDto,
  CreateClassReportDto,
  summaryReportDto,
  taskBaseReport as taskBaseReportType,
} from "../types/report";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface GetReportsProps {
  type?: "ALL" | "CLASS" | "ASSESSMENT";

  page?: number;

  size?: number;
}

export async function getMyReports({
  type = "ALL",

  page = 1,

  size = 10,
}: GetReportsProps): Promise<ReportResponse> {
  const session = await auth();

  if (!session?.access_token) {
    throw new Error("Unauthorized");
  }

  const params = new URLSearchParams({
    type,

    page: String(page),

    size: String(size),
  });

  const response = await fetch(`${API_URL}/reports/my?${params}`, {
    method: "GET",

    headers: {
      Accept: "application/json",

      Authorization: `Bearer ${session.access_token}`,
    },

    cache: "no-store",
  });

  const data: ApiResponse<ReportResponse> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed fetching reports");
  }

  return data.payload;
}

export async function createTaskReport(payload: CreateTaskReportDto) {
  const session = await auth();

  const res = await fetch(`${API_URL}/reports/task-based`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data?.message || "Task report failed");
  }

  return data.payload;
}

export async function createClassReport(payload: CreateClassReportDto) {
  const session = await auth();

  const res = await fetch(`${API_URL}/reports/class-based`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data?.message || "Class report failed");
  }

  return data.payload;
}

export async function summaryReports() {
  const session = await auth();

  if (!session?.access_token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_URL}/reports/my/summary`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data?.message || "Failed to fetch summary report");
  }

  return data.payload;
}



export async function taskBaseReport(payload : taskBaseReportType){
  const session = await auth();
  if(!session?.access_token){
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_URL}/reports/task-based`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      Authorization:`Bearer ${session.access_token}`,
    },
    body:JSON.stringify(payload),
  });

  const data = await res.json();
  if(!res.ok || !data.success){
    throw new Error(data?.message || "Failed to generate task base report");
  }
  
  return data.payload;
}

export async function getTopPerformance(reportId:string){
  const session = await auth();
  if(!session?.access_token){
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_URL}/reports/${reportId}/top-performers`,{
    method:"GET",
    headers:{
      
      Authorization:`Bearer ${session.access_token}`,
    },
    next: { revalidate: 60 },

  });

  const data = await res.json();
  if(!res.ok || !data.success){
    throw new Error(data?.message || "Failed to fetch top performers");
  }
  
  return data.payload;
}


export async function subMissionBreakdown(reportId:string){
  const session = await auth();
  if(!session?.access_token){
    throw new Error("Unauthorized");
  }
  
  const res = await fetch(`${API_URL}/reports/${reportId}/submission-breakdown-by-class`,{
    method:"GET",
    headers:{
      Authorization:`Bearer ${session.access_token}`,
    },
    next: { revalidate: 60 },
  });

  const data = await res.json();
  if(!res.ok || !data.success){
    throw new Error(data?.message || "Failed to fetch submission breakdown by class");
  }
  
  return data.payload;
    

}