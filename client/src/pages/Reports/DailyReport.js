import React, { useState } from 'react';
import { getDailyReport } from '../../services/reportService';
import { formatCurrency, formatDate } from '../../utils/format';
import { toast } from 'react-toastify';

export default function DailyReport() {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await getDailyReport(date);
      setReport(res.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!report || !report.data.length) return;
    const headers = [
      'Sale Date', 'Customer Name', 'Item Name', 'Specification',
      'Unit Measure', 'Unit Price', 'Quantity Sold', 'SubTotal Price',
    ];
    const rows = report.data.map((row) => [
      row.SaleDate, row.CustomerName, row.ItemName,
      `"${row.Specification}"`, row.UnitMeasure,
      row.UnitPrice, row.QuantitySold, row.SubTotalPrice,
    ]);
    rows.push(['', '', '', '', '', '', 'Total', report.totalAmount]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `daily-report-${report.reportDate}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success('Report exported as CSV');
  };

  return (
    <div>
      <h4 className="fw-bold mb-4">Daily Sales Report</h4>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <form onSubmit={fetchReport} className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label">Select Date</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Loading...' : 'Generate'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {report && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h6 className="fw-bold mb-0">Report for {formatDate(report.reportDate)}</h6>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-primary" onClick={handlePrint}>Print</button>
              <button className="btn btn-sm btn-outline-success" onClick={handleExportCSV}>Export CSV</button>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-sm mb-0" id="report-table">
                <thead className="table-light">
                  <tr>
                    <th>Sale Date</th>
                    <th>Customer</th>
                    <th>Item</th>
                    <th>Specification</th>
                    <th>Unit</th>
                    <th className="text-end">Price</th>
                    <th className="text-center">Qty</th>
                    <th className="text-end">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {report.data.map((row, i) => (
                    <tr key={i}>
                      <td>{formatDate(row.SaleDate)}</td>
                      <td>{row.CustomerName}</td>
                      <td>{row.ItemName}</td>
                      <td className="text-muted" style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {row.Specification}
                      </td>
                      <td>{row.UnitMeasure}</td>
                      <td className="text-end">{formatCurrency(row.UnitPrice)}</td>
                      <td className="text-center">{row.QuantitySold}</td>
                      <td className="text-end fw-bold">{formatCurrency(row.SubTotalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="table-light">
                  <tr>
                    <td colSpan={7} className="text-end fw-bold fs-5">Total Sales Amount:</td>
                    <td className="text-end fw-bold fs-5 text-primary">{formatCurrency(report.totalAmount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {report && report.data.length === 0 && (
        <div className="alert alert-info">No sales found for this date.</div>
      )}
    </div>
  );
}
