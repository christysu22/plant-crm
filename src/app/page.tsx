import Link from 'next/link';

export default function Home() {
  const modules = [
    {
      title: 'Customer Relationship Management',
      icon: '👥',
      description: 'Track customers across PalmStreet and Etsy. Manage order history, satisfaction notes, and deals.',
      link: '/crm',
      ready: true,
    },
    {
      title: 'Inventory Management',
      icon: '📦',
      description: 'Track plant inventory, stock levels, and manage product catalog with real-time updates.',
      link: '/inventory',
      ready: false,
    },
    {
      title: 'Receipts & Invoices',
      icon: '🧾',
      description: 'Generate and manage receipts and invoices for all transactions with automatic calculations.',
      link: '/receipts',
      ready: false,
    },
    {
      title: 'Revenue Forecaster',
      icon: '📈',
      description: 'Predict future revenue based on historical data, trends, and seasonal patterns.',
      link: '/revenue',
      ready: false,
    },
    {
      title: 'Vendor Relationship Management',
      icon: '🤝',
      description: 'Manage supplier relationships, track orders, and maintain vendor contact information.',
      link: '/vendors',
      ready: false,
    },
    {
      title: 'Competitor Research',
      icon: '🔍',
      description: 'Track competitor pricing, products, and market trends to stay competitive.',
      link: '/competitors',
      ready: false,
    },
  ];

  return (
    <div className="container">
      <header>
        <h1>Plant Business Management System</h1>
        <p>Complete solution for managing your plant business operations</p>
      </header>

      <div className="dashboard-grid">
        {modules.map((module) => (
          <Link
            key={module.link}
            href={module.link}
            className="dashboard-card"
          >
            <div className="card-icon">{module.icon}</div>
            <h2 className="card-title">
              {module.title}
              {!module.ready && <span className="coming-soon">Coming Soon</span>}
            </h2>
            <p className="card-description">{module.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
