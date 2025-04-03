// middleware/authenticate.js
const jwt = require('jsonwebtoken');
const authenticate = async (req, res, next) => {
  // ... (JWT verification logic as shown before, attaching req.userId) ...
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'Auth Error: No token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) { return res.status(401).json({ message: 'Auth Error: Invalid token' }); }
};
module.exports = authenticate;