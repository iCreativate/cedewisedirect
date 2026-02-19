import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "BROKER" | "UNDERWRITING_MANAGER" | "CO_INSURER" | "INSURER";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid?: string;
    role?: "BROKER" | "UNDERWRITING_MANAGER" | "CO_INSURER" | "INSURER";
  }
}

