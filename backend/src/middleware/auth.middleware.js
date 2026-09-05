import { config } from '../config/env.js';

/**
 * JWT Authentication Middleware Stub
 * Verifies Bearer tokens for protected routes
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      // Note: Full JWT verify implementation will be connected with User model
      // Example: const decoded = jwt.verify(token, config.jwtSecret);
      // req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      res.status(401);
      return next(new Error('Not authorized, token failed verification'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no bearer token provided'));
  }
};
