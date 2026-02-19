import { initTRPC } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const createContext = async () => {
  const session = await getServerSession(authOptions);
  return { session, prisma };
};

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({ transformer: superjson });

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next();
});

type DemoSubmissionRow = {
  id: string;
  title: string;
  clientName: string;
  status: string;
  riskType: string;
  coverageAmount: number;
  createdAt: string;
  premiumEstimate?: number;
  hazards?: string;
  description?: string;
};

const DEMO_SUBMISSIONS: DemoSubmissionRow[] = [
  {
    id: "POL-20241215-0001",
    title: "Commercial Property - ABC Corporation",
    clientName: "ABC Corporation",
    status: "PENDING",
    riskType: "Property",
    coverageAmount: 15000000,
    createdAt: "2024-12-15",
    premiumEstimate: 245000,
    hazards: "Fire load, electrical systems, adjacent warehousing",
    description:
      "Multi-site commercial property cover for head office and warehouse locations. Risk survey pending.\n\n__EXTRA__:{\"insuredName\":\"ABC Corporation\",\"policyNo\":\"POL-20241215-0001\",\"marketer\":\"Internal\",\"effectiveDate\":\"2025-01-01\",\"riskAddress\":\"Sandton, Johannesburg\",\"occupancyOfRisk\":\"Office & Warehousing\",\"construction\":\"Concrete/Steel\"}",
  },
  {
    id: "POL-20241214-0032",
    title: "Liability Coverage - XYZ Industries",
    clientName: "XYZ Industries",
    status: "UNDER_REVIEW",
    riskType: "Liability",
    coverageAmount: 8500000,
    createdAt: "2024-12-14",
    premiumEstimate: 180000,
    hazards: "Public interface operations, contractor exposure",
    description:
      "GL program renewal with updated claims history and revised limits.\n\n__EXTRA__:{\"insuredName\":\"XYZ Industries\",\"policyNo\":\"POL-20241214-0032\",\"effectiveDate\":\"2025-02-01\",\"riskAddress\":\"Ekurhuleni, Gauteng\",\"occupancyOfRisk\":\"Manufacturing\"}",
  },
  {
    id: "POL-20241213-0021",
    title: "Property & Business Interruption - Global Tech Ltd",
    clientName: "Global Tech Ltd",
    status: "APPROVED",
    riskType: "Property",
    coverageAmount: 32000000,
    createdAt: "2024-12-13",
    premiumEstimate: 520000,
    hazards: "Data center fire suppression, critical dependencies",
    description:
      "Property + BI placement for primary DC and satellite offices. BI worksheets attached.\n\n__EXTRA__:{\"insuredName\":\"Global Tech Ltd\",\"policyNo\":\"POL-20241213-0021\",\"effectiveDate\":\"2025-01-15\",\"riskAddress\":\"Cape Town, Western Cape\",\"occupancyOfRisk\":\"Technology / Data Center\"}",
  },
  {
    id: "POL-20241212-0015",
    title: "Professional Liability - TechStart Inc",
    clientName: "TechStart Inc",
    status: "PENDING",
    riskType: "Liability",
    coverageAmount: 12000000,
    createdAt: "2024-12-12",
    premiumEstimate: 195000,
    hazards: "Professional services, cyber exposure",
    description:
      "Professional indemnity renewal for technology consultancy. Pending proposal.\n\n__EXTRA__:{\"insuredName\":\"TechStart Inc\",\"policyNo\":\"POL-20241212-0015\",\"effectiveDate\":\"2025-01-01\",\"riskAddress\":\"Sandton, Gauteng\",\"occupancyOfRisk\":\"Professional Services\"}",
  },
  {
    id: "POL-20241211-0008",
    title: "Commercial Property Portfolio - Retail Group SA",
    clientName: "Retail Group SA",
    status: "APPROVED",
    riskType: "Property",
    coverageAmount: 45000000,
    createdAt: "2024-12-11",
    premiumEstimate: 780000,
    hazards: "Retail premises, stock, business interruption",
    description:
      "Portfolio cover for retail chain – 12 locations. Schedule attached.\n\n__EXTRA__:{\"insuredName\":\"Retail Group SA\",\"policyNo\":\"POL-20241211-0008\",\"effectiveDate\":\"2025-02-01\",\"riskAddress\":\"Nationwide\",\"occupancyOfRisk\":\"Retail\"}",
  },
  {
    id: "POL-20241210-0042",
    title: "General Liability - Manufacturing Co",
    clientName: "Manufacturing Co",
    status: "UNDER_REVIEW",
    riskType: "Liability",
    coverageAmount: 6500000,
    createdAt: "2024-12-10",
    premiumEstimate: 125000,
    hazards: "Factory operations, product liability",
    description:
      "GL renewal with updated payroll and turnover. Underwriter review in progress.\n\n__EXTRA__:{\"insuredName\":\"Manufacturing Co\",\"policyNo\":\"POL-20241210-0042\",\"effectiveDate\":\"2025-01-15\",\"riskAddress\":\"Ekurhuleni, Gauteng\",\"occupancyOfRisk\":\"Manufacturing\"}",
  },
  {
    id: "POL-20241209-0033",
    title: "Property Damage - Logistics Solutions",
    clientName: "Logistics Solutions",
    status: "APPROVED",
    riskType: "Property",
    coverageAmount: 18500000,
    createdAt: "2024-12-09",
    premiumEstimate: 310000,
    hazards: "Warehouses, fleet, goods in transit",
    description:
      "Property and transit cover for logistics operator. Policy endorsed.\n\n__EXTRA__:{\"insuredName\":\"Logistics Solutions\",\"policyNo\":\"POL-20241209-0033\",\"effectiveDate\":\"2025-01-01\",\"riskAddress\":\"Durban, KZN\",\"occupancyOfRisk\":\"Logistics / Warehousing\"}",
  },
];

