"use client";

import AppShell from "@/components/AppShell";
import ApprovalDrawer from "@/components/ApprovalDrawer";
import {
  ageMix,
  campaignBudget,
  campaignKpis,
  campaignSeries,
  campaigns,
  deviceMix,
  geoMix,
  placementMix,
} from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { CampaignRecord } from "@/lib/types";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const campaignStateClass = (state: string) => {
  switch (state) {
    case "Active":
      return "active";
    case "Review":
      return "review";
    default:
      return "review";
  }
};

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

export default function CampaignDetailPage() {
  const { campaigns: userCampaigns, products, setCampaignState } = useStore();
  const params = useParams<{ id: string | string[] }>();
  const campaignId = Array.isArray(params.id) ? params.id[0] : params.id;

  const combined = useMemo<CampaignRecord[]>(
    () => {
      const byId = new Map<string, CampaignRecord>();
      campaigns.forEach((seedCampaign) => {
        byId.set(seedCampaign.id, seedCampaign);
      });
      userCampaigns.forEach((userCampaign) => {
        const seedCampaign = byId.get(userCampaign.id);
        byId.set(userCampaign.id, {
          ...(seedCampaign ?? userCampaign),
          ...userCampaign,
          segments: userCampaign.segments ?? seedCampaign?.segments ?? [],
        });
      });
      return Array.from(byId.values());
    },
    [userCampaigns]
  );
  const campaign = combined.find((item) => item.id === campaignId);
  const product = products.find((item) => {
    if (!campaign) return false;
    if (campaign.productId && item.id === campaign.productId) return true;
    if (campaign.code && item.sku === campaign.code) return true;
    return item.name.toLowerCase() === campaign.name.toLowerCase();
  });
  const targeting = product?.targeting;
  const textValue = (value?: string) => (value && value.trim() ? value : "—");
  const listValue = (value?: string[]) =>
    value && value.length > 0 ? value.join(", ") : "—";
  const needsApproval = Boolean(campaign && campaign.state === "Review");
  const maxImpressions = Math.max(...campaignSeries.map((d) => d.impressions));
  const linePoints = campaignSeries
    .map((d, i) => {
      const x = 16 + (i / (campaignSeries.length - 1)) * 360;
      const y = 120 - (d.impressions / maxImpressions) * 90;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <AppShell
      title={campaign ? campaign.name : "Campaign Detail"}
      subtitle="Reach and impression goals"
      active="Campaigns"
      actions={
        needsApproval && campaign ? (
          <ApprovalDrawer
            entityType="Campaign"
            entityName={campaign.name}
            currentStatus={campaign.state}
            triggerLabel="Approve Campaign"
            onApprove={() => setCampaignState(campaign, "Active")}
            checklist={[
              "Budget and schedule validated",
              "Placements and targeting reviewed",
              "Compliance and brand safety checks passed",
              "Launch readiness confirmed",
            ]}
          />
        ) : null
      }
    >
      {campaign ? (
        <section className="section">
          <div className="status-strip">
            <div className="status-card">
              <span className="subtle">Campaign State</span>
              <span className={`badge ${campaignStateClass(campaign.state)}`}>{campaign.state}</span>
            </div>
            <div className="status-card">
              <span className="subtle">Source Product Status</span>
              <span className={`badge ${productStatusClass(product?.status ?? "Ready for View")}`}>
                {product?.status ?? "Ready for View"}
              </span>
            </div>
            <div className="status-card">
              <span className="subtle">Last Sync</span>
              <strong>{campaign.lastSync}</strong>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="section-header">
          <div>
            <h2>Performance</h2>
            <span>Reach, impressions, and efficiency metrics.</span>
          </div>
        </div>

        <div className="kpi-grid">
          <div className="kpi-card">
            <span>Impressions</span>
            <strong>{campaignKpis.impressions}</strong>
          </div>
          <div className="kpi-card">
            <span>Reach</span>
            <strong>{campaignKpis.reach}</strong>
          </div>
          <div className="kpi-card">
            <span>CTR</span>
            <strong>{campaignKpis.ctr}</strong>
          </div>
          <div className="kpi-card">
            <span>CPM</span>
            <strong>{campaignKpis.cpm}</strong>
          </div>
          <div className="kpi-card">
            <span>CVR</span>
            <strong>{campaignKpis.cvr}</strong>
          </div>
          <div className="kpi-card">
            <span>ROAS</span>
            <strong>{campaignKpis.roas}</strong>
          </div>
        </div>

        <div className="analytics-grid">
          <div className="chart-card">
            <div className="chart-title">Impressions Trend</div>
            <svg viewBox="0 0 400 140" width="100%" height="140">
              <polyline
                fill="none"
                stroke="#111"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={linePoints}
              />
            </svg>
          </div>
          <div className="chart-card">
            <div className="chart-title">Budget Pacing</div>
            <div className="pacing">
              <div className="row">
                <span className="subtle">Spend</span>
                <strong>{campaignKpis.spend}</strong>
              </div>
              <div className="progress-bar">
                <span style={{ width: `${Math.round((campaignBudget.spent / campaignBudget.total) * 100)}%` }} />
              </div>
              <div className="subtle">
                {Math.round((campaignBudget.spent / campaignBudget.total) * 100)}% of budget
                delivered · Daily cap ${campaignBudget.dailyCap}
              </div>
            </div>
          </div>
          <div className="chart-card">
            <div className="chart-title">Device Mix</div>
            <div className="donut">
              <svg viewBox="0 0 120 120" width="120" height="120">
                <circle cx="60" cy="60" r="50" stroke="#ededed" strokeWidth="12" fill="none" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#111"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray="314"
                  strokeDashoffset={`${314 - (314 * deviceMix[0].share) / 100}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="donut-label">
                <strong>{deviceMix[0].share}%</strong>
                <span>{deviceMix[0].label}</span>
              </div>
            </div>
            <div className="bar-list">
              {deviceMix.map((device) => (
                <div key={device.label} className="bar-row">
                  <span>{device.label}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${device.share}%` }} />
                  </div>
                  <span>{device.share}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="chart-card">
            <div className="chart-title">Placement Mix</div>
            <div className="bar-list">
              {placementMix.map((placement) => (
                <div key={placement.label} className="bar-row">
                  <span>{placement.label}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${placement.share}%` }} />
                  </div>
                  <span>{placement.share}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="chart-card">
            <div className="chart-title">Top Regions</div>
            <div className="zones-card" style={{ height: 120 }}>
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
            <div className="bar-list" style={{ marginTop: 10 }}>
              {geoMix.map((geo) => (
                <div key={geo.label} className="bar-row">
                  <span>{geo.label}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${geo.share}%` }} />
                  </div>
                  <span>{geo.share}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="chart-card">
            <div className="chart-title">Age Distribution</div>
            <div className="bar-list">
              {ageMix.map((age) => (
                <div key={age.label} className="bar-row">
                  <span>{age.label}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${age.share}%` }} />
                  </div>
                  <span>{age.share}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Product Snapshot</h2>
          <span>Source product and positioning data.</span>
        </div>
        {product ? (
          <div className="grid-two">
            <div className="form-group">
              <label>Product</label>
              <div className="subtle">{textValue(product.name)}</div>
            </div>
            <div className="form-group">
              <label>Category</label>
              <div className="subtle">{textValue(product.category)}</div>
            </div>
            <div className="form-group">
              <label>Status</label>
              <div className="subtle">{product.status}</div>
            </div>
            <div className="form-group">
              <label>Launch Date</label>
              <div className="subtle">{textValue(product.launchDate)}</div>
            </div>
            <div className="form-group">
              <label>Price Range</label>
              <div className="subtle">{textValue(product.priceRange)}</div>
            </div>
            <div className="form-group">
              <label>Brand Tone</label>
              <div className="subtle">{textValue(product.brandTone)}</div>
            </div>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label>Description</label>
              <div className="subtle">{textValue(product.description)}</div>
            </div>
          </div>
        ) : (
          <div className="callout">Product metadata not available.</div>
        )}
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Campaign Settings</h2>
          <span>Objective, budget, and schedule.</span>
        </div>
        {campaign ? (
          <div className="grid-two">
            <div className="form-group">
              <label>Objective</label>
              <div className="subtle">{textValue(campaign.objective)}</div>
            </div>
            <div className="form-group">
              <label>Budget Type</label>
              <div className="subtle">{textValue(campaign.budgetType)}</div>
            </div>
            <div className="form-group">
              <label>Budget Amount</label>
              <div className="subtle">{textValue(campaign.budgetAmount)}</div>
            </div>
            <div className="form-group">
              <label>Bid Strategy</label>
              <div className="subtle">{textValue(campaign.bidStrategy)}</div>
            </div>
            <div className="form-group">
              <label>Pacing</label>
              <div className="subtle">{textValue(campaign.pacing)}</div>
            </div>
            <div className="form-group">
              <label>Frequency Cap</label>
              <div className="subtle">{textValue(campaign.frequencyCap)}</div>
            </div>
            <div className="form-group">
              <label>Start Date</label>
              <div className="subtle">{textValue(campaign.startDate)}</div>
            </div>
            <div className="form-group">
              <label>End Date</label>
              <div className="subtle">{textValue(campaign.endDate)}</div>
            </div>
          </div>
        ) : (
          <div className="callout">Campaign settings not available.</div>
        )}
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Targeting Snapshot</h2>
          <span>Targeting fields applied to this campaign.</span>
        </div>
        {targeting ? (
          <div className="grid-two">
            <div className="form-group">
              <label>Age Range</label>
              <div className="subtle">
                {textValue(targeting.ageMin)}–{textValue(targeting.ageMax)}
              </div>
            </div>
            <div className="form-group">
              <label>Gender</label>
              <div className="subtle">{listValue(targeting.genders)}</div>
            </div>
            <div className="form-group">
              <label>Include Regions</label>
              <div className="subtle">{textValue(targeting.includeRegions)}</div>
            </div>
            <div className="form-group">
              <label>Exclude Regions</label>
              <div className="subtle">{textValue(targeting.excludeRegions)}</div>
            </div>
            <div className="form-group">
              <label>Languages</label>
              <div className="subtle">{textValue(targeting.languages)}</div>
            </div>
            <div className="form-group">
              <label>Interests</label>
              <div className="subtle">{textValue(targeting.interests)}</div>
            </div>
            <div className="form-group">
              <label>Intent Signals</label>
              <div className="subtle">{textValue(targeting.intentSignals)}</div>
            </div>
            <div className="form-group">
              <label>Objective</label>
              <div className="subtle">{textValue(targeting.objective)}</div>
            </div>
            <div className="form-group">
              <label>Devices</label>
              <div className="subtle">{listValue(targeting.devices)}</div>
            </div>
            <div className="form-group">
              <label>Platforms</label>
              <div className="subtle">{listValue(targeting.platforms)}</div>
            </div>
            <div className="form-group">
              <label>Placements</label>
              <div className="subtle">{listValue(targeting.placements)}</div>
            </div>
            <div className="form-group">
              <label>Brand Safety</label>
              <div className="subtle">{textValue(targeting.brandSafetyLevel)}</div>
            </div>
            <div className="form-group">
              <label>Excluded Brands</label>
              <div className="subtle">{textValue(targeting.excludedBrands)}</div>
            </div>
            <div className="form-group">
              <label>Excluded Keywords</label>
              <div className="subtle">{textValue(targeting.excludedKeywords)}</div>
            </div>
            <div className="form-group">
              <label>Frequency Cap</label>
              <div className="subtle">{textValue(targeting.frequencyCap)}</div>
            </div>
          </div>
        ) : (
          <div className="callout">Targeting data not available.</div>
        )}
      </section>

    </AppShell>
  );
}
