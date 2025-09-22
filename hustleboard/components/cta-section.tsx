import {
Button }
from "@/components/ui/button"

import {
ArrowUpRight , Sparkles }
from "lucide-react"



export function CTASection() {
return (

    <section className="py-16 px-4 relative overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/3 rounded-full blur-3xl" />



      <div className="max-w-4xl mx-auto text-center relative">

        <div
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl transition-all duration-500 hover:shadow-3xl hover:bg-white/15"
        >

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-sm font-medium text-accent mb-6">

            <Sparkles className="w-4 h-4" />

            Join the Movement

          </div>



          <h2 className="text-5xl font-serif font-black text-foreground mb-6 leading-tight">

            Your Side Hustle

            <span className="text-primary block">Starts Today</span>

          </h2>



          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed font-semibold">

            Stop wondering "what if" and start building the income stream that changes everything. It's free to start.

          </p>




          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">

          <Button size="lg" className="text-lg px-10 py-4 group rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg">

            Start Building Income

            <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />

          </Button>



            <div className="text-sm text-muted-foreground font-semibold">

              No credit card required • 5 min setup

            </div>

          </div>




          <div className="mt-16 pt-8 border-t border-border/30">

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">

              <div className="flex items-center gap-2">

                <div className="w-2 h-2 bg-accent rounded-full" />

                <span className="font-semibold">

                  Average first month: <span className="font-bold text-foreground">$340</span>

                </span>

              </div>

              <div className="flex items-center gap-2">

                <div className="w-2 h-2 bg-primary rounded-full" />

                <span className="font-semibold">

                  Setup time: <span className="font-bold text-foreground">Under 5 minutes</span>

                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>

  )

}
