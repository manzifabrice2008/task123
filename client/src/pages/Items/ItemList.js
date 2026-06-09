import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getItems, deleteItem } from '../../services/itemService';
import { formatCurrency } from '../../utils/format';
import { toast } from 'react-toastify';
import ConfirmDialog from '../../components/ConfirmDialog';
import Pagination from '../../components/Pagination';

export default function ItemList() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();

  const fetchItems = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search.trim()) params.search = search;
      const res = await getItems(params);
      setItems(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteItem(confirmDelete);
      toast.success('Item deleted successfully');
      setConfirmDelete(null);
      fetchItems(pagination.page);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems(1);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Items</h4>
        <Link to="/items/new" className="btn btn-primary">+ Add Item</Link>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search by item name or specification..."
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
                      <th>Item Name</th>
                      <th>Specification</th>
                      <th>Unit</th>
                      <th className="text-center">Qty</th>
                      <th className="text-end">Unit Price</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.ItemID}>
                        <td>{item.ItemID}</td>
                        <td className="fw-medium">{item.ItemName}</td>
                        <td className="text-muted" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.Specification}
                        </td>
                        <td>{item.UnitMeasure}</td>
                        <td className="text-center">
                          <span className={`badge ${item.Quantity < 10 ? (item.Quantity === 0 ? 'bg-danger' : 'bg-warning') : 'bg-success'}`}>
                            {item.Quantity}
                          </span>
                        </td>
                        <td className="text-end">{formatCurrency(item.UnitPrice)}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-primary me-1"
                            onClick={() => navigate(`/items/edit/${item.ItemID}`)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => setConfirmDelete(item.ItemID)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {items.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center text-muted py-4">No items found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination
                page={pagination.page}
                pages={pagination.pages}
                onPageChange={fetchItems}
              />
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        show={!!confirmDelete}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
