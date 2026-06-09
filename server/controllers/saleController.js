const { initPool: pool } = require('../config/database');
const AppError = require('../utils/AppError');
const { catchAsync } = require('../utils/helpers');

exports.getSales = catchAsync(async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  let query = 'SELECT * FROM Sales';
  let countQuery = 'SELECT COUNT(*) as total FROM Sales';
  const params = [];
  const countParams = [];

  if (search) {
    const whereClause =
      ' WHERE CustomerName LIKE ? OR SaleDate = ?';
    query += whereClause;
    countQuery += whereClause;
    params.push(`%${search}%`, search);
    countParams.push(`%${search}%`, search);
  }

  query += ' ORDER BY SaleID DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);

  const [sales] = await pool.query(query, params);
  const [countResult] = await pool.query(countQuery, countParams);
  const total = countResult[0].total;

  res.json({
    success: true,
    data: sales,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

exports.getSale = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const [saleRows] = await pool.query('SELECT * FROM Sales WHERE SaleID = ?', [
    id,
  ]);
  if (saleRows.length === 0) {
    return next(new AppError('Sale not found', 404));
  }

  const [detailRows] = await pool.query(
    `SELECT sd.*, i.ItemName 
     FROM SalesDetail sd 
     JOIN Items i ON sd.ItemID = i.ItemID 
     WHERE sd.SaleID = ?`,
    [id]
  );

  res.json({
    success: true,
    data: { ...saleRows[0], details: detailRows },
  });
});

exports.createSale = catchAsync(async (req, res, next) => {
  const { SaleDate, CustomerName, items } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    if (!CustomerName || !SaleDate) {
      throw new AppError('Customer name and sale date are required', 400);
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new AppError('At least one item is required', 400);
    }

    let totalPrice = 0;
    const details = [];

    for (const item of items) {
      const { ItemID, QuantitySold, UnitPrice } = item;

      if (!ItemID || !QuantitySold || !UnitPrice) {
        throw new AppError('Each item must have ItemID, QuantitySold, and UnitPrice', 400);
      }

      if (QuantitySold <= 0) {
        throw new AppError('Quantity sold must be greater than zero', 400);
      }

      const [itemRows] = await connection.query(
        'SELECT * FROM Items WHERE ItemID = ?',
        [ItemID]
      );

      if (itemRows.length === 0) {
        throw new AppError(`Item with ID ${ItemID} not found`, 404);
      }

      const itemData = itemRows[0];
      if (itemData.Quantity < QuantitySold) {
        throw new AppError(
          `Insufficient stock for ${itemData.ItemName}. Available: ${itemData.Quantity}, Requested: ${QuantitySold}`,
          400
        );
      }

      const subtotal = QuantitySold * UnitPrice;
      totalPrice += subtotal;
      details.push({ ItemID, QuantitySold, UnitPrice, SubTotalPrice: subtotal });
    }

    const [saleResult] = await connection.query(
      'INSERT INTO Sales (SaleDate, CustomerName, TotalPrice) VALUES (?, ?, ?)',
      [SaleDate, CustomerName, totalPrice]
    );

    const saleId = saleResult.insertId;

    for (const detail of details) {
      await connection.query(
        'INSERT INTO SalesDetail (SaleID, ItemID, QuantitySold, UnitPrice, SubTotalPrice) VALUES (?, ?, ?, ?, ?)',
        [saleId, detail.ItemID, detail.QuantitySold, detail.UnitPrice, detail.SubTotalPrice]
      );

      await connection.query(
        'UPDATE Items SET Quantity = Quantity - ? WHERE ItemID = ?',
        [detail.QuantitySold, detail.ItemID]
      );
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Sale created successfully',
      data: { SaleID: saleId, TotalPrice: totalPrice },
    });
  } catch (error) {
    await connection.rollback();
    if (error.isOperational) {
      return next(error);
    }
    throw error;
  } finally {
    connection.release();
  }
});

exports.deleteSale = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const [existing] = await pool.query('SELECT * FROM Sales WHERE SaleID = ?', [
    id,
  ]);
  if (existing.length === 0) {
    return next(new AppError('Sale not found', 404));
  }

  try {
    const [details] = await pool.query(
      'SELECT * FROM SalesDetail WHERE SaleID = ?',
      [id]
    );

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      for (const detail of details) {
        await connection.query(
          'UPDATE Items SET Quantity = Quantity + ? WHERE ItemID = ?',
          [detail.QuantitySold, detail.ItemID]
        );
      }

      await connection.query('DELETE FROM SalesDetail WHERE SaleID = ?', [id]);
      await connection.query('DELETE FROM Sales WHERE SaleID = ?', [id]);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

    res.json({ success: true, message: 'Sale deleted successfully' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return next(
        new AppError('Cannot delete sale due to existing references', 400)
      );
    }
    throw error;
  }
});

exports.getAllSales = catchAsync(async (req, res) => {
  const [sales] = await pool.query('SELECT * FROM Sales ORDER BY SaleID DESC');
  res.json({ success: true, data: sales });
});
