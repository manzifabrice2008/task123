const bcrypt = require('bcrypt');
const { initPool: pool } = require('../config/database');
const AppError = require('../utils/AppError');
const { catchAsync } = require('../utils/helpers');

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError('Username and password are required', 400));
  }

  const [rows] = await pool.query(
    'SELECT * FROM Users WHERE UserName = ?',
    [username]
  );

  if (rows.length === 0) {
    return next(new AppError('Invalid username or password', 401));
  }

  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.Password);

  if (!isMatch) {
    return next(new AppError('Invalid username or password', 401));
  }

  req.session.userId = user.UserID;
  req.session.username = user.UserName;

  res.json({
    success: true,
    message: 'Login successful',
    user: { id: user.UserID, username: user.UserName },
  });
});

exports.logout = catchAsync((req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(new AppError('Failed to logout', 500));
    }
    res.clearCookie('connect.sid');
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

exports.checkSession = catchAsync((req, res) => {
  if (req.session && req.session.userId) {
    return res.json({
      success: true,
      user: { id: req.session.userId, username: req.session.username },
    });
  }
  res.json({ success: false, message: 'No active session' });
});
