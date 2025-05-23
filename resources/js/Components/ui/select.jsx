import * as React from "react"
import { cn } from "@/lib/utils"
import { Check, ChevronDown } from "lucide-react"

const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div className={cn("relative", className)}>
      <select
        ref={ref}
        className="hidden"
        {...props}
      />
      {children}
    </div>
  )
})

Select.displayName = "Select"

const SelectTrigger = React.forwardRef(({ className, children, placeholder, ...props }, ref) => {
  const [open, setOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState(props.value || "")
  const selectRef = React.useRef(null)

  // Handle selecting value
  React.useEffect(() => {
    setSelectedValue(props.value || "")
  }, [props.value])

  function toggleDropdown() {
    setOpen(!open)
  }

  // Find the label for the selected value
  const selectedLabel = React.Children.toArray(children)
    .find(child => React.isValidElement(child) && child.props.children && child.props.value === selectedValue)
    ?.props?.children || placeholder

  return (
    <>
      <button
        type="button"
        onClick={toggleDropdown}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      {open && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border border-input bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
          <div className="overflow-y-auto max-h-60 p-1" ref={selectRef}>
            {React.Children.map(children, child => {
              if (!React.isValidElement(child)) return null
              
              return React.cloneElement(child, {
                onClick: () => {
                  if (child.props.value !== undefined) {
                    if (props.onValueChange) {
                      props.onValueChange(child.props.value)
                    }
                    setSelectedValue(child.props.value)
                  }
                  setOpen(false)
                },
                isSelected: child.props.value === selectedValue
              })
            })}
          </div>
        </div>
      )}
    </>
  )
})

SelectTrigger.displayName = "SelectTrigger"

const SelectValue = React.forwardRef(({ className, children, placeholder, ...props }, ref) => {
  return (
    <span ref={ref} {...props}>
      {children || placeholder}
    </span>
  )
})

SelectValue.displayName = "SelectValue"

const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("overflow-hidden p-1", className)}
      {...props}
    >
      {children}
    </div>
  )
})

SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef(({ className, children, isSelected, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        isSelected && "bg-accent text-accent-foreground",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4" />}
      </span>
      <span className="pl-6">{children}</span>
    </div>
  )
})

SelectItem.displayName = "SelectItem"

export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} 