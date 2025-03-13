import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success"
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export function useToast() {
  const toast = ({ title, description, variant = "default", duration = 5000, action }: ToastProps) => {
    const options: any = {
      duration,
      style: {
        // You can add custom styles based on variant
        background: variant === "destructive" ? "var(--destructive)" : undefined,
        color: variant === "destructive" ? "var(--destructive-foreground)" : undefined,
      },
    }

    if (action) {
      options.action = {
        label: action.label,
        onClick: action.onClick,
      }
    }

    if (variant === "success") {
      return sonnerToast.success(title, {
        description,
        ...options,
      })
    }

    if (variant === "destructive") {
      return sonnerToast.error(title, {
        description,
        ...options,
      })
    }

    return sonnerToast(title, {
      description,
      ...options,
    })
  }

  return {
    toast,
    dismiss: sonnerToast.dismiss,
    toasts: [], // Sonner manages its own state
  }
}

