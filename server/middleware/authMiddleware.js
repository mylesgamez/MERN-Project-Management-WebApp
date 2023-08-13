const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    console.log('Authorization Header:', req.header('Authorization'));
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Updated here
        req.userId = decoded._id; // Attach the user ID to the request object
        next();
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

module.exports = authMiddleware;
