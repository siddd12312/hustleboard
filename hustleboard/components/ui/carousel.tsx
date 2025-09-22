'use client'




import * as React from 'react'



import useEmblaCarousel, {
type UseEmblaCarouselType,
}
from 'embla-carousel-react'



import {
ArrowLeft, ArrowRight }
from 'lucide-react'



import {
cn }
from '@/lib/utils'

import {
Button }
from '@/components/ui/button'






type CarouselApi = UseEmblaCarouselType[1]

type UseCarouselParameters = Parameters<typeof useEmblaCarousel>

type CarouselOptions = UseCarouselParameters[0]

type CarouselPlugin = UseCarouselParameters[1]





type CarouselProps = {
opts?: CarouselOptions

  plugins?: CarouselPlugin

  orientation?: 'horizontal' | 'vertical'

  setApi?: (api: CarouselApi) => void

}
type CarouselContextProps = {
carouselRef: ReturnType<typeof useEmblaCarousel>[0]

  api: ReturnType<typeof useEmblaCarousel>[1]

  scrollPrev: () => void

  scrollNext: () => void

  canScrollPrev: boolean

  canScrollNext: boolean

}
& CarouselProps



const CarouselContext = React.createContext<CarouselContextProps | null>(null)





function useCarousel() {
const ctx = React.useContext(CarouselContext)

  

  if (!ctx) {
throw new Error('useCarousel must be used within a <Carousel />')
  }
return ctx

}
function Carousel({
orientation = 'horizontal',
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}
: React.ComponentProps<'div'> & CarouselProps) {
const [ref, emblaApi] = useEmblaCarousel(
    {
...opts,
      axis: orientation === 'horizontal' ? 'x' : 'y',
    }
,
    plugins,
  )

  const [prevAble, setPrevAble] = React.useState(false)
  const [nextAble, setNextAble] = React.useState(false)



  const sel = React.useCallback((a: CarouselApi) => {
if (!a) return

    setPrevAble(a.canScrollPrev())

    setNextAble(a.canScrollNext())

  }
, [])



  const goPrev = React.useCallback(() => {
emblaApi?.scrollPrev()

  }
, [emblaApi])



  const goNext = React.useCallback(() => {
emblaApi?.scrollNext()

  }
, [emblaApi])



  const keyHandle = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
if (e.key === 'ArrowLeft') {
e.preventDefault()

        goPrev()

      }
else if (e.key === 'ArrowRight') {
e.preventDefault()

        goNext()

      }
}
,
    [goPrev, goNext],
  )



  React.useEffect(() => {
if (!emblaApi || !setApi) return

    setApi(emblaApi)

  }
, [emblaApi, setApi])



  React.useEffect(() => {
if (!emblaApi) return

    sel(emblaApi)

    emblaApi.on('reInit', sel)

    emblaApi.on('select', sel)



    return () => {
emblaApi?.off('select', sel)

    }
}
, [emblaApi, sel])



  return (

    <CarouselContext.Provider
      value={
{
carouselRef: ref,
        api: emblaApi,
        opts,
        orientation:
          orientation || (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
        scrollPrev: goPrev,
        scrollNext: goNext,
        canScrollPrev: prevAble,
        canScrollNext: nextAble,
      }
}
>
      <div
        onKeyDownCapture={
keyHandle}
className={
cn('relative', className)}
role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {
...props}
>
        {
children}
</div>
    </CarouselContext.Provider>

  )

}
function CarouselContent({
className, ...props }
: React.ComponentProps<'div'>) {
const {
carouselRef, orientation }
= useCarousel()



  return (

    <div
      ref={
carouselRef}
className="overflow-hidden"
      data-slot="carousel-content"
    >

      <div

        className={
cn(
          'flex',
          orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
          className,
        )}
{
...props}
/>

    </div>

  )

}
function CarouselItem({
className, ...props }
: React.ComponentProps<'div'>) {
const {
orientation }
= useCarousel()



  return (

    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={
cn(
        'min-w-0 shrink-0 grow-0 basis-full',
        orientation === 'horizontal' ? 'pl-4' : 'pt-4',
        className,
      )}
{
...props}
/>

  )

}
function CarouselPrevious({
className,
  variant = 'outline',
  size = 'icon',
  ...props
}
: React.ComponentProps<typeof Button>) {
const {
orientation, scrollPrev, canScrollPrev }
= useCarousel()



  return (

    <Button
      data-slot="carousel-previous"
      variant={
variant}
size={
size}
className={
cn(
        'absolute size-8 rounded-full',
        orientation === 'horizontal'
          ? 'top-1/2 -left-12 -translate-y-1/2'
          : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
        className,
      )}
disabled={
!canScrollPrev}
onClick={
scrollPrev}
{
...props}
>
      <ArrowLeft />
      <span className="sr-only">Previous slide</span>
    </Button>

  )

}
function CarouselNext({
className,
  variant = 'outline',
  size = 'icon',
  ...props
}
: React.ComponentProps<typeof Button>) {
const {
orientation, scrollNext, canScrollNext }
= useCarousel()



  return (

    <Button
      data-slot="carousel-next"
      variant={
variant}
size={
size}
className={
cn(
        'absolute size-8 rounded-full',
        orientation === 'horizontal'
          ? 'top-1/2 -right-12 -translate-y-1/2'
          : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
        className,
      )}
disabled={
!canScrollNext}
onClick={
scrollNext}
{
...props}
>
      <ArrowRight />
      <span className="sr-only">Next slide</span>
    </Button>

  )

}
export {
type CarouselApi,

  Carousel,

  CarouselContent,

  CarouselItem,

  CarouselPrevious,

  CarouselNext,
}
