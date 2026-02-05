"use client";

import {
  CampaignState,
  CampaignRecord,
  Product,
  ProductSentiment,
  ProductStatus,
  TargetingInputs,
  TargetingMetrics,
  TargetingSegment,
} from "@/lib/types";
import { seedMetrics, seedProducts, seedSegments } from "@/lib/seed";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "ads-assistant-store";

type StoreState = {
  products: Product[];
  selectedProductId: string | null;
  targetingGenerated: boolean;
  selectedSegments: string[];
  campaigns: CampaignRecord[];
  metrics: TargetingMetrics;
  segments: TargetingSegment[];
  loading: boolean;
  draftProduct: {
    name: string;
    category: string;
    priceRange: string;
    launchDate: string;
    brandTone?: string;
    description?: string;
  } | null;
  draftTargeting: TargetingInputs | null;
};

type StoreActions = {
  selectProduct: (id: string) => void;
  generateTargeting: () => Promise<void>;
  toggleSegment: (id: string) => void;
  createCampaign: () => void;
  createCampaignForProduct: (productId: string) => void;
  createCampaignWithDetails: (input: {
    productId: string;
    name: string;
    objective: string;
    budgetType: "Daily" | "Lifetime";
    budgetAmount: string;
    startDate: string;
    endDate: string;
    bidStrategy: string;
    pacing: "Even" | "Ahead" | "ASAP";
    frequencyCap: string;
  }) => void;
  approveProduct: (productId: string) => void;
  setCampaignState: (campaign: CampaignRecord, state: CampaignState) => void;
  setDraftProduct: (input: {
    name: string;
    category: string;
    priceRange: string;
    launchDate: string;
    brandTone?: string;
    description?: string;
  }) => void;
  setDraftTargeting: (input: TargetingInputs) => void;
  clearDraft: () => void;
  createProduct: (input: {
    name: string;
    category: string;
    priceRange: string;
    launchDate: string;
    brandTone?: string;
    description?: string;
    targeting?: TargetingInputs;
    sentiment?: ProductSentiment;
  }) => void;
  resetTargeting: () => void;
};

type Store = StoreState & StoreActions;

const defaultState: StoreState = {
  products: seedProducts,
  selectedProductId: null,
  targetingGenerated: false,
  selectedSegments: [],
  campaigns: [],
  metrics: seedMetrics,
  segments: seedSegments,
  loading: false,
  draftProduct: null,
  draftTargeting: null,
};

const StoreContext = createContext<Store | null>(null);

const loadState = (): StoreState | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoreState;
  } catch {
    return null;
  }
};

const persistState = (state: StoreState) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const isDatePassed = (value: string): boolean => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return false;
  const target = new Date(parsed);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return target < today;
};

const normalizeProductStatus = (status: string, launchDate: string): ProductStatus => {
  if (isDatePassed(launchDate)) return "Archived";
  if (status === "Approved" || status === "Targeting Approved") return "Approved";
  return "Ready for View";
};

const normalizeProducts = (products: Product[]): Product[] =>
  products.map((product) => ({
    ...product,
    status: normalizeProductStatus(product.status, product.launchDate),
  }));

const generateFallbackTargeting = (product: Product): TargetingInputs => {
  const category = product.category.toLowerCase();
  const tone = (product.brandTone ?? "").toLowerCase();
  const base: TargetingInputs = {
    ageMin: "24",
    ageMax: "44",
    genders: ["All"],
    includeRegions: "United States, Canada, United Kingdom",
    excludeRegions: "Russia, China",
    interests: "Lifestyle, Shopping, Consumer tech",
    languages: "English",
    intentSignals: "buyer intent signals, category searches, product reviews",
    industries: "SaaS, Technology, Services",
    companySize: "Mid-market (200-1000)",
    jobSeniority: "Manager, Director, VP",
    jobFunctions: "Marketing, Product, Growth",
    devices: ["Mobile", "Desktop"],
    platforms: ["iOS", "Android", "Web"],
    placements: ["Homepage", "Product pages", "Blog"],
    contentTopics: "Business, Technology, Strategy",
    brandSafetyLevel: "Standard",
    excludedBrands: "Competitor X, Competitor Y",
    excludedKeywords: "free, cheap, discount",
    frequencyCap: "3 / day",
    objective: "Awareness",
  };

  if (category.includes("fitness")) {
    base.ageMin = "20";
    base.ageMax = "45";
    base.interests = "Fitness, Wellness, Running, Outdoor gear";
    base.intentSignals = "training plans, wellness subscriptions, hydration";
    base.contentTopics = "Fitness, Wellness, Outdoor";
  }
  if (category.includes("electronics") || category.includes("tech")) {
    base.ageMin = "18";
    base.ageMax = "40";
    base.interests = "Audio gear, Tech reviews, Gaming, Smart devices";
    base.intentSignals = "noise-canceling, premium audio, smart devices";
    base.contentTopics = "Technology, Audio, Gaming";
  }
  if (category.includes("home")) {
    base.ageMin = "25";
    base.ageMax = "54";
    base.interests = "Home decor, Interior design, Lifestyle";
    base.intentSignals = "home refresh, interior inspiration, premium decor";
    base.contentTopics = "Home decor, Lifestyle";
  }
  if (tone.includes("luxury")) {
    base.objective = "Consideration";
    base.excludedKeywords = "discount, cheap, clearance";
    base.brandSafetyLevel = "Limited";
  }
  return base;
};

