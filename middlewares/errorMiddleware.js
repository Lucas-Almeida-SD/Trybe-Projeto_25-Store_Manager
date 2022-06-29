const httpStatus = require('../helpers/httpStatus');

const errorMiddleware = (err, req, res, _next) => {
  const { code, message } = err;

  res.status(httpStatus[code]).json({ message });
};

module.exports = errorMiddleware;
