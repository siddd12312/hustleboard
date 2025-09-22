'use client'



import * as React from 'react'






import type {
ToastActionElement, ToastProps }
from '@/components/ui/toast'





const TOAST_LIMIT = 1

const TOAST_REMOVE_DELAY = 1000000





type ToasterToast = ToastProps & {
id: string

  title?: React.ReactNode

  description?: React.ReactNode

  action?: ToastActionElement

}
const actionTypes = {
ADD_TOAST: 'ADD_TOAST',

  UPDATE_TOAST: 'UPDATE_TOAST',

  DISMISS_TOAST: 'DISMISS_TOAST',

  REMOVE_TOAST: 'REMOVE_TOAST',

}
as const







let cnt = 0






function getId() {
cnt = (cnt + 1) % Number.MAX_SAFE_INTEGER

  return cnt.toString()

}
type ActionType = typeof actionTypes





type Actn =

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
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()







const addToRemoveQueue = (tid: string) => {
if (toastTimeouts.has(tid)) {
return

  }
const t = setTimeout(() => {
toastTimeouts.delete(tid)

    dispatch({
type: 'REMOVE_TOAST',

      toastId: tid,

    }
)

  }
, TOAST_REMOVE_DELAY)





  toastTimeouts.set(tid, t)

}
export const reducer = (state: State, actn: Actn): State => {
switch (actn.type) {
case 'ADD_TOAST':

      return {
...state,

        toasts: [actn.toast, ...state.toasts].slice(0, TOAST_LIMIT),

      }
case 'UPDATE_TOAST':

      return {
...state,

        toasts: state.toasts.map((to) =>

          to.id === actn.toast.id ? {
...to, ...actn.toast }
: to,

        ),

      }
case 'DISMISS_TOAST': {
const {
toastId }
= actn









      if (toastId) {
addToRemoveQueue(toastId)

      }
else {
state.toasts.forEach((to) => {
addToRemoveQueue(to.id)

        }
)

      }
return {
...state,

        toasts: state.toasts.map((to) =>

          to.id === toastId || toastId === undefined

            ? {
...to,

                open: false,

              }
: to,

        ),

      }
}
case 'REMOVE_TOAST':

      if (actn.toastId === undefined) {
return {
...state,

          toasts: [],

        }
}
return {
...state,

        toasts: state.toasts.filter((to) => to.id !== actn.toastId),

      }
}
}
const listeners: Array<(st: State) => void> = []



let memState: State = {
toasts: [] }
function dispatch(actn: Actn) {
memState = reducer(memState, actn)

  listeners.forEach((lstnr) => {
lstnr(memState)

  }
)

}
type Toast = Omit<ToasterToast, 'id'>









function toast({
...prps }
: Toast) {
const id = getId()





  const update = (prps: ToasterToast) =>

    dispatch({
type: 'UPDATE_TOAST',

      toast: {
...prps, id }
,

    }
)

  const dismiss = () => dispatch({
type: 'DISMISS_TOAST', toastId: id }
)







  dispatch({
type: 'ADD_TOAST',

    toast: {
...prps,

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
listeners.push(setSt)

    return () => {
const idx = listeners.indexOf(setSt)

      if (idx > -1) {
listeners.splice(idx, 1)

      }
}
}
, [st])





  return {
...st,

    toast,

    dismiss: (tid?: string) => dispatch({
type: 'DISMISS_TOAST', toastId: tid }
),

  }
}
export {
useToast, toast }
