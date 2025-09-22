const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
class ApiError extends Error 
{
constructor(public status: number, msg: string) {
super(msg);
this.name = 'ApiError';
}
}
class ApiClient 
{
private baseURL: string;
private token: string | null = null;
constructor(baseURL: string) {
this.baseURL = baseURL;
this.token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
}
setToken(tok: string) {
this.token = tok;
if (typeof window !== 'undefined') {
localStorage.setItem('token', tok);
}
}
clearToken() {
this.token = null;
if (typeof window !== 'undefined') {
localStorage.removeItem('token');
}
}
private async request<T>(

    endpoint: string,

    options: RequestInit = {
}
): Promise<T> 
  {
const url = `${
this.baseURL}
${
endpoint}
`;
const config: RequestInit = {
headers: {
'Content-Type': 'application/json',

        ...(this.token && {
Authorization: `Bearer ${
this.token}
` }
),

        ...options.headers,

      }
,

      ...options,

    }
;
try 
    {
const resp = await fetch(url, config);
const dat = await resp.json();
if (!resp.ok) {
throw new ApiError(resp.status, dat.message || 'An error occurred');
}
return dat;
}
catch (err) {
if (err instanceof ApiError) {
throw err;
}
throw new ApiError(0, 'Network error occurred');
}
}
async login(email1: string, pass1: string) {
const resp = await this.request<{
status: string;
message: string;
data: {
user: User;
token: string;
}
;
}
>('/auth/login', {
method: 'POST',

      body: JSON.stringify({
email: email1, password: pass1 }
),

    }
);
this.setToken(resp.data.token);
return resp;
}
async register(usrData: {
firstName: string;
lastName: string;
email: string;
password: string;
}
) {
const resp = await this.request<{
status: string;
message: string;
data: {
user: User;
token: string;
}
;
}
>('/auth/register', {
method: 'POST',

      body: JSON.stringify(usrData),

    }
);
this.setToken(resp.data.token);
return resp;
}
async logout() {
this.clearToken();
}
async getProfile() {
return this.request<{
status: string;
data: {
user: User }
;
}
>('/user/profile');
}
async updateProfile(uData: Partial<User>) {
return this.request<{
status: string;
data: {
user: User }
;
}
>('/user/profile', {
method: 'PUT',

      body: JSON.stringify(uData),

    }
);
}
async addSkill(skill1: string) {
return this.request<{
status: string;
data: {
user: User }
;
}
>('/user/skills', {
method: 'POST',

      body: JSON.stringify({
skill: skill1 }
),

    }
);
}
async getSkills() {
return this.request<{
status: string;
data: {
skills: string[] }
;
}
>('/user/skills');
}
async getHustles(paramz?: {
page?: number;
limit?: number;
status?: string;
category?: string;
}
) {
const params2 = new URLSearchParams();
if (paramz?.page) params2.set('page', paramz.page.toString());
if (paramz?.limit) params2.set('limit', paramz.limit.toString());
if (paramz?.status) params2.set('status', paramz.status);
if (paramz?.category) params2.set('category', paramz.category);
const qStr = params2.toString();
return this.request<{
status: string;
data: {
hustles: Hustle[];
pagination: {
page: number;
limit: number;
total: number;
pages: number;
}
;
}
;
}
>(`/hustles${
qStr ? `?${
qStr}
` : ''}
`);
}
async getHustle(id: string) {
return this.request<{
status: string;
data: {
hustle: Hustle }
;
}
>(`/hustles/${
id}
`);
}
async createHustle(hustleData: {
title: string;
description: string;
category: string;
hourlyRate?: number;
skills?: string[];
goals?: {
monthlyEarnings?: number;
monthlyHours?: number;
}
;
}
) {
return this.request<{
status: string;
data: {
hustle: Hustle }
;
}
>('/hustles', {
method: 'POST',

      body: JSON.stringify(hustleData),

    }
);
}
async updateHustle(id: string, hData: Partial<Hustle>) {
return this.request<{
status: string;
data: {
hustle: Hustle }
;
}
>(`/hustles/${
id}
`, {
method: 'PUT',

      body: JSON.stringify(hData),

    }
);
}
async getEarnings(paramz?: {
page?: number;
limit?: number;
hustleId?: string;
startDate?: string;
endDate?: string;
sortBy?: string;
sortOrder?: 'asc' | 'desc';
}
) {
const params2 = new URLSearchParams();
if (paramz?.page) params2.set('page', paramz.page.toString());
if (paramz?.limit) params2.set('limit', paramz.limit.toString());
if (paramz?.hustleId) params2.set('hustleId', paramz.hustleId);
if (paramz?.startDate) params2.set('startDate', paramz.startDate);
if (paramz?.endDate) params2.set('endDate', paramz.endDate);
if (paramz?.sortBy) params2.set('sortBy', paramz.sortBy);
if (paramz?.sortOrder) params2.set('sortOrder', paramz.sortOrder);
const qStr = params2.toString();
return this.request<{
status: string;
data: {
earnings: Earning[];
pagination: {
page: number;
limit: number;
total: number;
pages: number;
}
;
}
;
}
>(`/earnings${
qStr ? `?${
qStr}
` : ''}
`);
}
async getEarningsSummary(paramz?: {
period?: 'week' | 'month' | 'year';
hustleId?: string;
}
) {
const params2 = new URLSearchParams();
if (paramz?.period) params2.set('period', paramz.period);
if (paramz?.hustleId) params2.set('hustleId', paramz.hustleId);
const qStr = params2.toString();
return this.request<{
status: string;
data: {
totalEarnings: number;
totalHours: number;
averageRate: number;
transactionCount: number;
period: string;
}
;
}
>(`/earnings/summary${
qStr ? `?${
qStr}
` : ''}
`);
}
async logEarning(earnDat: {
hustleId: string;
amount: number;
description: string;
category: string;
paymentMethod: string;
hoursWorked?: number;
date: string;
}
) {
return this.request<{
status: string;
data: {
earning: Earning }
;
}
>('/earnings', {
method: 'POST',

      body: JSON.stringify(earnDat),

    }
);
}
async getOpportunities(paramz?: {
page?: number;
limit?: number;
category?: string;
type?: string;
location?: string;
skills?: string;
search?: string;
sortBy?: string;
sortOrder?: 'asc' | 'desc';
}
) {
const params2 = new URLSearchParams();
if (paramz?.page) params2.set('page', paramz.page.toString());
if (paramz?.limit) params2.set('limit', paramz.limit.toString());
if (paramz?.category) params2.set('category', paramz.category);
if (paramz?.type) params2.set('type', paramz.type);
if (paramz?.location) params2.set('location', paramz.location);
if (paramz?.skills) params2.set('skills', paramz.skills);
if (paramz?.search) params2.set('search', paramz.search);
if (paramz?.sortBy) params2.set('sortBy', paramz.sortBy);
if (paramz?.sortOrder) params2.set('sortOrder', paramz.sortOrder);
const qStr = params2.toString();
return this.request<{
status: string;
data: {
opportunities: Opportunity[];
pagination: {
page: number;
limit: number;
total: number;
pages: number;
}
;
}
;
}
>(`/opportunities${
qStr ? `?${
qStr}
` : ''}
`);
}
async getOpportunity(id: string) {
return this.request<{
status: string;
data: {
opportunity: Opportunity }
;
}
>(`/opportunities/${
id}
`);
}
async getOpportunityCategories() {
return this.request<{
status: string;
data: {
categories: string[] }
;
}
>('/opportunities/categories');
}
async getDashboardMetrics() {
return this.request<{
status: string;
data: {
totalEarnings: number;
totalHours: number;
averageRate: number;
activeHustles: number;
totalHustles: number;
recentEarnings: number;
recentHours: number;
recentAvgRate: number;
recentTransactions: number;
}
;
}
>('/dashboard/metrics');
}
async getDashboardEarnings(paramz?: {
year?: number;
month?: number;
hustleId?: string;
}
) {
const params2 = new URLSearchParams();
if (paramz?.year) params2.set('year', paramz.year.toString());
if (paramz?.month) params2.set('month', paramz.month.toString());
if (paramz?.hustleId) params2.set('hustleId', paramz.hustleId);
const qStr = params2.toString();
return this.request<{
status: string;
data: {
monthlyData: Array<{
month: string;
earnings: number;
hours: number;
}
>;
hustleBreakdown: Array<{
hustleId: string;
hustleName: string;
earnings: number;
hours: number;
}
>;
}
;
}
>(`/dashboard/earnings${
qStr ? `?${
qStr}
` : ''}
`);
}
async getDashboardActivities(paramz?: {
limit?: number;
type?: string;
}
) {
const params2 = new URLSearchParams();
if (paramz?.limit) params2.set('limit', paramz.limit.toString());
if (paramz?.type) params2.set('type', paramz.type);
const qStr = params2.toString();
return this.request<{
status: string;
data: {
activities: Array<{
id: string;
type: string;
description: string;
amount?: number;
date: string;
hustleId?: string;
hustleName?: string;
}
>;
}
;
}
>(`/dashboard/activities${
qStr ? `?${
qStr}
` : ''}
`);
}
async getResources(paramz?: {
page?: number;
limit?: number;
category?: string;
type?: string;
difficulty?: string;
search?: string;
sortBy?: string;
sortOrder?: 'asc' | 'desc';
}
) {
const params2 = new URLSearchParams();
if (paramz?.page) params2.set('page', paramz.page.toString());
if (paramz?.limit) params2.set('limit', paramz.limit.toString());
if (paramz?.category) params2.set('category', paramz.category);
if (paramz?.type) params2.set('type', paramz.type);
if (paramz?.difficulty) params2.set('difficulty', paramz.difficulty);
if (paramz?.search) params2.set('search', paramz.search);
if (paramz?.sortBy) params2.set('sortBy', paramz.sortBy);
if (paramz?.sortOrder) params2.set('sortOrder', paramz.sortOrder);
const qStr = params2.toString();
return this.request<{
status: string;
data: {
resources: Resource[];
pagination: {
page: number;
limit: number;
total: number;
pages: number;
}
;
}
;
}
>(`/resources${
qStr ? `?${
qStr}
` : ''}
`);
}
}
export interface User 
{
_id: string;
firstName: string;
lastName: string;
email: string;
profilePicture?: string;
bio?: string;
location?: string;
skills: string[];
achievements: Achievement[];
bookmarkedResources: string[];
totalEarnings: number;
totalHours: number;
isActive: boolean;
lastLogin: string;
preferences: {
notifications: {
email: boolean;
push: boolean;
}
;
currency: string;
timezone: string;
}
;
createdAt: string;
updatedAt: string;
}
export interface Hustle 
{
_id: string;
userId: string;
title: string;
description: string;
category: string;
status: 'Active' | 'Paused' | 'Completed';
hourlyRate: number;
totalEarnings: number;
totalHours: number;
startDate: string;
endDate?: string;
skills: string[];
tags: string[];
goals: {
monthlyEarnings: number;
monthlyHours: number;
}
;
isPublic: boolean;
notes?: string;
createdAt: string;
updatedAt: string;
}
export interface Earning 
{
_id: string;
userId: string;
hustleId: string;
amount: number;
currency: string;
description: string;
category: string;
paymentMethod: string;
hoursWorked: number;
hourlyRate: number;
date: string;
isRecurring: boolean;
recurringFrequency?: string;
taxDeductible: boolean;
notes?: string;
attachments: string[];
status: 'Received' | 'Pending' | 'Cancelled';
createdAt: string;
updatedAt: string;
}
export interface Opportunity 
{
_id: string;
title: string;
description: string;
company: string;
category: string;
type: 'Freelancing' | 'Part-time' | 'Contract' | 'Gig';
compensation: {
min: number;
max: number;
currency: string;
period: 'hour' | 'day' | 'week' | 'month' | 'project';
}
;
requiredSkills: string[];
preferredSkills: string[];
experienceLevel: 'Entry Level' | 'Intermediate' | 'Advanced' | 'Expert';
location: {
city: string;
state: string;
country: string;
remote: boolean;
}
;
applicationDeadline: string;
startDate: string;
duration: string;
status: 'Active' | 'Closed' | 'Paused';
contactInfo: {
name: string;
email: string;
phone?: string;
}
;
applicationUrl: string;
requirements: string[];
benefits: string[];
tags: string[];
isVerified: boolean;
postedBy: string;
applications: string[];
viewCount: number;
applicationCount: number;
createdAt: string;
updatedAt: string;
}
export interface Resource 
{
_id: string;
title: string;
description: string;
type: 'Course' | 'Tutorial' | 'Article' | 'Video' | 'Book' | 'Tool';
category: string;
url: string;
thumbnail?: string;
author: {
name: string;
email?: string;
website?: string;
}
;
skills: string[];
difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
duration: number;
cost: 'Free' | 'Paid';
price: number;
currency: string;
language: string;
tags: string[];
rating: {
average: number;
count: number;
}
;
viewCount: number;
bookmarkCount: number;
isVerified: boolean;
isActive: boolean;
featured: boolean;
publishedAt: string;
lastUpdated: string;
createdAt: string;
updatedAt: string;
}
export interface Achievement 
{
_id: string;
name: string;
description: string;
category: string;
icon: string;
color: string;
requirements: Record<string, any>;
rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
points: number;
isActive: boolean;
isHidden: boolean;
sortOrder: number;
createdAt: string;
updatedAt: string;
}
export const apiClient = new ApiClient(API_BASE_URL);
export {
ApiError }
;
