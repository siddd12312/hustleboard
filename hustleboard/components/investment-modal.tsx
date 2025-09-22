"use client"

import {
useState }
from "react"

import {
Dialog , DialogContent , DialogHeader , DialogTitle , DialogTrigger }
from "@/components/ui/dialog"

import {
Button }
from "@/components/ui/button"

import {
Badge }
from "@/components/ui/badge"

import {
ExternalLink , TrendingUp , DollarSign , BookOpen , Calculator , Target }
from "lucide-react"

interface InvestmentModalProps 
{
totalEarnings : number

    children : React.ReactNode
}
export function InvestmentModal({
totalEarnings , children }
: InvestmentModalProps) {
const [openFlag , setOpenFlag] = useState( false )



  const investResList = [
    {
title : "Vanguard Total Stock Market ETF (VTI)" ,

      description : "Low-cost index fund for broad market exposure" ,

      type : "ETF" ,

      minInvestment : 1 ,

      link : "https://investor.vanguard.com/investment-products/etfs/profile/vti" ,

      icon : TrendingUp
    }
,

    {
title : "Fidelity Zero Total Market Index Fund" ,

      description : "Zero-fee index fund for beginners" ,

      type : "Mutual Fund" ,

      minInvestment : 0 ,

      link : "https://www.fidelity.com/mutual-funds/fidelity-funds/zero-total-market-index-fund" ,

      icon : DollarSign
    }
,

    {
title : "Acorns" ,

      description : "Micro-investing app that rounds up purchases" ,

      type : "App" ,

      minInvestment : 0 ,

      link : "https://www.acorns.com/" ,

      icon : Calculator
    }
,

    {
title : "Robinhood" ,

      description : "Commission-free stock and ETF trading" ,

      type : "Platform" ,

      minInvestment : 0 ,

      link : "https://robinhood.com/" ,

      icon : Target
    }
,

    {
title : "Investopedia" ,

      description : "Learn the basics of investing" ,

      type : "Education" ,

      minInvestment : 0 ,

      link : "https://www.investopedia.com/" ,

      icon : BookOpen
    }
,

    {
title : "Bogleheads Wiki" ,

      description : "Community-driven investing knowledge" ,

      type : "Education" ,

      minInvestment : 0 ,

      link : "https://www.bogleheads.org/wiki/Main_Page" ,

      icon : BookOpen
    }
]



  const getAdv = (money : number) => {
if (money < 100) {
return {
title : "Start Small, Think Big!" ,
        advice : "Even with smaller earnings, you can start building wealth. Consider micro-investing apps or high-yield savings accounts." ,
        priority : "Build an emergency fund first, then start with $25-50 monthly investments."
      }
}
else if (money < 500) {
return {
title : "You're Ready to Invest!" ,
        advice : "With consistent earnings, you can start a regular investment plan. Consider index funds and ETFs for diversification." ,
        priority : "Aim to invest 10-20% of your side hustle income monthly."
      }
}
else if (money < 1000) {
return {
title : "Serious Investment Potential!" ,
        advice : "Your earnings show real potential. Consider a diversified portfolio with stocks, bonds, and alternative investments." ,
        priority : "Consider opening a Roth IRA and investing in low-cost index funds."
      }
}
else 
    {
return {
title : "Investment Powerhouse!" ,
        advice : "With significant earnings, you can build substantial wealth. Consider professional advice and advanced strategies." ,
        priority : "Maximize tax-advantaged accounts and consider real estate or business investments."
      }
}
}
const advObj = getAdv( totalEarnings )



  return (
    <Dialog open = {
openFlag }
onOpenChange = {
setOpenFlag }
>
      <DialogTrigger asChild>
        {
children }
</DialogTrigger>
      <DialogContent className = "max-w-4xl max-h-[80vh] overflow-y-auto" >
        <DialogHeader>
          <DialogTitle className = "text-2xl font-bold text-center" >
            Investment Opportunities
          </DialogTitle>
        </DialogHeader>

        <div className = "space-y-6" >


          <div className = "bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6 text-center" >
            <h3 className = "text-lg font-semibold mb-2" >Your Total Earnings</h3>
            <div className = "text-4xl font-bold text-primary mb-2" >
              ${
totalEarnings.toLocaleString() }
</div>
            <p className = "text-muted-foreground" >
              {
advObj.advice }
</p>
          </div>


          <div className = "bg-card border border-border rounded-2xl p-6" >
            <h3 className = "text-xl font-bold mb-4 flex items-center gap-2" >
              <Target className = "w-5 h-5 text-primary" />
              {
advObj.title }
</h3>
            <div className = "bg-primary/5 rounded-xl p-4" >
              <p className = "font-semibold text-primary mb-2" >Priority Action:</p>
              <p className = "text-muted-foreground" >{
advObj.priority }
</p>
            </div>
          </div>


          <div>
            <h3 className = "text-xl font-bold mb-4 flex items-center gap-2" >
              <BookOpen className = "w-5 h-5 text-accent" />
              Recommended Resources
            </h3>
            <div className = "grid grid-cols-1 md:grid-cols-2 gap-4" >
              {
investResList.map( (res , idx) => (
                <div
                  key = {
idx }
className = "border border-border rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                >
                  <div className = "flex items-start justify-between mb-3" >
                    <div className = "flex items-center gap-3" >
                      <div className = "w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors" >
                        <res.icon className = "w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h4 className = "font-semibold text-sm" >{
res.title }
</h4>
                        <Badge variant = "secondary" className = "text-xs" >
                          {
res.type }
</Badge>
                      </div>
                    </div>
                    <Button
                      size = "sm"
                      variant = "ghost"
                      className = "h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick = {
() => window.open( res.link , '_blank' ) }
>
                      <ExternalLink className = "w-4 h-4" />
                    </Button>
                  </div>
                  <p className = "text-sm text-muted-foreground mb-3" >
                    {
res.description }
</p>
                  <div className = "flex items-center justify-between" >
                    <span className = "text-xs text-muted-foreground" >
                      Min: ${
res.minInvestment }
</span>
                    <Button
                      size = "sm"
                      className = "text-xs"
                      onClick = {
() => window.open( res.link , '_blank' ) }
>
                      Learn More
                      <ExternalLink className = "w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              ) ) }
</div>
          </div>



          <div className = "bg-muted/50 rounded-xl p-4 text-sm text-muted-foreground" >
            <p className = "font-semibold mb-2" >Important Disclaimer:</p>
            <p>
              This information is for educational purposes only and not financial advice. 
              Always do your own research and consider consulting with a financial advisor 
              before making investment decisions. Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

}
