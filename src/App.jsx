import { useEffect, useMemo, useState } from 'react';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const makeSummary = (snapshot) => [
  { label: 'PHC network coverage', value: `${snapshot.coverage}%`, change: '+4.8%' },
  { label: 'Stock risk exposure', value: `${snapshot.stockRisk}%`, change: '-2.1%' },
  { label: 'Active alerts', value: snapshot.alertsCount, change: '12 critical' },
  { label: 'Resource resilience', value: `${snapshot.resilience}%`, change: '+6.3%' },
];

const createSnapshot = () => {
  const districtData = [
    { name: 'Andhra Pradesh - Visakhapatnam', risk: 24, patients: 1380, beds: 81, staff: 89, medicine: 76 },
    { name: 'Andhra Pradesh - Vijayawada', risk: 29, patients: 1520, beds: 74, staff: 84, medicine: 69 },
    { name: 'Telangana - Hyderabad', risk: 27, patients: 1620, beds: 79, staff: 88, medicine: 73 },
    { name: 'Karnataka - Bengaluru', risk: 31, patients: 1705, beds: 76, staff: 85, medicine: 68 },
    { name: 'Karnataka - Mysuru', risk: 22, patients: 1040, beds: 86, staff: 93, medicine: 81 },
    { name: 'Tamil Nadu - Chennai', risk: 35, patients: 1830, beds: 70, staff: 82, medicine: 64 },
    { name: 'Kerala - Thiruvananthapuram', risk: 19, patients: 980, beds: 89, staff: 94, medicine: 84 },
    { name: 'Goa - Panaji', risk: 16, patients: 640, beds: 92, staff: 96, medicine: 88 },
  ];

  const inventory = [
    { name: 'Antibiotics', level: 'Healthy', percent: 84, delta: '+6%' },
    { name: 'Oral Rehydration', level: 'Watch', percent: 66, delta: '-8%' },
    { name: 'Oxygen cylinders', level: 'Critical', percent: 39, delta: '-12%' },
    { name: 'Essential vaccines', level: 'Healthy', percent: 88, delta: '+4%' },
  ];

  const routes = [
    { from: 'Andhra Pradesh - Visakhapatnam', to: 'Telangana - Hyderabad', eta: '2h 35m', status: 'On track', priority: 'High' },
    { from: 'Karnataka - Bengaluru', to: 'Tamil Nadu - Chennai', eta: '4h 10m', status: 'Delayed', priority: 'Medium' },
    { from: 'Kerala - Thiruvananthapuram', to: 'Karnataka - Mysuru', eta: '3h 05m', status: 'On track', priority: 'High' },
    { from: 'Andhra Pradesh - Vijayawada', to: 'Karnataka - Bengaluru', eta: '6h 20m', status: 'Watch', priority: 'Medium' },
  ];

  const alerts = [
    { title: 'Oxygen supply risk', detail: '5 PHCs below safety threshold across South India', severity: 'Critical' },
    { title: 'Respiratory demand surge', detail: '12% increase in patient footfall in Tamil Nadu and Telangana', severity: 'High' },
    { title: 'Staff availability dips', detail: 'Chennai and Vijayawada attendance at 72%', severity: 'Moderate' },
    { title: 'Monsoon logistics disruption', detail: 'Transport delays affect redistribution from Kerala to Karnataka', severity: 'High' },
  ];

  const stockRisk = clamp(Math.round(100 - (inventory.reduce((sum, item) => sum + item.percent, 0) / inventory.length) * 0.7), 6, 90);
  const coverage = clamp(Math.round(districtData.reduce((sum, item) => sum + item.beds + item.staff, 0) / 48), 74, 99);
  const resilience = clamp(Math.round((districtData.reduce((sum, item) => sum + item.staff, 0) / 380) * 100), 72, 98);

  return {
    coverage,
    stockRisk,
    resilience,
    alertsCount: 14,
    districtData,
    inventory,
    routes,
    alerts,
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
};

const exportSnapshot = (snapshot) => {
  const csvRows = [
    ['District', 'Risk Index', 'Patients', 'Beds', 'Staff', 'Medicine'],
    ...snapshot.districtData.map((district) => [
      district.name,
      district.risk,
      district.patients,
      district.beds,
      district.staff,
      district.medicine,
    ]),
  ];

  const csvContent = csvRows.map((row) => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'health_resilience_export.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const generateReport = (snapshot) => {
  const reportContent = `Ministry of Health - Public Health Supply Chain Resilience Report\n\n` +
    `Updated: ${snapshot.lastUpdated}\n` +
    `National coverage: ${snapshot.coverage}%\n` +
    `Stock risk exposure: ${snapshot.stockRisk}%\n` +
    `Resource resilience: ${snapshot.resilience}%\n\n` +
    `District summary:\n` +
    snapshot.districtData.map((district) => `- ${district.name}: risk ${district.risk}%, patients ${district.patients}, beds ${district.beds}%, staff ${district.staff}%, medicine ${district.medicine}%`).join('\n') +
    `\n\nPriority actions:\n` +
    snapshot.alerts.map((alert) => `- ${alert.title}: ${alert.detail}`).join('\n');

  const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'health_resilience_report.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

function App() {
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('overview');
  const [snapshot, setSnapshot] = useState(createSnapshot);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSnapshot(createSnapshot());
    }, 6000);

    return () => clearInterval(intervalId);
  }, []);

  const summary = useMemo(() => makeSummary(snapshot), [snapshot]);

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'network', label: 'Network' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'distribution', label: 'Distribution' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'policy', label: 'Policy' },
  ];

  const sectionContent = {
    overview: (
      <>
        <section className="stats-grid">
          {summary.map((stat) => (
            <article key={stat.label} className="stat-card">
              <p>{stat.label}</p>
              <h3>{stat.value}</h3>
              <span>{stat.change}</span>
            </article>
          ))}
        </section>

        <section className="panel-grid panel-grid-main">
          <div className="panel wide-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">District intelligence</p>
                <h3>Facility operating status</h3>
              </div>
              <button className="soft-btn" onClick={() => exportSnapshot(snapshot)}>Export</button>
            </div>

            <div className="district-grid">
              {snapshot.districtData.map((district) => (
                <div key={district.name} className="district-card">
                  <div className="district-header">
                    <div>
                      <h4>{district.name}</h4>
                      <small>Risk index: {district.risk}%</small>
                    </div>
                    <span className={`tag ${district.risk > 35 ? 'critical' : district.risk > 25 ? 'warning' : 'stable'}`}>
                      {district.risk > 35 ? 'Critical' : district.risk > 25 ? 'Watch' : 'Stable'}
                    </span>
                  </div>

                  <div className="metrics-row">
                    <div>
                      <span>Patients</span>
                      <strong>{district.patients}</strong>
                    </div>
                    <div>
                      <span>Beds</span>
                      <strong>{district.beds}%</strong>
                    </div>
                  </div>

                  <div className="metrics-row">
                    <div>
                      <span>Staff</span>
                      <strong>{district.staff}%</strong>
                    </div>
                    <div>
                      <span>Medicine</span>
                      <strong>{district.medicine}%</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Priority watch</p>
                <h3>Emergency alerts</h3>
              </div>
            </div>

            <ul className="alert-list">
              {snapshot.alerts.map((alert) => (
                <li key={alert.title} className="alert-item">
                  <div className="alert-topline">
                    <strong>{alert.title}</strong>
                    <span className={`severity ${alert.severity.toLowerCase()}`}>{alert.severity}</span>
                  </div>
                  <p>{alert.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="panel-grid panel-grid-bottom">
          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Inventory outlook</p>
                <h3>Supply readiness</h3>
              </div>
              <button className="soft-btn" onClick={() => setActiveTab('inventory')}>View all</button>
            </div>

            <div className="inventory-list">
              {snapshot.inventory.map((item) => (
                <div key={item.name} className="inventory-row">
                  <div className="inventory-meta">
                    <strong>{item.name}</strong>
                    <span>{item.level}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${item.percent}%` }} />
                  </div>
                  <div className="inventory-end">
                    <b>{item.percent}%</b>
                    <small>{item.delta}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Redistribution</p>
                <h3>Recommended logistics</h3>
              </div>
            </div>

            <div className="route-list">
              {snapshot.routes.map((route) => (
                <div key={`${route.from}-${route.to}`} className="route-item">
                  <div>
                    <strong>{route.from}</strong>
                    <small>to {route.to}</small>
                  </div>
                  <span className="eta">{route.eta}</span>
                  <span className={`route-status ${route.status === 'Delayed' ? 'warning' : 'ok'}`}>{route.status}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    ),
    network: (
      <section className="panel-grid panel-grid-main">
        <div className="panel wide-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">National network</p>
              <h3>PHC connectivity matrix</h3>
            </div>
          </div>

          <div className="network-summary">
            {[
              { label: 'Connected PHCs', value: '482', status: 'Stable' },
              { label: 'Cold chain uptime', value: '89.3%', status: 'Watch' },
              { label: 'EHR sync', value: '98.4%', status: 'Stable' },
              { label: 'Lagging districts', value: '03', status: 'Alert' },
            ].map((item) => (
              <div key={item.label} className="network-summary-item">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <em>{item.status}</em>
              </div>
            ))}
          </div>

          <div className="district-grid">
            {snapshot.districtData.map((district) => (
              <div key={district.name} className="district-card network-card">
                <div className="district-header">
                  <div>
                    <h4>{district.name}</h4>
                    <small>Link reliability: {district.staff}%</small>
                  </div>
                  <span className={`tag ${district.risk > 35 ? 'critical' : district.risk > 25 ? 'warning' : 'stable'}`}>
                    {district.risk > 35 ? 'Critical' : district.risk > 25 ? 'Watch' : 'Stable'}
                  </span>
                </div>
                <div className="metrics-row">
                  <div>
                    <span>Average wait</span>
                    <strong>{Math.max(12, 36 - district.staff)} min</strong>
                  </div>
                  <div>
                    <span>Footfall</span>
                    <strong>{district.patients}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Network health</p>
              <h3>Digital service uptime</h3>
            </div>
          </div>
          <ul className="alert-list">
            {['EHR sync: 98.4%', 'Logistics tracker: 95.1%', 'District reporting: 96.8%', 'Cold chain visibility: 89.3%'].map((item) => (
              <li key={item} className="alert-item service-item">
                <div className="alert-topline">
                  <strong>{item}</strong>
                  <span className="severity moderate">Live</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    ),
    inventory: (
      <section className="panel-grid panel-grid-main">
        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Inventory monitoring</p>
              <h3>Critical medicine stock</h3>
            </div>
          </div>
          <div className="inventory-list">
            {snapshot.inventory.map((item) => (
              <div key={item.name} className="inventory-row">
                <div className="inventory-meta">
                  <strong>{item.name}</strong>
                  <span>{item.level}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${item.percent}%` }} />
                </div>
                <div className="inventory-end">
                  <b>{item.percent}%</b>
                  <small>{item.delta}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Procurement</p>
              <h3>Restocking guidance</h3>
            </div>
          </div>
          <ul className="alert-list">
            {[
              'Oxygen cylinders require urgent replenishment in Northern Zone.',
              'Oral rehydration packets to be restocked within 72 hours.',
              'Vaccine reserve remains sufficient for 18 days.',
            ].map((item) => (
              <li key={item} className="alert-item">
                <div className="alert-topline">
                  <strong>Action required</strong>
                  <span className="severity high">Priority</span>
                </div>
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    ),
    distribution: (
      <section className="panel-grid panel-grid-main">
        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Resource movement</p>
              <h3>Redistribution plan</h3>
            </div>
          </div>
          <div className="route-list">
            {snapshot.routes.map((route) => (
              <div key={`${route.from}-${route.to}`} className="route-item">
                <div>
                  <strong>{route.from}</strong>
                  <small>to {route.to}</small>
                </div>
                <span className="eta">{route.eta}</span>
                <span className={`route-status ${route.status === 'Delayed' ? 'warning' : 'ok'}`}>{route.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Dispatch logic</p>
              <h3>Recommended priority order</h3>
            </div>
          </div>
          <ul className="alert-list">
            {['Northern Zone: oxygen and basic medicines', 'Western Region: vaccines and antibiotics', 'Coastal Belt: mobile outreach support'].map((item) => (
              <li key={item} className="alert-item">
                <div className="alert-topline">
                  <strong>{item}</strong>
                  <span className="severity critical">High</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    ),
    alerts: (
      <section className="panel-grid panel-grid-main">
        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Risk monitoring</p>
              <h3>Emergency alert center</h3>
            </div>
          </div>
          <ul className="alert-list">
            {snapshot.alerts.map((alert) => (
              <li key={alert.title} className="alert-item">
                <div className="alert-topline">
                  <strong>{alert.title}</strong>
                  <span className={`severity ${alert.severity.toLowerCase()}`}>{alert.severity}</span>
                </div>
                <p>{alert.detail}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Escalation</p>
              <h3>Response team</h3>
            </div>
          </div>
          <ul className="alert-list">
            {[
              'District command desk: 12 active escalations',
              'Field logistics unit: 3 high-priority transfers',
              'Public health surveillance: 2 emerging clusters',
            ].map((item) => (
              <li key={item} className="alert-item">
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    ),
    policy: (
      <section className="panel-grid panel-grid-main">
        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Governance</p>
              <h3>Federated public health policy</h3>
            </div>
          </div>
          <ul className="alert-list">
            {[
              'Data stays local to participating health agencies; only model updates are shared.',
              'Cross-border learning supports predictive planning without exposing sensitive records.',
              'Decision approval remains with national authorities before redistribution.',
            ].map((item) => (
              <li key={item} className="alert-item">
                <div className="alert-topline">
                  <strong>Policy rule</strong>
                  <span className="severity moderate">Secure</span>
                </div>
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Compliance</p>
              <h3>Operational safeguards</h3>
            </div>
          </div>
          <ul className="alert-list">
            {[
              'Audit logs enabled for all critical recommendations.',
              'Role-based access for district and national users.',
              'Data retention aligned to health governance standards.',
            ].map((item) => (
              <li key={item} className="alert-item">
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    )
  };

  const titles = {
    overview: { eyebrow: 'Ministry of Health operational view', title: 'Public health supply chain resilience' },
    network: { eyebrow: 'National health infrastructure', title: 'PHC network and connectivity overview' },
    inventory: { eyebrow: 'Supply chain intelligence', title: 'Medicine availability and stock monitoring' },
    distribution: { eyebrow: 'Logistics and redistribution', title: 'Cross-district resource movement strategy' },
    alerts: { eyebrow: 'Emergency operations', title: 'Health risk alert and response center' },
    policy: { eyebrow: 'Governance and safeguards', title: 'Federated policy and resilience controls' },
  };

  const currentTitle = titles[activeTab] || titles.overview;

  return (
    <div className={`app-shell ${theme}`}>
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">+</div>
          <div>
            <p className="eyebrow">BRICS resilience network</p>
            <h1>HealthGrid</h1>
          </div>
        </div>

        <nav className="nav">
          {navItems.map((item) => (
            <a
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              href="#"
              onClick={(event) => {
                event.preventDefault();
                setActiveTab(item.id);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="sidebar-panel">
          <p className="eyebrow">Regional priority</p>
          <strong>BRICS resilience response</strong>
          <span>Preparedness index: 81%</span>
        </div>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">{currentTitle.eyebrow}</p>
            <h2>{currentTitle.title}</h2>
          </div>

          <div className="top-actions">
            <div className="live-pill">
              <span className="pulse-dot" />
              Live sync
            </div>
            <button className="ghost-btn" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
              {theme === 'light' ? 'Dark mode' : 'Light mode'}
            </button>
            <button className="primary-btn" onClick={() => generateReport(snapshot)}>Generate report</button>
          </div>
        </header>

        {sectionContent[activeTab] || sectionContent.overview}

        <footer className="footer-bar">
          <span>Operational snapshot</span>
          <strong>Updated {snapshot.lastUpdated}</strong>
          <button className="soft-btn export-btn" onClick={() => exportSnapshot(snapshot)}>Export CSV</button>
        </footer>
      </main>
    </div>
  );
}

export default App;
