export type ProductStatus = "Ready for View" | "Approved" | "Archived";

export type CampaignState = "Review" | "Active";

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  advertiser: string;
  status: ProductStatus;
  launchDate: string;
  priceRange: string;
  updatedAt: string;
  brandTone?: string;
  description?: string;
  targeting?: TargetingInputs;
  sentiment?: ProductSentiment;
};

export type TargetingSegment = {
  id: string;
  title: string;
  tags: string[];
  confidence: number;
  rationale: string;
  reach: string;
  cpmIndex: string;
};

export type TargetingMetrics = {
  impressionGoal: string;
  estimatedReach: string;
  confidence: number;
  objective: string;
  updatedAt: string;
};

export type TargetingInputs = {
  ageMin: string;
  ageMax: string;
  genders: string[];
  includeRegions: string;
  excludeRegions: string;
  languages: string;
  interests: string;
  intentSignals: string;
  industries: string;
  companySize: string;
  jobSeniority: string;
  jobFunctions: string;
  devices: string[];
  platforms: string[];
  placements: string[];
  contentTopics: string;
  brandSafetyLevel: string;
  excludedBrands: string;
  excludedKeywords: string;
  frequencyCap: string;
  objective: string;
};

export type ProductSentiment = {
  netSentiment: number;
  confidence: number;
  volume: string;
  momentum: string;
  distribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  drivers: string[];
  risks: string[];
  insights: string[];
  trend: number[];
  sources: string[];
};

export type CampaignRecord = {
  id: string;
  name: string;
  code: string;
  scope: string;
  state: CampaignState;
  lastSync: string;
  segments: string[];
  productId: string;
  objective?: string;
  budgetType?: "Daily" | "Lifetime";
  budgetAmount?: string;
  startDate?: string;
  endDate?: string;
  bidStrategy?: string;
  pacing?: "Even" | "Ahead" | "ASAP";
  frequencyCap?: string;
};
