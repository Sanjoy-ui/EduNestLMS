import jwt from 'jsonwebtoken';

// Public endpoint prefixes (no mandatory authentication required)
const PUBLIC_PREFIXES = [
  '/healthz',
  '/api/v1/auth',
  '/api/auth',
  '/api/v1/course/getpublishedcoures',
  '/api/course/getpublishedcoures',
  '/api/v1/course/getcourse',
  '/api/course/getcourse',
  '/api/v1/course/getcreator',
  '/api/course/getcreator',
  '/api/v1/review/allReview',
  '/api/review/allReview',
  '/api/v1/ai/search',
  '/api/ai/search',
  '/api/v1/user/currentuser',
  '/api/user/currentuser'
];

export const verifyGatewayAuth = (req, res, next) => {
  // Always allow CORS preflight OPTIONS requests to pass through untouched
  if (req.method === 'OPTIONS') {
    return next();
  }

  const path = req.path;

  // Extract token from cookies or Authorization header
  let token = req.cookies?.token;

  if (!token && req.headers.authorization) {
    if (req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else {
      token = req.headers.authorization;
    }
  }

  // Check if current path starts with any public endpoint prefix
  const isPublic = PUBLIC_PREFIXES.some(prefix => path.startsWith(prefix));

  if (isPublic) {
    // If token exists on a public path, decode it and pass x-user-id anyway
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.userId = decoded.userId || decoded.id;
        req.headers['x-user-id'] = req.userId;
      } catch (err) {
        // Ignore token decode errors on public paths
      }
    }
    return next();
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. Token missing.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = decoded.userId || decoded.id;

    // Attach decoded user ID to request headers forwarded to downstream microservicess
    req.headers['x-user-id'] = req.userId;
    next();
  } catch (error) {
    console.error('API Gateway Auth Verification Failed:', error.message);
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};

export default verifyGatewayAuth;
