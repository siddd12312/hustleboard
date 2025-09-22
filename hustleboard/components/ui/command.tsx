'use client'

import * as React   from 'react'

import {
Command as CmdPrm }
from 'cmdk'

import {
SearchIcon }
from 'lucide-react'

import {
cn }
from '@/lib/utils'

import {
Dialog,
 DialogContent,
 DialogDescription,
 DialogHeader,
 DialogTitle,
}
from '@/components/ui/dialog'





function Command({
className,
 ...rest
}
: React.ComponentProps<typeof CmdPrm>) {
return (
     <CmdPrm
       data-slot="command"
       className={
cn(
         'bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md',
         className,
       )}
{
...rest}
/>
   )
}
function CommandDialog({
title = 'Command Palette',
  description = 'Search for a command to run...',
  children,
  className,
  showCloseButton = true,
  ...extra
}
: React.ComponentProps<typeof Dialog> & {
title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
}
) {
return (

    <Dialog {
...extra}
>
      <DialogHeader className="sr-only">
        <DialogTitle>{
title}
</DialogTitle>
        <DialogDescription>{
description}
</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={
cn('overflow-hidden p-0', className)}
showCloseButton={
showCloseButton}
>
        <Command className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {
children}
</Command>
      </DialogContent>
    </Dialog>
  )
}
function CommandInput({
className,
  ...prps
}
: React.ComponentProps<typeof CmdPrm.Input>) {
return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-9 items-center gap-2 border-b px-3"
    >
      <SearchIcon className="size-4 shrink-0 opacity-50" />
      <CmdPrm.Input
        data-slot="command-input"
        className={
cn(
          'placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
{
...prps}
/>
    </div>
  )
}
function CommandList({
className,
  ...prps
}
: React.ComponentProps<typeof CmdPrm.List>) {
return (
    <CmdPrm.List
      data-slot="command-list"
      className={
cn(
        'max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto',
        className,
      )}
{
...prps}
/>
  )
}
function CommandEmpty({
...prps
}
: React.ComponentProps<typeof CmdPrm.Empty>) {
return (
    <CmdPrm.Empty
      data-slot="command-empty"
      className="py-6 text-center text-sm"
      {
...prps}
/>
  )
}
function CommandGroup({
className,
  ...prps
}
: React.ComponentProps<typeof CmdPrm.Group>) {
return (
    <CmdPrm.Group
      data-slot="command-group"
      className={
cn(
        'text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium',
        className,
      )}
{
...prps}
/>
  )
}
function CommandSeparator({
className,
  ...prps
}
: React.ComponentProps<typeof CmdPrm.Separator>) {
return (
    <CmdPrm.Separator
      data-slot="command-separator"
      className={
cn('bg-border -mx-1 h-px', className)}
{
...prps}
/>
  )
}
function CommandItem({
className,
  ...prps
}
: React.ComponentProps<typeof CmdPrm.Item>) {
return (
    <CmdPrm.Item
      data-slot="command-item"
      className={
cn(
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
{
...prps}
/>
  )
}
function CommandShortcut({
className,
  ...prps
}
: React.ComponentProps<'span'>) {
return (
    <span
      data-slot="command-shortcut"
      className={
cn(
        'text-muted-foreground ml-auto text-xs tracking-widest',
        className,
      )}
{
...prps}
/>
  )
}
export {
Command,

  CommandDialog,

  CommandInput,

  CommandList,

  CommandEmpty,

  CommandGroup,

  CommandItem,

  CommandShortcut,

  CommandSeparator,

}
