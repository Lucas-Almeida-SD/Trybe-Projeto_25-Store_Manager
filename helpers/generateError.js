const generateError = (code, message) => (
  {
    error: {
      code,
      message,
    },
  }
);

module.exports = generateError;