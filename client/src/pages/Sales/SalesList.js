import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSales, deleteSale } from '../../services/saleService';
import { formatCurrency, formatDate } from '../../utils/format';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../components/ConfirmDialog';
import Pagination from '../../components/Pagination';

export default function SalesList() {
  const [sales, setSales] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();

  const fetchSales = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search.trim()) params.search = search;
      const res = await getSales(params);
      setSales(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteSale(confirmDelete);
      toast.success('Sale deleted successfully');
      setConfirmDelete(null);
      fetchSales(pagination.page);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSales(1);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Sales</h4>
        <Link to="/sales/new" className="btn btn-primary">+ New Sale</Link>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search by customer name or date..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn btn-outline-secondary" type="submit">Search</button>
            </div>
          </form>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status" />
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th className="text-end">Total</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((sale) => (
                      <tr key={sale.SaleID}>
                        <td>{sale.SaleID}</td>
                        <td className="fw-medium">{sale.CustomerName}</td>
                        <td>{formatDate(sale.SaleDate)}</td>
                        <td className="text-end fw-bold">{formatCurrency(sale.TotalPrice)}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-info me-1"
                            onClick={() => navigate(`/sales/${sale.SaleID}`)}
                          >
                            View
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => setConfirmDelete(sale.SaleID)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {sales.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center text-muted py-4">No sales found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination
                page={pagination.page}
                pages={pagination.pages}
                onPageChange={fetchSales}
              />
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        show={!!confirmDelete}
        title="Delete Sale"
        message="Are you sure you want to delete this sale? Stock quantities will be restored."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
