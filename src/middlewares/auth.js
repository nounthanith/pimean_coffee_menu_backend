const jwt = require('jsonwebtoken');

// Extract Bearer token from Authorization header
const getTokenFromHeader = (req) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2) return null;
  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) return null;
  return token;
};

// Verify JWT and attach payload to req.user
const verifyToken = (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ success: false, message: 'JWT secret not configured' });
    }
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Require at least one of the roles
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthenticated' });
  }
  const userRole = req.user.role;
  if (!roles.length) return next();
  if (!userRole || !roles.includes(userRole)) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  return next();
};

// Shortcut for admin-only
const requireAdmin = requireRole('admin');

module.exports = {
  verifyToken,
  requireRole,
  requireAdmin,
};
