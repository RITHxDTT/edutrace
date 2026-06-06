import Credentials from "next-auth/providers/credentials";
import { loginService } from "./services/auth.service";
import NextAuth from "next-auth";
import { ZodError } from "zod";

async function refreshAccessToken(token: any) {
  try {
    if (!token.refresh_token) {
      console.error("No refresh token stored");
      return { ...token, error: "RefreshTokenError" };
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: token.refresh_token }),
      },
    );

    const data = await res.json();

    if (!res.ok || !data.success) {
      console.error("Refresh failed:", data);
      return { ...token, error: "RefreshTokenError" };
    }

    const payload = data.payload;
    const newAccessToken = payload.accessToken ?? payload.access_token;
    const newRefreshToken =
      payload.refreshToken ?? payload.refresh_token ?? token.refresh_token;
    const expiresIn = payload.expiresIn ?? payload.expires_in;

    return {
      ...token,
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      expires_at: Math.floor(Date.now() / 1000) + expiresIn,
      error: undefined,
    };
  } catch (e) {
    console.error("refreshAccessToken threw:", e);
    return { ...token, error: "RefreshTokenError" };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const user = await loginService(credentials);
          if (!user) throw new Error("Invalid credentials.");
          return user;
        } catch (error) {
          if (error instanceof ZodError) return null;
        }
      },
    }),
  ],

  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    newUser: "/register",
  },

  callbacks: {
    async jwt({ token, trigger, user, session }) {
      if (user?.payload?.accessToken) {
        const accessToken = user.payload.accessToken;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const data = await res.json();
        const profile = data.payload;
        const role = profile.role;

        const isTeacher = role === "teacher";
        const taughtSubjects = isTeacher ? (profile.taughtSubjects ?? []) : null;
        const taughtClassrooms = isTeacher ? (profile.taughtClassrooms ?? []) : null;

        return {
          ...token,
          access_token: accessToken,
          refresh_token: user.payload.refreshToken,
          expires_at: Math.floor(Date.now() / 1000) + user.payload.expiresIn,
          role: role,
          firstName: profile.firstName,
          lastName: profile.lastName,
          fullName: profile.fullName,
          username: profile.username,
          gender: profile.gender,
          birthdate: profile.birthdate,
          email: profile.email,
          profileImageUrl: profile.profileImageUrl,
          address: profile.address,
          userId: profile.userId,
          classroomAbbre: profile.classroom?.classroomAbbre ?? null,
          taughtSubjects,
          taughtClassrooms,
          generation: profile.generation,
        };
      }

      if (Date.now() / 1000 >= (token.expires_at as number) - 10) {
        token = await refreshAccessToken(token);
      }
      if (trigger === "update") {
        return {
          ...token,
          profileImageUrl: session.profileImageUrl ?? token.profileImageUrl,
          ...session.user,
        };
      }

      return token;
    },

    async session({ session, token }) {
      session.access_token = token.access_token;

      session.user = {
        ...session.user,
        userId: token.userId,
        role: token.role,
        firstName: token.firstName,
        lastName: token.lastName,
        fullName: token.fullName,
        username: token.username,
        gender: token.gender,
        birthdate: token.birthdate,
        email: token.email,
        profileImageUrl: token.profileImageUrl as string,
        address: token.address as string,
        classroomAbbre: token.classroomAbbre,
        taughtSubjects: token.taughtSubjects,
        taughtClassrooms: token.taughtClassrooms,
        generation: token.generation
      };

      if (token.error) {
        session.error = token.error;
      }

      return session;
    },
  },
});
