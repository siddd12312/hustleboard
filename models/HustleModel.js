const jsonStorage = require('../storage/jsonStorage');
class Hustle 
{
constructor(stuff) {
this._id = stuff._id;
this.userId = stuff.userId;
this.title = stuff.title;
this.description = stuff.description;
this.category = stuff.category;
this.status = stuff.status || 'Active';
this.hourlyRate = stuff.hourlyRate || 0;
this.totalEarnings = stuff.totalEarnings || 0;
this.totalHours = stuff.totalHours || 0;
this.startDate = stuff.startDate || new Date().toISOString();
this.endDate = stuff.endDate || null;
this.skills = stuff.skills || [];
this.tags = stuff.tags || [];
this.goals = stuff.goals || {
monthlyEarnings: 0, monthlyHours: 0 }
;
this.isPublic = stuff.isPublic || false;
this.notes = stuff.notes || '';
this.createdAt = stuff.createdAt;
this.updatedAt = stuff.updatedAt;
}
static async create(hustleDat) {
const h = await jsonStorage.create('hustles', hustleDat);
return new Hustle(h);
}
static async findById(idx) {
const h = await jsonStorage.findById('hustles', idx);
return h ? new Hustle(h) : null;
}
static async find( fil = {
}
, opt = {
}
) {
const hs = await jsonStorage.find('hustles', fil);
return hs.map(item => new Hustle(item));
}
static async findWithPagination( fil = {
}
, opt = {
}
) {
const rr = await jsonStorage.findWithPagination('hustles', fil, opt);
return {
...rr,

      data: rr.data.map(xx => new Hustle(xx))

    }
;
}
static async updateById(idx, updateDat) {
const h = await jsonStorage.update('hustles', idx, updateDat);
return h ? new Hustle(h) : null;
}
static async deleteById(idx) {
return await jsonStorage.delete('hustles', idx);
}
static async count(fil = {
}
) {
return await jsonStorage.count('hustles', fil);
}
static async aggregate(pipe) {
const hs = await jsonStorage.find('hustles');
if (pipe.length === 0) return hs;
let res = hs;
for (const stag of pipe) {
if (stag.$match) {
res = res.filter(thing => {
return Object.keys(stag.$match).every(k => {
if (k === '_id') {
return thing[k] === stag.$match[k];
}
if (Array.isArray(stag.$match[k])) {
return stag.$match[k].includes(thing[k]);
}
if (typeof stag.$match[k] === 'object' && stag.$match[k] !== null) {
return Object.keys(stag.$match[k]).every(subK => {
if (subK === '$gte') {
return new Date(thing[k]) >= new Date(stag.$match[k][subK]);
}
if (subK === '$lte') {
return new Date(thing[k]) <= new Date(stag.$match[k][subK]);
}
return thing[k] && thing[k][subK] === stag.$match[k][subK];
}
);
}
return thing[k] === stag.$match[k];
}
);
}
);
}
if (stag.$group) {
const gk = stag.$group._id;
const grpd = {
}
;
res.forEach(thing => {
let gv;
if (gk === null) {
gv = 'all';
}
else if (typeof gk === 'string') {
gv = thing[gk];
}
else if (typeof gk === 'object') {
gv = Object.keys(gk).map(kk => thing[kk]).join('_');
}
if (!grpd[gv]) {
grpd[gv] = [];
}
grpd[gv].push(thing);
}
);
res = Object.values(grpd).map(grp => {
const gr = {
_id: grp[0][Object.keys(gk)[0]] }
;
Object.keys(stag.$group).forEach(key => {
if (key === '_id') return;
const oper = stag.$group[key];
if (oper.$sum) {
if (oper.$sum === 1) {
gr[key] = grp.length;
}
else 
              {
gr[key] = grp.reduce((summ, itm) => summ + (itm[oper.$sum] || 0), 0);
}
}
else if (oper.$avg) {
const vals = grp.map(itm => itm[oper.$avg] || 0);
gr[key] = vals.reduce((summ, v) => summ + v, 0) / vals.length;
}
else if (oper.$cond) {
const cond = oper.$cond;
const truVal = cond[1];
const flsVal = cond[2];
const fld = cond[0].$eq[0];
const vlu = cond[0].$eq[1];
gr[key] = grp.reduce((summ, itm) => {
return summ + (itm[fld] === vlu ? truVal : flsVal);
}
, 0);
}
}
);
return gr;
}
);
}
if (stag.$sort) {
res.sort((a, b) => {
for (const [key, dir] of Object.entries(stag.$sort)) {
const aVal = a[key];
const bVal = b[key];
if (aVal < bVal) return dir === 1 ? -1 : 1;
if (aVal > bVal) return dir === 1 ? 1 : -1;
}
return 0;
}
);
}
}
return res;
}
async save() {
const h = await jsonStorage.update('hustles', this._id, {
userId: this.userId,

      title: this.title,

      description: this.description,

      category: this.category,

      status: this.status,

      hourlyRate: this.hourlyRate,

      totalEarnings: this.totalEarnings,

      totalHours: this.totalHours,

      startDate: this.startDate,

      endDate: this.endDate,

      skills: this.skills,

      tags: this.tags,

      goals: this.goals,

      isPublic: this.isPublic,

      notes: this.notes

    }
);
if (h) {
Object.assign(this, h);
}
return h;
}
get averageRate() {
if (this.totalHours > 0) {
return Math.round((this.totalEarnings / this.totalHours) * 100) / 100;
}
return this.hourlyRate || 0;
}
get roi() {
if (this.totalHours > 0) {
return Math.round((this.totalEarnings / this.totalHours) * 100) / 100;
}
return 0;
}
}
module.exports = Hustle;
