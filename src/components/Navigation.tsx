'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: '🏠' },
    { name: 'CRM', path: '/crm', icon: '👥' },
    { name: 'Inventory', path: '/inventory', icon: '📦' },
    { name: 'Receipts & Invoices', path: '/receipts', icon: '🧾' },
    { name: 'Revenue Forecaster', path: '/revenue', icon: '📈' },
    { name: 'Vendor Management', path: '/vendors', icon: '🤝' },
    { name: 'Competitor Research', path: '/competitors', icon: '🔍' },
  ];

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h1>Plant Business CRM</h1>
      </div>
      <div className="nav-links">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`nav-link ${pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
