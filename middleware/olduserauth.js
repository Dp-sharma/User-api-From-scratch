const jwt = require('jsonwebtoken')
const Blacklist = require('../models/blacklist')


const olduserauth = async(req, res, next) => {
    const token = req.cookies.jwtoken;

    if (!token) {
        next();
    }
    else{
        const Blacklistedtoken = await Blacklist.findOne({token})
    if (Blacklistedtoken) {

        console.log('your are logged out')
        res.redirect('/login')
    }
    else{
        try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.student = decoded.user; // Attach user info to the request object
        // next(); // Proceed to the next middleware or route handler
        res.redirect('/myprofile')
    } catch (error) {
        return res.status(401).json({ success: false, msg: 'Invalid token.' });
    }
    }
    }
    
    
};

module.exports = olduserauth;