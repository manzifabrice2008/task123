import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItem, createItem, updateItem } from '../../services/itemService';
import { toast } from 'react-toastify';

export default function ItemForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    ItemName: '',
    Specification: '',
    UnitMeasure: '',
    Quantity: '',
    UnitPrice: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchItem = async () => {
        try {
          const res = await getItem(id);
          const item = res.data.data;
          setForm({
            ItemName: item.ItemName,
            Specification: item.Specification || '',
            UnitMeasure: item.UnitMeasure,
            Quantity: item.Quantity,
            UnitPrice: item.UnitPrice,
          });
        } catch (err) {
          toast.error(err.message);
          navigate('/items');
        } finally {
          setFetching(false);
        }
      };
      fetchItem();
    }
  }, [id, isEdit, navigate]);

  const validate = () => {
    if (!form.ItemName.trim()) return 'Item name is required';
    if (!form.Specification.trim()) return 'Specification is required';
    if (!form.UnitMeasure.trim()) return 'Unit measure is required';
    if (form.Quantity === '' || parseInt(form.Quantity) < 0)
      return 'Quantity must be a non-negative number';
    if (form.UnitPrice === '' || parseFloat(form.UnitPrice) <= 0)
      return 'Unit price must be greater than zero';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }
    setLoading(true);
    try {
      const data = {
        ...form,
        Quantity: parseInt(form.Quantity),
        UnitPrice: parseFloat(form.UnitPrice),
      };
      if (isEdit) {
        await updateItem(id, data);
        toast.success('Item updated successfully');
      } else {
        await createItem(data);
        toast.success('Item created successfully');
      }
      navigate('/items');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (fetching) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white">
            <h5 className="fw-bold mb-0">{isEdit ? 'Edit Item' : 'Add New Item'}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Item Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="ItemName"
                  value={form.ItemName}
                  onChange={handleChange}
                  placeholder="e.g. Hammer"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Specification *</label>
                <textarea
                  className="form-control"
                  name="Specification"
                  value={form.Specification}
                  onChange={handleChange}
                  rows="2"
                  placeholder="e.g. Claw Hammer 16oz with Fiberglass Handle"
                />
              </div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Unit Measure *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="UnitMeasure"
                    value={form.UnitMeasure}
                    onChange={handleChange}
                    placeholder="e.g. Piece, Kg"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    name="Quantity"
                    value={form.Quantity}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Unit Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    name="UnitPrice"
                    value={form.UnitPrice}
                    onChange={handleChange}
                    min="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                  {isEdit ? 'Update Item' : 'Create Item'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/items')}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
