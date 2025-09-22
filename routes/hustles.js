const express = require('express');
const {
body, validationResult }
= require('express-validator');
const Hustle = require('../models/HustleModel');
const {
protect }
= require('../middleware/auth');
const router = express.Router();
router.get('/',

  protect,

  async (req, res) => {
try {
const {
page = 1, 
        limit = 10, 
        sortBy = 'createdAt', 
        sortOrder = 'desc',
        status,
        category
      }
= req.query;
const skip = (page - 1) * limit;
const f = {
userId: req.user._id }
;
if (status) 
        f.status = status;
if (category) 
        f.category = category;
const sort = {
}
;
sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
const stuff = await Hustle.findWithPagination(f, {
page: parseInt(page),
        limit: parseInt(limit),
        sort
      }
);
res.json({
status: 'success',
        data: {
hustles: stuff.data,
          pagination: {
page: stuff.page,
            limit: stuff.limit,
            total: stuff.total,
            pages: stuff.pages
          }
}
}
);
}
catch (e) {
console.log('get hustles er');
res.status(500).json({
status: 'error',
        message: 'Server error while fetching hustles'
      }
);
}
}
);
router.get('/:id', protect, async (req, res) => {
try {
const found = await Hustle.findById(req.params.id);
if (!found || found.userId.toString() !== req.user._id.toString()) {
return res.status(404).json({
status: 'error',
          message: 'Hustle not found'
        }
);
}
res.json({
status: 'success',
        data: {
hustle: found }
}
);
}
catch (e) {
console.log('get hustle by id er');
res.status(500).json({
status: 'error',
        message: 'Server error while fetching hustle'
      }
);
}
}
);
router.post('/',
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({
max: 200 }
)
      .withMessage('Title cannot exceed 200 characters'),
    body('description')
      .trim()
      .notEmpty()
      .withMessage('Description is required')
      .isLength({
max: 1000 }
)
      .withMessage('Description cannot exceed 1000 characters'),
    body('category')
      .isIn([
        'Freelancing',
        'Part-time',
        'Contract',
        'Gig Work',
        'Consulting',
        'Tutoring',
        'Content Creation',
        'E-commerce',
        'Sales',
        'Marketing',
        'Other'
      ])
      .withMessage('Invalid category'),
    body('hourlyRate')
      .isFloat({
min: 0 }
)
      .withMessage('Hourly rate must be a positive number'),
    body('skills')
      .isArray()
      .withMessage('Skills must be an array'),
    body('goals.monthlyEarnings')
      .optional()
      .isFloat({
min: 0 }
)
      .withMessage('Monthly earnings goal must be a positive number'),
    body('goals.monthlyHours')
      .optional()
      .isFloat({
min: 0 }
)
      .withMessage('Monthly hours goal must be a positive number')
  ],
  protect,

  async (req, res) => {
try {
const errs = validationResult(req);
if (!errs.isEmpty()) {
return res.status(400).json({
status: 'error',
          message: 'Validation failed',
          errors: errs.array()
        }
);
}
const stuff = {
...req.body,
        userId: req.user._id
      }
;
const made = await Hustle.create(stuff);
res.status(201).json({
status: 'success',
        message: 'Hustle created successfully',
        data: {
hustle: made }
}
);
}
catch (e) {
console.log('creat hustle er');
res.status(500).json({
status: 'error',
        message: 'Server error while creating hustle'
      }
);
}
}
);
router.put('/:id',
  [
    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Title cannot be empty')
      .isLength({
max: 200 }
)
      .withMessage('Title cannot exceed 200 characters'),
    body('description')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Description cannot be empty')
      .isLength({
max: 1000 }
)
      .withMessage('Description cannot exceed 1000 characters'),
    body('category')
      .optional()
      .isIn([
        'Freelancing',
        'Part-time',
        'Contract',
        'Gig Work',
        'Consulting',
        'Tutoring',
        'Content Creation',
        'E-commerce',
        'Sales',
        'Marketing',
        'Other'
      ])
      .withMessage('Invalid category'),
    body('hourlyRate')
      .optional()
      .isFloat({
min: 0 }
)
      .withMessage('Hourly rate must be a positive number'),
    body('skills')
      .optional()
      .isArray()
      .withMessage('Skills must be an array'),
    body('goals.monthlyEarnings')
      .optional()
      .isFloat({
min: 0 }
)
      .withMessage('Monthly earnings goal must be a positive number'),
    body('goals.monthlyHours')
      .optional()
      .isFloat({
min: 0 }
)
      .withMessage('Monthly hours goal must be a positive number')
  ],
  protect,

  async (req, res) => {
try {
const errz = validationResult(req);
if (!errz.isEmpty()) {
return res.status(400).json({
status: 'error',
          message: 'Validation failed',
          errors: errz.array()
        }
);
}
const {
id }
= req.params;
const up = req.body;
const exist = await Hustle.findById(id);
if (!exist || exist.userId.toString() !== req.user._id.toString()) {
return res.status(404).json({
status: 'error',
          message: 'Hustle not found or unauthorized'
        }
);
}
const upHustle = await Hustle.updateById(id, up);
res.json({
status: 'success',
        message: 'Hustle updated successfully',
        data: {
hustle: upHustle }
}
);
}
catch (e) {
console.log('update hustle er');
res.status(500).json({
status: 'error',
        message: 'Server error while updating hustle'
      }
);
}
}
);
router.delete('/:id', protect, async (req, res) => {
try {
const {
id }
= req.params;
const old = await Hustle.findById(id);
if (!old || old.userId.toString() !== req.user._id.toString()) {
return res.status(404).json({
status: 'error',
          message: 'Hustle not found or unauthorized'
        }
);
}
await Hustle.deleteById(id);
res.json({
status: 'success',
        message: 'Hustle deleted successfully'
      }
);
}
catch (e) {
console.log('delete hustle er');
res.status(500).json({
status: 'error',
        message: 'Server error while deleting hustle'
      }
);
}
}
);
module.exports = router;
