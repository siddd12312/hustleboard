const express = require('express');
const {
body , validationResult }
= require('express-validator');
const Opportunity = require('../models/OpportunityModel');
const User = require('../models/UserModel');
const {
protect , optionalAuth }
= require('../middleware/auth');
const router = express.Router();
router.get('/' , optionalAuth , async (req, res) => {
try {
const {
page = 1, 
      limit = 10, 
      category, 
      type, 
      location, 
      skills,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minCompensation,
      maxCompensation
    }
= req.query;
const skip = (page - 1) * limit;
const f = {
}
;
if (category) f.category = category;
if (type) f.type = type;
if (location) {
f.location = location;
}
if (skills) {
const skillsArr = skills.split(',').map(s => s.trim());
f.requiredSkills = skillsArr[0];
}
if (search) {
f.search = search;
}
if (minCompensation || maxCompensation) {
if (minCompensation) f.minCompensation = parseFloat(minCompensation);
if (maxCompensation) f.maxCompensation = parseFloat(maxCompensation);
}
const srt = {
}
;
srt[sortBy] = sortOrder === 'desc' ? -1 : 1;
const result = await Opportunity.findWithPagination(f, {
page: parseInt(page),

      limit: parseInt(limit),

      sort: srt

    }
);
const opps = [];
for (const opp of result.data) {
const pb = await User.findById(opp.postedBy);
if (pb) {
opp.postedBy = {
_id: pb._id,

          firstName: pb.firstName,

          lastName: pb.lastName,

          profilePicture: pb.profilePicture

        }
;
}
opps.push(opp);
}
res.json({
status: 'success',

      data: {
opportunities: opps,

        pagination: {
page: result.page,

          limit: result.limit,

          total: result.total,

          pages: result.pages

        }
}
}
);
}
catch (err) {
console.log('get ops err', err);
res.status(500).json({
status: 'error',

      message: 'Server error while fetching opportunities'

    }
);
}
}
);
router.get('/:id', optionalAuth, async (req, res) => {
try {
const opp = await Opportunity.findById(req.params.id);
if (!opp) {
return res.status(404).json({
status: 'error',

        message: 'Opportunity not found'

      }
);
}
opp.viewCount += 1;
await opp.save({
validateBeforeSave: false }
);
res.json({
status: 'success',

      data: {
opportunity: opp }
}
);
}
catch (err) {
console.log('get op err', err);
res.status(500).json({
status: 'error',

      message: 'Server error while fetching opportunity'

    }
);
}
}
);
router.post('/', [

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
max: 2000 }
)

    .withMessage('Description cannot exceed 2000 characters'),

  body('company')

    .trim()

    .notEmpty()

    .withMessage('Company is required')

    .isLength({
max: 100 }
)

    .withMessage('Company name cannot exceed 100 characters'),

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

  body('type')

    .isIn(['Remote', 'On-site', 'Hybrid'])

    .withMessage('Invalid type'),

  body('compensation.min')

    .optional()

    .isFloat({
min: 0 }
)

    .withMessage('Minimum compensation must be a positive number'),

  body('compensation.max')

    .optional()

    .isFloat({
min: 0 }
)

    .withMessage('Maximum compensation must be a positive number'),

  body('applicationDeadline')

    .isISO8601()

    .withMessage('Application deadline must be a valid date'),

  body('startDate')

    .isISO8601()

    .withMessage('Start date must be a valid date')

], protect, async (req, res) => {
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
const opData = {
...req.body,

      postedBy: req.user._id

    }
;
const op = await Opportunity.create(opData);
res.status(201).json({
status: 'success',

      message: 'Opportunity created successfully',

      data: {
opportunity: op }
}
);
}
catch (err) {
console.log('crt op err', err);
res.status(500).json({
status: 'error',

      message: 'Server error while creating opportunity'

    }
);
}
}
);
router.post('/:id/apply', [

  body('coverLetter')

    .optional()

    .trim()

    .isLength({
max: 1000 }
)

    .withMessage('Cover letter cannot exceed 1000 characters'),

  body('resume')

    .optional()

    .isURL()

    .withMessage('Resume must be a valid URL')

], protect, async (req, res) => {
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
const {
coverLetter, resume }
= req.body;
const opp = await Opportunity.findById(req.params.id);
if (!opp) {
return res.status(404).json({
status: 'error',

        message: 'Opportunity not found'

      }
);
}
if (opp.status !== 'Active') {
return res.status(400).json({
status: 'error',

        message: 'This opportunity is no longer accepting applications'

      }
);
}
if (new Date(opp.applicationDeadline) < new Date()) {
return res.status(400).json({
status: 'error',

        message: 'Application deadline has passed'

      }
);
}
const existApp = opp.applications.find(

      ap => ap.userId.toString() === req.user._id.toString()

    );
if (existApp) {
return res.status(400).json({
status: 'error',

        message: 'You have already applied to this opportunity'

      }
);
}
opp.applications.push({
userId: req.user._id,

      coverLetter,

      resume,

      status: 'Applied'

    }
);
opp.applicationCount += 1;
await opp.save();
res.json({
status: 'success',

      message: 'Application submitted successfully'

    }
);
}
catch (err) {
console.log('apply op err', err);
res.status(500).json({
status: 'error',

      message: 'Server error while applying to opportunity'

    }
);
}
}
);
router.get('/categories', async (req, res) => {
try {
const cts = await Opportunity.distinct('category');
res.json({
status: 'success',

      data: {
categories: cts }
}
);
}
catch (err) {
console.log('get cats err', err);
res.status(500).json({
status: 'error',

      message: 'Server error while fetching categories'

    }
);
}
}
);
router.get('/skills', async (req, res) => {
try {
const sks = await Opportunity.distinct('requiredSkills');
res.json({
status: 'success',

      data: {
skills: sks.filter(s => s && s.trim()) }
}
);
}
catch (err) {
console.log('get sks err', err);
res.status(500).json({
status: 'error',

      message: 'Server error while fetching skills'

    }
);
}
}
);
router.get('/my-applications', protect, async (req, res) => {
try {
const {
page = 1, limit = 10, status }
= req.query;
const skip = (page - 1) * limit;
const f = {
'applications.userId': req.user._id

    }
;
if (status) {
f['applications.status'] = status;
}
const opps = await Opportunity.find(f);
const apps = opps.map(o => {
const userApp = o.applications.find(

        a => a.userId.toString() === req.user._id.toString()

      );
return {
opportunity: {
_id: o._id,

          title: o.title,

          company: o.company,

          category: o.category,

          type: o.type,

          location: o.location,

          applicationDeadline: o.applicationDeadline,

          postedBy: o.postedBy

        }
,

        application: userApp

      }
;
}
);
const tot = await Opportunity.countDocuments(f);
res.json({
status: 'success',

      data: {
applications: apps,

        pagination: {
page: parseInt(page),

          limit: parseInt(limit),

          total: tot,

          pages: Math.ceil(tot / limit)

        }
}
}
);
}
catch (err) {
console.log('get my apps err', err);
res.status(500).json({
status: 'error',

      message: 'Server error while fetching applications'

    }
);
}
}
);
module.exports = router;
