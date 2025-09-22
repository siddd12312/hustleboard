"use client"

import {
useState, useEffect }
from "react"

import {
Button }
from "@/components/ui/button"

import {
Select, SelectContent, SelectItem, SelectTrigger, SelectValue }
from "@/components/ui/select"

import {
Input }
from "@/components/ui/input"

import {
Search, Loader2 }
from "lucide-react"

import {
OpportunityCard }
from "./opportunity-card"

import {
apiClient, Opportunity }
from "@/lib/api"

interface SkillResource 
{
name: string

  type: "course" | "tutorial" | "certification"

  url: string

  provider: string

}
interface Opportunity 
{
id: string

  title: string

  company: string

  payRange: string

  hoursPerWeek: string

  location: string

  skills: string[]

  description: string

  rating: number

  category: string

  timeCommitment: "part-time" | "flexible" | "weekend"

  payType: "hourly" | "project" | "monthly"

  skillsYoullGain?: string[]

  recommendedResource?: SkillResource

}
const mockOpportunities: Opportunity[] = [

  {
id: "1",
    title: "Freelance Graphic Designer",
    company: "Creative Studio Co",
    payRange: "$25-35/hr",
    hoursPerWeek: "10-15 hrs/week",
    location: "Remote",
    skills: ["Adobe Creative Suite", "Branding", "UI Design"],
    description: "Create visual content for social media campaigns and marketing materials.",
    rating: 4.8,
    category: "Design",
    timeCommitment: "flexible",
    payType: "hourly",
    skillsYoullGain: ["Advanced Typography", "Brand Strategy", "Client Communication"],
    recommendedResource: {
name: "Advanced Graphic Design Course",
      type: "course",
      url: "https://www.coursera.org/learn/graphic-design",
      provider: "Coursera",
    }
,
  }
,

  {
id: "2",
    title: "Social Media Manager",
    company: "Local Restaurant Chain",
    payRange: "$800-1200/month",
    hoursPerWeek: "8-12 hrs/week",
    location: "Hybrid",
    skills: ["Content Creation", "Analytics", "Community Management"],
    description: "Manage social media presence across multiple platforms and create engaging content.",
    rating: 4.5,
    category: "Marketing",
    timeCommitment: "part-time",
    payType: "monthly",
    skillsYoullGain: ["Social Media Strategy", "Data Analysis", "Content Planning"],
    recommendedResource: {
name: "Social Media Marketing Specialization",
      type: "course",
      url: "https://www.coursera.org/specializations/social-media-marketing",
      provider: "Coursera",
    }
,
  }
,

  {
id: "3",
    title: "Web Development Projects",
    company: "Tech Startup Hub",
    payRange: "$500-2000/project",
    hoursPerWeek: "5-20 hrs/week",
    location: "Remote",
    skills: ["React", "Node.js", "TypeScript"],
    description: "Build modern web applications for early-stage startups and small businesses.",
    rating: 4.9,
    category: "Development",
    timeCommitment: "flexible",
    payType: "project",
    skillsYoullGain: ["Full-Stack Development", "API Design", "Database Management"],
    recommendedResource: {
name: "Full-Stack Web Development Bootcamp",
      type: "course",
      url: "https://www.udemy.com/course/the-complete-web-development-bootcamp/",
      provider: "Udemy",
    }
,
  }
,

  {
id: "4",
    title: "Content Writer",
    company: "Digital Marketing Agency",
    payRange: "$20-30/hr",
    hoursPerWeek: "15-25 hrs/week",
    location: "Remote",
    skills: ["SEO Writing", "Research", "Content Strategy"],
    description: "Write blog posts, articles, and marketing copy for various clients.",
    rating: 4.6,
    category: "Writing",
    timeCommitment: "part-time",
    payType: "hourly",
    skillsYoullGain: ["SEO Optimization", "Content Marketing", "Editorial Skills"],
    recommendedResource: {
name: "Content Marketing Certification",
      type: "certification",
      url: "https://academy.hubspot.com/courses/content-marketing",
      provider: "HubSpot Academy",
    }
,
  }
,

  {
id: "5",
    title: "Online Tutoring",
    company: "EduTech Platform",
    payRange: "$18-25/hr",
    hoursPerWeek: "10-30 hrs/week",
    location: "Remote",
    skills: ["Mathematics", "Teaching", "Communication"],
    description: "Provide one-on-one tutoring sessions for high school and college students.",
    rating: 4.7,
    category: "Education",
    timeCommitment: "flexible",
    payType: "hourly",
    skillsYoullGain: ["Curriculum Development", "Student Assessment", "Online Teaching"],
    recommendedResource: {
name: "Online Teaching Fundamentals",
      type: "course",
      url: "https://www.edx.org/course/introduction-to-online-teaching",
      provider: "edX",
    }
,
  }
,

  {
id: "6",
    title: "Weekend Event Photography",
    company: "Event Planning Co",
    payRange: "$200-400/event",
    hoursPerWeek: "4-8 hrs/week",
    location: "Local",
    skills: ["Photography", "Photo Editing", "Customer Service"],
    description: "Capture special moments at weddings, parties, and corporate events.",
    rating: 4.4,
    category: "Photography",
    timeCommitment: "weekend",
    payType: "project",
    skillsYoullGain: ["Event Photography", "Photo Retouching", "Client Relations"],
    recommendedResource: {
name: "Professional Photography Masterclass",
      type: "course",
      url: "https://www.masterclass.com/classes/annie-leibovitz-teaches-photography",
      provider: "MasterClass",
    }
,
  }
,
]

