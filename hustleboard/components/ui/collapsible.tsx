'use client'

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'


function Collapsible({
...stuff }
: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
return (
   <CollapsiblePrimitive.Root
      data-slot =   "collapsible"
      {
...stuff}
/>
   )

}
function CollapsibleTrigger({
...stuff2 }
: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
return (
     <CollapsiblePrimitive.CollapsibleTrigger

      data-slot= "collapsible-trigger"    {
...stuff2}
/>
   )
}
function CollapsibleContent({
...stuff3
 }
: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
return (

    <CollapsiblePrimitive.CollapsibleContent

      data-slot="collapsible-content"
      {
...stuff3}
/>

  )

}
export {
Collapsible, CollapsibleTrigger, CollapsibleContent }
