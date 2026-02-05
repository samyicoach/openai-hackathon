import Link from "next/link";
import { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/products", label: "Products" },
  { href: "/campaigns", label: "Campaigns" },
];

export default function AppShell({
  title,
  subtitle,
  active,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  active: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">O</div>
          Open Ads
        </div>
        <nav className="nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={item.label === active ? "active" : ""}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="avatar">AA</div>
          Alex Admin
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>{title}</h1>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          <div className="actions">{actions}</div>
        </header>
        <div className="page-enter">{children}</div>
      </main>
    </div>
  );
}
