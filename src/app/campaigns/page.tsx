"use client";

import AppShell from "@/components/AppShell";
import {
  campaignBenchmarks,
  campaignKpis,
  campaignSeries,
  campaignBudget,
  campaigns,
  deviceMix,
  geoMix,
  ageMix,
  placementMix,
} from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { CampaignRecord } from "@/lib/types";
import Link from "next/link";
import { useMemo, useState } from "react";

const stateClass = (state: string) => {
  switch (state) {
    case "Active":
      return "active";
    case "Review":
      return "review";
    default:
      return "review";
  }
};

export default function CampaignsPage() {
  const { campaigns: userCampaigns } = useStore();
  const [statusSort, setStatusSort] = useState<"workflow" | "reverse">("workflow");

  const maxImpressions = Math.max(...campaignSeries.map((d) => d.impressions));
  const maxSpend = Math.max(...campaignSeries.map((d) => d.spend));
  const linePoints = campaignSeries
    .map((d, i) => {
      const x = 16 + (i / (campaignSeries.length - 1)) * 360;
      const y = 120 - (d.impressions / maxImpressions) * 90;
      return `${x},${y}`;
    })
    .join(" ");

  const combined = useMemo(() => {
    const byId = new Map<string, CampaignRecord>();
    campaigns.forEach((seedCampaign) => {
      byId.set(seedCampaign.id, seedCampaign);
    });
    userCampaigns.forEach((userCampaign) => {
      const seedCampaign = byId.get(userCampaign.id);
      const segmentCount = userCampaign.segments?.length ?? 0;
      byId.set(userCampaign.id, {
        ...(seedCampaign ?? userCampaign),
        ...userCampaign,
        scope: `${userCampaign.scope ?? "General"} · ${segmentCount} segments`,
        segments: userCampaign.segments ?? seedCampaign?.segments ?? [],
      });
    });

    const rank =
      statusSort === "workflow"
        ? { Review: 1, Active: 2 }
        : { Active: 1, Review: 2 };

    return Array.from(byId.values()).sort((a, b) => {
      const rankA = rank[a.state as keyof typeof rank] ?? 99;
      const rankB = rank[b.state as keyof typeof rank] ?? 99;
      if (rankA !== rankB) return rankA - rankB;
      return a.name.localeCompare(b.name);
    });
  }, [statusSort, userCampaigns]);

  return (
    <AppShell
      title="Campaigns"
      subtitle="Campaigns created from product targeting"
      active="Campaigns"
      actions={
        <Link className="btn dark" href="/campaigns/new">
          + Create Campaign
        </Link>
      }
    >
      <section className="section">
        <div className="section-header">
          <div>
            <h2>Campaign Performance</h2>
            <span>Delivery, efficiency, and audience health.</span>
          </div>
          <div className="subtle">Last 7 days</div>
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
            <span>Frequency</span>
            <strong>{campaignKpis.frequency}</strong>
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
            <span>Viewability</span>
            <strong>{campaignKpis.viewability}</strong>
          </div>
        </div>

        <div className="analytics-grid">
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <div className="chart-title">Delivery Trend</div>
                <div className="chart-sub">Impressions and daily spend</div>
              </div>
              <div className="legend">
                <span className="dot" /> Impressions
              </div>
            </div>
            <svg viewBox="0 0 400 140" width="100%" height="140">
              <polyline
                fill="none"
                stroke="#111"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={linePoints}
              />
              <circle
                cx="376"
                cy={
                  120 -
                  (campaignSeries[campaignSeries.length - 1].impressions / maxImpressions) * 90
                }
                r="4"
                fill="#111"
              />
            </svg>
            <div className="spark-bars">
              {campaignSeries.map((item) => (
                <div key={item.label} className="spark-bar">
                  <span style={{ height: `${(item.spend / maxSpend) * 100}%` }} />
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-title">Pacing & Benchmarks</div>
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
                delivered
              </div>
            </div>
            <div className="benchmarks">
              <div>
                <span className="subtle">Display CTR benchmark</span>
                <strong>{campaignBenchmarks.displayCtr}</strong>
              </div>
              <div>
                <span className="subtle">Display CVR benchmark</span>
                <strong>{campaignBenchmarks.displayCvrRange}</strong>
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
          <div>
            <h2>Campaigns</h2>
            <span>Includes newly created campaigns.</span>
          </div>
          <div className="row">
            <span className="subtle">Sort by status</span>
            <select
              className="select"
              value={statusSort}
              onChange={(event) =>
                setStatusSort(event.target.value as "workflow" | "reverse")
              }
              style={{ minWidth: 180 }}
            >
              <option value="workflow">Workflow (Review → Active)</option>
              <option value="reverse">Reverse (Active → Review)</option>
            </select>
          </div>
        </div>
        {combined.length === 0 ? (
          <div className="callout">No campaigns yet. Create one from Products.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Identifier</th>
                <th>Scope</th>
                <th>State</th>
                <th>Last Sync</th>
              </tr>
            </thead>
            <tbody>
              {combined.map((campaign) => (
                <tr key={campaign.id}>
                  <td>
                    <div>
                      <Link href={`/campaigns/${campaign.id}`}>{campaign.name}</Link>
                    </div>
                    <div style={{ color: "var(--muted)", fontSize: 12 }}>
                      ID {campaign.code}
                    </div>
                  </td>
                  <td>{campaign.scope}</td>
                  <td>
                    <span className={`badge ${stateClass(campaign.state)}`}>
                      {campaign.state}
                    </span>
                  </td>
                  <td>{campaign.lastSync}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </AppShell>
  );
}
