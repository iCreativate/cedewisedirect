import { describe, it, expect } from "vitest";
import { isDashboardPathAllowed } from "@/lib/rbac";

describe("RBAC dashboard matcher", () => {
  it("allows broker path for broker", () => {
    expect(isDashboardPathAllowed("BROKER", "/dashboard/broker")).toBe(true);
    expect(isDashboardPathAllowed("BROKER", "/dashboard/broker/sub")).toBe(true);
  });
  it("blocks cross-role paths", () => {
    expect(isDashboardPathAllowed("BROKER", "/dashboard/insurer")).toBe(false);
  });
});

