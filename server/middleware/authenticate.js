// Example server-side middleware (authenticate.js)
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
console.log(authHeader)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Auth Error: No token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        
        console.log("type of req.userId: ", typeof req.userId); //add this line
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error); // Log the error
        return res.status(401).json({ message: 'Auth Error: Invalid token' });
    }
};

module.exports = authenticate;