export type UserRole = "BROKER" | "UNDERWRITING_MANAGER" | "CO_INSURER" | "INSURER";

export type SubmissionStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "ENDORSED"
  | "APPROVED"
  | "DECLINED";

export interface SubmissionInput {
  title: string;
  clientName: string;
  riskType: string;
  coverageAmount: number;
  description: string;
  hazards?: string;
  premiumEstimate?: number;
}

