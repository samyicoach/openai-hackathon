"use client";

import AppShell from "@/components/AppShell";
import ApprovalDrawer from "@/components/ApprovalDrawer";
import { useStore } from "@/lib/store";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const productStatusClass = (status: string) => {
  switch (status) {
    case "Approved":
      return "approved";
    case "Ready for View":
      return "ready";
    case "Archived":
      return "review";
    default:
      return "draft";
  }
};

export default function ProductDetailPage() {
  const { products, approveProduct } = useStore();
  const params = useParams<{ id: string | string[] }>();
  const productId = Array.isArray(params.id) ? params.id[0] : params.id;
  const product = useMemo(
    () => products.find((item) => item.id === productId),
    [products, productId]
  );
  const needsApproval = Boolean(product && product.status === "Ready for View");

  return (
    <AppShell
      title={product ? product.name : "Product Detail"}
      subtitle="Product profile and targeting configuration"
      active="Products"
      actions={
        needsApproval && product ? (
          <ApprovalDrawer
            entityType="Product"
            entityName={product.name}
            currentStatus={product.status}
            triggerLabel="Approve Product"
            onApprove={() => approveProduct(product.id)}
            checklist={[
              "Product metadata complete",
              "Targeting configuration reviewed",
              "Brand safety checks passed",
              "Sentiment confidence acceptable",
            ]}
          />
        ) : null
      }
    >
      {product ? (
        <section className="section">
          <div className="status-strip">
            <div className="status-card">
              <span className="subtle">Status</span>
              <span className={`badge ${productStatusClass(product.status)}`}>{product.status}</span>
            </div>
            <div className="status-card">
              <span className="subtle">Last Updated</span>
              <strong>{product.updatedAt}</strong>
            </div>
            <div className="status-card">
              <span className="subtle">SKU</span>
              <strong>{product.sku}</strong>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="section-header">
          <h2>Product Info</h2>
          <span>Metadata and positioning details.</span>
        </div>
        {product ? (
          <div className="audit">
            <div>
              <strong>Category:</strong> {product.category}
            </div>
            <div>
              <strong>Status:</strong> {product.status}
            </div>
            <div>
              <strong>Launch Date:</strong> {product.launchDate}
            </div>
            <div>
              <strong>Price Range:</strong> {product.priceRange}
            </div>
            <div>
              <strong>Brand Tone:</strong> {product.brandTone ?? "—"}
            </div>
            <div>
              <strong>Description:</strong> {product.description ?? "—"}
            </div>
          </div>
        ) : (
          <div className="callout">Product not found.</div>
        )}
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Targeting</h2>
          <span>Selected targeting defaults for this product.</span>
        </div>
        {product?.targeting ? (
          <div className="grid-two">
            <div className="form-group">
              <label>Age Range</label>
              <div className="row">
                <span>{product.targeting.ageMin}</span>
                <span className="subtle">to</span>
                <span>{product.targeting.ageMax}</span>
              </div>
            </div>
            <div className="form-group">
              <label>Gender</label>
              <div className="toggle-group">
                {product.targeting.genders.map((gender) => (
                  <span key={gender} className="toggle-pill active">
                    {gender}
                  </span>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Include Regions</label>
              <div className="subtle">{product.targeting.includeRegions}</div>
              <div className="map-preview" style={{ marginTop: 12 }}>
                <svg viewBox="0 0 240 120" width="100%" height="120">
                  <g fill="#e3e3e6">
                    <path d="M28 56c-10-18 6-38 30-36 18 2 32 16 28 32-5 18-40 22-58 4z" />
                    <path d="M90 30c-4-10 6-20 18-20 14 0 22 10 20 22-3 12-28 14-38-2z" />
                    <path d="M150 22c-8-12 4-26 26-26 22 0 36 16 32 32-5 20-52 24-58-6z" />
                    <path d="M174 70c-6-10 6-20 20-20 16 0 26 12 24 24-3 12-30 16-44-4z" />
                    <path d="M112 84c-6-10 6-20 20-20 16 0 26 12 24 24-3 12-30 16-44-4z" />
                  </g>
                </svg>
              </div>
            </div>
            <div className="form-group">
              <label>Exclude Regions</label>
              <div className="subtle">{product.targeting.excludeRegions}</div>
              <div className="map-preview muted" style={{ marginTop: 12 }}>
                <svg viewBox="0 0 240 120" width="100%" height="120">
                  <g fill="#ededf0">
                    <path d="M28 56c-10-18 6-38 30-36 18 2 32 16 28 32-5 18-40 22-58 4z" />
                    <path d="M90 30c-4-10 6-20 18-20 14 0 22 10 20 22-3 12-28 14-38-2z" />
                    <path d="M150 22c-8-12 4-26 26-26 22 0 36 16 32 32-5 20-52 24-58-6z" />
                    <path d="M174 70c-6-10 6-20 20-20 16 0 26 12 24 24-3 12-30 16-44-4z" />
                    <path d="M112 84c-6-10 6-20 20-20 16 0 26 12 24 24-3 12-30 16-44-4z" />
                  </g>
                </svg>
              </div>
            </div>
            <div className="form-group">
              <label>Primary Language</label>
              <div className="subtle">{product.targeting.languages}</div>
            </div>
            <div className="form-group">
              <label>Interests</label>
              <div className="subtle">{product.targeting.interests}</div>
            </div>
            <div className="form-group">
              <label>Intent Signals</label>
              <div className="subtle">{product.targeting.intentSignals}</div>
            </div>
            <div className="form-group">
              <label>Industries</label>
              <div className="subtle">{product.targeting.industries}</div>
            </div>
            <div className="form-group">
              <label>Company Size</label>
              <div className="subtle">{product.targeting.companySize}</div>
            </div>
            <div className="form-group">
              <label>Job Seniority</label>
              <div className="subtle">{product.targeting.jobSeniority}</div>
            </div>
            <div className="form-group">
              <label>Job Functions</label>
              <div className="subtle">{product.targeting.jobFunctions}</div>
            </div>
            <div className="form-group">
              <label>Objective</label>
              <div className="subtle">{product.targeting.objective}</div>
            </div>
            <div className="form-group">
              <label>Content Topics</label>
              <div className="subtle">{product.targeting.contentTopics}</div>
            </div>
            <div className="form-group">
              <label>Brand Safety</label>
              <div className="subtle">{product.targeting.brandSafetyLevel}</div>
            </div>
            <div className="form-group">
              <label>Devices</label>
              <div className="toggle-group">
                {product.targeting.devices.map((device) => (
                  <span key={device} className="toggle-pill active">
                    {device}
                  </span>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Platforms</label>
              <div className="toggle-group">
                {product.targeting.platforms.map((platform) => (
                  <span key={platform} className="toggle-pill active">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Placements</label>
              <div className="toggle-group">
                {product.targeting.placements.map((placement) => (
                  <span key={placement} className="toggle-pill active">
                    {placement}
                  </span>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Excluded Brands</label>
              <div className="subtle">{product.targeting.excludedBrands}</div>
            </div>
            <div className="form-group">
              <label>Excluded Keywords</label>
              <div className="subtle">{product.targeting.excludedKeywords}</div>
            </div>
            <div className="form-group">
              <label>Frequency Cap</label>
              <div className="subtle">{product.targeting.frequencyCap}</div>
            </div>
          </div>
        ) : (
          <div className="callout">No targeting has been generated for this product.</div>
        )}
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Sentiment</h2>
          <span>AI analysis of perception and confidence signals.</span>
        </div>
        {product?.sentiment ? (
          <div className="panel" style={{ display: "grid", gap: 16 }}>
            <div className="sentiment-grid">
              <div className="sentiment-summary">
                <span>Net Sentiment</span>
                <strong>{product.sentiment.netSentiment}%</strong>
                <div className="subtle">Momentum {product.sentiment.momentum}</div>
              </div>
              <div className="sentiment-summary">
                <span>Confidence</span>
                <strong>{product.sentiment.confidence}%</strong>
                <div className="subtle">Signal quality</div>
              </div>
              <div className="sentiment-summary">
                <span>Volume</span>
                <strong>{product.sentiment.volume}</strong>
                <div className="subtle">Last 30 days</div>
              </div>
            </div>
            <div className="sentiment-stack">
              <div className="stack-bar">
                <span
                  className="stack positive"
                  style={{ width: `${product.sentiment.distribution.positive}%` }}
                />
                <span
                  className="stack neutral"
                  style={{ width: `${product.sentiment.distribution.neutral}%` }}
                />
                <span
                  className="stack negative"
                  style={{ width: `${product.sentiment.distribution.negative}%` }}
                />
              </div>
              <div className="stack-labels">
                <span>Positive {product.sentiment.distribution.positive}%</span>
                <span>Neutral {product.sentiment.distribution.neutral}%</span>
                <span>Negative {product.sentiment.distribution.negative}%</span>
              </div>
            </div>
            <div className="insight-grid">
              <div>
                <div className="subtle">Drivers</div>
                <ul className="compact-list">
                  {product.sentiment.drivers.map((driver) => (
                    <li key={driver}>{driver}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="subtle">Risks</div>
                <ul className="compact-list">
                  {product.sentiment.risks.map((risk) => (
                    <li key={risk}>{risk}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="subtle">Insights</div>
                <ul className="compact-list">
                  {product.sentiment.insights.map((insight) => (
                    <li key={insight}>{insight}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="callout">Sentiment data is not available for this product.</div>
        )}
      </section>

    </AppShell>
  );
}
