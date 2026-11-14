import governanceJson from "./high-risk-content-governance.json";

export type HighRiskSurfaceId = "pflege" | "orientierung" | "lebenswelt" | "szenarien";
export type HighRiskSourceStatus = "pending-external-verification" | "not-applicable-fictional";

export interface HighRiskGovernanceGroup {
  selector: string;
  count: number;
  classification: string;
  source: {
    status: HighRiskSourceStatus;
    url: string | null;
    asOf: string | null;
  };
}

export interface HighRiskSurfaceGovernance {
  id: HighRiskSurfaceId;
  bank: string;
  titleAr: string;
  jurisdiction: string;
  noticeAr: string;
  officialActionAr: string;
  professionalReview: "pending";
  fieldValidation: "pending";
  groups: HighRiskGovernanceGroup[];
}

export interface HighRiskGovernanceRegistry {
  schema: "wegb2-high-risk-content-governance-v1";
  updatedAt: string;
  claimBoundaryAr: string;
  surfaces: HighRiskSurfaceGovernance[];
}

export const HIGH_RISK_GOVERNANCE = governanceJson as HighRiskGovernanceRegistry;

const BY_ID = new Map(HIGH_RISK_GOVERNANCE.surfaces.map((surface) => [surface.id, surface]));

export function highRiskGovernanceFor(id: HighRiskSurfaceId): HighRiskSurfaceGovernance {
  const surface = BY_ID.get(id);
  if (!surface) throw new Error(`Missing high-risk governance surface: ${id}`);
  return surface;
}

export function hasUnverifiedFactualGroups(surface: HighRiskSurfaceGovernance): boolean {
  return surface.groups.some((group) => group.source.status === "pending-external-verification");
}
