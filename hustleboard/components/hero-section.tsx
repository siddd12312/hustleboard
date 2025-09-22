import {
Button }
from "@/components/ui/button"
import {
ArrowUpRight }
from "lucide-react"


export function HeroSection() {
return (


    <section className="min-h-[80vh] flex items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden py-16">

      <div    className="absolute inset-0 -z-10">

        <div
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl"
        />

        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        />

      </div>



      <div className="container mx-auto max-w-6xl">

        <div 
        className="grid lg:grid-cols-2 gap-8 items-center">

          <div className="space-y-6">

            <div
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl transition-all duration-500 hover:shadow-3xl hover:bg-white/15"
            >

              <h1
              className="text-5xl sm:text-6xl font-serif font-black text-foreground leading-tight"
              >

                Turn Your

                <span className="text-primary block">
                  Skills Into
                </span>

                <span className="text-accent">
                  Income
                </span>

              </h1>


              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed font-semibold mt-6">
                Discover side hustles that match your abilities. Track what works. Build the financial freedom you
                deserve.
              </p>


              <div className="flex flex-col sm:flex-row gap-3 mt-8">

                <Button 
                  size="lg"
                  className="text-base px-6 py-3 group rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >

                  Start Hustling

                  <ArrowUpRight
                    className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
                  />

                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="text-base px-6 py-3 bg-transparent rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-white/5"
                >
                  See How It Works
                </Button>

              </div>
            </div>
          </div>



          <div className="relative">

            <div
              className="bg-card border border-border rounded-3xl p-6 shadow-lg transition-all duration-500 hover:shadow-xl hover:scale-105"
            >

              <div className="space-y-4">

                <div className="flex items-center justify-between">

                  <span className="text-sm font-medium text-muted-foreground">
                    This Month
                  </span>

                  <span className="text-2xl font-bold text-primary">
                    $1,247
                  </span>

                </div>

                <div className="space-y-2">

                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      Freelance Writing
                    </span>
                    <span className="font-medium">
                      $680
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      Tutoring
                    </span>
                    <span className="font-medium">
                      $420
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      Design Projects
                    </span>
                    <span className="font-medium">
                      $147
                    </span>
                  </div>

                </div>

              </div>
            </div>
          </div>

        </div>
      </div>



    </section>


  )

}
