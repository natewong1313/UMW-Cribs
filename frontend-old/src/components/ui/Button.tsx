import { cva, type VariantProps } from "class-variance-authority"
import cnMerge from "@/utils/cnMerge"
import { IconLoader as IconLoader } from "@tabler/icons-react"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:select-none disabled:pointer-events-none disabled:opacity-70",
  {
    variants: {
      variant: {
        default:
          "bg-blue-500 text-white hover:bg-blue-600/90 active:bg-blue-600",
        danger: "bg-red-500 text-white hover:bg-red-600/90 active:bg-red-600",
        secondary:
          "bg-gray-200 text-gray-600 hover:bg-gray-300/70 active:bg-gray-300",
        outline:
          "ring-1 ring-gray-300 text-gray-600 hover:bg-gray-100 active:bg-gray-200/70",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  loadingText?: string
}
export default function Button({
  className,
  variant,
  size,
  children,
  isLoading,
  loadingText,
  disabled,
  ...props
}: ButtonProps) {
  if (isLoading) disabled = true
  return (
    <button
      disabled={disabled}
      className={cnMerge(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {isLoading && (
        <IconLoader className="animate-button-loader h-5 w-5 mr-1.5" />
      )}
      {loadingText || children}
    </button>
  )
}
