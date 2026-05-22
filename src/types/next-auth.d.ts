import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    error?: string;
    access_token?: string;
    user?: {
      firstName?: string;
      lastName?: string;
      role?: string;
      username?: string;
      fullName?: string;
      profileImageUrl?: string;
      userId?: string
    } & DefaultSession["user"]
  }

  interface User {
    payload: {
      accessToken: string;
      expiresIn: number;
      refreshToken: string;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    access_token: string;
    expires_at: number;
    refresh_token?: string;
    error?: string;

    role?: string,
    email: string,
    firstName?: string,
    lastName?: string,
    fullName?: string,
    profileImageUrl?: string;
    userId?: string
  }
}