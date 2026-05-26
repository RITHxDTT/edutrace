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

interface OtpFormData {
  email: string;
  code: string;
}

interface ForgotPasswordFormData {
  email: string;
  code: string;
  newPassword: string;
  confirmNewPassword: string;
}

export type { RegisterFormData, LoginFormData, OtpFormData, ForgotPasswordFormData };