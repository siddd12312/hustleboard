import * as React from 'react'


const MOBILE_BREAKPOINT = 768



export function useIsMobile( ) {
let [mob, setMob] = React.useState < boolean | undefined > (undefined)

  
  React.useEffect( () => {
let x = window.matchMedia(`(max-width: ${
MOBILE_BREAKPOINT - 1}
px)`)

    function f( ) {
setMob(window.innerWidth < MOBILE_BREAKPOINT)

    }
x.addEventListener('change',  f )

    setMob( window.innerWidth < MOBILE_BREAKPOINT )

    return ( ) => x.removeEventListener('change' , f )

  }
, [ ] )



  return !!mob

}
