"use client"

import {
useState, useEffect }
from "react"

import {
Card, CardContent, CardHeader, CardTitle }
from "@/components/ui/card"

import {
Badge }
from "@/components/ui/badge"

import {
Button }
from "@/components/ui/button"

import {
Select, SelectContent, SelectItem, SelectTrigger, SelectValue }
from "@/components/ui/select"

import {
BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell }
from "recharts"

import {
DollarSign, Clock, TrendingUp, Target, Calendar, Plus, Loader2 }
from "lucide-react"

import {
apiClient, Hustle, Earning }
from "@/lib/api"

import {
useAuth }
from "@/contexts/AuthContext"





const defMonEarn = [
  {
month: "Jan", freelance: 0, tutoring: 0, photography: 0 }
,

  {
month: "Feb", freelance: 0, tutoring: 0, photography: 0 }
,

  {
month: "Mar", freelance: 0, tutoring: 0, photography: 0 }
,

  {
month: "Apr", freelance: 0, tutoring: 0, photography: 0 }
,

  {
month: "May", freelance: 0, tutoring: 0, photography: 0 }
,

  {
month: "Jun", freelance: 0, tutoring: 0, photography: 0 }
,
]



const defBreakdown = [
  {
name: "No Data", value: 0, color: "var(--color-chart-1)" }
,
]



const defRoi = [
  {
hustle: "No Data", hoursWorked: 0, earnings: 0, roi: 0 }
,
]



