const express = require('express');
const {
body, validationResult }
= require('express-validator');
const Earning = require('../models/EarningModel');
const {
protect }
= require('../middleware/auth');
const router = express.Router();
router.get('/',
 protect,
 async (req, res) => {
try 
  {
const {
page = 1, 
      limit = 10, 
      sortBy = 'date', 
      sortOrder = 'desc',
      category,
      hustleId,
      startDate,
      endDate
    }
= req.query;
const skip = (page - 1) * limit;
let fltr = {
userId: req.user._id }
;
if (category) fltr.category = category;
if (hustleId) fltr.hustleId = hustleId;
if (startDate || endDate) {
fltr.date = {
}
;
if (startDate) fltr.date.$gte = new Date(startDate);
if (endDate) fltr.date.$lte = new Date(endDate);
}
let srt = {
}
;
srt[sortBy] = sortOrder === 'desc' ? -1 : 1;
const rslt = await Earning.findWithPagination(fltr, {
page: parseInt(page),
      limit: parseInt(limit),
      sort: srt
    }
);
res.json({
success: true,
      data: {
earnings: rslt.data,
        pagination: {
page: rslt.page,
          limit: rslt.limit,
          total: rslt.total,
          pages: rslt.pages
        }
}
}
);
}
catch (e) {
console.log('get err');
res.status(500).json({
success: false,

      message: 'Server error while fetching earnings'

    }
);
}
}
);
router.post('/',
[
  body('hustleId')
    .notEmpty()
    .withMessage('Hustle ID is required'),
  body('amount')
    .isFloat({
min: 0 }
)
    .withMessage('Amount must be a positive number'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({
max: 500 }
)
    .withMessage('Description cannot exceed 500 characters'),
  body('category')
    .optional()
    .isLength({
max: 100 }
)
    .withMessage('Category cannot exceed 100 characters'),
  body('paymentMethod')
    .optional()
    .isLength({
max: 50 }
)
    .withMessage('Payment method cannot exceed 50 characters'),
  body('hoursWorked')
    .optional()
    .isFloat({
min: 0 }
)
    .withMessage('Hours worked must be a positive number'),
  body('date')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date')
],
 protect,
 async (req, res) => {
try 
  {
const errs = validationResult(req);
if (!errs.isEmpty()) {
return res.status(400).json({
success: false,

        message: 'Validation failed',

        errors: errs.array()

      }
);
}
let earnDt = {
...req.body,
      userId: req.user._id
    }
;
const earn = await Earning.create(earnDt);
res.status(201).json({
success: true,

      message: 'Earning logged successfully',

      data: {
earning: earn }
}
);
}
catch (e) {
console.log('crt err');
res.status(500).json({
success: false,
      message: 'Server error while creating earning'
    }
);
}
}
);
router.get('/summary', protect, async (req, res) => {
try 
  {
const {
period = 'month', year, month }
= req.query;
const userId = req.user._id;
let stDt, enDt;
const now = new Date();
if (period === 'month' && year && month) {
stDt = new Date(year, month - 1, 1);
enDt = new Date(year, month, 0);
}
else if (period === 'year' && year) {
stDt = new Date(year, 0, 1);
enDt = new Date(year, 11, 31);
}
else 
    {
stDt = new Date(now.getFullYear(), now.getMonth(), 1);
enDt = new Date(now.getFullYear(), now.getMonth() + 1, 0);
}
const earns = await Earning.find({
userId,

      date: {
$gte: stDt, $lte: enDt }
}
);
const totEarn = earns.reduce((s, e) => s + e.amount, 0);
const totHrs = earns.reduce((s, e) => s + e.hoursWorked, 0);
const avrH = totHrs > 0 ? totEarn / totHrs : 0;
res.json({
success: true,

      data: {
period: {
startDate: stDt, endDate: enDt, type: period }
,
        totalEarnings: totEarn,
        totalHours: totHrs,
        avgHourlyRate: Math.round(avrH * 100) / 100,
        transactionCount: earns.length
      }
}
);
}
catch (e) {
console.log('summ err');
res.status(500).json({
success: false,
      message: 'Server error while fetching earnings summary'
    }
);
}
}
);
router.put('/:id',
[
  body('amount')
    .optional()
    .isFloat({
min: 0 }
)
    .withMessage('Amount must be a positive number'),
  body('description')
    .optional()
    .trim()
    .isLength({
max: 500 }
)
    .withMessage('Description cannot exceed 500 characters'),
  body('category')
    .optional()
    .isLength({
max: 100 }
)
    .withMessage('Category cannot exceed 100 characters'),
  body('hoursWorked')
    .optional()
    .isFloat({
min: 0 }
)
    .withMessage('Hours worked must be a positive number')
],
 protect,
 async (req, res) => {
try 
  {
const errs = validationResult(req);
if (!errs.isEmpty()) {
return res.status(400).json({
success: false,
        message: 'Validation failed',
        errors: errs.array()
      }
);
}
const earn = await Earning.findById(req.params.id);
if (!earn) {
return res.status(404).json({
success: false,
        message: 'Earning not found'
      }
);
}
if (earn.userId !== req.user._id) {
return res.status(403).json({
success: false,
        message: 'Not authorized to update this earning'
      }
);
}
const updEarn = await Earning.updateById(req.params.id, req.body);
res.json({
success: true,
      message: 'Earning updated successfully',
      data: {
earning: updEarn }
}
);
}
catch (e) {
console.log('upd err');
res.status(500).json({
success: false,
      message: 'Server error while updating earning'
    }
);
}
}
);
router.delete('/:id', protect, async (req, res) => {
try 
  {
const earn = await Earning.findById(req.params.id);
if (!earn) {
return res.status(404).json({
success: false,
        message: 'Earning not found'
      }
);
}
if (earn.userId !== req.user._id) {
return res.status(403).json({
success: false,
        message: 'Not authorized to delete this earning'
      }
);
}
await Earning.deleteById(req.params.id);
res.json({
success: true,
      message: 'Earning deleted successfully'
    }
);
}
catch (e) {
console.log('del err');
res.status(500).json({
success: false,
      message: 'Server error while deleting earning'
    }
);
}
}
);
module.exports = router;
