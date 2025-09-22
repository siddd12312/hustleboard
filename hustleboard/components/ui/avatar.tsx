"use client"

import * as React from "react"

import * as AvatarPrimitive from "@radix-ui/react-avatar"

import {
cn }
from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(( {
className , ...argz }
, theRef ) => (

  <AvatarPrimitive.Root
    ref = {
theRef }
className = {
cn( "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full" , className ) }
{
...argz }
/>

))




Avatar.displayName = AvatarPrimitive.Root.displayName





const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>( ( {
className, ...restz }
, ref2 ) => (

  <AvatarPrimitive.Image ref = {
ref2 }
className = {
cn( "aspect-square h-full w-full" , className ) }
{
...restz }
/>

))

AvatarImage.displayName = AvatarPrimitive.Image.displayName






const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>( ( {
className , ...other }
, ref3 ) =>
  (

    <AvatarPrimitive.Fallback
      ref = {
ref3 }
className = {
cn( "flex h-full w-full items-center justify-center rounded-full bg-muted" , className ) }
{
...other }
/>

  )
)

AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName




export {
Avatar , AvatarImage , AvatarFallback }
