import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getSale, deleteSale } from '../../services/saleService';
import { formatCurrency, formatDate } from '../../utils/format';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function SaleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    getSale(id)
      .then((res) => setSale(res.data.data))
      .catch(() => setSale(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteSale(id);
      toast.success('Sale deleted successfully');
      navigate('/sales');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete sale');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="alert alert-danger">
        Sale not found. <Link to="/sales">Go back to Sales</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <Link to="/sales" className="btn btn-outline-secondary btn-sm">
            &larr; Back
          </Link>
          <h4 className="fw-bold mb-0">Sale #{sale.SaleID}</h4>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary btn-sm" onClick={() => window.print()}>
            🖨 Print
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(true)}>
            Delete Sale
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <small className="text-muted d-block mb-1">Customer</small>
              <h5 className="fw-bold mb-0">{sale.CustomerName}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <small className="text-muted d-block mb-1">Sale Date</small>
              <h5 className="fw-bold mb-0">{formatDate(sale.SaleDate)}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <small className="text-muted d-block mb-1">Total Amount</small>
              <h5 className="fw-bold mb-0 text-primary">{formatCurrency(sale.TotalPrice)}</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom">
          <h6 className="fw-bold mb-0">Items Sold</h6>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Item Name</th>
                  <th className="text-end">Unit Price</th>
                  <th className="text-center">Qty</th>
                  <th className="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {sale.details?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-muted py-4">No items found</td>
                  </tr>
                )}
                {sale.details?.map((d, i) => (
                  <tr key={d.SalesDetailID}>
                    <td className="text-muted">{i + 1}</td>
                    <td className="fw-medium">{d.ItemName}</td>
                    <td className="text-end">{formatCurrency(d.UnitPrice)}</td>
                    <td className="text-center">
                      <span className="badge bg-secondary rounded-pill">{d.QuantitySold}</span>
                    </td>
                    <td className="text-end fw-bold">{formatCurrency(d.SubTotalPrice)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="table-light">
                <tr>
                  <td colSpan={4} className="text-end fw-bold">Grand Total</td>
                  <td className="text-end fw-bold text-primary fs-6">{formatCurrency(sale.TotalPrice)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <ConfirmDialog
        show={confirmDelete}
        title="Delete Sale"
        message="Are you sure you want to delete this sale? Stock quantities will be restored."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
