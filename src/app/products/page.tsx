"use client";

import AppShell from "@/components/AppShell";
import { useStore } from "@/lib/store";
import Link from "next/link";
import { useMemo, useState } from "react";

const statusClass = (status: string) => {
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

export default function ProductsPage() {
  const { products, selectedProductId, selectProduct } = useStore();
  const [statusSort, setStatusSort] = useState<"workflow" | "reverse">("workflow");

  const sortedProducts = useMemo(() => {
    const rank =
      statusSort === "workflow"
        ? { "Ready for View": 1, Approved: 2, Archived: 3 }
        : { Archived: 1, Approved: 2, "Ready for View": 3 };
    return [...products].sort((a, b) => {
      const rankA = rank[a.status as keyof typeof rank] ?? 99;
      const rankB = rank[b.status as keyof typeof rank] ?? 99;
      if (rankA !== rankB) return rankA - rankB;
      return a.name.localeCompare(b.name);
    });
  }, [products, statusSort]);

  return (
    <AppShell
      title="Products"
      subtitle="Select a product, review targeting, and launch a campaign"
      active="Products"
      actions={
        <Link className="btn dark" href="/products/new">
          + Create Product
        </Link>
      }
    >
      <section className="section">
        <div className="section-header">
          <div>
            <h2>Products</h2>
            <span>Review products and open targeting.</span>
          </div>
          <div className="row">
            <span className="subtle">Sort</span>
            <select
              className="select"
              value={statusSort}
              onChange={(event) =>
                setStatusSort(event.target.value as "workflow" | "reverse")
              }
              style={{ minWidth: 180 }}
            >
              <option value="workflow">Status: Ready first</option>
              <option value="reverse">Status: Archived first</option>
            </select>
          </div>
        </div>
        <div className="list">
          {sortedProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className={`list-card ${product.id === selectedProductId ? "active" : ""}`}
              onClick={() => selectProduct(product.id)}
            >
              <div className="row">
                <div>
                  <strong>{product.name}</strong>
                  <div style={{ color: "var(--muted)", fontSize: 12 }}>
                    {product.sku} · {product.advertiser}
                  </div>
                </div>
                <span className={`badge ${statusClass(product.status)}`}>
                  {product.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
