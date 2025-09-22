const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
body , validationResult }
= require('express-validator');
const User = require('../models/UserModel');
const router = express.Router();
router.post('/register', [

  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({
min: 2, max: 50 }
)
    .withMessage('First name must be between 2 and 50 characters'),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({
min: 2, max: 50 }
)
    .withMessage('Last name must be between 2 and 50 characters'),

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),

  body('password')
    .isLength({
min: 6 }
)
    .withMessage('Password must be at least 6 characters long')

], async (req, res) => {
try {
const errs = validationResult(req);
if (!errs.isEmpty()) {
return res.status(400).json({
success: false,

        message: 'Validation failed',

        errors: errs.array()

      }
);
}
const {
firstName , lastName , email , password }
= req.body;
const userFind = await User.findByEmail(email);
if (userFind) {
return res.status(400).json({
success: false,

        message: 'User already exists with this email'

      }
);
}
const sr = 12;
const pwdHash = await bcrypt.hash(password, sr);
const dataUser = {
firstName,

      lastName,

      email,

      password: pwdHash,

      isActive: true

    }
;
const userNew = await User.create(dataUser);
const tok = jwt.sign(

      {
id: userNew._id }
,

      process.env.JWT_SECRET || 'fallback-secret',

      {
expiresIn: process.env.JWT_EXPIRE || '7d' }
);
const userRes = {
...userNew }
;
delete userRes.password;
res.status(201).json({
status: 'success',

      message: 'User registered successfully',

      data: {
user: userRes,

        token: tok

      }
}
);
}
catch (err) {
console.log('reg err');
res.status(500).json({
success: false,

      message: 'Server error during registration'

    }
);
}
}
);
router.post('/login', [

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')

], async (req, res) => {
try {
const errs = validationResult(req);
if (!errs.isEmpty()) {
return res.status(400).json({
success: false,

        message: 'Validation failed',

        errors: errs.array()

      }
);
}
const {
email , password }
= req.body;
const user = await User.findByEmail(email);
if (!user) {
return res.status(401).json({
status: 'error',

        message: 'Invalid email or password'

      }
);
}
if (!user.isActive) {
return res.status(401).json({
status: 'error',

        message: 'Account has been deactivated'

      }
);
}
const passOk = await bcrypt.compare(password, user.password);
if (!passOk) {
return res.status(401).json({
status: 'error',

        message: 'Invalid email or password'

      }
);
}
await User.updateById(user._id, {
lastLogin: new Date().toISOString()

    }
);
const tok = jwt.sign(

      {
id: user._id }
,

      process.env.JWT_SECRET || 'fallback-secret',

      {
expiresIn: process.env.JWT_EXPIRE || '7d' }
);
const userRes = {
...user }
;
delete userRes.password;
res.json({
status: 'success',

      message: 'Login successful',

      data: {
user: userRes,

        token: tok

      }
}
);
}
catch (err) {
console.log('logn err');
res.status(500).json({
success: false,

      message: 'Server error during login'

    }
);
}
}
);
router.get('/me', async (req, res) => {
try {
let tok;
if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
tok = req.headers.authorization.split(' ')[1];
}
if (!tok && req.cookies && req.cookies.token) {
tok = req.cookies.token;
}
if (!tok) {
return res.status(401).json({
success: false,

        message: 'Access denied. No token provided.'

      }
);
}
try {
const dec = jwt.verify(tok, process.env.JWT_SECRET || 'fallback-secret');
const user = await User.findById(dec.id);
if (!user) {
return res.status(401).json({
success: false,

          message: 'Token is valid but user no longer exists'

        }
);
}
if (!user.isActive) {
return res.status(401).json({
success: false,

          message: 'Account has been deactivated'

        }
);
}
const userRes = {
...user }
;
delete userRes.password;
res.json({
success: true,

        data: {
user: userRes

        }
}
);
}
catch (err) {
return res.status(401).json({
success: false,

        message: 'Invalid token'

      }
);
}
}
catch (err) {
console.log('getme err');
res.status(500).json({
success: false,

      message: 'Server error during authentication'

    }
);
}
}
);
module.exports = router;
