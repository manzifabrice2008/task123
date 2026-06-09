import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getItems } from '../../services/itemService';
import { createSale } from '../../services/saleService';
import { formatCurrency } from '../../utils/format';
import { toast } from 'react-toastify';

export default function NewSale() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await getItems({ limit: 1000 });
        setItems(res.data.data);
      } catch (err) {
        toast.error('Failed to load items');
      }
    };
    fetchItems();
  }, []);

  const addRow = () => {
    setCartItems([
      ...cartItems,
      { ItemID: '', ItemName: '', UnitPrice: '', QuantitySold: '', SubTotal: 0, availableQty: 0 },
    ]);
  };

  const removeRow = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...cartItems];

    if (field === 'ItemID') {
      const selectedItem = items.find((i) => i.ItemID === parseInt(value));
      if (selectedItem) {
        updated[index].ItemID = selectedItem.ItemID;
        updated[index].ItemName = selectedItem.ItemName;
        updated[index].UnitPrice = selectedItem.UnitPrice;
        updated[index].availableQty = selectedItem.Quantity;
      } else {
        updated[index].ItemID = '';
        updated[index].ItemName = '';
        updated[index].UnitPrice = '';
        updated[index].availableQty = 0;
      }
      updated[index].QuantitySold = '';
      updated[index].SubTotal = 0;
    } else if (field === 'QuantitySold') {
      updated[index].QuantitySold = value;
      const qty = parseInt(value) || 0;
      const price = parseFloat(updated[index].UnitPrice) || 0;
      updated[index].SubTotal = qty * price;
    }

    setCartItems(updated);
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.SubTotal, 0);

  const validate = () => {
    if (!customerName.trim()) return 'Customer name is required';
    if (!saleDate) return 'Sale date is required';
    if (cartItems.length === 0) return 'At least one item is required';
    for (const item of cartItems) {
      if (!item.ItemID) return 'Please select an item for all rows';
      if (!item.QuantitySold || parseInt(item.QuantitySold) <= 0)
        return 'Quantity must be greater than zero';
      if (parseInt(item.QuantitySold) > item.availableQty)
        return `Insufficient stock for ${item.ItemName}. Available: ${item.availableQty}`;
    }
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
      const saleData = {
        CustomerName: customerName,
        SaleDate: saleDate,
        items: cartItems.map((item) => ({
          ItemID: item.ItemID,
          QuantitySold: parseInt(item.QuantitySold),
          UnitPrice: parseFloat(item.UnitPrice),
        })),
      };
      await createSale(saleData);
      toast.success('Sale created successfully');
      navigate('/sales');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4 className="fw-bold mb-4">New Sale</h4>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label">Customer Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Sale Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                />
              </div>
            </div>

            <h6 className="fw-bold mb-3">Items</h6>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '35%' }}>Item</th>
                    <th style={{ width: '10%' }}>Available</th>
                    <th style={{ width: '15%' }}>Unit Price</th>
                    <th style={{ width: '15%' }}>Qty Sold</th>
                    <th style={{ width: '15%' }}>Subtotal</th>
                    <th style={{ width: '5%' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, i) => (
                    <tr key={i}>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={item.ItemID}
                          onChange={(e) => handleItemChange(i, 'ItemID', e.target.value)}
                        >
                          <option value="">-- Select Item --</option>
                          {items.map((inv) => (
                            <option
                              key={inv.ItemID}
                              value={inv.ItemID}
                              disabled={inv.Quantity <= 0}
                            >
                              {inv.ItemName} {inv.Quantity <= 0 ? '(Out of Stock)' : ''}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="text-center align-middle">
                        <span className={`badge ${item.availableQty < 10 ? 'bg-warning' : 'bg-success'}`}>
                          {item.availableQty}
                        </span>
                      </td>
                      <td className="align-middle">{formatCurrency(item.UnitPrice || 0)}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          min="1"
                          max={item.availableQty}
                          value={item.QuantitySold}
                          onChange={(e) => handleItemChange(i, 'QuantitySold', e.target.value)}
                          placeholder="Qty"
                        />
                      </td>
                      <td className="align-middle text-end fw-bold">
                        {formatCurrency(item.SubTotal)}
                      </td>
                      <td className="text-center align-middle">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeRow(i)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button type="button" className="btn btn-outline-primary btn-sm mb-3" onClick={addRow}>
              + Add Item
            </button>

            <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded mb-3">
              <h5 className="mb-0 fw-bold">Total:</h5>
              <h4 className="mb-0 fw-bold text-primary">{formatCurrency(totalPrice)}</h4>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                Complete Sale
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/sales')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
