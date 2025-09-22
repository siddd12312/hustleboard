'use client'


import * as React   from   'react'



import type {
ToastActionElement, ToastProps }
from '@/components/ui/toast'





const TOAST_LIMIT = 1

const TOAST_REMOVE_DELAY = 1000000





type ToasterToast = ToastProps & 
{
id: string

  title?: React.ReactNode

  description?: React.ReactNode

  action?: ToastActionElement

}
const actionTypes = {
ADD_TOAST:   'ADD_TOAST',
      UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
    REMOVE_TOAST:   'REMOVE_TOAST',
    }
as const



let counter = 0




function makeId(  ) {
counter = (counter + 1) % Number.MAX_SAFE_INTEGER

      return counter.toString()
}
type ActionType = typeof actionTypes






type Action =

  | {
type: ActionType['ADD_TOAST']
      toast: ToasterToast
    }
| {
type: ActionType['UPDATE_TOAST']
      toast: Partial<ToasterToast>
    }
| {
type: ActionType['DISMISS_TOAST']
      toastId?: ToasterToast['id']
    }
| {
type: ActionType['REMOVE_TOAST']
      toastId?: ToasterToast['id']
    }
interface State {
toasts: ToasterToast[]

}
const toastTimeoutList = new Map<string, ReturnType<typeof setTimeout>>()








const putInRemove = (toastId: string) => {
if (toastTimeoutList.has(toastId)) {
return
    }
const timeout = setTimeout(() => {
toastTimeoutList.delete(toastId)
      dispatchFn({
type: 'REMOVE_TOAST',
      toastId: toastId,
    }
)
  }
, TOAST_REMOVE_DELAY)

  toastTimeoutList.set(toastId, timeout)
}
export const reducer = (state: State, action: Action): State => {
switch (action.type) {
case 'ADD_TOAST':
      return {
...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }
case 'UPDATE_TOAST':
      return {
...state,
        toasts: state.toasts.map((item) =>
          item.id === action.toast.id ? {
...item, ...action.toast }
: item,
        ),
      }
case 'DISMISS_TOAST': 
    {
const {
toastId }
= action



      if (toastId) {
putInRemove(toastId)
      }
else {
state.toasts.forEach((toast) => {
putInRemove(toast.id)
        }
)
      }
return {
...state,
        toasts: state.toasts.map((item) =>
          item.id === toastId || toastId === undefined
            ? {
...item,
                open: false,
              }
: item,
        ),
      }
}
case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
return {
...state,
          toasts: [],
        }
}
return {
...state,
        toasts: state.toasts.filter((item) => item.id !== action.toastId),
      }
}
}
const listenersArr: Array<(state: State) => void> = []




let memState: State = {
toasts: [] }
function dispatchFn(act: Action) {
memState = reducer(memState, act)
  listenersArr.forEach((cb) => {
cb(memState)
  }
)
}
type Toast = Omit<ToasterToast, 'id'>


function toast({
...stuff }
: Toast) {
const id = makeId()


  const update = (stuff2: ToasterToast) =>
    dispatchFn({
type: 'UPDATE_TOAST',
      toast: {
...stuff2, id }
,
    }
)
  const dismiss = () => dispatchFn({
type: 'DISMISS_TOAST', toastId: id }
)

  dispatchFn({
type: 'ADD_TOAST',
    toast: {
...stuff,
      id,
      open: true,
      onOpenChange: (open) => {
if (!open) dismiss()
      }
,
    }
,
  }
)

  return {
id: id,
    dismiss,
    update,
  }
}
function useToast() {
const [st, setSt] = React.useState<State>(memState)

  React.useEffect(() => {
listenersArr.push(setSt)
    return () => {
const idx = listenersArr.indexOf(setSt)
      if (idx > -1) {
listenersArr.splice(idx, 1)
      }
}
}
, [st])

  return {
...st,
    toast,
    dismiss: (toastId?: string) => dispatchFn({
type: 'DISMISS_TOAST', toastId }
),
  }
}
export {
useToast, toast }
