"use client"

import * as React from "react"

import type {
  ToastProps as ArkToastProps,
  Toast as ArkToast,
  ToastActionProps as ArkToastActionProps,
} from "@ark-ui/react"

type Toast = ArkToast
type ToastActionProps = ArkToastActionProps
type ToastProps = ArkToastProps

const ToastContext = React.createContext({
  addToast: (toast: ToastProps) => {},
  updateToast: (id: string, toast: Partial<ToastProps>) => {},
  dismissToast: (id: string) => {},
  removeToast: (id: string) => {},
  toasts: [] as Toast[],
})

function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export { useToast, ToastContext, type ToastProps, type ToastActionProps }

