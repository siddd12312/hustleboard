const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const protect = async (req, res, next) => {
try 
    {
let tkn ;
if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
tkn = req.headers.authorization.split(' ')[1];
}
if (!tkn && req.cookies && req.cookies.token) {
tkn = req.cookies.token;
}
if (!tkn) {
return res.status(401)
        .json(
          {
success: false,
            message: 'Access denied. No token provided.'
          }
);
}
try 
      {
const dec = jwt.verify(tkn, process.env.JWT_SECRET || 'fallback-secret');
const usr = await User.findById(dec.id);
if (!usr) {
return res.status(401).json(
            {
success: false,
              message: 'Token is valid but user no longer exists'
            }
);
}
if (!usr.isActive) {
return res.status(401)
          .json(
            {
success: false,
              message: 'Account has been deactivated'
            }
);
}
req.user = usr;
next();
}
catch (e) {
return res.status(401)
        .json(
          {
success: false,
            message: 'Invalid token'
          }
);
}
}
catch (e) {
console.error('Auth middleware error:', e);
return res.status(500)
      .json(
        {
success: false,
          message: 'Server error during authentication'
        }
);
}
}
;
const optionalAuth = async (req, res, next) => {
try 
    {
let tokn ;
if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
tokn = req.headers.authorization.split(' ')[1];
}
if (req.cookies && req.cookies.token) {
tokn = req.cookies.token;
}
if (tokn) {
try 
        {
const decd = jwt.verify(tokn, process.env.JWT_SECRET || 'fallback-secret');
const usr2 = await User.findById(decd.id);
if (usr2 && usr2.isActive) {
req.user = usr2;
}
}
catch (er) {
console.log('bad tokn');
}
}
next();
}
catch (er) {
console.error('Optional auth middleware error:', er);
next();
}
}
;
module.exports = {
protect,
  optionalAuth
}
;
