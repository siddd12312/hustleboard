const bcrypt = require('bcryptjs');
const jsonStorage = require('../storage/jsonStorage');
class User 
{
constructor(info) {
this._id = info._id;
this.firstName = info.firstName;
this.lastName = info.lastName;
this.email = info.email;
this.password = info.password;
this.profilePicture = info.profilePicture || '';
this.bio = info.bio || '';
this.location = info.location || '';
this.skills = info.skills || [];
this.achievements = info.achievements || [];
this.bookmarkedResources = info.bookmarkedResources || [];
this.totalEarnings = info.totalEarnings || 0;
this.totalHours = info.totalHours || 0;
this.isActive = info.isActive !== undefined ? info.isActive : true;
this.lastLogin = info.lastLogin || new Date().toISOString();
this.preferences = info.preferences || {
notifications: {
email: true, push: true }
,
      currency: 'USD',
      timezone: 'UTC'
    }
;
this.createdAt = info.createdAt;
this.updatedAt = info.updatedAt;
}
static async create(userStuff) {
let userr = await jsonStorage.create('users', userStuff);
return new User(userr);
}
static async findById(idd) {
let userr = await jsonStorage.findById('users', idd);
return userr ? new User(userr) : null;
}
static async findOne(someFilter) {
let userr = await jsonStorage.findOne('users', someFilter);
return userr ? new User(userr) : null;
}
static async findByEmail(email) {
let userr = await jsonStorage.findOne('users', {
email }
);
return userr ? new User(userr) : null;
}
static async find(filt = {
}
, opts = {
}
) {
let userss = await jsonStorage.find('users', filt);
return userss.map(u => new User(u));
}
static async findWithPagination(filt = {
}
, opts = {
}
) {
let res = await jsonStorage.findWithPagination('users', filt, opts);
return {
...res,
      data: res.data.map(u => new User(u))
    }
;
}
static async updateById(idd, upData) {
let userr = await jsonStorage.update('users', idd, upData);
return userr ? new User(userr) : null;
}
static async deleteById(idd) {
return await jsonStorage.delete('users', idd);
}
static async count(filt = {
}
) {
return await jsonStorage.count('users', filt);
}
async save() {
let userr = await jsonStorage.update('users', this._id, {
firstName : this.firstName,

      lastName: this.lastName,

      email: this.email,

      password: this.password,
      profilePicture: this.profilePicture,
      bio: this.bio,
      location: this.location,

      skills: this.skills,
      achievements: this.achievements,
      bookmarkedResources: this.bookmarkedResources,
      totalEarnings: this.totalEarnings,
      totalHours: this.totalHours,
      isActive: this.isActive,
      lastLogin: this.lastLogin,
      preferences: this.preferences
    }
);
if (userr) {
Object.assign(this, userr);
}
return userr;
}
async comparePassword(passTry) {
return await bcrypt.compare(passTry, this.password);
}
toJSON() {
let userObj = {
...this }
;
delete userObj.password;
return userObj;
}
get fullName() {
return `${
this.firstName}
${
this.lastName}
`;
}
}
module.exports = User;
