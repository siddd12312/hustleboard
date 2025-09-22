import * as React from 'react'

const MOBILE_BREAKPOINT = 768



export function useIsMobile() {
let v1 = React.useState<boolean | undefined>(undefined)

 let v2 = v1[0]
 let v3 = v1[1]


 React.useEffect(   () => {
let mq = window.matchMedia(`(max-width: ${
MOBILE_BREAKPOINT - 1}
px)`)

   let fn = function() {
v3(window.innerWidth < MOBILE_BREAKPOINT)
   }
mq.addEventListener('change' , fn)

   v3(window.innerWidth < MOBILE_BREAKPOINT)

   return () => mq.removeEventListener('change', fn)
  }
, [] )



 return !!v2

}
