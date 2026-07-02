import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma as any),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await prisma.user.findUnique({
          where: { email: (credentials.email as string).trim().toLowerCase() }
        });
        
        if (!user || !user.password) {
          await bcrypt.compare("", "$2a$10$abcdefghijklmnopqrstuv");
          return null;
        }
        
        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        
        if (passwordsMatch) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password: _pw, ...safeUser } = user;
          return safeUser;
        }
        return null;
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  }
});
