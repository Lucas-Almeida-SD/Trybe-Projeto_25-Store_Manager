const httpStatus = require('../helpers/httpStatus');

const errorMiddleware = (err, req, res, _next) => {
  if (err.code && err.message) {
    const { code, message } = err;
    return res.status(httpStatus[code]).json({ message });
  }

  const message = 'Internal Server Error';
  res.status(httpStatus.internalServerError).json({ message });
};

module.exports = errorMiddleware;
