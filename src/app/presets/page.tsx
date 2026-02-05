import AppShell from "@/components/AppShell";
import { presets } from "@/lib/mock-data";

export default function PresetsPage() {
  return (
    <AppShell
      title="Targeting Presets"
      subtitle="Saved targeting profiles for quick reuse"
      active="Presets"
      actions={<button className="btn dark">+ Create Preset</button>}
    >
      <section className="section">
        <div className="section-header">
          <h2>Preset Library</h2>
          <span>Apply presets when registering a new product.</span>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Advertiser</th>
              <th>Segments</th>
              <th>Last Used</th>
            </tr>
          </thead>
          <tbody>
            {presets.map((preset) => (
              <tr key={preset.id}>
                <td>{preset.name}</td>
                <td>{preset.advertiser}</td>
                <td style={{ color: "var(--muted)" }}>{preset.segments}</td>
                <td>{preset.lastUsed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AppShell>
  );
}
