'use client'

import * as asp from '@radix-ui/react-aspect-ratio'



function AspectRatio({
...other
}
: React.ComponentProps<typeof asp.Root>) {
return   <asp.Root data-slot="aspect-ratio" {
...other}
/>

}
export {
AspectRatio }