function getDemoSubmission(id: string, sessionUser: any) {
  const found =
    DEMO_SUBMISSIONS.find((s) => s.id === id) ??
    DEMO_SUBMISSIONS.find((s) => s.id.endsWith(id));
  if (!found) return null;
  const now = new Date();
  return {
    id: found.id,
    title: found.title,
    clientName: found.clientName,
    status: found.status,
    riskType: found.riskType,
    coverageAmount: found.coverageAmount,
    premiumEstimate: found.premiumEstimate ?? null,
    hazards: found.hazards ?? null,
    description: found.description ?? `${found.title}\n\nSubmitted for review.`,
    createdAt: new Date(found.createdAt),
    updatedAt: now,
    attachments: [] as any[],
    broker: sessionUser
      ? {
          id: (sessionUser as any).id ?? "demo-user",
          name: (sessionUser as any).name ?? "Demo User",
          email: (sessionUser as any).email ?? "demo@cedewise.test",
        }
      : null,
  } as any;
}

export const appRouter = router({
  health: publicProcedure.query(() => ({ ok: true })),
  me: protectedProcedure.query(({ ctx }) => ctx.session?.user ?? null),
  mySubmissions: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.prisma) return [];
    const userId = (ctx.session!.user as any).id as string;
    return ctx.prisma.submission.findMany({
      where: { brokerId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        attachments: true,
      },
    });
  }),
  createSubmission: protectedProcedure
    .input(
      z.object({
        title: z.string().min(2),
        clientName: z.string().min(2),
        riskType: z.string(),
        coverageAmount: z.number().positive(),
        description: z.string().min(5),
        hazards: z.string().optional(),
        premiumEstimate: z.number().optional(),
        extra: z.any().optional(),
        attachments: z.array(z.object({
          name: z.string(),
          size: z.number(),
          type: z.string(),
          url: z.string().nullable().optional(),
        })).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.prisma) throw new Error("Database unavailable in demo mode");
      const userId = (ctx.session!.user as any).id as string;
      
      const submission = await ctx.prisma.submission.create({
        data: {
          title: input.title,
          clientName: input.clientName,
          riskType: input.riskType,
          coverageAmount: input.coverageAmount,
          description:
            input.description + (input.extra ? `\n\n__EXTRA__:${JSON.stringify(input.extra)}` : ""),
          hazards: input.hazards,
          premiumEstimate: input.premiumEstimate,
          brokerId: userId,
          status: "SUBMITTED", // Set status to SUBMITTED when created
          attachments: {
            create: (input.attachments || []).map((att) => ({
              fileName: att.name,
              fileType: att.type,
              url: att.url || "", // In production, this would be the uploaded file URL
            })),
          },
        },
        include: {
          attachments: true,
        },
      });
      
      return submission;
    }),
  getSubmission: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.prisma) {
        const demo = getDemoSubmission(input.id, ctx.session?.user);
        if (!demo) throw new TRPCError({ code: "NOT_FOUND", message: "Submission not found" });
        return demo;
      }
      const userId = (ctx.session!.user as any).id as string;
      
      const submission = await ctx.prisma.submission.findFirst({
        where: {
          id: input.id,
          brokerId: userId, // Ensure user can only access their own submissions
        },
        include: {
          attachments: true,
          broker: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      
      if (!submission) throw new TRPCError({ code: "NOT_FOUND", message: "Submission not found" });
      return submission;
    }),
  updateSubmission: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(2).optional(),
        clientName: z.string().min(2).optional(),
        riskType: z.string().optional(),
        coverageAmount: z.number().positive().optional(),
        description: z.string().min(5).optional(),
        hazards: z.string().optional(),
        premiumEstimate: z.number().optional(),
        extra: z.any().optional(),
        status: z.enum(["DRAFT", "SUBMITTED", "UNDER_REVIEW", "ENDORSED", "APPROVED", "DECLINED"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.prisma) {
        const existing = getDemoSubmission(input.id, ctx.session?.user);
        if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Submission not found" });
        // Demo-mode update: return updated object (non-persistent)
        return {
          ...existing,
          ...(input.title ? { title: input.title } : null),
          ...(input.clientName ? { clientName: input.clientName } : null),
          ...(input.riskType ? { riskType: input.riskType } : null),
          ...(input.coverageAmount ? { coverageAmount: input.coverageAmount } : null),
          ...(input.hazards !== undefined ? { hazards: input.hazards } : null),
          ...(input.premiumEstimate !== undefined ? { premiumEstimate: input.premiumEstimate } : null),
          ...(input.status ? { status: input.status } : null),
          ...(input.description ? { description: input.description } : null),
          updatedAt: new Date(),
        } as any;
      }
      const userId = (ctx.session!.user as any).id as string;
      const { id, ...updateData } = input;
      
      // Verify ownership
      const existing = await ctx.prisma.submission.findFirst({
        where: { id, brokerId: userId },
      });
      
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Submission not found or unauthorized" });
      
      // Parse extra data if description contains it
      let description = updateData.description;
      if (updateData.extra && description) {
        description = description + `\n\n__EXTRA__:${JSON.stringify(updateData.extra)}`;
      }
      
      return ctx.prisma.submission.update({
        where: { id },
        data: {
          ...(updateData.title && { title: updateData.title }),
          ...(updateData.clientName && { clientName: updateData.clientName }),
          ...(updateData.riskType && { riskType: updateData.riskType }),
          ...(updateData.coverageAmount && { coverageAmount: updateData.coverageAmount }),
          ...(description && { description }),
          ...(updateData.hazards !== undefined && { hazards: updateData.hazards }),
          ...(updateData.premiumEstimate !== undefined && { premiumEstimate: updateData.premiumEstimate }),
          ...(updateData.status && { status: updateData.status }),
        },
        include: {
          attachments: true,
        },
      });
    }),
});

export type AppRouter = typeof appRouter;

