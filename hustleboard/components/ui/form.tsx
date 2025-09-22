'use client'

import * as React from 'react'

import * as LabelPrimitive from '@radix-ui/react-label'

import {
Slot }
from '@radix-ui/react-slot'

import {
Controller,
    FormProvider,
    useFormContext,
    useFormState,
    type ControllerProps,
    type FieldPath,
    type FieldValues,
}
from 'react-hook-form'

import {
cn }
from '@/lib/utils'

import {
Label }
from '@/components/ui/label'



const Form = FormProvider



type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
name: TName
}
const FormFieldContext = React.createContext<FormFieldContextValue>(
    {
}
as FormFieldContextValue,
)

const FormField = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
...props
}
: ControllerProps<TFieldValues, TName>) => {
return (
        <FormFieldContext.Provider value={
{
name: props.name }
}
>
        <Controller {
...props}
/>
        </FormFieldContext.Provider>
    )

}
const useFormField = () => {
const ctx1 = React.useContext(FormFieldContext)
    const ctx2 = React.useContext(FormItemContext)
    const {
getFieldState }
= useFormContext()
    const st = useFormState({
name: ctx1.name }
)
    const st2 = getFieldState(ctx1.name, st)


    if (!ctx1) {
throw new Error('useFormField should be used within <FormField>')
    }
const {
id }
= ctx2

    return {
id,
        name: ctx1.name,
        formItemId: `${
id}
-form-item`,
        formDescriptionId: `${
id}
-form-item-description`,
        formMessageId: `${
id}
-form-item-message`,
        ...st2,
    }
}
type FormItemContextValue = {
id: string
}
const FormItemContext = React.createContext<FormItemContextValue>(
    {
}
as FormItemContextValue,
)

function FormItem({
className, ...prps }
: React.ComponentProps<'div'>) {
const id = React.useId()


    return (
        <FormItemContext.Provider value={
{
id }
}
>
        <div
            data-slot="form-item"
            className={
cn('grid gap-2', className)}
{
...prps}
/>
        </FormItemContext.Provider>
    )
}
function FormLabel({
className,
    ...rest
}
: React.ComponentProps<typeof LabelPrimitive.Root>) {
const {
error, formItemId }
= useFormField()

    return (
        <Label
            data-slot="form-label"
            data-error={
!!error}
className={
cn('data-[error=true]:text-destructive', className)}
htmlFor={
formItemId}
{
...rest}
/>
    )
}
function FormControl({
...rprops }
: React.ComponentProps<typeof Slot>) {
const {
error, formItemId, formDescriptionId, formMessageId }
= useFormField()


    return (
        <Slot
            data-slot="form-control"
            id={
formItemId}
aria-describedby={
!error
                    ? `${
formDescriptionId}
`
                    : `${
formDescriptionId}
${
formMessageId}
`
            }
aria-invalid={
!!error}
{
...rprops}
/>
    )
}
function FormDescription({
className, ...qprops }
: React.ComponentProps<'p'>) {
const {
formDescriptionId }
= useFormField()

    return (
        <p
            data-slot="form-description"
            id={
formDescriptionId}
className={
cn('text-muted-foreground text-sm', className)}
{
...qprops}
/>
    )
}
function FormMessage({
className, ...props }
: React.ComponentProps<'p'>) {
const {
error, formMessageId }
= useFormField()
    const body = error ? String(error?.message ?? '') : props.children

    if (!body) {
return null
    }
return (
        <p
            data-slot="form-message"
            id={
formMessageId}
className={
cn('text-destructive text-sm', className)}
{
...props}
>
            {
body}
</p>
    )
}
export {
useFormField,

    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormField,
}
