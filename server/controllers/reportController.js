const { initPool: pool } = require('../config/database');
const { catchAsync } = require('../utils/helpers');

exports.dailyReport = catchAsync(async (req, res) => {
  const { date } = req.query;
  const reportDate = date || new Date().toISOString().split('T')[0];

  const [rows] = await pool.query(
    `SELECT 
       s.SaleDate,
       s.CustomerName,
       i.ItemName,
       i.Specification,
       i.UnitMeasure,
       sd.UnitPrice,
       sd.QuantitySold,
       sd.SubTotalPrice
     FROM Sales s
     JOIN SalesDetail sd ON s.SaleID = sd.SaleID
     JOIN Items i ON sd.ItemID = i.ItemID
     WHERE s.SaleDate = ?
     ORDER BY s.SaleID, sd.SalesDetailID`,
    [reportDate]
  );

  const totalAmount = rows.reduce((sum, r) => sum + parseFloat(r.SubTotalPrice), 0);

  res.json({
    success: true,
    data: rows,
    totalAmount,
    reportDate,
  });
});

exports.monthlyReport = catchAsync(async (req, res) => {
  const { year, month } = req.query;
  const reportYear = year || new Date().getFullYear();
  const reportMonth = month || new Date().getMonth() + 1;

  const [rows] = await pool.query(
    `SELECT 
       s.SaleDate,
       s.CustomerName,
       i.ItemName,
       i.Specification,
       i.UnitMeasure,
       sd.UnitPrice,
       sd.QuantitySold,
       sd.SubTotalPrice
     FROM Sales s
     JOIN SalesDetail sd ON s.SaleID = sd.SaleID
     JOIN Items i ON sd.ItemID = i.ItemID
     WHERE YEAR(s.SaleDate) = ? AND MONTH(s.SaleDate) = ?
     ORDER BY s.SaleDate, sd.SalesDetailID`,
    [reportYear, reportMonth]
  );

  const totalAmount = rows.reduce((sum, r) => sum + parseFloat(r.SubTotalPrice), 0);

  res.json({
    success: true,
    data: rows,
    totalAmount,
    reportYear,
    reportMonth,
  });
});

exports.dashboardStats = catchAsync(async (req, res) => {
  const today = new Date().toISOString().split('T')[0];

  const [totalItems] = await pool.query(
    'SELECT COUNT(*) as count FROM Items'
  );
  const [totalSales] = await pool.query(
    'SELECT COUNT(*) as count FROM Sales'
  );
  const [totalRevenue] = await pool.query(
    'SELECT COALESCE(SUM(TotalPrice), 0) as total FROM Sales'
  );
  const [todaySales] = await pool.query(
    'SELECT COALESCE(SUM(TotalPrice), 0) as total FROM Sales WHERE SaleDate = ?',
    [today]
  );
  const [recentSales] = await pool.query(
    'SELECT * FROM Sales ORDER BY SaleID DESC LIMIT 5'
  );
  const [lowStock] = await pool.query(
    'SELECT * FROM Items WHERE Quantity < 10 ORDER BY Quantity ASC LIMIT 5'
  );

  const [dailySales] = await pool.query(
    `SELECT SaleDate, SUM(TotalPrice) as total 
     FROM Sales 
     GROUP BY SaleDate 
     ORDER BY SaleDate DESC 
     LIMIT 7`
  );

  const [monthlySales] = await pool.query(
    `SELECT DATE_FORMAT(SaleDate, '%Y-%m') as month, SUM(TotalPrice) as total 
     FROM Sales 
     GROUP BY DATE_FORMAT(SaleDate, '%Y-%m') 
     ORDER BY month DESC 
     LIMIT 6`
  );

  res.json({
    success: true,
    data: {
      totalItems: totalItems[0].count,
      totalSales: totalSales[0].count,
      totalRevenue: totalRevenue[0].total,
      todaySales: todaySales[0].total,
      recentSales,
      lowStock,
      dailySales: dailySales.reverse(),
      monthlySales: monthlySales.reverse(),
    },
  });
});
