const AppError = require('../utils/AppError');

const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  return next(new AppError('Unauthorized. Please log in.', 401));
};

module.exports = { requireAuth };
