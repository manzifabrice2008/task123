const { initPool: pool } = require('../config/database');
const AppError = require('../utils/AppError');
const { catchAsync } = require('../utils/helpers');

exports.getItems = catchAsync(async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  let query = 'SELECT * FROM Items';
  let countQuery = 'SELECT COUNT(*) as total FROM Items';
  const params = [];
  const countParams = [];

  if (search) {
    const whereClause = ' WHERE ItemName LIKE ? OR Specification LIKE ?';
    const searchParam = [`%${search}%`, `%${search}%`];
    query += whereClause;
    countQuery += whereClause;
    params.push(...searchParam);
    countParams.push(...searchParam);
  }

  query += ' ORDER BY ItemID DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);

  const [items] = await pool.query(query, params);
  const [countResult] = await pool.query(countQuery, countParams);
  const total = countResult[0].total;

  res.json({
    success: true,
    data: items,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

exports.getItem = catchAsync(async (req, res, next) => {
  const [rows] = await pool.query('SELECT * FROM Items WHERE ItemID = ?', [
    req.params.id,
  ]);
  if (rows.length === 0) {
    return next(new AppError('Item not found', 404));
  }
  res.json({ success: true, data: rows[0] });
});

exports.createItem = catchAsync(async (req, res, next) => {
  const { ItemName, Specification, UnitMeasure, Quantity, UnitPrice } =
    req.body;

  if (!ItemName || !Specification || !UnitMeasure) {
    return next(new AppError('Item name, specification, and unit are required', 400));
  }
  if (Quantity === undefined || Quantity < 0) {
    return next(new AppError('Quantity must be a non-negative number', 400));
  }
  if (UnitPrice === undefined || UnitPrice <= 0) {
    return next(new AppError('Unit price must be greater than zero', 400));
  }

  const [result] = await pool.query(
    'INSERT INTO Items (ItemName, Specification, UnitMeasure, Quantity, UnitPrice) VALUES (?, ?, ?, ?, ?)',
    [ItemName, Specification, UnitMeasure, Quantity, UnitPrice]
  );

  res.status(201).json({
    success: true,
    message: 'Item created successfully',
    data: { ItemID: result.insertId },
  });
});

exports.updateItem = catchAsync(async (req, res, next) => {
  const { ItemName, Specification, UnitMeasure, Quantity, UnitPrice } =
    req.body;
  const { id } = req.params;

  const [existing] = await pool.query(
    'SELECT * FROM Items WHERE ItemID = ?',
    [id]
  );
  if (existing.length === 0) {
    return next(new AppError('Item not found', 404));
  }

  if (!ItemName || !Specification || !UnitMeasure) {
    return next(new AppError('Item name, specification, and unit are required', 400));
  }
  if (Quantity === undefined || Quantity < 0) {
    return next(new AppError('Quantity must be a non-negative number', 400));
  }
  if (UnitPrice === undefined || UnitPrice <= 0) {
    return next(new AppError('Unit price must be greater than zero', 400));
  }

  await pool.query(
    'UPDATE Items SET ItemName = ?, Specification = ?, UnitMeasure = ?, Quantity = ?, UnitPrice = ? WHERE ItemID = ?',
    [ItemName, Specification, UnitMeasure, Quantity, UnitPrice, id]
  );

  res.json({ success: true, message: 'Item updated successfully' });
});

exports.deleteItem = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const [existing] = await pool.query(
    'SELECT * FROM Items WHERE ItemID = ?',
    [id]
  );
  if (existing.length === 0) {
    return next(new AppError('Item not found', 404));
  }

  try {
    await pool.query('DELETE FROM Items WHERE ItemID = ?', [id]);
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return next(
        new AppError(
          'Cannot delete item because it is referenced in sales records',
          400
        )
      );
    }
    throw error;
  }
});
