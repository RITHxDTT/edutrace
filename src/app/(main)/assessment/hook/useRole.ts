// hooks/useRole.ts
export type UserRole = "student" | "teacher" | "admin";

const CURRENT_ROLE: UserRole = "student"; // change here only

export function useRole() {
  const role = CURRENT_ROLE;
  return {
    role,
    isStudent: role === "student",
    isTeacher: role === "teacher",
  };
}
