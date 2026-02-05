"use client";

import AppShell from "@/components/AppShell";
import { aiRecommendationCards } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { ProductSentiment } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const buildTrendPoints = (values: number[]) => {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = 40 - ((value - min) / range) * 34;
      return `${x},${y}`;
    })
    .join(" ");
};

const buildSentimentSummary = (tone?: string, category?: string): ProductSentiment => {
  const base: ProductSentiment = {
    netSentiment: 64,
    confidence: 90,
    volume: "128k mentions / 30d",
    momentum: "+9%",
    distribution: { positive: 62, neutral: 26, negative: 12 },
    drivers: [
      "Strong affinity in urban professional cohorts",
      "Positive product performance reviews",
      "High intent signals in premium placements",
    ],
    risks: ["Price sensitivity in entry-level segments"],
    insights: [
      "Confidence highest in North America + UK",
      "Sentiment lifts during weekday commute windows",
    ],
    trend: [50, 54, 58, 60, 62, 64, 66, 68],
    sources: ["Social listening", "Review aggregators", "Partner surveys"],
  };

  const toneValue = (tone ?? "").toLowerCase();
  const categoryValue = (category ?? "").toLowerCase();

  if (toneValue.includes("luxury")) {
    base.netSentiment = 58;
    base.confidence = 86;
    base.momentum = "+6%";
    base.distribution = { positive: 56, neutral: 30, negative: 14 };
    base.drivers = [
      "High-end craftsmanship comments",
      "Creator endorsements",
      "Premium placement affinity",
    ];
    base.risks = ["Price comparisons vs. competitors", "Battery life scrutiny"];
    base.insights = [
      "Strong lift in creator communities",
      "Sentiment strongest with high-income cohorts",
    ];
    base.trend = [46, 48, 52, 55, 57, 58, 59, 60];
  }

  if (toneValue.includes("playful")) {
    base.netSentiment = 70;
    base.confidence = 88;
    base.momentum = "+10%";
    base.distribution = { positive: 68, neutral: 23, negative: 9 };
    base.drivers = ["Community challenges", "Colorway drops", "UGC momentum"];
    base.risks = ["Seasonal dips outside peak months"];
    base.insights = ["High sentiment on mobile placements", "Strong response to wellness content"];
    base.trend = [54, 58, 62, 64, 66, 68, 70, 71];
  }

  if (categoryValue.includes("home")) {
    base.netSentiment = 66;
    base.confidence = 85;
    base.momentum = "+8%";
    base.distribution = { positive: 62, neutral: 27, negative: 11 };
    base.drivers = ["Minimalist design praise", "Seasonal scent interest"];
    base.risks = ["Fulfillment delays in peak season"];
    base.insights = ["Strong resonance with design-forward cohorts"];
    base.trend = [48, 51, 55, 58, 60, 62, 64, 66];
  }

  return base;
};

