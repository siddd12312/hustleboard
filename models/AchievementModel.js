const jsonStorage = require('../storage/jsonStorage');
class Achievement 
{
constructor(dta) {
this._id = dta._id;
this.name = dta.name;
this.description = dta.description;
this.category = dta.category;
this.icon = dta.icon;
this.color = dta.color || '#3B82F6';
this.requirements = dta.requirements || {
}
;
this.rarity = dta.rarity || 'Common';
this.points = dta.points || 10;
this.isActive = dta.isActive !== undefined ? dta.isActive : true;
this.isHidden = dta.isHidden || false;
this.sortOrder = dta.sortOrder || 0;
this.createdAt = dta.createdAt;
this.updatedAt = dta.updatedAt;
}
static async create (achievData) {
const achv = await jsonStorage.create('achievements', achievData);
return new Achievement(achv);
}
static async findById (id) {
const achv = await jsonStorage.findById('achievements', id);
if (achv) {
return new Achievement(achv);
}
else
    {
return null;
}
}
static async find (flt = {
}
, opts = {
}
) {
const achvs = await jsonStorage.find('achievements', flt);
return achvs.map(item => new Achievement(item));
}
static async findWithPagination (flt = {
}
, opts = {
}
) {
const reslt = await jsonStorage.findWithPagination('achievements', flt, opts);
return {
...reslt,
      data: reslt.data.map(ach => new Achievement(ach))
    }
;
}
static async updateById (id, updData) {
const achv = await jsonStorage.update('achievements', id, updData);
if (achv) {
return new Achievement(achv);
}
else
    {
return null;
}
}
static async deleteById (id) {
return await jsonStorage.delete('achievements', id);
}
static async count (flt = {
}
) {
return await jsonStorage.count('achievements', flt);
}
async save () {
const ach = await jsonStorage.update('achievements', this._id, {
name: this.name,

      description: this.description,

      category: this.category,

      icon: this.icon,

      color: this.color,

      requirements: this.requirements,

      rarity: this.rarity,

      points: this.points,

      isActive: this.isActive,

      isHidden: this.isHidden,

      sortOrder: this.sortOrder

    }
);
if (ach) {
Object.assign(this, ach);
}
return ach;
}
}
module.exports = Achievement;
