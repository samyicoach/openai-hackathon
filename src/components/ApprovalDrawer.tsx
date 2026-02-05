"use client";

import { useEffect, useMemo, useState } from "react";

type ApprovalDrawerProps = {
  entityType: "Product" | "Campaign";
  entityName: string;
  currentStatus: string;
  checklist: string[];
  triggerLabel?: string;
  triggerClassName?: string;
  onApprove?: () => void;
  onReject?: () => void;
  onRequestChanges?: () => void;
};

type DecisionType = "Pending" | "Approved" | "Changes Requested" | "Rejected";

const statusBadgeClass = (status: string) => {
  if (status === "Active" || status === "Approved") return "approved";
  if (status === "Archived") return "review";
  if (status === "Ready for View" || status === "Review") return "ready";
  return "draft";
};

export default function ApprovalDrawer({
  entityType,
  entityName,
  currentStatus,
  checklist,
  triggerLabel = "Review & Approve",
  triggerClassName = "btn dark",
  onApprove,
  onReject,
  onRequestChanges,
}: ApprovalDrawerProps) {
  const [open, setOpen] = useState(false);
  const [reviewer, setReviewer] = useState("Alex Admin");
  const [notes, setNotes] = useState("");
  const [decision, setDecision] = useState<DecisionType>("Pending");
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    checklist.forEach((item) => {
      initial[item] = false;
    });
    return initial;
  });

  const checkedCount = useMemo(
    () => Object.values(checked).filter(Boolean).length,
    [checked]
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <button className={triggerClassName} onClick={() => setOpen(true)}>
        {triggerLabel}
      </button>
      <div
        className={`approval-backdrop ${open ? "open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />
      <aside className={`approval-drawer ${open ? "open" : ""}`}>
        <div className="approval-head">
          <div>
            <h3>Approval Panel</h3>
            <p>
              {entityType}: {entityName}
            </p>
          </div>
          <button className="btn" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>

        <div className="approval-section">
          <div className="subtle">Current status</div>
          <div className="approval-status-row">
            <span className={`badge ${statusBadgeClass(currentStatus)}`}>{currentStatus}</span>
            <span className={`badge ${
              decision === "Approved"
                ? "approved"
                : decision === "Rejected"
                  ? "rejected"
                  : decision === "Changes Requested"
                    ? "ready"
                    : "queued"
            }`}>
              {decision}
            </span>
          </div>
        </div>

        <div className="approval-section">
          <label>Reviewer</label>
          <select
            className="select"
            value={reviewer}
            onChange={(event) => setReviewer(event.target.value)}
          >
            <option>Alex Admin</option>
            <option>Jordan Ops</option>
            <option>Sam Compliance</option>
          </select>
        </div>

        <div className="approval-section">
          <div className="approval-checklist-head">
            <label>Checklist</label>
            <span className="subtle">
              {checkedCount}/{checklist.length}
            </span>
          </div>
          <div className="approval-checklist">
            {checklist.map((item) => (
              <label key={item} className="approval-check-item">
                <input
                  type="checkbox"
                  checked={checked[item] ?? false}
                  onChange={() =>
                    setChecked((prev) => ({
                      ...prev,
                      [item]: !prev[item],
                    }))
                  }
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="approval-section">
          <label>Review notes</label>
          <textarea
            className="textarea framed"
            rows={4}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Add approval notes, blockers, or policy comments."
          />
        </div>

        <div className="approval-actions">
          <button
            className="btn"
            onClick={() => {
              setDecision("Changes Requested");
              onRequestChanges?.();
              setOpen(false);
            }}
          >
            Request Changes
          </button>
          <button
            className="btn"
            onClick={() => {
              setDecision("Rejected");
              onReject?.();
              setOpen(false);
            }}
          >
            Reject
          </button>
          <button
            className="btn dark"
            onClick={() => {
              setDecision("Approved");
              onApprove?.();
              setOpen(false);
            }}
          >
            Approve
          </button>
        </div>
      </aside>
    </>
  );
}
