import { z } from "zod";

export const submissionSchema = z.object({
  title: z.string().min(2, "Required"),
  clientName: z.string().min(2, "Required"),
  riskType: z.enum(["Property", "Liability"]).or(z.string().min(1)),
  coverageAmount: z.number({ invalid_type_error: "Enter a number" }).positive(),
  description: z.string().min(5, "Too short"),
  hazards: z.string().optional(),
  premiumEstimate: z.number().optional(),
  // Risk Assessment Form Data
  extra: z
    .object({
      // General Policy Information
      insuredName: z.string().optional(),
      policyNo: z.string().optional(),
      marketer: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      effectiveDate: z.string().optional(),
      // Risk Details
      riskAddress: z.string().optional(),
      occupancyOfRisk: z.string().optional(),
      construction: z.enum(["Standard", "Non-Standard"]).optional(),
      otherInformation: z.string().optional(),
      renewalDetails: z.string().optional(),
      // Calculation Tables (multiple tables supported)
      calculationTables: z
        .array(
          z.object({
            insuredNameCalc: z.string().optional(),
            location: z.string().optional(),
            calculationRows: z
              .array(
                z.object({
                  section: z.string(),
                  subSection: z.string(),
                  sumInsuredVATIncl: z.number().optional(),
                  premiumVATIncl: z.number().optional(),
                  sumInsuredVATExcl: z.number().optional(),
                  premiumVATExcl: z.number().optional(),
                  rate: z.number().optional(),
                })
              )
              .optional(),
          })
        )
        .optional(),
      // Reinsurance Placements
      excludingVATPercent: z.number().optional(),
      excludingVATAmount: z.number().optional(),
      hicSharePercent: z.number().optional(),
      hicShareAmount: z.number().optional(),
      shortfallAfterHIC: z.number().optional(),
      proportionalFAC: z
        .array(
          z.object({
            percent: z.number().optional(),
            amount: z.number().optional(),
          })
        )
        .optional(),
      totalProportionalFACSecured: z.number().optional(),
      shortfallAfterProportional: z.number().optional(),
      xolFAC: z
        .array(
          z.object({
            reinsurer: z.string(),
            percentOfXOLLayer: z.number().optional(),
            exposureOnXOLLayer: z.number().optional(),
          })
        )
        .optional(),
      totalXOLFACSecured: z.number().optional(),
      shortfallAfterXOL: z.number().optional(),
      reinsurersConditions: z.string().optional(),
      xolPremiumsQuoted: z.number().optional(),
      totalPremium: z.number().optional(),
    })
    .optional(),
  // Attachments
  attachments: z
    .array(
      z.object({
        name: z.string(),
        size: z.number(),
        type: z.string(),
        url: z.string().nullable().optional(),
      })
    )
    .optional(),
});

export type SubmissionFormValues = z.infer<typeof submissionSchema>;

