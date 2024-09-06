const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2, // limit each IP to 50 requests per windowMs
  message: 'Too many requests from this IP, please try again after an hour',
  statusCode: 429,
  skipSuccessfulRequests: false,
  skipFailedRequests: true,
});

module.exports = limiter;

