import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import { ClassroomProps, ClassroomType } from "./classroom";
import { SubjectType } from "./subject";

type SessionSubject = SubjectType | string;

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
      gender?: "MALE" | "FEMALE";
      birthdate: CalendarDate | null;
      address?: string;
      profileImageUrl?: string;
      userId?: string;
      address?: string;
      classroomAbbre?: string;
      taughtSubjects?: SessionSubject[];
      taughtClassrooms?: Array<ClassroomType | ClassroomProps | string>;
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

    role?: string;
    email: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    username?: string;
    gender: "MALE" | "FEMALE";
    birthdate: CalendarDate | null;
    address?: string; a
    profileImageUrl?: string;
    userId?: string;
    classroomAbbre?: string;
    taughtSubjects?: SessionSubject[];
    taughtClassrooms?: Array<ClassroomType | ClassroomProps | string>;
  }
}
