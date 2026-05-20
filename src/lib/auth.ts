import CredentialsProvider from "next-auth/providers/credentials";
import { mockuser } from "./mockUser";
import { JWT } from "next-auth/jwt";

async function refreshAccessToken(token: JWT) {
  try {
    return {
      ...token,
      accessToken: `new-access-token-${Date.now()}`,
      accessTokenExpires: Date.now() + 5 * 60 * 1000, // 5 mins
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials: any) {
        const user = mockuser.find(
          (u) =>
            u.email === credentials.email &&
            u.password === credentials.password
        );

        if (!user) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,

          accessToken: `access-token-${user.id}`,
          refreshToken: `refresh-token-${user.id}`,

          accessTokenExpires: Date.now() + 5 * 60 * 1000,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt" as const,
  },

  callbacks: {
    async jwt({ token, user }: any) {

      // first login
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          role: user.role,
          accessTokenExpires: user.accessTokenExpires,
        };
      }

    //   token still valid
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

    //   refresh token
      return refreshAccessToken(token);
    },

    async session({ session, token }: any) {
      session.user.role = token.role;

      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};