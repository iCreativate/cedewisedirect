import { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  debug: process.env.NODE_ENV !== "production",
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const email = credentials.email.toLowerCase().trim();
        const demoModeEnabled =
          process.env.DEMO_MODE === "true" || process.env.NODE_ENV === "development";
        if (demoModeEnabled) {
          const demoUsers = new Set([
            "broker.demo@cedewise.test",
            "manager.demo@cedewise.test",
            "coinsurer.demo@cedewise.test",
            "insurer.demo@cedewise.test",
          ]);
          if (demoUsers.has(email) && credentials.password === "Password123!") {
            const role = email.startsWith("broker")
              ? "BROKER"
              : email.startsWith("manager")
              ? "UNDERWRITING_MANAGER"
              : email.startsWith("coinsurer")
              ? "CO_INSURER"
              : "INSURER";
            return { id: email, email, name: email.split("@")[0], role } as any;
          }
        }
        let user = prisma ? await prisma.user.findUnique({ where: { email } }) : null;
        if (!user && prisma && process.env.DEV_AUTOPROVISION === "true") {
          // Development convenience: auto-provision a broker for demo logins
          user = await prisma.user.create({
            data: {
              email,
              name: email.split("@")[0],
              role: "BROKER",
              passwordHash: await (async () => {
                const { hashSync } = await import("bcryptjs");
                return hashSync(credentials.password, 10);
              })(),
            },
          });
        }
        if (!user) return null;
        const valid = await compare(credentials.password, user.passwordHash);
        if (!valid) return null;
        return { id: user.id, email: user.email, name: user.name, role: user.role } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.uid = (user as any).id;
      }
      return token as any;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = (token as any).uid;
        (session.user as any).role = (token as any).role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

