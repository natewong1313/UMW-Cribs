import type { HTMLProps } from "react"
import cn from "../../utils/cn"

type Props = HTMLProps<HTMLInputElement>

export default function Label(props: Props) {
  return (
    <label
      htmlFor={props.htmlFor}
      className={cn(
        "mt-1.5 block text-sm font-medium leading-6 text-gray-900",
        props.className
      )}
    >
      {props.children}
    </label>
  )
}
