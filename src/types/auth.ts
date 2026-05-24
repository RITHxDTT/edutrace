interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
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

interface AuthUser {
  accessToken: string,
  expiresIn: number,
  refresh_token: string,
  token_type: string
}

export type { RegisterFormData, LoginFormData, ForgotPasswordData, ResetPasswordData };