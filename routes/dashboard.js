const express = require('express');
const User = require('../models/UserModel');
const Hustle = require('../models/HustleModel');
const Earning = require('../models/EarningModel');
const Opportunity = require('../models/OpportunityModel');
const {
protect }
= require('../middleware/auth');
const router = express.Router();
router.get('/metrics', protect, async (req, res) => {
try 
  {
const uId = req.user._id;
const usr = await User.findById(uId);
const hstls = await Hustle.find({
userId: uId }
);
const hStats = [{
totalHustles: hstls.length,

      activeHustles: hstls.filter(x => x.status === 'Active').length

    }
];
const n = new Date();
const cMStart = new Date(n.getFullYear(), n.getMonth(), 1);
const cMEnd = new Date(n.getFullYear(), n.getMonth() + 1, 0);
const earningsAll = await Earning.find({
userId: uId }
);
const currMonthEarns = earningsAll.filter(er => {
const dt = new Date(er.date);
return dt >= cMStart && dt <= cMEnd;
}
);
const pMStart = new Date(n.getFullYear(), n.getMonth() - 1, 1);
const pMEnd = new Date(n.getFullYear(), n.getMonth(), 0);
const prevMonthEarns = earningsAll.filter(er => {
const dt = new Date(er.date);
return dt >= pMStart && dt <= pMEnd;
}
);
const recEarnStats = [{
totalEarnings: currMonthEarns.reduce((s, e) => s + e.amount, 0),

      totalHours: currMonthEarns.reduce((s, e) => s + e.hoursWorked, 0),

      count: currMonthEarns.length

    }
];
const prevMStats = {
totalEarnings: prevMonthEarns.reduce((s, e) => s + e.amount, 0),

      totalHours: prevMonthEarns.reduce((s, e) => s + e.hoursWorked, 0),

      count: prevMonthEarns.length

    }
;
const avgHRate = usr.totalHours > 0 

      ? Math.round((usr.totalEarnings / usr.totalHours) * 100) / 100 

      : 0;
const recentAvgRate = recEarnStats[0] && recEarnStats[0].totalHours > 0

      ? Math.round((recEarnStats[0].totalEarnings / recEarnStats[0].totalHours) * 100) / 100

      : 0;
const earningsChange = prevMStats.totalEarnings > 0 

      ? Math.round(((recEarnStats[0]?.totalEarnings || 0) - prevMStats.totalEarnings) / prevMStats.totalEarnings * 100)

      : 0;
const hoursChange = prevMStats.totalHours > 0

      ? Math.round(((recEarnStats[0]?.totalHours || 0) - prevMStats.totalHours) / prevMStats.totalHours * 100)

      : 0;
res.json({
status: 'success',

      data: {
totalEarnings: usr.totalEarnings,

        totalHours: usr.totalHours,

        averageRate: avgHRate,

        activeHustles: hStats[0]?.activeHustles || 0,

        totalHustles: hStats[0]?.totalHustles || 0,

        recentEarnings: recEarnStats[0]?.totalEarnings || 0,

        recentHours: recEarnStats[0]?.totalHours || 0,

        recentAvgRate,

        recentTransactions: recEarnStats[0]?.count || 0,

        earningsChange,

        hoursChange

      }
}
);
}
catch (error) {
console.log('metrics err');
res.status(500).json({
status: 'error',

      message: 'Server error while fetching dashboard metrics'

    }
);
}
}
);
router.get('/earnings', protect, async (req, res) => {
try {
const {
year = new Date().getFullYear() }
= req.query;
const uId = req.user._id;
const startD = new Date(year, 0, 1);
const endD = new Date(year, 11, 31);
const earningsAll = await Earning.find({
userId: uId }
);
const earningsFilt = earningsAll.filter(er => {
const dt = new Date(er.date);
return dt >= startD && dt <= endD;
}
);
const hustlesAll = await Hustle.find({
userId: uId }
);
const hMap = {
}
;
hustlesAll.forEach(hsl => {
hMap[hsl._id] = hsl;
}
);
const monthEarnByCat = {
}
;
const tMonthEarn = {
}
;
earningsFilt.forEach(er => {
const dt = new Date(er.date);
const mn = dt.getMonth() + 1;
const hsl = hMap[er.hustleId];
const cat = hsl ? hsl.category : 'Other';
if (!tMonthEarn[mn]) {
tMonthEarn[mn] = {
totalEarnings: 0, totalHours: 0 }
;
}
if (!monthEarnByCat[cat]) {
monthEarnByCat[cat] = {
}
;
}
if (!monthEarnByCat[cat][mn]) {
monthEarnByCat[cat][mn] = {
totalEarnings: 0, totalHours: 0 }
;
}
tMonthEarn[mn].totalEarnings += er.amount;
tMonthEarn[mn].totalHours += er.hoursWorked;
monthEarnByCat[cat][mn].totalEarnings += er.amount;
monthEarnByCat[cat][mn].totalHours += er.hoursWorked;
}
);
const months = Array.from({
length: 12 }
, (_, i) => {
const mData = tMonthEarn[i + 1];
return {
month: i + 1,

        monthName: new Date(year, i).toLocaleString('default', {
month: 'short' }
),

        totalEarnings: mData?.totalEarnings || 0,

        totalHours: mData?.totalHours || 0

      }
;
}
);
const catData = {
}
;
Object.keys(monthEarnByCat).forEach(cat => {
catData[cat] = Array.from({
length: 12 }
, (_, i) => {
const mData = monthEarnByCat[cat][i + 1];
return {
month: i + 1,

          monthName: new Date(year, i).toLocaleString('default', {
month: 'short' }
),

          totalEarnings: mData?.totalEarnings || 0,

          totalHours: mData?.totalHours || 0

        }
;
}
);
}
);
res.json({
status: 'success',

      data: {
monthly: months,

        byCategory: catData

      }
}
);
}
catch (error) {
console.log('earnings err');
res.status(500).json({
status: 'error',

      message: 'Server error while fetching earnings data'

    }
);
}
}
);
router.get('/activities', protect, async (req, res) => {
try {
const uId = req.user._id;
const {
limit = 10 }
= req.query;
const rEarnings = await Earning.find({
userId: uId }
)

      .populate('hustleId', 'title category')

      .sort({
date: -1 }
)

      .limit(5);
const rHustles = await Hustle.find({
userId: uId }
)

      .sort({
createdAt: -1 }
)

      .limit(3);
const rApps = await Opportunity.find({
'applications.userId': uId

    }
)

      .populate('postedBy', 'firstName lastName')

      .sort({
'applications.appliedAt': -1 }
)

      .limit(3);
const acts = [];
rEarnings.forEach(e => {
acts.push({
type: 'earning',

        message: `Earned $${
e.amount}
from ${
e.hustleId?.title || 'Unknown Hustle'}
`,

        timestamp: e.date,

        icon: '💰',

        data: e

      }
);
}
);
rHustles.forEach(h => {
acts.push({
type: 'hustle',

        message: `Started new hustle: ${
h.title}
`,

        timestamp: h.createdAt,

        icon: '🚀',

        data: h

      }
);
}
);
rApps.forEach(op => {
const uApp = op.applications.find(

        a => a.userId.toString() === uId

      );
if (uApp) {
acts.push({
type: 'application',

          message: `Applied to ${
op.title}
at ${
op.company}
`,

          timestamp: uApp.appliedAt,

          icon: '📝',

          data: {
opportunity: op, application: uApp }
}
);
}
}
);
acts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
acts.splice(parseInt(limit));
res.json({
status: 'success',

      data: {
activities: acts }
}
);
}
catch (error) {
console.log('activities err');
res.status(500).json({
status: 'error',

      message: 'Server error while fetching activities'

    }
);
}
}
);
router.get('/roi', protect, async (req, res) => {
try {
const uId = req.user._id;
const {
period = 'month' }
= req.query;
let sDate, eDate;
const n = new Date();
switch (period) {
case 'week':

        sDate = new Date(n.setDate(n.getDate() - n.getDay()));
eDate = new Date(n.setDate(n.getDate() - n.getDay() + 6));
break;
case 'month':

        sDate = new Date(n.getFullYear(), n.getMonth(), 1);
eDate = new Date(n.getFullYear(), n.getMonth() + 1, 0);
break;
case 'year':

        sDate = new Date(n.getFullYear(), 0, 1);
eDate = new Date(n.getFullYear(), 11, 31);
break;
default:

        sDate = new Date(n.getFullYear(), n.getMonth(), 1);
eDate = new Date(n.getFullYear(), n.getMonth() + 1, 0);
}
const roiData = await Earning.aggregate([

      {
$match: {
userId: uId,

          date: {
$gte: sDate, $lte: eDate }
}
}
,

      {
$lookup: {
from: 'hustles',

          localField: 'hustleId',

          foreignField: '_id',

          as: 'hustle'

        }
}
,

      {
$unwind: '$hustle'

      }
,

      {
$group: {
_id: '$hustleId',

          hustleTitle: {
$first: '$hustle.title' }
,

          hustleCategory: {
$first: '$hustle.category' }
,

          totalEarnings: {
$sum: '$amount' }
,

          totalHours: {
$sum: '$hoursWorked' }
,

          transactionCount: {
$sum: 1 }
}
}
,

      {
$addFields: {
hourlyRate: {
$cond: [

              {
$gt: ['$totalHours', 0] }
,

              {
$divide: ['$totalEarnings', '$totalHours'] }
,

              0

            ]

          }
}
}
,

      {
$sort: {
totalEarnings: -1 }
}
]);
const overallStats = await Earning.aggregate([

      {
$match: {
userId: uId,

          date: {
$gte: sDate, $lte: eDate }
}
}
,

      {
$group: {
_id: null,

          totalEarnings: {
$sum: '$amount' }
,

          totalHours: {
$sum: '$hoursWorked' }
,

          avgHourlyRate: {
$avg: '$hourlyRate' }
}
}
]);
res.json({
status: 'success',

      data: {
period: {
startDate: sDate, endDate: eDate, type: period }
,

        byHustle: roiData,

        overall: overallStats[0] || {
totalEarnings: 0,

          totalHours: 0,

          avgHourlyRate: 0

        }
}
}
);
}
catch (error) {
console.log('roi err');
res.status(500).json({
status: 'error',

      message: 'Server error while fetching ROI data'

    }
);
}
}
);
router.get('/breakdown', protect, async (req, res) => {
try {
const uId = req.user._id;
const {
period = 'month' }
= req.query;
let sDate, eDate;
const n = new Date();
switch (period) {
case 'week':

        sDate = new Date(n.setDate(n.getDate() - n.getDay()));
eDate = new Date(n.setDate(n.getDate() - n.getDay() + 6));
break;
case 'month':

        sDate = new Date(n.getFullYear(), n.getMonth(), 1);
eDate = new Date(n.getFullYear(), n.getMonth() + 1, 0);
break;
case 'year':

        sDate = new Date(n.getFullYear(), 0, 1);
eDate = new Date(n.getFullYear(), 11, 31);
break;
default:

        sDate = new Date(n.getFullYear(), n.getMonth(), 1);
eDate = new Date(n.getFullYear(), n.getMonth() + 1, 0);
}
const catBreak = await Earning.aggregate([

      {
$match: {
userId: uId,

          date: {
$gte: sDate, $lte: eDate }
}
}
,

      {
$lookup: {
from: 'hustles',

          localField: 'hustleId',

          foreignField: '_id',

          as: 'hustle'

        }
}
,

      {
$unwind: '$hustle'

      }
,

      {
$group: {
_id: '$hustle.category',

          totalEarnings: {
$sum: '$amount' }
,

          totalHours: {
$sum: '$hoursWorked' }
,

          transactionCount: {
$sum: 1 }
,

          avgHourlyRate: {
$avg: '$hourlyRate' }
}
}
,

      {
$sort: {
totalEarnings: -1 }
}
]);
const earnCatBreak = await Earning.aggregate([

      {
$match: {
userId: uId,

          date: {
$gte: sDate, $lte: eDate }
}
}
,

      {
$group: {
_id: '$category',

          totalEarnings: {
$sum: '$amount' }
,

          totalHours: {
$sum: '$hoursWorked' }
,

          transactionCount: {
$sum: 1 }
}
}
,

      {
$sort: {
totalEarnings: -1 }
}
]);
const tEarns = catBreak.reduce((s, i) => s + i.totalEarnings, 0);
const catBreakP = catBreak.map(i => ({
...i,

      percentage: tEarns > 0 ? Math.round((i.totalEarnings / tEarns) * 100) : 0

    }
));
const earnCatBreakP = earnCatBreak.map(i => ({
...i,

      percentage: tEarns > 0 ? Math.round((i.totalEarnings / tEarns) * 100) : 0

    }
));
res.json({
status: 'success',

      data: {
period: {
startDate: sDate, endDate: eDate, type: period }
,

        byHustleCategory: catBreakP,

        byEarningCategory: earnCatBreakP,

        totalEarnings: tEarns

      }
}
);
}
catch (error) {
console.log('breakdown err');
res.status(500).json({
status: 'error',

      message: 'Server error while fetching breakdown data'

    }
);
}
}
);
module.exports = router;
