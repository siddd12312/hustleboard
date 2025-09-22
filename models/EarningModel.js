const jsonStorage = require('../storage/jsonStorage');
class Earning 
{
constructor(obj) {
this._id = obj._id;
this.userId = obj.userId;
this.hustleId = obj.hustleId;
this.amount = obj.amount;
this.currency = obj.currency || 'USD';
this.description = obj.description;
this.category = obj.category;
this.paymentMethod = obj.paymentMethod;
this.hoursWorked = obj.hoursWorked || 0;
this.hourlyRate = obj.hourlyRate || 0;
this.date = obj.date || new Date().toISOString();
this.isRecurring = obj.isRecurring || false;
this.recurringFrequency = obj.recurringFrequency || null;
this.taxDeductible = obj.taxDeductible || false;
this.notes = obj.notes || '';
this.attachments = obj.attachments || [];
this.status = obj.status || 'Received';
this.createdAt = obj.createdAt;
this.updatedAt = obj.updatedAt;
}
static async create(data1) {
if (data1.hoursWorked > 0 && !data1.hourlyRate) {
data1.hourlyRate = Math.round((data1.amount / data1.hoursWorked) * 100) / 100;
}
const res1 = await jsonStorage.create('earnings', data1);
return new Earning(res1);
}
static async findById(id1) {
const res2 = await jsonStorage.findById('earnings', id1);
return res2 ? new Earning(res2) : null;
}
static async find(filt = {
}
, opts = {
}
) {
const res3 = await jsonStorage.find('earnings', filt);
return res3.map(e => new Earning(e));
}
static async findWithPagination(filt2 = {
}
, opts2 = {
}
) {
const res4 = await jsonStorage.findWithPagination('earnings', filt2, opts2);
return {
...res4,
      data: res4.data.map(e => new Earning(e))
    }
;
}
static async updateById(id2, data2) {
const res5 = await jsonStorage.update('earnings', id2, data2);
return res5 ? new Earning(res5) : null;
}
static async deleteById(id3) {
return await jsonStorage.delete('earnings', id3);
}
static async count(filt3 = {
}
) {
return await jsonStorage.count('earnings', filt3);
}
static async aggregate(pipeline) {
const res6 = await jsonStorage.find('earnings');
if (pipeline.length === 0) return res6;
let tempResult = res6;
for (const stage of pipeline) {
if (stage.$match) {
tempResult = tempResult.filter(itm => {
return Object.keys(stage.$match).every(k => {
if (k === '_id') {
return itm[k] === stage.$match[k];
}
if (Array.isArray(stage.$match[k])) {
return stage.$match[k].includes(itm[k]);
}
if (typeof stage.$match[k] === 'object' && stage.$match[k] !== null) {
return Object.keys(stage.$match[k]).every(sub => {
if (sub === '$gte') {
return new Date(itm[k]) >= new Date(stage.$match[k][sub]);
}
if (sub === '$lte') {
return new Date(itm[k]) <= new Date(stage.$match[k][sub]);
}
return itm[k] && itm[k][sub] === stage.$match[k][sub];
}
);
}
return itm[k] === stage.$match[k];
}
);
}
);
}
if (stage.$group) {
const groupKey = stage.$group._id;
const grouped = {
}
;
tempResult.forEach(itm2 => {
let valGroup;
if (groupKey === null) {
valGroup = 'all';
}
else if (typeof groupKey === 'string') {
valGroup = itm2[groupKey];
}
else if (typeof groupKey === 'object') {
valGroup = Object.keys(groupKey).map(k2 => itm2[k2]).join('_');
}
if (!grouped[valGroup]) {
grouped[valGroup] = [];
}
grouped[valGroup].push(itm2);
}
);
tempResult = Object.values(grouped).map(g => {
const groupRes = {
_id: g[0][Object.keys(groupKey)[0]] }
;
Object.keys(stage.$group).forEach(k3 => {
if (k3 === '_id') return;
const op = stage.$group[k3];
if (op.$sum) {
if (op.$sum === 1) {
groupRes[k3] = g.length;
}
else 
              {
groupRes[k3] = g.reduce((acc, itm3) => acc + (itm3[op.$sum] || 0), 0);
}
}
else if (op.$avg) {
const vals = g.map(itm4 => itm4[op.$avg] || 0);
groupRes[k3] = vals.reduce((acc2, v) => acc2 + v, 0) / vals.length;
}
}
);
return groupRes;
}
);
}
if (stage.$sort) {
tempResult.sort((a, b) => {
for (const [k4, dir] of Object.entries(stage.$sort)) {
const av = a[k4];
const bv = b[k4];
if (av < bv) return dir === 1 ? -1 : 1;
if (av > bv) return dir === 1 ? 1 : -1;
}
return 0;
}
);
}
}
return tempResult;
}
async save() {
const res7 = await jsonStorage.update('earnings', this._id, {
userId: this.userId,

      hustleId: this.hustleId,

      amount: this.amount,

      currency: this.currency,

      description: this.description,

      category: this.category,

      paymentMethod: this.paymentMethod,

      hoursWorked: this.hoursWorked,

      hourlyRate: this.hourlyRate,

      date: this.date,

      isRecurring: this.isRecurring,

      recurringFrequency: this.recurringFrequency,

      taxDeductible: this.taxDeductible,

      notes: this.notes,

      attachments: this.attachments,

      status: this.status

    }
);
if (res7) {
Object.assign(this, res7);
}
return res7;
}
get formattedAmount() {
return new Intl.NumberFormat('en-US', {
style: 'currency',

      currency: this.currency

    }
).format(this.amount);
}
}
module.exports = Earning;
