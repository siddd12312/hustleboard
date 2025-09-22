const jsonStorage = require('../storage/jsonStorage');
class Resource
{
constructor (stuff) {
this._id = stuff._id;
this.title = stuff.title;
this.description = stuff.description;
this.type = stuff.type;
this.category = stuff.category;
this.url = stuff.url;
this.thumbnail = stuff.thumbnail || '';
this.author = stuff.author || {
}
;
this.skills = stuff.skills || [];
this.difficulty = stuff.difficulty || 'Beginner';
this.duration = stuff.duration || 0;
this.cost = stuff.cost || 'Free';
this.price = stuff.price || 0;
this.currency = stuff.currency || 'USD';
this.language = stuff.language || 'English';
this.tags = stuff.tags || [];
this.rating = stuff.rating || {
average: 0, count: 0 }
;
this.viewCount = stuff.viewCount || 0;
this.bookmarkCount = stuff.bookmarkCount || 0;
this.isVerified = stuff.isVerified || false;
this.isActive = stuff.isActive !== undefined ? stuff.isActive : true;
this.featured = stuff.featured || false;
this.publishedAt = stuff.publishedAt || new Date().toISOString();
this.lastUpdated = stuff.lastUpdated || new Date().toISOString();
this.createdAt = stuff.createdAt;
this.updatedAt = stuff.updatedAt;
}
static async create(thing) {
const thingy = await jsonStorage.create('resources', thing);
return new Resource(thingy);
}
static async findById(id) {
const x = await jsonStorage.findById('resources', id);
return x ? new Resource(x) : null;
}
static async find(q = {
}
, opt = {
}
) {
const arr = await jsonStorage.find('resources', q);
return arr.map(item => new Resource(item));
}
static async findWithPagination(q = {
}
, opt = {
}
) {
const thing = await jsonStorage.findWithPagination('resources', q, opt);
return {
...thing,

      data: thing.data.map(item => new Resource(item))

    }
;
}
static async updateById(id, updateData) {
const x = await jsonStorage.update('resources', id, updateData);
return x ? new Resource(x) : null;
}
static async deleteById(id) {
return await jsonStorage.delete('resources', id);
}
static async count(q = {
}
) {
return await jsonStorage.count('resources', q);
}
static async distinct(field) {
const arr = await jsonStorage.find('resources');
const vals = arr.map(x => x[field]).filter(v => v);
return [...new Set(vals)];
}
static async search(term, fields = ['title', 'description', 'author.name']) {
const arr = await jsonStorage.search('resources', term, fields);
return arr.map(x => new Resource(x));
}
async save() {
const x = await jsonStorage.update('resources', this._id, {
title: this.title,

      description: this.description,

      type: this.type,

      category: this.category,

      url: this.url,

      thumbnail: this.thumbnail,

      author: this.author,

      skills: this.skills,

      difficulty: this.difficulty,

      duration: this.duration,

      cost: this.cost,

      price: this.price,

      currency: this.currency,

      language: this.language,

      tags: this.tags,

      rating: this.rating,

      viewCount: this.viewCount,

      bookmarkCount: this.bookmarkCount,

      isVerified: this.isVerified,

      isActive: this.isActive,

      featured: this.featured,

      publishedAt: this.publishedAt,

      lastUpdated: this.lastUpdated

    }
);
if (x) {
Object.assign(this, x);
}
return x;
}
get formattedPrice() {
if (this.cost === 'Free') {
return 'Free';
}
return new Intl.NumberFormat('en-US', {
style: 'currency',

      currency: this.currency

    }
).format(this.price);
}
get formattedDuration() {
if (!this.duration) return 'N/A';
const h = Math.floor(this.duration / 60);
const m = this.duration % 60;
if (h > 0) {
return m > 0 ? `${
h}
h ${
m}
m` : `${
h}
h`;
}
return `${
m}
m`;
}
}
module.exports = Resource;
