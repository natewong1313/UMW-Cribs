import { Listbox, Transition } from "@headlessui/react"
import { IconCheck, IconChevronDown } from "@tabler/icons-react"
import type { HTMLProps } from "react"
import { Fragment } from "react"
import cn from "../../utils/cn"

export type SelectValue = {
  label: string
  value: string | number
}

type Props = HTMLProps<HTMLSelectElement> & {
  label?: string
  options: SelectValue[]
  value?: string | number
  onChange: (value: SelectValue) => void
  placeholder?: string
}

export default function Select({
  label,
  options,
  value,
  onChange,
  placeholder,
  className,
}: Props) {
  const selectedOption = options.find((opt) => opt.value === value)
  return (
    <Listbox value={selectedOption} onChange={onChange}>
      {({ open }) => (
        <>
          {label && (
            <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
              {label}
            </Listbox.Label>
          )}
          <div className={cn("relative", label && "mt-2")}>
            <Listbox.Button
              className={cn(
                "relative w-full cursor-pointer rounded-md bg-white py-1.5 pl-3 pr-10 text-left font-medium ring-1 ring-inset ring-gray-300 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:text-sm sm:leading-6",
                value ? "text-gray-900" : "text-gray-500",
                className
              )}
            >
              <span className="block truncate">
                {value ? selectedOption?.label : placeholder}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <IconChevronDown
                  className={cn(
                    "h-5 w-5 opacity-70 transition-all duration-75",
                    open && "rotate-180"
                  )}
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-72 w-full overflow-auto rounded-md bg-white px-1 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {options.map((opt) => (
                  <Listbox.Option
                    key={opt.value}
                    className={({ active }) =>
                      cn(
                        active && "bg-gray-100",
                        "relative cursor-pointer select-none rounded-md py-2 pl-3 pr-5 text-gray-900"
                      )
                    }
                    value={opt}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={cn(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {opt.label}
                        </span>

                        {selected ? (
                          <span
                            className={cn(
                              "absolute inset-y-0 right-0 flex items-center pr-2 text-gray-700"
                            )}
                          >
                            <IconCheck className="h-4 w-4" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}
