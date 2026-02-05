import AppShell from "@/components/AppShell";
import {
  campaignBenchmarks,
  dashboardKpis,
  dashboardSeries,
  geoMix,
  deviceMix,
} from "@/lib/mock-data";

export default function Home() {
  const maxImpressions = Math.max(...dashboardSeries.map((d) => d.impressions));
  const maxSpend = Math.max(...dashboardSeries.map((d) => d.spend));
  const linePoints = dashboardSeries
    .map((d, i) => {
      const x = 16 + (i / (dashboardSeries.length - 1)) * 360;
      const y = 120 - (d.impressions / maxImpressions) * 90;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <AppShell
      title="Dashboard"
      subtitle="Overall campaign reach, impressions, and system health"
      active="Dashboard"
    >
      <section className="section">
        <div className="section-header">
          <div>
            <h2>Performance Overview</h2>
            <span>Topline delivery and efficiency metrics.</span>
          </div>
          <div className="subtle">Last 6 weeks</div>
        </div>

        <div className="kpi-grid">
          <div className="kpi-card">
            <span>Impressions</span>
            <strong>{dashboardKpis.impressions}</strong>
          </div>
          <div className="kpi-card">
            <span>Reach</span>
            <strong>{dashboardKpis.reach}</strong>
          </div>
          <div className="kpi-card">
            <span>Frequency</span>
            <strong>{dashboardKpis.frequency}</strong>
          </div>
          <div className="kpi-card">
            <span>CTR</span>
            <strong>{dashboardKpis.ctr}</strong>
          </div>
          <div className="kpi-card">
            <span>CPM</span>
            <strong>{dashboardKpis.cpm}</strong>
          </div>
          <div className="kpi-card">
            <span>ROAS</span>
            <strong>{dashboardKpis.roas}</strong>
          </div>
        </div>

        <div className="analytics-grid">
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <div className="chart-title">Impressions Trend</div>
                <div className="chart-sub">Weekly delivery trend</div>
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
            </svg>
            <div className="spark-bars">
              {dashboardSeries.map((item) => (
                <div key={item.label} className="spark-bar">
                  <span style={{ height: `${(item.spend / maxSpend) * 100}%` }} />
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
            <div className="chart-title">Quality Benchmarks</div>
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
        </div>
      </section>
    </AppShell>
  );
}
