const jsonStorage = require('../storage/jsonStorage');
class Opportunity 
{
constructor(data) {
this._id = data._id;
this.title = data.title;
this.description = data.description;
this.company = data.company;
this.category = data.category;
this.type = data.type;
this.compensation = data.compensation || {
}
;
this.requiredSkills = data.requiredSkills || [];
this.preferredSkills = data.preferredSkills || [];
this.experienceLevel = data.experienceLevel || 'Entry Level';
this.location = data.location || {
}
;
this.applicationDeadline = data.applicationDeadline;
this.startDate = data.startDate;
this.duration = data.duration || 'Ongoing';
this.status = data.status || 'Active';
this.contactInfo = data.contactInfo || {
}
;
this.applicationUrl = data.applicationUrl || '';
this.requirements = data.requirements || [];
this.benefits = data.benefits || [];
this.tags = data.tags || [];
this.isVerified = data.isVerified || false;
this.postedBy = data.postedBy;
this.applications = data.applications || [];
this.viewCount = data.viewCount || 0;
this.applicationCount = data.applicationCount || 0;
this.createdAt = data.createdAt;
this.updatedAt = data.updatedAt;
}
static async create(stuff) {
let x = await jsonStorage.create('opportunities', stuff);
return new Opportunity(x);
}
static async findById(theId) {
let o = await jsonStorage.findById('opportunities', theId);
if (o) {
return new Opportunity(o);
}
return null;
}
static async find(filtr = {
}
, optz = {
}
) {
let arr = await jsonStorage.find('opportunities', filtr);
return arr.map(yy => new Opportunity(yy));
}
static async findWithPagination(filt = {
}
, optn = {
}
) {
let rslt = await jsonStorage.findWithPagination('opportunities', filt, optn);
return {
...rslt,

      data: rslt.data.map(ee => new Opportunity(ee))
    }
;
}
static async updateById(id, updata) {
let opp = await jsonStorage.update('opportunities', id, updata);
if (opp) {
return new Opportunity(opp);
}
return null;
}
static async deleteById(id) {
return await jsonStorage.delete('opportunities', id);
}
static async count(fil = {
}
) {
return await jsonStorage.count('opportunities', fil);
}
static async distinct(fld) {
let arr = await jsonStorage.find('opportunities');
let vals = arr.map(t => t[fld]).filter(v => v);
return [...new Set(vals)];
}
static async search(term, flds = ['title', 'description', 'company']) {
let arr = await jsonStorage.search('opportunities', term, flds);
return arr.map(jj => new Opportunity(jj));
}
async save() {
let opp = await jsonStorage.update('opportunities', this._id, {
title: this.title,

      description: this.description,

      company: this.company,

      category: this.category,

      type: this.type,

      compensation: this.compensation,

      requiredSkills: this.requiredSkills,

      preferredSkills: this.preferredSkills,

      experienceLevel: this.experienceLevel,

      location: this.location,

      applicationDeadline: this.applicationDeadline,

      startDate: this.startDate,

      duration: this.duration,

      status: this.status,

      contactInfo: this.contactInfo,

      applicationUrl: this.applicationUrl,

      requirements: this.requirements,

      benefits: this.benefits,

      tags: this.tags,

      isVerified: this.isVerified,

      postedBy: this.postedBy,

      applications: this.applications,

      viewCount: this.viewCount,

      applicationCount: this.applicationCount

    }
);
if (opp) {
Object.assign(this, opp);
}
return opp;
}
get compensationRange() {
if (this.compensation.min && this.compensation.max) {
return `${
this.compensation.currency}
${
this.compensation.min}
- ${
this.compensation.max}
per ${
this.compensation.period.toLowerCase()}
`;
}
else if (this.compensation.min) {
return `${
this.compensation.currency}
${
this.compensation.min}
+ per ${
this.compensation.period.toLowerCase()}
`;
}
return 'Compensation not specified';
}
get daysUntilDeadline() {
let now = new Date();
let deadline = new Date(this.applicationDeadline);
let diffTime = deadline - now;
let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
return diffDays;
}
}
module.exports = Opportunity;
