import { CampaignRecord, TargetingMetrics } from "@/lib/types";

export const campaignPerformance = {
  projectedImpressions: "2.4M",
  activeRegions: 14,
  liveDeployments: 124,
  validationQueue: 8,
  systemAlerts: 3,
};

export const campaignKpis = {
  impressions: "2.4M",
  reach: "1.85M",
  frequency: "1.3",
  clicks: "11.0k",
  ctr: "0.46%",
  spend: "$12.4k",
  cpm: "$5.2",
  cpc: "$1.12",
  cvr: "0.42%",
  conversions: "46",
  roas: "2.8x",
  viewability: "78%",
};

export const campaignSeries = [
  { label: "Mon", impressions: 120000, clicks: 520, spend: 620, conversions: 5 },
  { label: "Tue", impressions: 142000, clicks: 580, spend: 680, conversions: 6 },
  { label: "Wed", impressions: 160000, clicks: 640, spend: 710, conversions: 7 },
  { label: "Thu", impressions: 132000, clicks: 560, spend: 640, conversions: 5 },
  { label: "Fri", impressions: 170000, clicks: 700, spend: 760, conversions: 7 },
  { label: "Sat", impressions: 190000, clicks: 760, spend: 820, conversions: 8 },
  { label: "Sun", impressions: 210000, clicks: 820, spend: 890, conversions: 8 },
];

export const campaignBudget = {
  total: 18000,
  spent: 12400,
  dailyCap: 1200,
};

export const geoMix = [
  { label: "United States", share: 38 },
  { label: "Canada", share: 16 },
  { label: "United Kingdom", share: 14 },
  { label: "Germany", share: 12 },
  { label: "Australia", share: 9 },
  { label: "Other", share: 11 },
];

export const ageMix = [
  { label: "18-24", share: 12 },
  { label: "25-34", share: 46 },
  { label: "35-44", share: 24 },
  { label: "45-54", share: 12 },
  { label: "55+", share: 6 },
];

export const placementMix = [
  { label: "Homepage", share: 34 },
  { label: "Product Pages", share: 28 },
  { label: "Blog", share: 18 },
  { label: "Email", share: 20 },
];

export const deviceMix = [
  { label: "Mobile", share: 62 },
  { label: "Desktop", share: 28 },
  { label: "Tablet", share: 10 },
];

export const campaignBenchmarks = {
  displayCtr: "0.46%",
  displayCvrRange: "0.30–0.57%",
};

export const dashboardKpis = {
  impressions: "8.9M",
  reach: "5.1M",
  frequency: "1.7",
  ctr: "0.41%",
  cpm: "$6.10",
  roas: "2.6x",
};

export const dashboardSeries = [
  { label: "Week 1", impressions: 980000, spend: 4200 },
  { label: "Week 2", impressions: 1120000, spend: 4600 },
  { label: "Week 3", impressions: 1380000, spend: 5100 },
  { label: "Week 4", impressions: 1550000, spend: 5700 },
  { label: "Week 5", impressions: 1710000, spend: 6200 },
  { label: "Week 6", impressions: 1860000, spend: 6900 },
];

