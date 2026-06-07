import { auth } from "@/auth";
import {
  ApiResponse,
  ReportResponse,
  CreateTaskReportDto,
  CreateClassReportDto,
  taskBaseReport as taskBaseReportType,
  ReportDetailResponse,
} from "../types/report";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface GetReportsProps {
  type?: "ALL" | "CLASS" | "ASSESSMENT";
  page?: number;
  size?: number;
}

// get my List reports with summary
export async function getMyReports({
  type = "ALL",
  page = 1,
  size = 10,
}: GetReportsProps): Promise<ReportResponse> {
  const session = await auth();
  if (!session?.access_token) throw new Error("Unauthorized");

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

//  get the my-reports list panel
export async function getMyListReport(payload: {
  type: string;
  page: number;
  size: number;
}) {
  const session = await auth();
  if (!session?.access_token) throw new Error("Unauthorized");

  const queryParams = new URLSearchParams({
    type: payload.type,
    page: payload.page.toString(),
    size: payload.size.toString(),
  });

  const res = await fetch(`${API_URL}/reports/my/list?${queryParams}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    next: { revalidate: 60 },
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data?.message || "Failed to fetch report list");
  }
  console.log(data.payload.reportName);
  return data.payload;
}

// get the my-reports summary panel
export async function summaryReports() {
  const session = await auth();
  if (!session?.access_token) throw new Error("Unauthorized");

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

// create Task Based Report
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

// create Class Based Report
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

// get report at-risk students panel
export async function getAtRiskStudents(reportId: string) {
  const session = await auth();
  if (!session?.access_token) throw new Error("Unauthorized");

  const res = await fetch(`${API_URL}/reports/${reportId}/at-risk-students`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    next: { revalidate: 60 },
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data?.message || "Failed to fetch at-risk students");
  }
  return data.payload;
}

// get report submission
export async function subMissionBreakdown(reportId: string) {
  const session = await auth();
  if (!session?.access_token) throw new Error("Unauthorized");

  const res = await fetch(
    `${API_URL}/reports/${reportId}/submission-breakdown-by-class`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      next: { revalidate: 60 },
    },
  );

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data?.message || "Failed to fetch submission breakdown");
  }
  return data.payload;
}

// get report score distribution panel
export async function getScoreDistribution(reportId: string) {
  const session = await auth();
  if (!session?.access_token) throw new Error("Unauthorized");

  const res = await fetch(`${API_URL}/reports/${reportId}/score-distribution`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    next: { revalidate: 60 },
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data?.message || "Failed to fetch score distribution");
  }
  return data.payload;
}

// get report score analysis panel
export async function scoreAnalysis(reportId: string) {
  const session = await auth();
  if (!session?.access_token) throw new Error("Unauthorized");

  const res = await fetch(`${API_URL}/reports/${reportId}/score-analysis`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    next: { revalidate: 60 },
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data?.message || "Failed to fetch score analysis");
  }
  return data.payload;
}

// get report metadata
export async function reportMetadata(reportId: string) {
  const session = await auth();
  if (!session?.access_token) throw new Error("Unauthorized");

  const res = await fetch(`${API_URL}/reports/${reportId}/meta`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    next: { revalidate: 60 },
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data?.message || "Failed to fetch report metadata");
  }
  return data.payload;
}

// get report class comparison panel
export async function classComparasion(reportId: string) {
  const session = await auth();
  if (!session?.access_token) throw new Error("Unauthorized");

  const res = await fetch(`${API_URL}/reports/${reportId}/class-comparison`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    next: { revalidate: 60 },
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data?.message || "Failed to fetch class comparison");
  }
  return data.payload;
}

// get single report summary panel details
export async function getReportSummaryById(reportId: string) {
  const session = await auth();
  if (!session?.access_token) throw new Error("Unauthorized");

  const res = await fetch(`${API_URL}/reports/${reportId}/summary`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    next: { revalidate: 60 },
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(
      data?.message || "Failed to fetch individual report summary",
    );
  }
  return data.payload;
}

export async function deleteReport(reportId: string) {
  const session = await auth();

  if (!session?.access_token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_URL}/reports/${reportId}`, {
    method: "DELETE",

    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },

    cache: "no-store",
  });

  const data = await res.json();

  console.log("Delete Response:", data);

  if (!res.ok || !data.success) {
    throw new Error(data?.message || "Failed deleting report");
  }

  return data.payload;
}

// export async function getTeacherSubjects() {
//   const session = await auth();

//   if (!session?.access_token) {
//     throw new Error("Unauthorized");
//   }

//   const res = await fetch(`${API_URL}/subjects/teacher?page=1&size=50`, {
//     method: "GET",
//     headers: {
//       Accept: "application/json",
//       Authorization: `Bearer ${session.access_token}`,
//     },
//     cache: "no-store",
//   });

//   const data = await res.json();

//   if (!res.ok || !data.success) {
//     throw new Error(data?.message || "Failed to fetch subjects");
//   }

//   return data.payload.content;
// }

export async function getUserProfile() {
  const session = await auth();

  if (!session?.access_token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_URL}/users/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data?.message || "Failed to fetch user profile");
  }

  return data.payload;
}

// get report details
export async function getReportDetail(
  reportId: string,
  tokenOverride?: string, 
): Promise<any> {
  let token = tokenOverride;

 
  if (!token) {
    const session = await auth();
    token = session?.access_token;
  }

  if (!token) {
    throw new Error("Unauthorized: Access token missing.");
  }

  const res = await fetch(`${API_URL}/reports/${reportId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`, 
    },
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed fetching report detail");
  }

  return data.payload;
}

export async function getReportDetails(
  reportId: string,
  isSystemBypass = false,
) {
  let authorizationHeader = "";

  if (isSystemBypass) {
    authorizationHeader = `Bearer ${process.env.INTERNAL_SYSTEM_API_KEY}`;
  } else {
    const session = await auth();
    if (!session?.access_token) throw new Error("Unauthorized");
    authorizationHeader = `Bearer ${session.access_token}`;
  }

  const response = await fetch(`${API_URL}/reports/${reportId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: authorizationHeader,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed fetching report data details");
  }

  const resData = await response.json();
  return resData.payload;
}

export async function getTeacherSubject() {
  const session = await auth();
  if (!session?.access_token) throw new Error("Unauthorized");

  const response = await fetch(`${API_URL}/users/me`, {
    method: "GET",
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${session.access_token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user profile information");
  }

  const data = await response.json();
  return data.payload;
}
