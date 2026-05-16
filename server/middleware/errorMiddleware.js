/**
 * errorMiddleware.js
 * Centralized error handling for Express.
 */

const errorHandler = (err, req, res, next) => {
  // Log full error in server console
  console.error(err);

  // If response status was already set (e.g., 400), preserve it; otherwise default to 500
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    // include stack trace in non-production environments
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { errorHandler };