const normalizeCampaignState = (state?: string): CampaignState =>
  state === "Active" ? "Active" : "Review";

const withCampaignDefaults = (campaign: CampaignRecord): CampaignRecord => ({
  ...campaign,
  state: normalizeCampaignState(campaign.state),
  objective: campaign.objective ?? "Awareness",
  budgetType: campaign.budgetType ?? "Daily",
  budgetAmount: campaign.budgetAmount ?? "$1,200",
  startDate: campaign.startDate ?? "2026-02-10",
  endDate: campaign.endDate ?? "2026-03-20",
  bidStrategy: campaign.bidStrategy ?? "Maximize Reach",
  pacing: campaign.pacing ?? "Even",
  frequencyCap: campaign.frequencyCap ?? "3 / day",
});

const hydrateProducts = (products: Product[]) => {
  if (!products || products.length === 0) return normalizeProducts(seedProducts);
  const merged = products.map((product) => {
    const seed = seedProducts.find((item) => item.id === product.id);
    if (!seed) return product;
    return {
      ...seed,
      ...product,
      brandTone: product.brandTone ?? seed.brandTone,
      description: product.description ?? seed.description,
      targeting: product.targeting ?? seed.targeting ?? generateFallbackTargeting(product),
    };
  });
  const missingSeeds = seedProducts.filter(
    (seed) => !merged.some((product) => product.id === seed.id)
  );
  return normalizeProducts([
    ...merged,
    ...missingSeeds.map((seed) => ({
      ...seed,
      targeting: seed.targeting ?? generateFallbackTargeting(seed),
    })),
  ]);
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(defaultState);

  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setState({
        ...saved,
        selectedProductId: null,
        products: normalizeProducts(hydrateProducts(saved.products)),
        campaigns: (saved.campaigns ?? []).map(withCampaignDefaults),
      });
    } else {
      setState((prev) => ({
        ...prev,
        products: normalizeProducts(hydrateProducts(prev.products)),
        campaigns: (prev.campaigns ?? []).map(withCampaignDefaults),
      }));
    }
  }, []);

  useEffect(() => {
    persistState(state);
  }, [state]);

  const selectProduct = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      selectedProductId: id,
      targetingGenerated: false,
      selectedSegments: [],
      loading: false,
    }));
  }, []);

  const resetTargeting = useCallback(() => {
    setState((prev) => ({
      ...prev,
      targetingGenerated: false,
      selectedSegments: [],
      loading: false,
    }));
  }, []);

  const generateTargeting = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    await new Promise((resolve) => setTimeout(resolve, 800));
    setState((prev) => ({
      ...prev,
      targetingGenerated: true,
      selectedSegments: prev.segments.map((segment) => segment.id),
      loading: false,
      products: prev.products.map((product) =>
        product.id === prev.selectedProductId
          ? {
              ...product,
              status: "Ready for View" as ProductStatus,
              updatedAt: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              }),
            }
          : product
      ),
    }));
  }, []);

  const toggleSegment = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      selectedSegments: prev.selectedSegments.includes(id)
        ? prev.selectedSegments.filter((segmentId) => segmentId !== id)
        : [...prev.selectedSegments, id],
    }));
  }, []);

  const createCampaignInternal = (
    prev: StoreState,
    productId: string,
    segments: string[],
    details?: Partial<CampaignRecord>
  ): StoreState => {
    const selectedProduct = prev.products.find((product) => product.id === productId);
    if (!selectedProduct) return prev;
    const now = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
    const newCampaign: CampaignRecord = {
      id: `user-${Date.now()}`,
      name: details?.name ?? `${selectedProduct.name} Launch`,
      code: selectedProduct.sku,
      scope: selectedProduct.category,
      state: "Review",
      lastSync: now,
      segments,
      productId: selectedProduct.id,
      objective: details?.objective,
      budgetType: details?.budgetType,
      budgetAmount: details?.budgetAmount,
      startDate: details?.startDate,
      endDate: details?.endDate,
      bidStrategy: details?.bidStrategy,
      pacing: details?.pacing,
      frequencyCap: details?.frequencyCap,
    };

      return {
        ...prev,
        campaigns: [withCampaignDefaults(newCampaign), ...prev.campaigns.map(withCampaignDefaults)],
        products: normalizeProducts(prev.products.map((product) =>
          product.id === selectedProduct.id
            ? {
                ...product,
              status: "Approved" as ProductStatus,
              updatedAt: now,
            }
          : product
      )),
    };
  };

  const createCampaign = useCallback(() => {
    setState((prev) =>
      createCampaignInternal(prev, prev.selectedProductId ?? "", prev.selectedSegments)
    );
  }, []);

  const createCampaignForProduct = useCallback((productId: string) => {
    setState((prev) =>
      createCampaignInternal(
        prev,
        productId,
        prev.selectedSegments.length ? prev.selectedSegments : prev.segments.map((s) => s.id)
      )
    );
  }, []);

  const createCampaignWithDetails = useCallback(
    (input: {
      productId: string;
      name: string;
      objective: string;
      budgetType: "Daily" | "Lifetime";
      budgetAmount: string;
      startDate: string;
      endDate: string;
      bidStrategy: string;
      pacing: "Even" | "Ahead" | "ASAP";
      frequencyCap: string;
    }) => {
      setState((prev) =>
        createCampaignInternal(
          prev,
          input.productId,
          prev.selectedSegments.length ? prev.selectedSegments : prev.segments.map((s) => s.id),
          input
        )
      );
    },
    []
  );

  const approveProduct = useCallback((productId: string) => {
    setState((prev) => ({
      ...prev,
      products: normalizeProducts(
        prev.products.map((product) =>
          product.id === productId
            ? {
                ...product,
                status: "Approved",
                updatedAt: new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                }),
              }
            : product
        )
      ),
    }));
  }, []);

  const setCampaignState = useCallback((campaign: CampaignRecord, state: CampaignState) => {
    setState((prev) => {
      const exists = prev.campaigns.some((item) => item.id === campaign.id);
      const normalized = withCampaignDefaults({ ...campaign, state });
      if (exists) {
        return {
          ...prev,
          campaigns: prev.campaigns.map((item) =>
            item.id === campaign.id ? withCampaignDefaults({ ...item, state }) : item
          ),
        };
      }
      return {
        ...prev,
        campaigns: [normalized, ...prev.campaigns.map(withCampaignDefaults)],
      };
    });
  }, []);

  const setDraftProduct = useCallback(
    (input: {
      name: string;
      category: string;
      priceRange: string;
      launchDate: string;
      brandTone?: string;
      description?: string;
    }) => {
      setState((prev) => ({
        ...prev,
        draftProduct: input,
      }));
    },
    []
  );

  const setDraftTargeting = useCallback((input: TargetingInputs) => {
    setState((prev) => ({
      ...prev,
      draftTargeting: input,
    }));
  }, []);

  const clearDraft = useCallback(() => {
    setState((prev) => ({
      ...prev,
      draftProduct: null,
      draftTargeting: null,
    }));
  }, []);

  const createProduct = useCallback(
    (input: {
      name: string;
      category: string;
      priceRange: string;
      launchDate: string;
      brandTone?: string;
      description?: string;
      targeting?: TargetingInputs;
      sentiment?: ProductSentiment;
    }) => {
      setState((prev) => {
        const newProduct: Product = {
          id: `p-${Date.now()}`,
          name: input.name,
          sku: `NEW-${Math.floor(Math.random() * 900 + 100)}`,
          category: input.category,
          advertiser: "New Advertiser",
          status: "Ready for View",
          launchDate: input.launchDate,
          priceRange: input.priceRange,
          updatedAt: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
          brandTone: input.brandTone,
          description: input.description,
          targeting: input.targeting,
          sentiment: input.sentiment,
        };
        return {
          ...prev,
          products: normalizeProducts([newProduct, ...prev.products]),
          selectedProductId: newProduct.id,
          targetingGenerated: false,
          selectedSegments: [],
        };
      });
    },
    []
  );

  const value = useMemo<Store>(
    () => ({
      ...state,
      selectProduct,
      generateTargeting,
      toggleSegment,
      createCampaign,
      createCampaignForProduct,
      createCampaignWithDetails,
      approveProduct,
      setCampaignState,
      setDraftProduct,
      setDraftTargeting,
      clearDraft,
      createProduct,
      resetTargeting,
    }),
    [
      state,
      selectProduct,
      generateTargeting,
      toggleSegment,
      createCampaign,
      createCampaignForProduct,
      createCampaignWithDetails,
      approveProduct,
      setCampaignState,
      setDraftProduct,
      setDraftTargeting,
      clearDraft,
      createProduct,
      resetTargeting,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return ctx;
};