export default function ProductSentimentPage() {
  const { draftProduct, draftTargeting, createProduct, clearDraft } = useStore();
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(true);
  const [phaseIndex, setPhaseIndex] = useState(0);

  const summary = useMemo(
    () => buildSentimentSummary(draftProduct?.brandTone, draftProduct?.category),
    [draftProduct?.brandTone, draftProduct?.category]
  );

  useEffect(() => {
    if (!draftProduct || !draftTargeting) {
      setIsGenerating(false);
      return;
    }
    setIsGenerating(true);
    setPhaseIndex(0);
    const intervalId = window.setInterval(() => {
      setPhaseIndex((prev) => Math.min(prev + 1, 2));
    }, 500);
    const timeoutId = window.setTimeout(() => {
      window.clearInterval(intervalId);
      setIsGenerating(false);
      setPhaseIndex(2);
    }, 1700);
    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, [draftProduct, draftTargeting]);

  if (!draftProduct || !draftTargeting) {
    return (
      <AppShell
        title="Sentiment Review"
        subtitle="Sentiment analysis requires product + targeting inputs."
        active="Products"
        actions={
          <Link className="btn" href="/products/new">
            Back to Product Setup
          </Link>
        }
      >
        <section className="section">
          <div className="callout">Start a new product to generate sentiment insights.</div>
        </section>
      </AppShell>
    );
  }

  if (isGenerating) {
    const phases = [
      "Aggregating source sentiment signals",
      "Calculating segment confidence and risk",
      "Producing sentiment recommendations",
    ];
    return (
      <AppShell
        title="Sentiment Review"
        subtitle="Generating sentiment insights from product and targeting inputs"
        active="Products"
        actions={null}
      >
        <section className="section">
          <div className="loading-panel">
            <div className="loading-orbit" />
            <h2>Analyzing Sentiment Signals</h2>
            <p>Running mock model inference to simulate backend AI processing.</p>
            <div className="loading-steps">
              {phases.map((phase, index) => (
                <div
                  key={phase}
                  className={`loading-step ${
                    index < phaseIndex ? "done" : index === phaseIndex ? "active" : ""
                  }`}
                >
                  {index < phaseIndex ? "Done" : index === phaseIndex ? "Running" : "Queued"} · {phase}
                </div>
              ))}
            </div>
          </div>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Sentiment Review"
      subtitle="AI analysis of targeting group sentiment and brand lift potential"
      active="Products"
      actions={
        <Link className="btn" href="/products/new?step=targeting">
          Back to Targeting
        </Link>
      }
    >
      <section className="section">
        <div className="section-header">
          <div>
            <h2>Sentiment Overview</h2>
            <span>Signals aggregated from social, reviews, and partner data.</span>
          </div>
        </div>
        <div className="sentiment-grid">
          <div className="sentiment-summary">
            <span>Net Sentiment</span>
            <strong>{summary.netSentiment}%</strong>
            <div className="subtle">Momentum {summary.momentum}</div>
          </div>
          <div className="sentiment-summary">
            <span>Confidence</span>
            <strong>{summary.confidence}%</strong>
            <div className="subtle">High signal volume</div>
          </div>
          <div className="sentiment-summary">
            <span>Volume</span>
            <strong>{summary.volume}</strong>
            <div className="subtle">Last 30 days</div>
          </div>
        </div>

        <div className="sentiment-stack" style={{ marginTop: 20 }}>
          <div className="stack-bar">
            <span className="stack positive" style={{ width: `${summary.distribution.positive}%` }} />
            <span className="stack neutral" style={{ width: `${summary.distribution.neutral}%` }} />
            <span className="stack negative" style={{ width: `${summary.distribution.negative}%` }} />
          </div>
          <div className="stack-labels">
            <span>Positive {summary.distribution.positive}%</span>
            <span>Neutral {summary.distribution.neutral}%</span>
            <span>Negative {summary.distribution.negative}%</span>
          </div>
        </div>

        <div className="insight-grid" style={{ marginTop: 18 }}>
          <div className="panel">
            <div className="subtle" style={{ marginBottom: 10 }}>
              Drivers
            </div>
            <ul className="compact-list">
              {summary.drivers.map((driver) => (
                <li key={driver}>{driver}</li>
              ))}
            </ul>
          </div>
          <div className="panel">
            <div className="subtle" style={{ marginBottom: 10 }}>
              Risks
            </div>
            <ul className="compact-list">
              {summary.risks.map((risk) => (
                <li key={risk}>{risk}</li>
              ))}
            </ul>
          </div>
          <div className="panel">
            <div className="subtle" style={{ marginBottom: 10 }}>
              Insights
            </div>
            <ul className="compact-list">
              {summary.insights.map((insight) => (
                <li key={insight}>{insight}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <h2>Targeting Group Sentiment</h2>
            <span>Confidence and sentiment signals for each recommended segment.</span>
          </div>
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          {aiRecommendationCards.map((segment) => {
            const sentiment = segment.sentiment ?? {
              net: 60,
              confidence: segment.confidence,
              distribution: { positive: 60, neutral: 26, negative: 14 },
              trend: [50, 52, 55, 57, 59, 60, 61, 62],
              drivers: ["High engagement"],
              risks: ["Lower conversions on weekends"],
            };
            const points = buildTrendPoints(sentiment.trend);
            return (
              <div className="sentiment-card" key={segment.id}>
                <div className="sentiment-header">
                  <div>
                    <strong>{segment.title}</strong>
                    <div className="reco-tags" style={{ marginTop: 6 }}>
                      <span className="tag">{segment.cluster}</span>
                      <span className="tag">{segment.reach}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="subtle">Net Sentiment</div>
                    <div className="sentiment-score">{sentiment.net}%</div>
                  </div>
                </div>

                <div className="sentiment-body">
                  <div>
                    <div className="subtle" style={{ marginBottom: 8 }}>
                      Sentiment split
                    </div>
                    <div className="stack-bar">
                      <span
                        className="stack positive"
                        style={{ width: `${sentiment.distribution.positive}%` }}
                      />
                      <span
                        className="stack neutral"
                        style={{ width: `${sentiment.distribution.neutral}%` }}
                      />
                      <span
                        className="stack negative"
                        style={{ width: `${sentiment.distribution.negative}%` }}
                      />
                    </div>
                    <div className="stack-labels">
                      <span>{sentiment.distribution.positive}% Positive</span>
                      <span>{sentiment.distribution.neutral}% Neutral</span>
                      <span>{sentiment.distribution.negative}% Negative</span>
                    </div>
                  </div>
                  <div>
                    <div className="subtle" style={{ marginBottom: 8 }}>
                      Sentiment trend
                    </div>
                    <div className="trend-chart">
                      <svg viewBox="0 0 100 40" width="100%" height="40">
                        <polyline
                          points={points}
                          fill="none"
                          stroke="#111"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div className="subtle">Confidence {sentiment.confidence}%</div>
                  </div>
                </div>

                <div className="sentiment-foot">
                  <div>
                    <div className="subtle">Drivers</div>
                    <div className="chip-row">
                      {sentiment.drivers.map((driver) => (
                        <span key={driver} className="chip">
                          {driver}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="subtle">Risks</div>
                    <div className="chip-row">
                      {sentiment.risks.map((risk) => (
                        <span key={risk} className="chip muted">
                          {risk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <h2>Product + Targeting Snapshot</h2>
            <span>Summary before activation.</span>
          </div>
        </div>
        <div className="audit">
          <div>
            <strong>Product:</strong> {draftProduct.name}
          </div>
          <div>
            <strong>Category:</strong> {draftProduct.category}
          </div>
          <div>
            <strong>Brand Tone:</strong> {draftProduct.brandTone}
          </div>
          <div>
            <strong>Target Regions:</strong> {draftTargeting.includeRegions}
          </div>
          <div>
            <strong>Primary Interests:</strong> {draftTargeting.interests}
          </div>
          <div>
            <strong>Objective:</strong> {draftTargeting.objective}
          </div>
        </div>
      </section>

      <div className="reco-actions" style={{ marginTop: 20 }}>
        <div className="subtle">Sentiment insights will be attached to the product record.</div>
        <button
          className="btn dark"
          onClick={() => {
            createProduct({
              ...draftProduct,
              targeting: draftTargeting,
              sentiment: summary,
            });
            clearDraft();
            router.push("/products");
          }}
        >
          Create Product
        </button>
      </div>
    </AppShell>
  );
}
