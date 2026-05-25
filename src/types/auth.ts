import { CalendarDate } from "@internationalized/date";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  classroomId: string;
  gender: "MALE" | "FEMALE";
  birthdate: CalendarDate | null;
}

interface LoginFormData {
  email: string;
  password: string;
}
interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  newPassword: string;
  confirmPassword: string;
}

export type { RegisterFormData, LoginFormData, ForgotPasswordData, ResetPasswordData };