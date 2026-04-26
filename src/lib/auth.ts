import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        console.log("🔑 Authorizing user:", credentials.email);
        const start = Date.now();
        await connectDB();
        console.log(`⏱ DB Connected in ${Date.now() - start}ms`);

        const checkStart = Date.now();
        const user = await User.findOne({ email: credentials.email }).select("+password");
        console.log(`⏱ User found in ${Date.now() - checkStart}ms`);

        if (!user) {
          throw new Error("No user found with this email");
        }

        const compStart = Date.now();
        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
        console.log(`⏱ Password verified in ${Date.now() - compStart}ms`);

        if (!isPasswordMatch) {
          throw new Error("Password does not match");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },
  secret: process.env.NEXTAUTH_SECRET,
};
