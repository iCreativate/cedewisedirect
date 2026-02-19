import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function createClient() {
  if (!process.env.DATABASE_URL) return undefined;
  try {
    return new PrismaClient({});
  } catch {
    return undefined;
  }
}

export const prisma: PrismaClient | undefined = global.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

