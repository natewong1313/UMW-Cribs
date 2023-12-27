import type { HTMLProps, ReactNode } from "react"
import cn from "../../utils/cn"

type Props = HTMLProps<HTMLInputElement> & {
  leftIcon?: ReactNode
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Input(props: Props) {
  if (props.leftIcon) {
    return (
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-1.5">
          {props.leftIcon}
        </div>
        {BaseInput({ ...props, className: props.className + " pl-6" })}
      </div>
    )
  }
  return BaseInput(props)
}

function BaseInput(props: Props) {
  return (
    <input
      type={props.type}
      name={props.name}
      id={props.id}
      className={cn(
        "block w-full rounded-md border-0 py-1.5 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-200 sm:text-sm sm:leading-6",
        props.className
      )}
      placeholder={props.placeholder}
      required={props.required}
      value={props.value}
      onChange={props.onChange}
    />
  )
}
