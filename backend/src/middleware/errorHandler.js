function errorHandler(err, req, res, next) {
  // If response already sent, delegate to default handler
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;
  const message = err.message || 'Something went wrong';

  console.error(`[Error] ${status}: ${message}`, err.stack);
  return res.status(status).json({ message });
}

module.exports = errorHandler;

