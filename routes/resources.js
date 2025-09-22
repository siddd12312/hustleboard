const express = require('express');
const {
body , validationResult }
= require('express-validator');
const Resource = require('../models/ResourceModel');
const User = require('../models/UserModel');
const {
protect, optionalAuth }
= require('../middleware/auth');
const router = express.Router();
router.get('/' , optionalAuth , async (req, res) => {
try {
const {
page = 1, 

       limit = 10, 

       category, 

       type, 

       difficulty,

       cost,

       skills,

       search,

       sortBy = 'createdAt',

       sortOrder = 'desc',

       featured

     }
= req.query;
const skip = (page - 1) * limit;
const flt = {
isActive: true }
;
if (category) flt.category = category;
if (type) flt.type = type;
if (difficulty) flt.difficulty = difficulty;
if (cost) flt.cost = cost;
if (skills) {
const arrSkills = skills.split(',').map(s => s.trim());
flt.skills = {
$in: arrSkills }
;
}
if (search) {
flt.$text = {
$search: search }
;
}
if (featured === 'true') {
flt.featured = true;
}
const srt = {
}
;
if (sortBy === 'relevance' && search) {
srt.score = {
$meta: 'textScore' }
;
}
else if (sortBy === 'rating') {
srt['rating.average'] = sortOrder === 'desc' ? -1 : 1;
}
else if (sortBy === 'popularity') {
srt.viewCount = sortOrder === 'desc' ? -1 : 1;
}
else {
srt[sortBy] = sortOrder === 'desc' ? -1 : 1;
}
const result = await Resource.findWithPagination(flt, {
page: parseInt(page),

       limit: parseInt(limit),

       sort: srt

     }
);
res.json({
status: 'success',

       data: {
resources: result.data,

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
console.log('err get res');
res.status(500).json({
status: 'error',

       message: 'Server error while fetching resources'

     }
);
}
}
);
router.get('/:id', optionalAuth, async (req, res) => {
try {
const resrc = await Resource.findById(req.params.id);
if (!resrc) {
return res.status(404).json({
status: 'error',

        message: 'Resource not found'

      }
);
}
resrc.viewCount = resrc.viewCount + 1;
await resrc.save({
validateBeforeSave: false }
);
res.json({
status: 'success',

      data: {
resource: resrc }
}
);
}
catch (err) {
console.log('err get res');
res.status(500).json({
status: 'error',

      message: 'Server error while fetching resource'

    }
);
}
}
);
router.get('/recommendations', protect, async (req, res) => {
try {
const {
limit = 10 }
= req.query;
const userId = req.user._id;
const usr = await User.findById(userId);
const userSkills = usr.skills.map(x => x.name);
const bookdUsr = await User.findById(userId);
const bookdIds = bookdUsr.bookmarkedResources.map(r => r._id.toString());
const recs = await Resource.find({
isActive: true,

      _id: {
$nin: bookdIds }
,

      $or: [

        {
skills: {
$in: userSkills }
}
,

        {
category: {
$in: ['Freelancing', 'Skills Development', 'Business'] }
}
]

    }
);
res.json({
status: 'success',

      data: {
recommendations: recs }
}
);
}
catch (err) {
console.log('err get rec');
res.status(500).json({
status: 'error',

      message: 'Server error while fetching recommendations'

    }
);
}
}
);
router.post('/:id/bookmark', protect, async (req, res) => {
try {
const {
id }
= req.params;
const userId = req.user._id;
const resrc = await Resource.findById(id);
if (!resrc) {
return res.status(404).json({
status: 'error',

        message: 'Resource not found'

      }
);
}
const usr = await User.findById(userId);
if (usr.bookmarkedResources.includes(id)) {
return res.status(400).json({
status: 'error',

        message: 'Resource already bookmarked'

      }
);
}
usr.bookmarkedResources.push(id);
await usr.save();
resrc.bookmarkCount = resrc.bookmarkCount + 1;
await resrc.save({
validateBeforeSave: false }
);
res.json({
status: 'success',

      message: 'Resource bookmarked successfully'

    }
);
}
catch (err) {
console.log('err book');
res.status(500).json({
status: 'error',

      message: 'Server error while bookmarking resource'

    }
);
}
}
);
router.delete('/:id/bookmark', protect, async (req, res) => {
try {
const {
id }
= req.params;
const userId = req.user._id;
const usr = await User.findById(userId);
const idx = usr.bookmarkedResources.indexOf(id);
if (idx === -1) {
return res.status(400).json({
status: 'error',

        message: 'Resource not bookmarked'

      }
);
}
usr.bookmarkedResources.splice(idx, 1);
await usr.save();
const resrc = await Resource.findById(id);
if (resrc) {
resrc.bookmarkCount = Math.max(0, resrc.bookmarkCount - 1);
await resrc.save({
validateBeforeSave: false }
);
}
res.json({
status: 'success',

      message: 'Bookmark removed successfully'

    }
);
}
catch (err) {
console.log('err del book');
res.status(500).json({
status: 'error',

      message: 'Server error while removing bookmark'

    }
);
}
}
);
router.get('/user/bookmarks', protect, async (req, res) => {
try {
const {
page = 1, limit = 10 }
= req.query;
const skip = (page - 1) * limit;
const userId = req.user._id;
const usr = await User.findById(userId);
const total = usr.bookmarkedResources.length;
res.json({
status: 'success',

      data: {
bookmarks: usr.bookmarkedResources,

        pagination: {
page: parseInt(page),

          limit: parseInt(limit),

          total,

          pages: Math.ceil(total / limit)

        }
}
}
);
}
catch (err) {
console.log('err get book');
res.status(500).json({
status: 'error',

      message: 'Server error while fetching bookmarks'

    }
);
}
}
);
router.get('/categories', async (req, res) => {
try {
const categories = await Resource.distinct('category', {
isActive: true }
);
res.json({
status: 'success',

      data: {
categories }
}
);
}
catch (err) {
console.log('err cat');
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
const skills = await Resource.distinct('skills', {
isActive: true }
);
res.json({
status: 'success',

      data: {
skills: skills.filter(s => s && s.trim()) }
}
);
}
catch (err) {
console.log('err get sk');
res.status(500).json({
status: 'error',

      message: 'Server error while fetching skills'

    }
);
}
}
);
router.get('/featured', async (req, res) => {
try {
const {
limit = 6 }
= req.query;
const fRes = await Resource.find({
isActive: true,

      featured: true

    }
);
res.json({
status: 'success',

      data: {
resources: fRes }
}
);
}
catch (err) {
console.log('err get feat');
res.status(500).json({
status: 'error',

      message: 'Server error while fetching featured resources'

    }
);
}
}
);
router.post('/:id/rate', [

  body('rating')

    .isFloat({
min: 1, max: 5 }
)

    .withMessage('Rating must be between 1 and 5')

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
id }
= req.params;
const {
rating }
= req.body;
const userId = req.user._id;
const resrc = await Resource.findById(id);
if (!resrc) {
return res.status(404).json({
status: 'error',

        message: 'Resource not found'

      }
);
}
const nCount = resrc.rating.count + 1;
const nAvg = ((resrc.rating.average * resrc.rating.count) + rating) / nCount;
resrc.rating.average = Math.round(nAvg * 10) / 10;
resrc.rating.count = nCount;
await resrc.save();
res.json({
status: 'success',

      message: 'Resource rated successfully',

      data: {
rating: {
average: resrc.rating.average,

          count: resrc.rating.count

        }
}
}
);
}
catch (err) {
console.log('err rate');
res.status(500).json({
status: 'error',

      message: 'Server error while rating resource'

    }
);
}
}
);
module.exports = router;
