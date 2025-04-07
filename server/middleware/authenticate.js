// middleware/authenticate.js
const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Auth Error: No token' });
    }
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // Change req.user to req.userId
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Auth Error: Invalid token' });
    }
};

module.exports = authenticate;