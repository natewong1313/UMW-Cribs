import { Listbox, Transition } from "@headlessui/react"
import { IconCheck, IconChevronDown } from "@tabler/icons-react"
import type { SelectHTMLAttributes, ReactNode } from "react"
import { Fragment, useState } from "react"
import cnMerge from "@/utils/cnMerge"

export interface SelectOption {
  label: string
  value: string
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string
  options: SelectOption[]
}

export default function Select({
  className,
  options,
  placeholder,
  ...props
}: SelectProps) {
  const [selected, setSelected] = useState<SelectOption>()

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <div className="relative">
          <Listbox.Button
            className={cnMerge(
              "relative w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left text-sm font-medium text-gray-900 shadow-sm transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-blue-200",
              className
            )}
          >
            {selected ? (
              <span className="block truncate">{selected.label}</span>
            ) : (
              placeholder
            )}
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <IconChevronDown
                className={cnMerge(
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
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map(option => (
                <Listbox.Option
                  key={option.value}
                  className={({ active }) =>
                    cnMerge(
                      active && "bg-gray-200",
                      "relative cursor-pointer select-none py-2 pl-3 pr-9"
                    )
                  }
                  value={option}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={cnMerge(
                          selected && "font-semibold",
                          "block truncate"
                        )}
                      >
                        {option.label}
                      </span>

                      {selected ? (
                        <span
                          className={cnMerge(
                            active ? "text-gray-700" : "text-blue-600",
                            "absolute inset-y-0 right-0 flex items-center pr-4"
                          )}
                        >
                          <IconCheck className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  )
}
