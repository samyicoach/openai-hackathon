import AppShell from "@/components/AppShell";
import { auditLog, targetingMetrics } from "@/lib/mock-data";

export default function ReportingPage() {
  return (
    <AppShell
      title="Reporting & Audit"
      subtitle="Projected impressions and approval trail"
      active="Reporting"
      actions={<button className="btn dark">Export Report</button>}
    >
      <section className="stats">
        <div className="stat-card">
          <p>Impression Goal</p>
          <h3>{targetingMetrics.impressionGoal}</h3>
        </div>
        <div className="stat-card">
          <p>Estimated Reach</p>
          <h3>{targetingMetrics.estimatedReach}</h3>
        </div>
        <div className="stat-card">
          <p>Avg. Confidence</p>
          <h3>{targetingMetrics.confidence}%</h3>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Audit Log</h2>
          <span>Who changed targeting, when, and why.</span>
        </div>
        <div className="audit">
          {auditLog.map((item) => (
            <div key={item.id}>
              <strong>{item.action}</strong> — {item.actor} · {item.timestamp}
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
