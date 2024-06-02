const jwt = require('jsonwebtoken');
const Blacklist = require('../models/blacklist');
// require('dotenv').config();

const authenticateToken = async(req, res, next) => {
    const token = req.cookies.jwtoken;

    if (!token) {
        return res.status(403).json({ success: false, msg: 'Access denied. No token provided.' });
    }
    const Blacklistedtoken = await Blacklist.findOne({token})
    if (Blacklistedtoken) {

        console.log('your are logged out')
        res.redirect('/login')
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.student = decoded.user; // Attach user info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ success: false, msg: 'Invalid token.' });
    }
};

module.exports = authenticateToken;