export function OpportunityFeed() {
const [oppList, setOppList] = useState<Opportunity[]>([])

  const [load, setLoad] = useState(true)

  const [sTerm, setSTerm] = useState("")

  const [tf, setTf] = useState<string>("all")

  const [pf, setPf] = useState<string>("all")

  const [sf, setSf] = useState<string>("all")

  const [catz, setCatz] = useState<string[]>([])

  useEffect(() => {
getOpps()
      getCats()
  }
, [])

  const getOpps = async () => {
try 
    {
setLoad(true)

      const res = await apiClient.getOpportunities({
limit: 20,
          search: sTerm || undefined,
          category: sf !== "all" ? sf : undefined,
      }
)

      setOppList(res.data.opportunities)

    }
catch (err) {
console.log('fail fetch opps', err)

    }
finally 
    {
setLoad(false)
    }
}
const getCats = async () => {
try 
    {
const res = await apiClient.getOpportunityCategories()
      setCatz(res.data.categories)
    }
catch (err) {
console.log('fail fetch cats', err)
    }
}
useEffect(() => {
const tid = setTimeout(() => {
getOpps()
    }
, 500)

    return () => clearTimeout(tid)
  }
, [sTerm, sf])

  const filterdOpps = oppList.filter((o) => {
const matchS =
      o.title.toLowerCase().includes(sTerm.toLowerCase()) ||
      o.company.toLowerCase().includes(sTerm.toLowerCase()) ||
      o.requiredSkills.some((sk) => sk.toLowerCase().includes(sTerm.toLowerCase()))

    const matchT = tf === "all" || o.type === tf

    const matchSk =
      sf === "all" || o.requiredSkills.some((sk) => sk.toLowerCase().includes(sf.toLowerCase()))

    return matchS && matchT && matchSk
  }
)

  const allS = Array.from(new Set(oppList.flatMap((o) => o.requiredSkills)))

  return (

    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">

      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">

        <div className="mb-8">

        <h1 className="text-3xl font-bold text-foreground mb-2">
          Side Hustle Opportunities
        </h1>

        <p className="text-muted-foreground">
          Discover high-paying gigs that fit your schedule and skills
        </p>

      </div>


      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search opportunities, companies, or skills..."
              value={
sTerm}
onChange={
(e) => setSTerm(e.target.value)}
className="pl-10"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">

          <Select value={
tf}
onValueChange={
setTf}
>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Time Commitment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time Commitments</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="weekend">Weekend Only</SelectItem>
            </SelectContent>
          </Select>

          <Select value={
pf}
onValueChange={
setPf}
>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Pay Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pay Ranges</SelectItem>
              <SelectItem value="low">Under $20/hr</SelectItem>
              <SelectItem value="medium">$20-35/hr</SelectItem>
              <SelectItem value="high">$35+/hr</SelectItem>
            </SelectContent>
          </Select>

          <Select value={
sf}
onValueChange={
setSf}
>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Skills" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Skills</SelectItem>
              {
allS.map((sk) => (
                <SelectItem key={
sk}
value={
sk.toLowerCase()}
>
                  {
sk}
</SelectItem>
              ))}
</SelectContent>
          </Select>
        </div>
      </div>



      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {
filterdOpps.length}
of {
oppList.length}
opportunities
        </p>
      </div>


      {
load && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading opportunities...</span>
        </div>
      )}
{
!load && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {
filterdOpps.map((opp) => (
            <OpportunityCard key={
opp._id}
opportunity={
opp}
/>
          ))}
</div>
      )}
{
filterdOpps.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">No opportunities match your current filters</p>
          <Button
            variant="outline"
            onClick={
() => {
setSTerm("")
              setTf("all")
              setPf("all")
              setSf("all")
            }
}
>
            Clear Filters
          </Button>
        </div>
      )}
</div>

    </div>

  )

}
