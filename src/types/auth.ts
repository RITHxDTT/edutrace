import { CalendarDate } from "@internationalized/date";

// interface RegisterFormData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   classroomId: string;
//   gender: "MALE" | "FEMALE";
//   birthdate: CalendarDate | null;
//   address: string;
// }
 interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: "MALE" | "FEMALE";
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

interface ResetPasswordFormData {
  token: string
  newPassword: string;
  confirmNewPassword: string;
}

export type { RegisterFormData, LoginFormData, OtpFormData, ForgotPasswordFormData, ResetPasswordFormData };