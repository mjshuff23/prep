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
        if (
          !credentials?.email || 
          !credentials?.password || 
          typeof credentials.email !== "string" || 
          typeof credentials.password !== "string"
        ) {
          return null;
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.trim().toLowerCase() }
        });
        
        if (!user || !user.password) {
          // Compare against a valid 60-character bcrypt hash to maintain timing
          await bcrypt.compare("", "$2a$10$CwTycUXWue0Thq9StjUM0u1KLRt1XhVp6vQzVzX8bZ3X9P4M2qL22");
          return null;
        }
        
        const passwordsMatch = await bcrypt.compare(
          credentials.password,
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
