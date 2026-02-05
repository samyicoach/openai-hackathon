export type CampaignRecord = {
  id: string;
  name: string;
  code: string;
  scope: string;
  state: "Review" | "Active";
  lastSync: string;
  segments: string[];
  productId: string;
};

const STORAGE_KEY = "ads-assistant-campaigns";

export const loadCampaigns = (): CampaignRecord[] => {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CampaignRecord[];
  } catch {
    return [];
  }
};

export const saveCampaigns = (campaigns: CampaignRecord[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
};
