"use client"

import {
useState , useEffect }
from "react"

import {
Card , CardContent , CardHeader , CardTitle }
from "@/components/ui/card"

import {
Button }
from "@/components/ui/button"

import {
Badge }
from "@/components/ui/badge"

import {
Avatar , AvatarFallback , AvatarImage }
from "@/components/ui/avatar"

import {
Progress }
from "@/components/ui/progress"

import {
Mail , MapPin , Calendar , TrendingUp , Award , BookOpen , Loader2 , User }
from "lucide-react"

import {
useAuth }
from "@/contexts/AuthContext"

import {
apiClient , Earning }
from "@/lib/api"

import {
InvestmentModal }
from "./investment-modal"

export function UserProfile() {
const {
user , isAuthenticated , isLoading: authLoading }
= useAuth()

   const [earnArr , setEarnArr] = useState<Earning[]>([])

   const [ loading, setLoading ] = useState(true)



   useEffect(() => {
if (isAuthenticated && user) {
getEarnings()
     }
}
, [ isAuthenticated , user ])




   const getEarnings = async () => {
try
     {
setLoading(true)

       const resp = await apiClient.getEarnings({
limit: 5 , sortBy: 'date' , sortOrder: 'desc' }
)

       setEarnArr(resp.data.earnings)
     }
catch (e) {
console.log('fetch fail recent earn' , e)
     }
finally
     {
setLoading(false)
     }
}
if (!isAuthenticated) {
return (

       <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">

         <div className="text-center py-12">

           <h1 className="text-3xl font-bold text-foreground mb-4">Please sign in to view your profile</h1>

           <p className="text-muted-foreground">Sign in to manage your skills, track achievements, and view your progress</p>

         </div>

       </div>
     )
   }
if (authLoading || loading) {
return (
       <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">

         <div className="flex items-center justify-center py-12">

           <Loader2 className="h-8 w-8 animate-spin" />

           <span className="ml-2">Loading profile...</span>

         </div>

       </div>
     )
   }
const achList = [
     {
id: "7f6bc4a9-3531-4354-98b6-a75fb4542c9e",
       name: "First Gig",
       description: "You took the leap! Your first side hustle gig is complete. This is where every successful hustler starts their journey.",
       category: "Getting Started",
       icon: "🚀",
       color: "#3B82F6",
       rarity: "Common",
       points: 10
     }
,
     {
id: "adcdd479-d976-4cd7-a99b-673d31f40def",
       name: "First $100",
       description: "Your first $100 earned! This milestone proves you can turn your skills into real money. Time to celebrate and plan for the next $100!",
       category: "Earnings",
       icon: "💰",
       color: "#10B981",
       rarity: "Common",
       points: 15
     }
,
     {
id: "406bb995-ce7e-4591-938f-5042145c8075",
       name: "Tutoring Pro",
       description: "You've helped fellow students succeed while earning $500+ from tutoring! Your knowledge is valuable and you're making a real impact.",
       category: "Tutoring",
       icon: "📚",
       color: "#F59E0B",
       rarity: "Uncommon",
       points: 25
     }
,
     {
id: "3d96f597-72ed-4ec5-9c72-029336c60582",
       name: "Gig Grinder",
       description: "10+ gigs completed! You've proven your reliability and work ethic. Clients trust you, and you're building a solid reputation in the gig economy.",
       category: "Gig Work",
       icon: "⚡",
       color: "#8B5CF6",
       rarity: "Uncommon",
       points: 30
     }
,
     {
id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
       name: "UCF Hustler",
       description: "You've earned $1000+ from side hustles! You're not just a student anymore - you're a true entrepreneur building financial independence while studying.",
       category: "Milestones",
       icon: "🎓",
       color: "#EF4444",
       rarity: "Rare",
       points: 50
     }
];
const getUserSkillz = () => {
const em = user?.email;
if (em === 'alex.rodriguez@knights.ucf.edu') {
return [
         {
name: 'Mathematics', level: 90, category: 'Tutoring', experience: '3+ years' }
,
         {
name: 'Teaching', level: 85, category: 'Tutoring', experience: '3+ years' }
,
         {
name: 'Customer Service', level: 80, category: 'Gig Work', experience: '2+ years' }
,
         {
name: 'JavaScript', level: 75, category: 'Programming', experience: '2+ years' }
,
         {
name: 'Python', level: 70, category: 'Programming', experience: '1+ years' }
];
}
else if (em === 'maya.patel@knights.ucf.edu') {
return [
         {
name: 'Content Creation', level: 90, category: 'Marketing', experience: '2+ years' }
,
         {
name: 'Social Media', level: 85, category: 'Marketing', experience: '2+ years' }
,
         {
name: 'Photography', level: 75, category: 'Creative', experience: '1+ years' }
,
         {
name: 'Video Editing', level: 70, category: 'Creative', experience: '1+ years' }
,
         {
name: 'Public Speaking', level: 80, category: 'Communication', experience: '2+ years' }
];
}
else if (em === 'jordan.kim@knights.ucf.edu') {
return [
         {
name: 'Mathematics', level: 95, category: 'Academic', experience: '4+ years' }
,
         {
name: 'Physics', level: 85, category: 'Academic', experience: '3+ years' }
,
         {
name: 'Research', level: 80, category: 'Academic', experience: '1+ years' }
,
         {
name: 'Data Analysis', level: 75, category: 'Technical', experience: '1+ years' }
,
         {
name: 'Teamwork', level: 85, category: 'Soft Skills', experience: '2+ years' }
];
}
return user?.skills?.map(s => {
if (typeof s === 'string') {
return {
name: s,
           level: 50,
           category: "General",
           experience: "1+ years"
         }
}
else
       {
return {
name: s.name || 'Unknown Skill',
           level: s.level === 'Expert' ? 90 : s.level === 'Advanced' ? 75 : s.level === 'Intermediate' ? 50 : 25,
           category: "General",
           experience: s.experience || "1+ years"
         }
}
}
) || [];
}
;
const skillArr = getUserSkillz();
const getUserAch = () => {
const em = user?.email;
if (em === 'alex.rodriguez@knights.ucf.edu') {
return [
         achList[0],
         achList[1],
         achList[2],
         achList[3]
       ];
}
else if (em === 'maya.patel@knights.ucf.edu') {
return [
         achList[0],
         achList[1],
         achList[4]
       ];
}
else if (em === 'jordan.kim@knights.ucf.edu') {
return [
         achList[0],
         achList[1]
       ];
}
return user?.achievements?.map(aid => ({
name: "Achievement",
       description: "You've earned this achievement!",
       earned: true
     }
)) || [];
}
;
const achArr = getUserAch();
const actArr = earnArr.map(e => ({
type: "earning",
     description: e.description,
     amount: e.amount,
     date: new Date(e.date).toLocaleDateString()
   }
))




   return (

     <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">

       <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">

         <div className="mb-8">

         <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>

         <p className="text-muted-foreground">Manage your skills, track achievements, and view your progress</p>

       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

         <div className="lg:col-span-1 space-y-6">

           <Card>
             <CardHeader className="text-center">
               <Avatar className="w-24 h-24 mx-auto mb-4">
                 <AvatarImage src="https://via.placeholder.com/96x96/6366f1/ffffff?text=U" />
                 <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                   <User className="w-8 h-8" />
                 </AvatarFallback>
               </Avatar>
               <CardTitle>{
user?.firstName}
{
user?.lastName}
</CardTitle>
               <p className="text-muted-foreground">{
user?.bio || "Creative Professional"}
</p>
             </CardHeader>
             <CardContent className="space-y-4">

               <div className="flex items-center gap-2 text-sm">
                 <Mail className="w-4 h-4 text-muted-foreground" />
                 <span>{
user?.email}
</span>
               </div>
               {
user?.location && (
                 <div className="flex items-center gap-2 text-sm">
                   <MapPin className="w-4 h-4 text-muted-foreground" />
                   <span>{
user.location}
</span>
                 </div>
               )}
<div className="flex items-center gap-2 text-sm">
                 <Calendar className="w-4 h-4 text-muted-foreground" />
                 <span>Joined Sep 2025</span>
               </div>
               <div className="pt-4 border-t border-border">
                 <div className="grid grid-cols-2 gap-4 text-center">
                   <InvestmentModal totalEarnings={
user?.totalEarnings || 0}
>
                     <div className="cursor-pointer hover:bg-muted/50 rounded-lg p-2 transition-all duration-300 hover:scale-105">
                       <div className="text-2xl font-bold text-primary">
                         ${
user?.totalEarnings?.toLocaleString() || '0'}
</div>
                       <div className="text-xs text-muted-foreground">Total Earned</div>
                       <div className="text-xs text-accent mt-1">💡 Click to explore investment options</div>
                     </div>
                   </InvestmentModal>
                   <div>
                     <div className="text-2xl font-bold text-accent">
                       {
user?.totalHours || 0}
h
                     </div>
                     <div className="text-xs text-muted-foreground">Hours Worked</div>
                   </div>
                 </div>
               </div>
               <Button className="w-full">Edit Profile</Button>
             </CardContent>
           </Card>

           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <Award className="w-5 h-5" />
                 Achievements
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-3">
               {
achArr.map((ach, i) => (
                 <div key={
i}
className="flex items-center gap-3">
                   <div
                     className={
`w-8 h-8 rounded-full flex items-center justify-center ${
ach.earned ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                     }
`}
>
                     <Award className="w-4 h-4" />
                   </div>
                   <div className="flex-1">
                     <p
                       className={
`text-sm font-medium ${
ach.earned ? "text-foreground" : "text-muted-foreground"}
`}
>
                       {
ach.name}
</p>
                     <p className="text-xs text-muted-foreground">{
ach.description}
</p>
                   </div>
                 </div>
               ))}
</CardContent>
           </Card>
         </div>

         <div className="lg:col-span-2 space-y-6">

           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <TrendingUp className="w-5 h-5" />
                 Skill Progress
               </CardTitle>
               <p className="text-sm text-muted-foreground">Track your skill development across different areas</p>
             </CardHeader>
             <CardContent className="space-y-6">
               {
skillArr.map((sk, idx) => (
                 <div key={
idx}
className="space-y-2">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <span className="font-medium">{
sk.name}
</span>
                       <Badge variant="outline" className="text-xs">
                         {
sk.category}
</Badge>
                     </div>
                     <span className="text-sm text-muted-foreground">{
sk.level}
%</span>
                   </div>
                   <Progress value={
sk.level}
className="h-2" />
                 </div>
               ))}
<Button variant="outline" className="w-full bg-transparent">
                 <BookOpen className="w-4 h-4 mr-2" />
                 Explore Skill Courses
               </Button>
             </CardContent>
           </Card>

           <Card>
             <CardHeader>
               <CardTitle>Recent Activity</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-4">
                 {
actArr.length > 0 ? (
                   actArr.map((act, i) => (
                     <div
                       key={
i}
className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                     >
                       <div
                         className={
`w-2 h-2 rounded-full ${
act.type === "earning"
                             ? "bg-accent"
                             : act.type === "skill"
                               ? "bg-primary"
                               : "bg-chart-3"
                         }
`}
/>
                       <div className="flex-1">
                         <p className="text-sm font-medium">
                           {
act.type === 'earning' ? `Earned $${
act.amount}
from ${
act.description}
` : act.description}
</p>
                         <p className="text-xs text-muted-foreground">{
act.date}
</p>
                       </div>
                     </div>
                   ))
                 ) : (
                   <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
                 )}
</div>
             </CardContent>
           </Card>
         </div>
       </div>
       </div>
     </div>
   )
}
