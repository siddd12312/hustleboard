import {
Card,    CardContent }
from "@/components/ui/card"

import {
Button }
from "@/components/ui/button"

import {
Badge }
from "@/components/ui/badge"

import {
Clock, DollarSign, MapPin, Star, TrendingUp, BookOpen, ExternalLink, Eye, Send }
from "lucide-react"

import Link from "next/link"

import {
Opportunity }
from "@/lib/api"

import {
useState }
from "react"

import {
useAuth }
from "@/contexts/AuthContext"

interface OpportunityCardProps {
opportunity: Opportunity

}
export function OpportunityCard({
opportunity }
: OpportunityCardProps) {
const {
isAuthenticated }
= useAuth()

  const [doingApply, setDoingApply] = useState(false)

  const [showMore, setShowMore] = useState(false)

  const tryApply = async () => {
if (!isAuthenticated) {
alert('Please sign in to apply for opportunities')

      return

    }
setDoingApply(true)

    try
    {
await new Promise(res=> setTimeout(res, 1000))

      alert(`Application submitted for ${
opportunity.title}
at ${
opportunity.company}
!`)

    }
catch (err) {
alert('Failed to submit application. Please try again.')

    }
finally
    {
setDoingApply(false)

    }
}
const seeMore = () => {
setShowMore(!showMore)

  }
return (

    <Card className="group hover:shadow-xl transition-all duration-300 border-l-4 border-l-accent overflow-hidden bg-gradient-to-br from-background to-muted/20">

      <CardContent className="p-4">

        <div className="flex items-start justify-between mb-3">

          <div className="flex-1 min-w-0">

            <div className="flex items-center gap-2 mb-1">

              <h3 className="font-serif text-lg font-semibold text-foreground truncate">{
opportunity.title}
</h3>

              <div className="flex items-center gap-1 text-xs">

                <Star className="w-3 h-3 fill-accent text-accent" />

                <span className="font-mono text-accent">4.5</span>

              </div>

            </div>

            <p className="text-sm text-muted-foreground mb-2">{
opportunity.company}
</p>

          </div>

          <Badge variant="secondary" className="ml-2 bg-accent/10 text-accent border-accent/30 text-xs px-2 py-1">

            {
opportunity.category}
</Badge>

        </div>



        <div className="grid grid-cols-3 gap-2 mb-3 text-xs">

          <div className="flex items-center gap-1 bg-primary/5 rounded px-2 py-1">

            <DollarSign className="w-3 h-3 text-primary" />

            <span className="font-mono font-medium">

              ${
opportunity.compensation.min}
-${
opportunity.compensation.max}
/{
opportunity.compensation.period}
</span>

          </div>

          <div className="flex items-center gap-1 bg-chart-2/5 rounded px-2 py-1">

            <Clock className="w-3 h-3 text-chart-2" />

            <span className="truncate">{
opportunity.type}
</span>

          </div>

          <div className="flex items-center gap-1 bg-chart-3/5 rounded px-2 py-1">

            <MapPin className="w-3 h-3 text-chart-3" />

            <span className="truncate">

              {
opportunity.location.remote ? 'Remote' : `${
opportunity.location.city}
, ${
opportunity.location.state}
`}
</span>

          </div>

        </div>



        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{
opportunity.description}
</p>



        <div className="mb-3">

          <div className="flex flex-wrap gap-1">

            {
opportunity.requiredSkills.slice(0, 3).map((item) => (

              <Badge key={
item}
variant="outline" className="text-xs px-2 py-0.5 h-5">

                {
item}
</Badge>

            ))}
{
opportunity.requiredSkills.length > 3 && (

              <Badge variant="outline" className="text-xs px-2 py-0.5 h-5 text-muted-foreground">

                +{
opportunity.requiredSkills.length - 3}
</Badge>

            )}
</div>

        </div>



        {
opportunity.preferredSkills && opportunity.preferredSkills.length > 0 && (

          <div className="mb-3 p-2 bg-gradient-to-r from-accent/5 to-primary/5 rounded border-l-2 border-accent">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-1">

                <TrendingUp className="w-3 h-3 text-accent" />

                <span className="text-xs font-medium text-accent">Growth:</span>

                <span className="text-xs text-muted-foreground">

                  {
opportunity.preferredSkills.slice(0, 2).join(", ")}
{
opportunity.preferredSkills.length > 2 && "..."}
</span>

              </div>

              {
opportunity.applicationUrl && (

                <Link

                  href={
opportunity.applicationUrl}
target="_blank"

                  className="flex items-center gap-1 text-xs text-primary hover:text-accent transition-colors"

                >

                  <BookOpen className="w-3 h-3" />

                  <ExternalLink className="w-2 h-2" />

                </Link>

              )}
</div>

          </div>

        )}
{
showMore && (

          <div className="mb-4 p-3 bg-muted/30 rounded-lg border">

            <h4 className="font-semibold text-sm mb-2 text-foreground">Job Details</h4>

            <div className="space-y-2 text-xs text-muted-foreground">

              <div>

                <span className="font-medium">Description:</span>

                <p className="mt-1">{
opportunity.description}
</p>

              </div>

              <div>

                <span className="font-medium">Requirements:</span>

                <ul className="mt-1 list-disc list-inside">

                  {
opportunity.requirements?.slice(0, 3).map((reqi, idx) => (

                    <li key={
idx}
>{
reqi}
</li>

                  ))}
</ul>

              </div>

              <div>

                <span className="font-medium">Benefits:</span>

                <ul className="mt-1 list-disc list-inside">

                  {
opportunity.benefits?.slice(0, 3).map((b, ind) => (

                    <li key={
ind}
>{
b}
</li>

                  ))}
</ul>

              </div>

              <div className="flex gap-4">

                <div>

                  <span className="font-medium">Start Date:</span>

                  <p>{
new Date(opportunity.startDate).toLocaleDateString()}
</p>

                </div>

                <div>

                  <span className="font-medium">Deadline:</span>

                  <p>{
new Date(opportunity.applicationDeadline).toLocaleDateString()}
</p>

                </div>

              </div>

            </div>

          </div>

        )}
<div className="flex gap-2">

          <Button 

            size="sm" 

            className="flex-1 h-8 text-xs font-medium"

            onClick={
tryApply}
disabled={
doingApply}
>

            {
doingApply ? (

              <>

                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1" />

                Applying...

              </>

            ) : (

              <>

                <Send className="w-3 h-3 mr-1" />

                Apply

              </>

            )}
</Button>

          <Button 

            variant="outline" 

            size="sm" 

            className="h-8 px-3 text-xs bg-transparent"

            onClick={
seeMore}
>

            <Eye className="w-3 h-3 mr-1" />

            {
showMore ? 'Hide' : 'Details'}
</Button>

        </div>

      </CardContent>

    </Card>

  )

}
