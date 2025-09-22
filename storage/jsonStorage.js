const fs = require('fs');
const   path = require('path');
const {
v4: uuidv4 }
= require('uuid');
class JSONStorage
{
constructor() {
this.dataDir   =   path.join(__dirname, '..', 'data');
this.ensureDataDir();
}
ensureDataDir( ) {
if (!fs.existsSync(this.dataDir)) {
fs.mkdirSync(this.dataDir, {
recursive: true }
);
}
}
getFilePath(collection) {
return path.join(this.dataDir, `${
collection}
.json`);
}
readCollection(collection) {
let fp = this.getFilePath(collection);
try
    {
if (!fs.existsSync(fp)) {
return [];
}
let txt = fs.readFileSync(fp, 'utf8');
return JSON.parse(txt);
}
catch(error) {
console.log("err read", error);
return [];
}
}
writeCollection(collection, dta) {
let fp = this.getFilePath(collection);
try
    {
fs.writeFileSync(fp, JSON.stringify(dta, null, 2));
return true;
}
catch(error) {
console.log("err write", error);
return false;
}
}
async create(collection, dat) {
let arr = this.readCollection(collection);
let itm = {
_id: uuidv4(),

      ...dat,

      createdAt: new Date().toISOString(),

      updatedAt: new Date().toISOString()

    }
;
arr.push(itm);
this.writeCollection(collection, arr);
return itm;
}
async findById(collection, id) {
let arr = this.readCollection(collection);
return arr.find(x => x._id === id);
}
async find(collection, fltr = {
}
) {
let arr = this.readCollection(collection);
if (Object.keys(fltr).length > 0) {
arr = arr.filter(row => {
return Object.keys(fltr).every(k => {
if (k === '_id') {
return row[k] === fltr[k];
}
if (Array.isArray(fltr[k])) {
return fltr[k].includes(row[k]);
}
if (typeof fltr[k] === 'object' && fltr[k] !== null) {
return Object.keys(fltr[k]).every(sub => {
if (sub === '$gte') {
return new Date(row[k]) >= new Date(fltr[k][sub]);
}
if (sub === '$lte') {
return new Date(row[k]) <= new Date(fltr[k][sub]);
}
if (sub === '$in') {
return fltr[k][sub].includes(row[k]);
}
return row[k] && row[k][sub] === fltr[k][sub];
}
);
}
return row[k] === fltr[k];
}
);
}
);
}
return arr;
}
async findOne(collection, fltr = {
}
) {
let arr = await this.find(collection, fltr);
return arr[0] || null;
}
async update(collection, id, upd) {
let arr = this.readCollection(collection);
let idx = arr.findIndex(e => e._id === id);
if (idx === -1) {
return null;
}
arr[idx] = {
...arr[idx],
      ...upd,
      updatedAt: new Date().toISOString()
    }
;
this.writeCollection(collection, arr);
return arr[idx];
}
async delete(collection, id) {
let arr = this.readCollection(collection);
let idx = arr.findIndex(e => e._id === id);
if (idx === -1) {
return false;
}
arr.splice(idx, 1);
this.writeCollection(collection, arr);
return true;
}
async count(collection, fltr = {
}
) {
let arr = await this.find(collection, fltr);
return arr.length;
}
async findWithPagination(collection, fltr = {
}
, opts = {
}
) {
let {
page = 1, limit = 10, sort = {
}
}
= opts;
let arr = await this.find(collection, fltr);
if (Object.keys(sort).length > 0) {
arr.sort((a, b) => {
for (let [k, dir] of Object.entries(sort)) {
let av = a[k];
let bv = b[k];
if (av < bv) return dir === 1 ? -1 : 1;
if (av > bv) return dir === 1 ? 1 : -1;
}
return 0;
}
);
}
let skip = (page - 1) * limit;
let paged = arr.slice(skip, skip + limit);
return {
data: paged,
      total: arr.length,
      page,
      limit,
      pages: Math.ceil(arr.length / limit)
    }
;
}
async search(collection, txt, flds = []) {
let arr = this.readCollection(collection);
if (!txt) return arr;
return arr.filter(row => {
return flds.some(fld => {
let v = this.getNestedValue(row, fld);
return v && v.toString().toLowerCase().includes(txt.toLowerCase());
}
);
}
);
}
getNestedValue(obj, pth) {
return pth.split('.').reduce((now, k) => now && now[k], obj);
}
async initializeSampleData() {
let c = ['users', 'hustles', 'earnings', 'opportunities', 'resources', 'achievements'];
for (let coll of c) {
let exist = this.readCollection(coll);
if (exist.length === 0) {
console.log("Init " + coll + " with data...");
}
}
}
}
module.exports = new JSONStorage();