export const campaigns: CampaignRecord[] = [
  {
    id: "c-1",
    name: "CloudWalk Sneakers",
    code: "CW-2024-001",
    scope: "Consumer Goods",
    state: "Active",
    lastSync: "Feb 2, 2026",
    segments: ["s-1", "s-2"],
    productId: "p-1",
    objective: "Awareness",
    budgetType: "Daily",
    budgetAmount: "$1,200",
    startDate: "2026-01-20",
    endDate: "2026-03-20",
    bidStrategy: "Maximize Reach",
    pacing: "Even",
    frequencyCap: "3 / day",
  },
  {
    id: "c-2",
    name: "HydroBottle 2.0",
    code: "HB-2024-042",
    scope: "Fitness",
    state: "Review",
    lastSync: "Feb 1, 2026",
    segments: ["s-2"],
    productId: "p-2",
    objective: "Consideration",
    budgetType: "Lifetime",
    budgetAmount: "$8,000",
    startDate: "2026-02-01",
    endDate: "2026-03-15",
    bidStrategy: "Target CPM",
    pacing: "Ahead",
    frequencyCap: "2 / day",
  },
  {
    id: "c-3",
    name: "SonicPro Headphones",
    code: "SP-2024-089",
    scope: "Electronics",
    state: "Review",
    lastSync: "Jan 30, 2026",
    segments: ["s-1", "s-3"],
    productId: "p-3",
    objective: "Conversion",
    budgetType: "Daily",
    budgetAmount: "$900",
    startDate: "2026-02-10",
    endDate: "2026-04-10",
    bidStrategy: "Target CPA",
    pacing: "Even",
    frequencyCap: "4 / day",
  },
  {
    id: "c-4",
    name: "ZenGlow Candle",
    code: "ZG-2024-005",
    scope: "Home Decor",
    state: "Review",
    lastSync: "Jan 29, 2026",
    segments: ["s-3"],
    productId: "p-4",
    objective: "Awareness",
    budgetType: "Lifetime",
    budgetAmount: "$6,000",
    startDate: "2026-01-15",
    endDate: "2026-02-28",
    bidStrategy: "Maximize Reach",
    pacing: "ASAP",
    frequencyCap: "3 / day",
  },
];

export const targetingMetrics: TargetingMetrics = {
  impressionGoal: "2.5M",
  estimatedReach: "1.85M",
  confidence: 92,
  objective: "Awareness",
  updatedAt: "12 mins ago",
};

export const aiRecommendationCards = [
  {
    id: "r-1",
    title: "Digital Pioneers",
    cluster: "Primary Cluster",
    reach: "1.2M–1.5M",
    lift: "+14.2%",
    confidence: 98,
    sentiment: {
      net: 64,
      confidence: 93,
      distribution: { positive: 66, neutral: 24, negative: 10 },
      trend: [52, 56, 58, 60, 62, 64, 65, 66],
      drivers: ["Innovation mindset", "High SaaS adoption", "Premium device usage"],
      risks: ["Price sensitivity in student cohorts"],
    },
    rationale:
      "Targets users engaging with emerging fintech and decentralized platforms. Strong overlap with profitable cohorts in coastal innovation hubs.",
    ageBands: [
      { label: "18-24", value: 12 },
      { label: "25-34", value: 58 },
      { label: "35-44", value: 22 },
      { label: "45+", value: 8 },
    ],
  },
  {
    id: "r-2",
    title: "Eco-Conscious Lifestyle",
    cluster: "Secondary",
    reach: "850k–1.1M",
    lift: "+8.5%",
    confidence: 89,
    sentiment: {
      net: 58,
      confidence: 88,
      distribution: { positive: 61, neutral: 27, negative: 12 },
      trend: [48, 50, 54, 56, 58, 59, 60, 61],
      drivers: ["Sustainability interest", "Curated placements", "Lifestyle affinity"],
      risks: ["Lower conversion on weekdays"],
    },
    rationale:
      "Aligns with sustainability signals and premium subscription behavior. Optimized for weekend peaks and curated placements.",
    ageBands: [
      { label: "18-24", value: 18 },
      { label: "25-34", value: 44 },
      { label: "35-44", value: 26 },
      { label: "45+", value: 12 },
    ],
  },
];

export const presets = [
  {
    id: "t-1",
    name: "Premium Launch",
    advertiser: "SonicPro",
    segments: "Affluent, Tech Enthusiasts, Urban Fitness",
    lastUsed: "Feb 1, 2026",
  },
  {
    id: "t-2",
    name: "Lifestyle Boost",
    advertiser: "ZenGlow",
    segments: "Home Decor, Wellness, Subscription Buyers",
    lastUsed: "Jan 21, 2026",
  },
];

export const auditLog = [
  {
    id: "a-1",
    action: "Targeting Approved",
    actor: "Alex Admin",
    timestamp: "Feb 2, 2026 3:42 PM",
  },
  {
    id: "a-2",
    action: "Recommendation Generated",
    actor: "AI Engine",
    timestamp: "Feb 2, 2026 3:40 PM",
  },
];
