const AppError = require('./AppError');

const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

const notFound = (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};

module.exports = { catchAsync, notFound };
