import AppShell from "@/components/AppShell";
import { aiRecommendationCards, targetingMetrics } from "@/lib/mock-data";

export default function TargetingPage() {
  return (
    <AppShell
      title="Targeting"
      subtitle="High-confidence recommendations with reach, impressions, and audience insights"
      active="Products"
      actions={<button className="btn dark">Export Targeting</button>}
    >
      <section className="section">
        <div className="section-header">
          <div>
            <h2>Recommendation Summary</h2>
            <span>Generated segments based on product intent signals.</span>
          </div>
          <button className="btn">Regenerate</button>
        </div>

        <div className="metric-grid">
          <div className="metric-card">
            <span>Impression Goal</span>
            <h4>{targetingMetrics.impressionGoal}</h4>
          </div>
          <div className="metric-card">
            <span>Estimated Reach</span>
            <h4>{targetingMetrics.estimatedReach}</h4>
          </div>
          <div className="metric-card">
            <span>Avg. Confidence</span>
            <h4>{targetingMetrics.confidence}%</h4>
          </div>
        </div>

        <div className="overview-grid">
          <div className="overview-card">
            <div className="overview-label">Reach Projection</div>
            <div className="overview-value">{targetingMetrics.estimatedReach}</div>
            <div className="line-chart">
              <svg viewBox="0 0 420 140" width="100%" height="140">
                <path
                  d="M10,120 C80,110 120,85 170,92 C210,98 230,120 260,110 C300,96 320,68 360,48 C390,32 405,34 410,40"
                  fill="none"
                  stroke="#111"
                  strokeWidth="2"
                />
                <circle cx="410" cy="40" r="4" fill="#111" />
                <line x1="10" y1="120" x2="410" y2="120" stroke="#efefef" />
                <line x1="10" y1="92" x2="410" y2="92" stroke="#f3f3f3" />
                <line x1="10" y1="64" x2="410" y2="64" stroke="#f6f6f6" />
              </svg>
            </div>
          </div>
          <div className="overview-card">
            <div className="overview-label">Confidence Ring</div>
            <div className="overview-value">{targetingMetrics.confidence}%</div>
            <svg viewBox="0 0 120 120" width="120" height="120">
              <circle cx="60" cy="60" r="50" stroke="#ededed" strokeWidth="10" fill="none" />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#111"
                strokeWidth="10"
                fill="none"
                strokeDasharray="314"
                strokeDashoffset={`${314 - (314 * targetingMetrics.confidence) / 100}`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <h2>Recommended Segments</h2>
            <span>Select the segments to activate for the campaign.</span>
          </div>
          <button className="btn dark">Apply Selection</button>
        </div>

        <div style={{ display: "grid", gap: 18 }}>
          {aiRecommendationCards.map((card) => (
            <div className="reco-card" key={card.id}>
              <div className="reco-top">
                <div>
                  <strong style={{ fontSize: 16 }}>{card.title}</strong>
                  <div className="reco-tags" style={{ marginTop: 6 }}>
                    <span className="tag">{card.cluster}</span>
                    <span className="tag">High Intent</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="subtle">Confidence</div>
                  <div style={{ fontSize: 22, fontWeight: 600 }}>{card.confidence}%</div>
                </div>
              </div>

              <div className="split">
                <div>
                  <div style={{ display: "flex", gap: 24, marginBottom: 12 }}>
                    <div>
                      <div className="subtle">Reach Estimate</div>
                      <div style={{ fontWeight: 600 }}>{card.reach}</div>
                    </div>
                    <div>
                      <div className="subtle">Projected Lift</div>
                      <div style={{ fontWeight: 600 }}>{card.lift}</div>
                    </div>
                  </div>
                  <div className="panel">
                    <div className="subtle" style={{ marginBottom: 8 }}>
                      AI Rationale
                    </div>
                    <p style={{ fontSize: 13, color: "var(--muted)" }}>{card.rationale}</p>
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                    <button className="btn dark">Select Segment</button>
                    <button className="btn">Download Audit</button>
                  </div>
                </div>

                <div style={{ display: "grid", gap: 12 }}>
                  <div className="panel">
                    <div className="subtle" style={{ marginBottom: 10 }}>
                      Geographic Reach
                    </div>
                    <div className="zones-card" style={{ height: 100 }} />
                  </div>
                  <div className="panel">
                    <div className="subtle" style={{ marginBottom: 10 }}>
                      Age Distribution
                    </div>
                    <div style={{ display: "grid", gap: 8 }}>
                      {card.ageBands.map((band) => (
                        <div key={band.label} style={{ display: "grid", gap: 6 }}>
                          <div className="subtle">
                            {band.label} · {band.value}%
                          </div>
                          <div className="progress-bar">
                            <span style={{ width: `${band.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
