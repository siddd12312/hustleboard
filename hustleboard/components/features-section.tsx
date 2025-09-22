import {
Target, Zap, BarChart3 }
from "lucide-react"

import {
Card, CardContent }
from "@/components/ui/card"



export function FeaturesSection( ) {
let stuff = [
     {
icon: Target,
       title: "Curated Opportunities",
       description:
         "Hand-picked side hustles that actually work for new grads. No MLM schemes or get-rich-quick nonsense.",
     }
,

     {
icon: BarChart3,
       title: "Smart Analytics",
       description: "See which hustles pay off. Track time invested vs. money earned with brutally honest metrics.",
     }
,

     {
icon: Zap,
       title: "Skill Matching",
       description: "We connect your existing abilities to income opportunities you never considered.",
     }
,
   ]


   return (
     <section className="py-16 px-4 relative">

       <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-accent/5 to-transparent" />



       <div className="max-w-7xl mx-auto">

         <div className="grid lg:grid-cols-5 gap-12 items-center">
       
           <div className="lg:col-span-2 space-y-6">
         
             <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl transition-all duration-500 hover:shadow-3xl hover:bg-white/15">
           
               <div className="space-y-4">
            
                 <h2 className="text-4xl font-serif font-black text-foreground leading-tight">
                   Stop Scrolling.
                   <span className="text-primary block">Start Earning.</span>
                 </h2>

                 <p className="text-lg text-muted-foreground leading-relaxed font-semibold">
                   Most side hustle advice is garbage. We focus on what actually works for people who just graduated and
                   need real income, fast.
                 </p>
               </div>
            
               <div className="flex items-center gap-4 mt-6">
                 <div className="flex -space-x-2">
                   <div className="w-10 h-10 bg-primary rounded-full border-2 border-background" />
                   <div className="w-10 h-10 bg-accent rounded-full border-2 border-background" />
                   <div className="w-10 h-10 bg-chart-3 rounded-full border-2 border-background" />
                 </div>
                 <div className="text-sm text-muted-foreground font-semibold">
                   <span className="font-bold text-foreground">2,847</span> grads already earning
                 </div>
               </div>
             </div>
           </div>


           <div className="lg:col-span-3">
             <div className="grid gap-6">
               {
stuff.map((thing , idx) => (
                 <Card
                   key={
idx}
className="border-border/30 hover:border-accent/50 transition-all duration-500 hover:shadow-xl hover:scale-105 group rounded-2xl"
                 >
                   <CardContent className="p-6">
                     <div className="flex items-start gap-4">
                       <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-all duration-300 group-hover:scale-110">
                         <thing.icon className="w-6 h-6 text-accent" />
                       </div>
                       <div className="space-y-2">
                         <h3 className="text-xl font-semibold font-serif">{
thing.title}
</h3>
                         <p className="text-muted-foreground leading-relaxed">{
thing.description}
</p>
                       </div>
                     </div>
                   </CardContent>
                 </Card>
               ))}
</div>
           </div>
         </div>
       </div>
     </section>
   )
}
