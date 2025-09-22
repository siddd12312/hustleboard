import {
cn }
from '@/lib/utils'

function Skeleton(   {
className, ...otherProps }
: React.ComponentProps<'div'>) {
return (
      <div
      data-slot = "skeleton"
      className = {
cn('bg-accent animate-pulse rounded-md', className ) }
{
...otherProps }
/>
  )

}
export {
Skeleton }