export function HustleDashboard() {
const {
user, isAuthenticated }
= useAuth()

  const [isLoading, setIsLoading] = useState(true)

  const [dashData, setDashData] = useState({
totalEarnings: 0,

    totalHours: 0,

    averageRate: 0,

    activeHustles: 0,

    totalHustles: 0,

    recentEarnings: 0,

    recentHours: 0,

    recentAvgRate: 0,

    recentTransactions: 0,

    earningsChange: 0,

    hoursChange: 0,
  }
)

  const [myHustles, setMyHustles] = useState<Hustle[]>([])

  const [myEarns, setMyEarns] = useState<Earning[]>([])

  const [monEarn, setMonEarn] = useState(defMonEarn)

  const [monEarnByCat, setMonEarnByCat] = useState({
}
)

  const [breakdown, setBreakdown] = useState(defBreakdown)

  const [roiList, setRoiList] = useState(defRoi)

  const [recentActs, setRecentActs] = useState<any[]>([])





  useEffect(() => {
if (isAuthenticated) {
getDashData()

    }
}
, [isAuthenticated])







  const getDashData = async () => {
try {
setIsLoading(true)

      

      const metResp = await apiClient.getDashboardMetrics()

      setDashData(metResp.data)

      

      const hustResp = await apiClient.getHustles({
limit: 10 }
)

      setMyHustles(hustResp.data.hustles)

      

      const earnResp = await apiClient.getEarnings({
limit: 10, sortBy: 'date', sortOrder: 'desc' }
)

      setMyEarns(earnResp.data.earnings)

      

      try {
const monResp = await apiClient.getDashboardEarnings({
year: new Date().getFullYear() }
)

        if (monResp.data.monthly) {
setMonEarn(monResp.data.monthly)

        }
if (monResp.data.byCategory) {
setMonEarnByCat(monResp.data.byCategory)

          

          const chartData = procMonEarnData(monResp.data.byCategory)

          setMonEarn(chartData)

        }
}
catch (error) {
console.warn('fetch mon earn fail', error)

      }
procChartData(hustResp.data.hustles, earnResp.data.earnings)

      

      makeRecentActs(earnResp.data.earnings)

      

    }
catch (error) {
console.error('fail dash data', error)

    }
finally {
setIsLoading(false)

    }
}
const procChartData = (husts: Hustle[], earns: Earning[]) => {
const bd = husts.map((h, i) => ({
name: h.title,

      value: h.totalEarnings,

      color: `var(--color-chart-${
(i % 3) + 1}
)`

    }
))

    setBreakdown(bd.length > 0 ? bd : defBreakdown)

    

    const roiArr = husts.map(h => ({
hustle: h.title,

      hoursWorked: h.totalHours,

      earnings: h.totalEarnings,

      roi: h.totalHours > 0 ? h.totalEarnings / h.totalHours : 0

    }
))

    setRoiList(roiArr.length > 0 ? roiArr : defRoi)

  }
const procMonEarnData = (catData: any) => {
if (!catData || Object.keys(catData).length === 0) {
return defMonEarn

    }
const firstCat = Object.keys(catData)[0]

    if (!firstCat || !catData[firstCat]) {
return defMonEarn

    }
const monthsArr = catData[firstCat]

    return monthsArr.map((monObj: any) => {
const out: any = {
month: monObj.monthName,

        freelance: 0,

        tutoring: 0,

        photography: 0

      }
Object.keys(catData).forEach(cat => {
const catMonths = catData[cat]

        const dataMon = catMonths.find((m: any) => m.monthName === out.month)

        

        if (dataMon) {
switch (cat) {
case 'Tutoring':

              out.tutoring = dataMon.totalEarnings

              break

            case 'Gig Work':

              out.freelance = dataMon.totalEarnings

              break

            case 'Content Creation':

              out.photography = dataMon.totalEarnings

              break

            default:

              out.freelance += dataMon.totalEarnings

          }
}
}
)



      return out

    }
)

  }
const makeRecentActs = (earns: Earning[]) => {
const acts = earns.slice(0, 4).map(e => ({
id: e._id,

      type: "earning",

      description: e.description,

      amount: e.amount,

      date: new Date(e.date).toLocaleDateString()

    }
))

    setRecentActs(acts)

  }
if (!isAuthenticated) {
return (

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        <div className="text-center py-12">

          <h1 className="text-3xl font-bold text-foreground mb-4">Please sign in to view your dashboard</h1>

          <p className="text-muted-foreground">Sign in to track your side hustle performance and earnings</p>

        </div>

      </div>

    )

  }
if (isLoading) {
return (

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        <div className="flex items-center justify-center py-12">

          <Loader2 className="h-8 w-8 animate-spin" />

          <span className="ml-2">Loading dashboard...</span>

        </div>

      </div>

    )

  }
return (

    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl transition-all duration-500 hover:shadow-3xl hover:bg-white/15 animate-fade-in">

        <div className="mb-8">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>

            <h1 className="text-3xl font-bold text-foreground mb-2">Hustle Dashboard</h1>

            <p className="text-muted-foreground">Track your side hustle performance and earnings</p>

          </div>

          <div className="flex items-center gap-3">

            <Select defaultValue="6months">

              <SelectTrigger className="w-40">

                <SelectValue />

              </SelectTrigger>

              <SelectContent>

                <SelectItem value="1month">Last Month</SelectItem>

                <SelectItem value="3months">Last 3 Months</SelectItem>

                <SelectItem value="6months">Last 6 Months</SelectItem>

                <SelectItem value="1year">Last Year</SelectItem>

              </SelectContent>

            </Select>

            <Button>

              <Plus className="w-4 h-4 mr-2" />

              Add Hustle

            </Button>

          </div>

        </div>

      </div>





      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <Card>

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>

            <DollarSign className="h-4 w-4 text-muted-foreground" />

          </CardHeader>

          <CardContent>

            <div className="text-2xl font-bold">${
dashData.totalEarnings.toLocaleString()}
</div>

            <p className="text-xs text-muted-foreground">

              <span className={
`${
dashData.earningsChange >= 0 ? 'text-accent' : 'text-red-500'}
`}
>

                {
dashData.earningsChange >= 0 ? '+' : ''}
{
dashData.earningsChange}
%

              </span> from last month

            </p>

          </CardContent>

        </Card>



        <Card>

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

            <CardTitle className="text-sm font-medium">Hours Worked</CardTitle>

            <Clock className="h-4 w-4 text-muted-foreground" />

          </CardHeader>

          <CardContent>

            <div className="text-2xl font-bold">{
dashData.totalHours}
h</div>

            <p className="text-xs text-muted-foreground">

              <span className={
`${
dashData.hoursChange >= 0 ? 'text-primary' : 'text-red-500'}
`}
>

                {
dashData.hoursChange >= 0 ? '+' : ''}
{
dashData.hoursChange}
%

              </span> from last month

            </p>

          </CardContent>

        </Card>



        <Card>

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

            <CardTitle className="text-sm font-medium">Avg. Hourly Rate</CardTitle>

            <TrendingUp className="h-4 w-4 text-muted-foreground" />

          </CardHeader>

          <CardContent>

            <div className="text-2xl font-bold">${
dashData.averageRate.toFixed(0)}
/hr</div>

            <p className="text-xs text-muted-foreground">

              <span className="text-accent">+{
dashData.recentAvgRate > 0 ? '2.3%' : '0%'}
</span> from last month

            </p>

          </CardContent>

        </Card>



        <Card>

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

            <CardTitle className="text-sm font-medium">Active Hustles</CardTitle>

            <Target className="h-4 w-4 text-muted-foreground" />

          </CardHeader>

          <CardContent>

            <div className="text-2xl font-bold">{
dashData.activeHustles}
</div>

            <p className="text-xs text-muted-foreground">

              <span className="text-chart-3">12</span> total hustles

            </p>

          </CardContent>

        </Card>

      </div>





      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

        

        <Card>

          <CardHeader>

            <CardTitle>Monthly Earnings by Hustle</CardTitle>

          </CardHeader>

          <CardContent>

            <ResponsiveContainer width="100%" height={
300}
>

              <BarChart data={
monEarn}
>

                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />

                <XAxis dataKey="month" className="text-muted-foreground" />

                <YAxis className="text-muted-foreground" />

                <Tooltip

                  contentStyle={
{
backgroundColor: "hsl(var(--card))",

                    border: "1px solid hsl(var(--border))",

                    borderRadius: "8px",

                  }
}
/>

                <Bar dataKey="freelance" stackId="a" fill="var(--color-chart-1)" name="Gig Work" />

                <Bar dataKey="tutoring" stackId="a" fill="var(--color-chart-2)" name="Tutoring" />

                <Bar dataKey="photography" stackId="a" fill="var(--color-chart-3)" name="Content Creation" />

              </BarChart>

            </ResponsiveContainer>

          </CardContent>

        </Card>



        

        <Card>

          <CardHeader>

            <CardTitle>Earnings Distribution</CardTitle>

          </CardHeader>

          <CardContent>

            <ResponsiveContainer width="100%" height={
300}
>

              <PieChart>

                <Pie

                  data={
breakdown}
cx="50%"

                  cy="50%"

                  labelLine={
false}
label={
({
name, percent }
) => `${
name}
${
(percent * 100).toFixed(0)}
%`}
outerRadius={
80}
fill="#8884d8"

                  dataKey="value"

                >

                  {
breakdown.map((entry, index) => (

                    <Cell key={
`cell-${
index}
`}
fill={
entry.color}
/>

                  ))}
</Pie>

                <Tooltip

                  formatter={
(value: number) => [`$${
value.toLocaleString()}
`, "Earnings"]}
contentStyle={
{
backgroundColor: "hsl(var(--card))",

                    border: "1px solid hsl(var(--border))",

                    borderRadius: "8px",

                  }
}
/>

              </PieChart>

            </ResponsiveContainer>

          </CardContent>

        </Card>

      </div>





      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        

        <Card>

          <CardHeader>

            <CardTitle>ROI Analysis</CardTitle>

            <p className="text-sm text-muted-foreground">Earnings per hour worked</p>

          </CardHeader>

          <CardContent>

            <div className="space-y-4">

              {
roiList.map((itm, idx) => (

                <div key={
idx}
className="flex items-center justify-between p-4 rounded-lg bg-muted/50">

                  <div>

                    <h4 className="font-medium">{
itm.hustle}
</h4>

                    <p className="text-sm text-muted-foreground">

                      {
itm.hoursWorked}
h worked • ${
itm.earnings.toLocaleString()}
earned

                    </p>

                  </div>

                  <div className="text-right">

                    <div className="text-lg font-bold text-accent">${
itm.roi.toFixed(2)}
/hr</div>

                    <Badge variant="secondary" className="text-xs">

                      {
itm.roi > 25 ? "High ROI" : itm.roi > 20 ? "Good ROI" : "Fair ROI"}
</Badge>

                  </div>

                </div>

              ))}
</div>

          </CardContent>

        </Card>



        

        <Card>

          <CardHeader>

            <CardTitle>Recent Activity</CardTitle>

          </CardHeader>

          <CardContent>

            <div className="space-y-4">

              {
recentActs.map((actvt) => (

                <div

                  key={
actvt.id}
className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"

                >

                  <div className={
`w-2 h-2 rounded-full ${
actvt.type === "earning" ? "bg-accent" : "bg-primary"}
`}
/>

                  <div className="flex-1">

                    <p className="text-sm font-medium">{
actvt.description}
</p>

                    <p className="text-xs text-muted-foreground">{
actvt.date}
</p>

                  </div>

                  {
actvt.amount && <div className="text-sm font-medium text-accent">+${
actvt.amount}
</div>}
</div>

              ))}
</div>

            <Button variant="outline" className="w-full mt-4 bg-transparent">

              <Calendar className="w-4 h-4 mr-2" />

              View All Activity

            </Button>

          </CardContent>

        </Card>

      </div>

      </div>

    </div>

  )

}
