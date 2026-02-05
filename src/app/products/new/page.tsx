"use client";

import AppShell from "@/components/AppShell";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function NewProductPage() {
  const { setDraftProduct, setDraftTargeting, draftProduct, draftTargeting, clearDraft } =
    useStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step");
  const productCategories = [
    "Apparel & Accessories",
    "Electronics",
    "Software & SaaS",
    "Business Services",
    "Home & Garden",
    "Health & Beauty",
    "Sporting Goods",
    "Finance & Insurance",
  ];
  const currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD"];
  const initialForm = {
    name: "",
    category: "",
    priceCurrency: "USD",
    priceMin: "",
    priceMax: "",
    launchDate: "",
    brandTone: "",
    description: "",
  };
  const initialTargetingInputs = {
    ageMin: "24",
    ageMax: "44",
    genders: ["All"],
    includeRegions: "United States, Canada, United Kingdom",
    excludeRegions: "Russia, China",
    languages: "English",
    interests: "Sneakers, Running, Fitness wearables, Urban lifestyle",
    intentSignals: "running shoes, commuter gear, sportswear reviews",
    industries: "Retail, Consumer Goods, Lifestyle",
    companySize: "Mid-market (200-1000)",
    jobSeniority: "Manager, Director, VP",
    jobFunctions: "Marketing, Growth, Product",
    devices: ["Mobile", "Desktop"],
    platforms: ["iOS", "Android", "Web"],
    placements: ["Homepage", "Product pages", "Blog"],
    contentTopics: "Lifestyle, Fitness, Apparel",
    brandSafetyLevel: "Standard",
    excludedBrands: "Competitor X, Competitor Y",
    excludedKeywords: "free, cheap, discount",
    frequencyCap: "3 per day",
    objective: "Awareness",
  };
  const [step, setStep] = useState<"details" | "targeting">("details");
  const [transitionLoading, setTransitionLoading] = useState<null | "targeting" | "sentiment">(
    null
  );
  const [form, setForm] = useState(initialForm);
  const [targetingInputs, setTargetingInputs] = useState(initialTargetingInputs);

  useEffect(() => {
    const returnToTargeting = stepParam === "targeting";
    if (returnToTargeting) {
      setStep("targeting");
      return;
    }
    setStep("details");
    setForm(initialForm);
    setTargetingInputs(initialTargetingInputs);
    clearDraft();
  }, [stepParam, clearDraft]);

  useEffect(() => {
    const returnToTargeting = stepParam === "targeting";
    if (!returnToTargeting || !draftProduct) {
      return;
    }
    const priceParts = draftProduct.priceRange.match(
      /^([A-Z]{3})\s+(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)$/
    );
    setForm((prev) => ({
      ...prev,
      name: draftProduct.name,
      category: draftProduct.category,
      launchDate: draftProduct.launchDate,
      brandTone: draftProduct.brandTone ?? prev.brandTone,
      description: draftProduct.description ?? prev.description,
      priceCurrency: priceParts?.[1] ?? prev.priceCurrency,
      priceMin: priceParts?.[2] ?? prev.priceMin,
      priceMax: priceParts?.[3] ?? prev.priceMax,
    }));
    setStep("targeting");
  }, [stepParam, draftProduct]);

  useEffect(() => {
    const returnToTargeting = stepParam === "targeting";
    if (returnToTargeting && draftTargeting) {
      setTargetingInputs((prev) => ({
        ...prev,
        ...draftTargeting,
      }));
    }
  }, [stepParam, draftTargeting]);

  const descriptionText = form.description.toLowerCase();
  const descriptionWords = descriptionText.trim()
    ? descriptionText.trim().split(/\s+/).length
    : 0;
  const hasAnyKeyword = (keywords: string[]) =>
    keywords.some((keyword) => descriptionText.includes(keyword));
  const hasAudienceContext = hasAnyKeyword([
    "for ",
    "who ",
    "audience",
    "target",
    "customer",
    "user",
    "team",
    "persona",
    "business",
    "company",
    "industry",
    "b2b",
    "b2c",
  ]);
  const hasProblemContext = hasAnyKeyword([
    "problem",
    "pain",
    "challenge",
    "issue",
    "need",
    "friction",
    "bottleneck",
    "solve",
    "solves",
    "solving",
    "inefficient",
    "slow",
  ]);
  const hasValueContext = hasAnyKeyword([
    "value",
    "benefit",
    "outcome",
    "improve",
    "increase",
    "reduce",
    "save",
    "faster",
    "lower",
    "higher",
    "roi",
    "growth",
  ]);
  const hasDifferentiatorContext = hasAnyKeyword([
    "unique",
    "different",
    "differentiator",
    "advantage",
    "versus",
    "vs ",
    "unlike",
    "compared",
    "better",
    "only",
    "exclusive",
  ]);
  const briefQualityItems = [
    { label: "Audience context", passed: hasAudienceContext },
    { label: "Problem statement", passed: hasProblemContext },
    { label: "Value or outcome", passed: hasValueContext },
    { label: "Differentiator", passed: hasDifferentiatorContext },
  ];
  const briefQualityScore = briefQualityItems.filter((item) => item.passed).length;

  const runMockGeneration = (mode: "targeting" | "sentiment", onComplete: () => void) => {
    setTransitionLoading(mode);
    window.setTimeout(() => {
      onComplete();
      setTransitionLoading(null);
    }, 1500);
  };

  const generateTargetingDefaults = () => {
    const category = form.category.toLowerCase();
    const tone = form.brandTone.toLowerCase();

    const defaults = {
      ageMin: "24",
      ageMax: "44",
      genders: ["All"],
      includeRegions: "United States, Canada, United Kingdom",
      excludeRegions: "Russia, China",
      languages: "English",
      interests: "Sneakers, Running, Fitness wearables, Urban lifestyle",
      intentSignals: "running shoes, commuter gear, sportswear reviews",
      industries: "Retail, Consumer Goods, Lifestyle",
      companySize: "Mid-market (200-1000)",
      jobSeniority: "Manager, Director, VP",
      jobFunctions: "Marketing, Growth, Product",
      devices: ["Mobile", "Desktop"],
      platforms: ["iOS", "Android", "Web"],
      placements: ["Homepage", "Product pages", "Blog"],
      contentTopics: "Lifestyle, Fitness, Apparel",
      brandSafetyLevel: "Standard",
      excludedBrands: "Competitor X, Competitor Y",
      excludedKeywords: "free, cheap, discount",
      frequencyCap: "3 per day",
      objective: "Awareness",
    };

    if (category.includes("fitness")) {
      defaults.ageMin = "20";
      defaults.ageMax = "45";
      defaults.interests = "Fitness, Wellness, Running, Health apps";
      defaults.intentSignals = "training plans, wellness subscriptions, hydration";
      defaults.contentTopics = "Fitness, Wellness, Outdoor";
      defaults.placements = ["Homepage", "Product pages", "Email"];
    }

    if (category.includes("electronics") || category.includes("tech")) {
      defaults.ageMin = "18";
      defaults.ageMax = "40";
      defaults.interests = "Audio gear, Tech reviews, Gaming, Smart devices";
      defaults.intentSignals = "noise-canceling, premium audio, smart devices";
      defaults.contentTopics = "Technology, Audio, Gaming";
      defaults.placements = ["Homepage", "Product pages", "Blog"];
    }

    if (category.includes("home")) {
      defaults.ageMin = "25";
      defaults.ageMax = "54";
      defaults.interests = "Home decor, Interior design, DIY, Lifestyle";
      defaults.intentSignals = "home refresh, interior inspiration, premium decor";
      defaults.contentTopics = "Home decor, Lifestyle";
      defaults.placements = ["Homepage", "Blog", "Email"];
    }

    if (tone.includes("luxury")) {
      defaults.interests += ", Luxury goods, Premium lifestyle";
      defaults.excludedKeywords = "discount, cheap, clearance";
      defaults.objective = "Consideration";
      defaults.brandSafetyLevel = "Limited";
    }

    if (tone.includes("bold")) {
      defaults.frequencyCap = "4 per day";
      defaults.objective = "Awareness";
    }

    return defaults;
  };

  return (
    <AppShell
      title="Create Product"
      subtitle="Add a new product, review targeting, then run sentiment checks"
      active="Products"
      actions={
        <Link className="btn" href="/products">
          Back to Products
        </Link>
      }
    >
      {transitionLoading ? (
        <div className="loader-only">
          <div className="loading-line">
            <span />
          </div>
        </div>
      ) : step === "details" ? (
        <section className="section">
          <div className="section-header">
            <div>
              <h2>Product Details</h2>
              <span>Complete required fields then continue.</span>
            </div>
          </div>
          <div className="grid-two">
            <div className="form-group">
              <label>Product Name</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="CloudWalk Sneakers"
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                className="select"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="" disabled>
                  Select category
                </option>
                {productCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Price Range</label>
              <div className="row">
                <select
                  className="select"
                  value={form.priceCurrency}
                  onChange={(e) => setForm({ ...form, priceCurrency: e.target.value })}
                  style={{ maxWidth: 120 }}
                >
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
                <input
                  className="input"
                  type="number"
                  min="0"
                  step="1"
                  value={form.priceMin}
                  onChange={(e) => setForm({ ...form, priceMin: e.target.value })}
                  placeholder="Min"
                />
                <input
                  className="input"
                  type="number"
                  min="0"
                  step="1"
                  value={form.priceMax}
                  onChange={(e) => setForm({ ...form, priceMax: e.target.value })}
                  placeholder="Max"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Launch Date</label>
              <input
                className="input"
                type="date"
                value={form.launchDate}
                onChange={(e) => setForm({ ...form, launchDate: e.target.value })}
              />
            </div>
          </div>
          <div className="section" style={{ marginTop: 20 }}>
            <div className="section-header">
              <div className="row" style={{ width: "100%" }}>
                <strong>Targeting Strategy Inputs</strong>
              </div>
            </div>
            <div className="form-group">
              <label>Creative Tone</label>
              <div className="tone-grid">
                {["Professional", "Playful", "Luxury", "Bold"].map((tone) => (
                  <button
                    type="button"
                    key={tone}
                    className={`tone-pill ${form.brandTone === tone ? "active" : ""}`}
                    onClick={() => setForm({ ...form, brandTone: tone })}
                  >
                    {tone}
                  </button>
                ))}
              </div>
              <div className="strategy-helper">
                Sets creative direction for generated segments, messaging, and campaign setup.
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 16 }}>
              <label>Positioning Brief</label>
              <textarea
                className="textarea framed"
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Who is this for, what problem does it solve, why this product is better, and expected business outcome."
              />
              <div className="char-count">{descriptionWords} words</div>
            </div>
            <div className="quality-panel">
              <div className="quality-head">
                <span className="subtle">Brief quality</span>
                <strong>{briefQualityScore}/4</strong>
              </div>
              <div className="quality-progress">
                <span style={{ width: `${(briefQualityScore / 4) * 100}%` }} />
              </div>
              <div className="quality-chip-row">
                {briefQualityItems.map((item) => (
                  <span key={item.label} className={`quality-chip ${item.passed ? "done" : ""}`}>
                    {item.passed ? "✓" : "○"} {item.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="subtle" style={{ marginTop: 10 }}>
              Add one sentence for each missing signal to improve targeting relevance.
            </div>
          </div>
          <div className="reco-actions" style={{ marginTop: 16 }}>
            <div className="subtle">Required: name, category, price range, and launch date.</div>
            <button
              className="btn dark"
              onClick={() => {
                if (!form.name || !form.category || !form.priceMin || !form.priceMax || !form.launchDate) return;
                runMockGeneration("targeting", () => {
                  setTargetingInputs(generateTargetingDefaults());
                  setStep("targeting");
                });
              }}
            >
              Next → Targeting
            </button>
          </div>
        </section>
      ) : (
        <section className="section">
          <div className="section-header">
            <div>
              <h2>Targeting</h2>
              <span>Auto-generated defaults. Refine the inputs below.</span>
            </div>
          </div>

          <div className="section" style={{ marginTop: 16 }}>
            <div className="section-header">
              <div>
                <span>Update demographics, context, and safety controls.</span>
              </div>
            </div>
            <div className="grid-two">
              <div className="form-group">
                <label>Age Range</label>
                <div className="row">
                  <select
                    className="select"
                    value={targetingInputs.ageMin}
                    onChange={(e) =>
                      setTargetingInputs({ ...targetingInputs, ageMin: e.target.value })
                    }
                  >
                    {["18", "21", "25", "30", "35", "40", "45", "50", "55", "60", "65"].map(
                      (age) => (
                        <option key={age}>{age}</option>
                      )
                    )}
                  </select>
                  <span className="subtle">to</span>
                  <select
                    className="select"
                    value={targetingInputs.ageMax}
                    onChange={(e) =>
                      setTargetingInputs({ ...targetingInputs, ageMax: e.target.value })
                    }
                  >
                    {["24", "30", "35", "40", "45", "50", "55", "60", "65", "70", "75", "80"].map(
                      (age) => (
                        <option key={age}>{age}</option>
                      )
                    )}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Gender</label>
                <div className="toggle-group">
                  {["All", "Women", "Men", "Non-binary"].map((gender) => (
                    <button
                      type="button"
                      key={gender}
                      className={`toggle-pill ${
                        targetingInputs.genders.includes(gender) ? "active" : ""
                      }`}
                      onClick={() =>
                        setTargetingInputs((prev) => ({
                          ...prev,
                          genders: prev.genders.includes(gender)
                            ? prev.genders.filter((g) => g !== gender)
                            : [...prev.genders, gender],
                        }))
                      }
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Include Regions</label>
                <input
                  className="input"
                  value={targetingInputs.includeRegions}
                  onChange={(e) =>
                    setTargetingInputs({ ...targetingInputs, includeRegions: e.target.value })
                  }
                  placeholder="United States, Canada, UK"
                />
                <div className="map-preview" style={{ marginTop: 12 }}>
                  <div className="subtle">Included regions</div>
                  <svg viewBox="0 0 240 120" width="100%" height="120">
                    <g fill="#e3e3e6">
                      <path d="M28 56c-10-18 6-38 30-36 18 2 32 16 28 32-5 18-40 22-58 4z" />
                      <path d="M90 30c-4-10 6-20 18-20 14 0 22 10 20 22-3 12-28 14-38-2z" />
                      <path d="M150 22c-8-12 4-26 26-26 22 0 36 16 32 32-5 20-52 24-58-6z" />
                      <path d="M174 70c-6-10 6-20 20-20 16 0 26 12 24 24-3 12-30 16-44-4z" />
                      <path d="M112 84c-6-10 6-20 20-20 16 0 26 12 24 24-3 12-30 16-44-4z" />
                    </g>
                    <g fill="#111111">
                      <circle cx="58" cy="54" r="3" />
                      <circle cx="118" cy="40" r="3" />
                      <circle cx="186" cy="36" r="3" />
                      <circle cx="176" cy="80" r="3" />
                    </g>
                  </svg>
                </div>
              </div>
              <div className="form-group">
                <label>Exclude Regions</label>
                <input
                  className="input"
                  value={targetingInputs.excludeRegions}
                  onChange={(e) =>
                    setTargetingInputs({ ...targetingInputs, excludeRegions: e.target.value })
                  }
                  placeholder="Russia, China"
                />
                <div className="map-preview muted" style={{ marginTop: 12 }}>
                  <div className="subtle">Excluded regions</div>
                  <svg viewBox="0 0 240 120" width="100%" height="120">
                    <g fill="#ededf0">
                      <path d="M28 56c-10-18 6-38 30-36 18 2 32 16 28 32-5 18-40 22-58 4z" />
                      <path d="M90 30c-4-10 6-20 18-20 14 0 22 10 20 22-3 12-28 14-38-2z" />
                      <path d="M150 22c-8-12 4-26 26-26 22 0 36 16 32 32-5 20-52 24-58-6z" />
                      <path d="M174 70c-6-10 6-20 20-20 16 0 26 12 24 24-3 12-30 16-44-4z" />
                      <path d="M112 84c-6-10 6-20 20-20 16 0 26 12 24 24-3 12-30 16-44-4z" />
                    </g>
                    <g fill="#bdbdc3">
                      <circle cx="140" cy="48" r="3" />
                      <circle cx="196" cy="58" r="3" />
                      <circle cx="88" cy="76" r="3" />
                    </g>
                  </svg>
                </div>
              </div>
              <div className="form-group">
                <label>Primary Language</label>
                <input
                  className="input"
                  value={targetingInputs.languages}
                  onChange={(e) =>
                    setTargetingInputs({ ...targetingInputs, languages: e.target.value })
                  }
                  placeholder="English"
                />
              </div>
              <div className="form-group">
                <label>Interests / Behaviors</label>
                <input
                  className="input"
                  value={targetingInputs.interests}
                  onChange={(e) =>
                    setTargetingInputs({ ...targetingInputs, interests: e.target.value })
                  }
                  placeholder="Sneakers, Running, Fitness"
                />
              </div>
              <div className="form-group">
                <label>Intent Signals</label>
                <input
                  className="input"
                  value={targetingInputs.intentSignals}
                  onChange={(e) =>
                    setTargetingInputs({ ...targetingInputs, intentSignals: e.target.value })
                  }
                  placeholder="searches, comparisons, category intent"
                />
              </div>
              <div className="form-group">
                <label>Industries</label>
                <input
                  className="input"
                  value={targetingInputs.industries}
                  onChange={(e) =>
                    setTargetingInputs({ ...targetingInputs, industries: e.target.value })
                  }
                  placeholder="SaaS, Retail, Technology"
                />
              </div>
              <div className="form-group">
                <label>Company Size</label>
                <input
                  className="input"
                  value={targetingInputs.companySize}
                  onChange={(e) =>
                    setTargetingInputs({ ...targetingInputs, companySize: e.target.value })
                  }
                  placeholder="Mid-market (200-1000)"
                />
              </div>
              <div className="form-group">
                <label>Job Seniority</label>
                <input
                  className="input"
                  value={targetingInputs.jobSeniority}
                  onChange={(e) =>
                    setTargetingInputs({ ...targetingInputs, jobSeniority: e.target.value })
                  }
                  placeholder="Manager, Director, VP"
                />
              </div>
              <div className="form-group">
                <label>Job Functions</label>
                <input
                  className="input"
                  value={targetingInputs.jobFunctions}
                  onChange={(e) =>
                    setTargetingInputs({ ...targetingInputs, jobFunctions: e.target.value })
                  }
                  placeholder="Marketing, Growth, Product"
                />
              </div>
              <div className="form-group">
                <label>Frequency Cap</label>
                <input
                  className="input"
                  value={targetingInputs.frequencyCap}
                  onChange={(e) =>
                    setTargetingInputs({ ...targetingInputs, frequencyCap: e.target.value })
                  }
                  placeholder="3 per day"
                />
              </div>
            </div>
            <div className="grid-two" style={{ marginTop: 16 }}>
              <div className="form-group">
                <label>Devices</label>
                <div className="toggle-group">
                  {["Mobile", "Desktop", "Tablet"].map((device) => (
                    <button
                      type="button"
                      key={device}
                      className={`toggle-pill ${
                        targetingInputs.devices.includes(device) ? "active" : ""
                      }`}
                      onClick={() =>
                        setTargetingInputs((prev) => ({
                          ...prev,
                          devices: prev.devices.includes(device)
                            ? prev.devices.filter((d) => d !== device)
                            : [...prev.devices, device],
                        }))
                      }
                    >
                      {device}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Platforms</label>
                <div className="toggle-group">
                  {["iOS", "Android", "Web"].map((platform) => (
                    <button
                      type="button"
                      key={platform}
                      className={`toggle-pill ${
                        targetingInputs.platforms.includes(platform) ? "active" : ""
                      }`}
                      onClick={() =>
                        setTargetingInputs((prev) => ({
                          ...prev,
                          platforms: prev.platforms.includes(platform)
                            ? prev.platforms.filter((p) => p !== platform)
                            : [...prev.platforms, platform],
                        }))
                      }
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Placements</label>
                <div className="toggle-group">
                  {["Homepage", "Product pages", "Blog", "Email"].map((placement) => (
                    <button
                      type="button"
                      key={placement}
                      className={`toggle-pill ${
                        targetingInputs.placements.includes(placement) ? "active" : ""
                      }`}
                      onClick={() =>
                        setTargetingInputs((prev) => ({
                          ...prev,
                          placements: prev.placements.includes(placement)
                            ? prev.placements.filter((p) => p !== placement)
                            : [...prev.placements, placement],
                        }))
                      }
                    >
                      {placement}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Objective</label>
                <input
                  className="input"
                  value={targetingInputs.objective}
                  onChange={(e) =>
                    setTargetingInputs({ ...targetingInputs, objective: e.target.value })
                  }
                  placeholder="Awareness"
                />
              </div>
              <div className="form-group">
                <label>Content Topics</label>
                <input
                  className="input"
                  value={targetingInputs.contentTopics}
                  onChange={(e) =>
                    setTargetingInputs({ ...targetingInputs, contentTopics: e.target.value })
                  }
                  placeholder="Lifestyle, Business, Technology"
                />
              </div>
              <div className="form-group">
                <label>Brand Safety</label>
                <input
                  className="input"
                  value={targetingInputs.brandSafetyLevel}
                  onChange={(e) =>
                    setTargetingInputs({ ...targetingInputs, brandSafetyLevel: e.target.value })
                  }
                  placeholder="Standard"
                />
              </div>
              <div className="form-group">
                <label>Exclude Brands</label>
                <input
                  className="input"
                  value={targetingInputs.excludedBrands}
                  onChange={(e) =>
                    setTargetingInputs({ ...targetingInputs, excludedBrands: e.target.value })
                  }
                  placeholder="Competitor X, Competitor Y"
                />
              </div>
              <div className="form-group">
                <label>Exclude Keywords</label>
                <input
                  className="input"
                  value={targetingInputs.excludedKeywords}
                  onChange={(e) =>
                    setTargetingInputs({ ...targetingInputs, excludedKeywords: e.target.value })
                  }
                  placeholder="free, cheap, discount"
                />
              </div>
            </div>
          </div>

          <div className="reco-actions" style={{ marginTop: 16 }}>
            <div className="subtle">Next we will run a sentiment analysis for each segment.</div>
            <button
              className="btn dark"
              onClick={() => {
                runMockGeneration("sentiment", () => {
                  setDraftProduct({
                    name: form.name,
                    category: form.category,
                    launchDate: form.launchDate,
                    priceRange: `${form.priceCurrency} ${form.priceMin} - ${form.priceMax}`,
                    brandTone: form.brandTone,
                    description: form.description,
                  });
                  setDraftTargeting(targetingInputs);
                  router.push("/products/new/sentiment");
                });
              }}
            >
              Next → Sentiment Analysis
            </button>
          </div>
        </section>
      )}
    </AppShell>
  );
}
