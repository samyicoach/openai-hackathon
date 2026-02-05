"use client";

import AppShell from "@/components/AppShell";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewCampaignPage() {
  const { products, createCampaignWithDetails } = useStore();
  const router = useRouter();
  const [form, setForm] = useState({
    productId: products[0]?.id ?? "",
    name: "",
    objective: "Awareness",
    budgetType: "Daily" as "Daily" | "Lifetime",
    budgetAmount: "1200",
    startDate: "2026-02-10",
    endDate: "2026-03-20",
    bidStrategy: "Maximize Reach",
    pacing: "Even" as "Even" | "Ahead" | "ASAP",
    frequencyCap: "3 / day",
  });

  return (
    <AppShell
      title="Create Campaign"
      subtitle="Define objective, budget, schedule, and delivery rules"
      active="Campaigns"
      actions={
        <Link className="btn" href="/campaigns">
          Back to Campaigns
        </Link>
      }
    >
      <section className="section">
        <div className="section-header">
          <div>
            <h2>Campaign Setup</h2>
            <span>Required fields are objective, budget, and schedule.</span>
          </div>
        </div>
        <div className="grid-two">
          <div className="form-group">
            <label>Campaign Name</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Spring Launch 2026"
            />
          </div>
          <div className="form-group">
            <label>Product</label>
            <select
              className="select"
              value={form.productId}
              onChange={(e) => setForm({ ...form, productId: e.target.value })}
            >
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} · {product.category}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Objective</label>
            <select
              className="select"
              value={form.objective}
              onChange={(e) => setForm({ ...form, objective: e.target.value })}
            >
              {[
                "Awareness",
                "Consideration",
                "Traffic",
                "Conversion",
                "Lead Generation",
              ].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Bid Strategy</label>
            <select
              className="select"
              value={form.bidStrategy}
              onChange={(e) => setForm({ ...form, bidStrategy: e.target.value })}
            >
              {[
                "Maximize Reach",
                "Target CPM",
                "Target CPA",
                "Target ROAS",
                "Manual CPC",
              ].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Budget Type</label>
            <select
              className="select"
              value={form.budgetType}
              onChange={(e) =>
                setForm({
                  ...form,
                  budgetType: e.target.value as "Daily" | "Lifetime",
                })
              }
            >
              {[
                { label: "Daily", value: "Daily" },
                { label: "Lifetime", value: "Lifetime" },
              ].map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Budget Amount</label>
            <input
              className="input"
              value={form.budgetAmount}
              onChange={(e) => setForm({ ...form, budgetAmount: e.target.value })}
              placeholder="1200"
            />
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input
              className="input"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              placeholder="2026-02-10"
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              className="input"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              placeholder="2026-03-20"
            />
          </div>
          <div className="form-group">
            <label>Pacing</label>
            <select
              className="select"
              value={form.pacing}
              onChange={(e) =>
                setForm({
                  ...form,
                  pacing: e.target.value as "Even" | "Ahead" | "ASAP",
                })
              }
            >
              {[
                { label: "Even", value: "Even" },
                { label: "Ahead", value: "Ahead" },
                { label: "ASAP", value: "ASAP" },
              ].map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Frequency Cap</label>
            <input
              className="input"
              value={form.frequencyCap}
              onChange={(e) => setForm({ ...form, frequencyCap: e.target.value })}
              placeholder="3 / day"
            />
          </div>
        </div>
        <div className="reco-actions" style={{ marginTop: 16 }}>
          <div className="subtle">Budget and schedule required to launch.</div>
          <button
            className="btn dark"
            onClick={() => {
              if (!form.name || !form.productId || !form.budgetAmount) return;
              createCampaignWithDetails({
                ...form,
                budgetAmount: form.budgetAmount.startsWith("$")
                  ? form.budgetAmount
                  : `$${form.budgetAmount}`,
              });
              router.push("/campaigns");
            }}
          >
            Create Campaign
          </button>
        </div>
      </section>
    </AppShell>
  );
}
