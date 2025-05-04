
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  ToastAction,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, className, ...props }) {
        // Handle both JSX elements and action config objects
        let actionElement = null;
        
        // If action exists, process it
        if (action) {
          // If action is a configuration object instead of a JSX element
          if (typeof action === 'object' && 'label' in action) {
            const { label, onClick, altText } = action;
            actionElement = (
              <ToastAction altText={altText || label} onClick={onClick}>
                {label}
              </ToastAction>
            );
          } else {
            // It's already a JSX element
            actionElement = action;
          }
        }
        
        return (
          <Toast key={id} className={className} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {actionElement}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
