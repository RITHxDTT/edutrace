import Credentials from "next-auth/providers/credentials";
import { loginService } from "./services/auth.service";
import NextAuth, { AuthError } from "next-auth";
import { ZodError } from "zod";

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
                    if (!user) {
                        throw new Error("Invalid credentials.")
                    }
                    return user;
                } catch (error) {
                    if (error instanceof ZodError) {
                        return null
                    }
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
        async jwt({ token, user }) {
            if (user?.payload?.accessToken) {
                const accessToken = user.payload.accessToken;

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                const data = await res.json();

                return {
                    ...token,
                    access_token: accessToken,
                    refresh_token: user.payload.refreshToken,
                    expires_at:
                        Math.floor(Date.now() / 1000) +
                        user.payload.expiresIn,
                    role: data.payload.role,
                    firstName: data.payload.firstName,
                    lastName: data.payload.lastName,
                    fullName: data.payload.fullName,
                    email: data.payload.email,
                    userId: data.payload.userId,
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
                email: token.email,
            }

            if (token.error) {
                session.error = token.error;
            }

            return session;
        },
    },
});