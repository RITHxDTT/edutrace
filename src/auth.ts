import Credentials from "next-auth/providers/credentials";
import { loginService } from "./services/auth.service";
import NextAuth from "next-auth";

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
                    return user ?? null;
                } catch {
                    return null;
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
            // Initial sign-in
            if (user) {
                const accessToken = user.payload.accessToken;

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const data = await res.json();
                console.log(data)

                return {
                    ...token,
                    access_token: accessToken,
                    refresh_token: user.payload.refreshToken,
                    expires_at: Math.floor(Date.now() / 1000) + user.payload.expiresIn,
                    role: data.payload.role,
                    firstName: data.payload.firstName,
                    lastName: data.payload.lastName,
                    fullName: data.payload.fullName,
                    email: data.payload.email,
                    userId: data.payload.userId,
                };
            }

            // Token still valid
            if (Date.now() < (token.expires_at ?? 0) * 1000) {
                return token;
            }

            // No refresh token
            if (!token.refresh_token) {
                return { ...token, error: "RefreshTokenError" };
            }

            // Refresh the token
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ refreshToken: token.refresh_token }),
                    }
                );

                const data = await response.json();
                if (!response.ok) throw data;

                return {
                    ...token,
                    access_token: data.payload.accessToken,
                    expires_at: Math.floor(Date.now() / 1000) + data.payload.expiresIn,
                    refresh_token: data.payload.refreshToken ?? token.refresh_token,
                    error: undefined,
                };
            } catch {
                return { ...token, error: "RefreshTokenError" };
            }
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