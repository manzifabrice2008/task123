import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../services/reportService';
import { formatCurrency, formatDate } from '../utils/format';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        setStats(res.data.data);
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (!stats) {
    return <div className="alert alert-danger">Failed to load dashboard data</div>;
  }

  const cards = [
    { label: 'Total Items', value: stats.totalItems, color: 'primary', link: '/items' },
    { label: 'Total Sales', value: stats.totalSales, color: 'success', link: '/sales' },
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), color: 'warning', link: '/reports/daily' },
    { label: "Today's Sales", value: formatCurrency(stats.todaySales), color: 'info', link: '/reports/daily' },
  ];

  return (
    <div>
      <h4 className="mb-4 fw-bold">Dashboard</h4>

      <div className="row g-3 mb-4">
        {cards.map((card, i) => (
          <div className="col-md-6 col-lg-3" key={i}>
            <Link to={card.link} className="text-decoration-none">
              <div className={`card border-0 shadow-sm bg-${card.color} text-white`}>
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="card-title mb-1 opacity-75">{card.label}</h6>
                    <h3 className="mb-0 fw-bold">{card.value}</h3>
                  </div>
                  <div className="opacity-50" style={{ fontSize: '2rem' }}>&#9632;</div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white">
              <h6 className="mb-0 fw-bold">Daily Sales (Last 7 Days)</h6>
            </div>
            <div className="card-body p-0">
              <table className="table table-sm mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th className="text-end">Sales Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.dailySales.map((d, i) => (
                    <tr key={i}>
                      <td>{formatDate(d.SaleDate)}</td>
                      <td className="text-end">{formatCurrency(d.total)}</td>
                    </tr>
                  ))}
                  {stats.dailySales.length === 0 && (
                    <tr><td colSpan="2" className="text-center text-muted py-3">No data</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white">
              <h6 className="mb-0 fw-bold">Monthly Sales</h6>
            </div>
            <div className="card-body p-0">
              <table className="table table-sm mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Month</th>
                    <th className="text-end">Sales Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.monthlySales.map((m, i) => (
                    <tr key={i}>
                      <td>{m.month}</td>
                      <td className="text-end">{formatCurrency(m.total)}</td>
                    </tr>
                  ))}
                  {stats.monthlySales.length === 0 && (
                    <tr><td colSpan="2" className="text-center text-muted py-3">No data</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold">Recent Sales</h6>
              <Link to="/sales" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-sm mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th className="text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentSales.map((sale) => (
                      <tr key={sale.SaleID}>
                        <td>{sale.SaleID}</td>
                        <td>{sale.CustomerName}</td>
                        <td>{formatDate(sale.SaleDate)}</td>
                        <td className="text-end">{formatCurrency(sale.TotalPrice)}</td>
                      </tr>
                    ))}
                    {stats.recentSales.length === 0 && (
                      <tr><td colSpan={4} className="text-center text-muted py-3">No sales yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold">Low Stock Items</h6>
              <Link to="/items" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-sm mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Unit</th>
                      <th className="text-end">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.lowStock.map((item) => (
                      <tr key={item.ItemID}>
                        <td>{item.ItemName}</td>
                        <td className={item.Quantity === 0 ? 'text-danger fw-bold' : 'text-warning fw-bold'}>
                          {item.Quantity}
                        </td>
                        <td>{item.UnitMeasure}</td>
                        <td className="text-end">
                          <span className={`badge ${item.Quantity === 0 ? 'bg-danger' : 'bg-warning'}`}>
                            {item.Quantity === 0 ? 'Out of Stock' : 'Low Stock'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {stats.lowStock.length === 0 && (
                      <tr><td colSpan={4} className="text-center text-muted py-3">All items are well stocked</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
