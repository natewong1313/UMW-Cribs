import { Popover, Transition } from "@headlessui/react"
import { IconChevronDown, IconCurrencyDollar } from "@tabler/icons-react"
import Navbar from "../components/Navbar"
import Select, { SelectValue } from "../components/shared/Select"
import { Fragment, useState } from "react"
import cn from "../utils/cn"
import shortenNum from "../utils/shortenNum"
import Label from "../components/shared/Label"
import Input from "../components/shared/Input"
import { GetUserLikesResponse, ListingsResponse } from "../types/types"
import { useQuery } from "react-query"
import ListingCard from "../components/ListingCard"
import ListingCardSkeleton from "../components/ListingCardSkeleton"
import { getListingsQuery, getUserLikesQuery } from "../query"
import ListingsMap from "../components/ListingsMap"
import { hoveredListingId } from "../stores/listingStore"

export default function HomePage() {
  const searchParams = new URLSearchParams(window.location.search)
  const { isLoading: listingsQueryLoading, data: listingsData } =
    useQuery<ListingsResponse>(getListingsQuery(searchParams))
  const { isLoading: likesQueryLoading, data: likesData } =
    useQuery<GetUserLikesResponse>(getUserLikesQuery)
  let likesSet = new Set<string>()
  if (!likesQueryLoading && likesData) {
    likesSet = new Set(likesData.likes.map((like) => like.listingId))
  }

  const distanceOptions = [
    {
      label: "Walking (0.5 mi.)",
      value: "walking",
    },
    {
      label: "Biking (2 mi.)",
      value: "biking",
    },
    {
      label: "Driving (5 mi.)",
      value: "driving",
    },
  ]
  const sortOptions = [
    {
      label: "Recently added",
      value: "",
    },
    {
      label: "Price low to high",
      value: "price:asc",
    },
    {
      label: "Price high to low",
      value: "price:desc",
    },
    {
      label: "Closest",
      value: "distance",
    },
  ]
  const onDistanceChange = (opt: SelectValue) => {
    if (opt.value == searchParams.get("distance")) {
      searchParams.delete("distance")
    } else {
      searchParams.set("distance", opt.value.toString())
    }
    window.location.search = searchParams.toString()
  }

  const onSortChange = (opt: SelectValue) => {
    if (opt.value == searchParams.get("sort") || opt.value == "") {
      searchParams.delete("sort")
    } else {
      searchParams.set("sort", opt.value.toString())
    }
    window.location.search = searchParams.toString()
  }

  return (
    <div>
      <Navbar />
      <div className="border-b border-gray-200 bg-gray-100 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <PriceDropdown
              minPrice={parseInt(searchParams.get("minPrice") || "")}
              maxPrice={parseInt(searchParams.get("maxPrice") || "")}
            />
            <RoomsDropdown
              minBeds={parseInt(searchParams.get("minBeds") || "")}
              maxBeds={parseInt(searchParams.get("maxBeds") || "")}
              minBaths={parseFloat(searchParams.get("minBaths") || "")}
              maxBaths={parseFloat(searchParams.get("maxBaths") || "")}
            />
            <div className="w-40">
              <Select
                value={searchParams.get("distance") || undefined}
                options={distanceOptions}
                onChange={onDistanceChange}
                placeholder="Distance"
                className={
                  searchParams.get("distance")
                    ? "bg-blue-100 font-semibold text-blue-500 ring-blue-300"
                    : ""
                }
              />
            </div>
          </div>
          <div className="flex items-center text-sm">
            Sort by:
            <Select
              value={searchParams.get("sort") || ""}
              options={sortOptions}
              onChange={onSortChange}
              placeholder={sortOptions[0].label}
              className="ml-2 bg-transparent font-medium text-black ring-transparent focus:outline-none focus:ring-0"
            />
          </div>
        </div>
      </div>
      <div className="flex">
        <div
          className="max-w-[600px] overflow-auto p-4 xl:max-w-[810px]"
          style={{ height: "calc(100vh - 148px)" }}
        >
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
            {listingsQueryLoading &&
              [...Array(6).keys()].map((i) => <ListingCardSkeleton key={i} />)}
            {!listingsQueryLoading &&
              listingsData?.listings.map((listing) => (
                <ListingCard
                  listing={listing}
                  key={listing.id}
                  onMouseOver={() => hoveredListingId.set(listing.id)}
                  onMouseOut={() => hoveredListingId.set("")}
                  isLiked={likesSet.has(listing.id)}
                />
              ))}
          </div>
        </div>
        <ListingsMap listings={listingsData?.listings || []} />
      </div>
    </div>
  )
}

type PriceDropdownProps = {
  minPrice: number
  maxPrice: number
}
function PriceDropdown({ minPrice, maxPrice }: PriceDropdownProps) {
  const [minPriceValue, setMinPriceValue] = useState(minPrice)
  const [maxPriceValue, setMaxPriceValue] = useState(maxPrice)
  const checkIfPositive = (e: React.FormEvent<HTMLInputElement>) => {
    return e.currentTarget.value != ""
      ? parseInt(e.currentTarget.value) > -1
      : true
  }
  const hasUpdated =
    minPriceValue.toString() != minPrice.toString() ||
    maxPriceValue.toString() != maxPrice.toString()

  const onUpdate = (e: React.FormEvent) => {
    // update search params
    e.preventDefault()
    const searchParams = new URLSearchParams(window.location.search)
    if (minPriceValue > 0) {
      searchParams.set("minPrice", minPriceValue.toString())
    } else {
      searchParams.delete("minPrice")
    }
    if (maxPriceValue > 0) {
      searchParams.set("maxPrice", maxPriceValue.toString())
    } else {
      searchParams.delete("maxPrice")
    }
    window.location.search = searchParams.toString()
  }
  const hasMinprice = minPrice > 0
  const hasMaxprice = maxPrice > 0
  const label = `${hasMinprice ? "$" + shortenNum(minPrice) : "Any"} - ${
    hasMaxprice ? "$" + shortenNum(maxPrice) : "Any"
  }`
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <FilterPopoverButton enabled={hasMinprice || hasMaxprice} open={open}>
            <span>{hasMinprice || hasMaxprice ? label : "Price"}</span>
          </FilterPopoverButton>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Popover.Panel className="absolute left-0 z-10 mt-1 flex -translate-x-0">
              <div className="w-64 flex-auto overflow-hidden rounded-xl border border-gray-200 bg-white text-sm leading-6 shadow-xl">
                <form className="p-4" onSubmit={onUpdate}>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="minPrice" className="mb-1">
                        Min price
                      </Label>
                      <Input
                        name="minPrice"
                        id="minPrice"
                        type="number"
                        leftIcon={
                          <IconCurrencyDollar
                            className="h-4 w-4 text-gray-400"
                            aria-hidden="true"
                          />
                        }
                        placeholder="0"
                        value={minPriceValue}
                        onChange={(e) =>
                          checkIfPositive(e) &&
                          setMinPriceValue(parseInt(e.currentTarget.value))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxPrice" className="mb-1">
                        Max price
                      </Label>
                      <Input
                        name="maxPrice"
                        id="maxPrice"
                        type="number"
                        leftIcon={
                          <IconCurrencyDollar
                            className="h-4 w-4 text-gray-400"
                            aria-hidden="true"
                          />
                        }
                        placeholder="0"
                        defaultValue={maxPrice}
                        value={maxPriceValue}
                        onChange={(e) =>
                          checkIfPositive(e) &&
                          setMaxPriceValue(parseInt(e.currentTarget.value))
                        }
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={!hasUpdated}
                    className="mt-4 flex w-full justify-center rounded-full bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:bg-blue-400"
                  >
                    Update filters
                  </button>
                </form>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}

type RoomsDropdownProps = {
  minBeds: number
  maxBeds: number
  minBaths: number
  maxBaths: number
}
function RoomsDropdown({
  minBeds,
  maxBeds,
  minBaths,
  maxBaths,
}: RoomsDropdownProps) {
  const [minBedsValue, setMinBedsValue] = useState(minBeds)
  const [maxBedsValue, setMaxBedsValue] = useState(maxBeds)
  const [minBathsValue, setMinBathsValue] = useState(minBaths)
  const [maxBathsValue, setMaxBathsValue] = useState(maxBaths)
  const hasUpdated =
    minBedsValue.toString() != minBeds.toString() ||
    maxBedsValue.toString() != maxBeds.toString() ||
    minBathsValue.toString() != minBaths.toString() ||
    maxBathsValue.toString() != maxBaths.toString()

  const onUpdate = (e: React.FormEvent) => {
    // update search params
    e.preventDefault()
    const searchParams = new URLSearchParams(window.location.search)
    if (minBedsValue > 0) {
      searchParams.set("minBeds", minBedsValue.toString())
    } else {
      searchParams.delete("minBeds")
    }
    if (maxBedsValue > 0) {
      searchParams.set("maxBeds", maxBedsValue.toString())
    } else {
      searchParams.delete("maxBeds")
    }
    if (minBathsValue > 0) {
      searchParams.set("minBaths", minBathsValue.toString())
    } else {
      searchParams.delete("minBaths")
    }
    if (maxBathsValue > 0) {
      searchParams.set("maxBaths", maxBathsValue.toString())
    } else {
      searchParams.delete("maxBaths")
    }
    window.location.search = searchParams.toString()
  }
  const hasMinBeds = minBeds > 0
  const hasMaxBeds = maxBeds > 0
  const hasMinBaths = minBaths > 0
  const hasMaxBaths = maxBaths > 0
  const labels: string[] = []
  if (hasMinBeds && !hasMaxBeds) {
    labels.push(`${minBeds}+ beds`)
  } else if (!hasMinBeds && hasMaxBeds) {
    labels.push(`Up to ${maxBeds} beds`)
  } else if (hasMinBeds && hasMaxBeds) {
    labels.push(`${minBeds} - ${maxBeds} beds`)
  }
  if (hasMinBaths && !hasMaxBaths) {
    labels.push(`${minBaths}+ baths`)
  } else if (!hasMinBaths && hasMaxBaths) {
    labels.push(`Up to ${maxBaths} baths`)
  } else if (hasMinBaths && hasMaxBaths) {
    labels.push(`${minBaths} - ${maxBaths} baths`)
  }

  const bedroomOptions = [
    {
      label: "1",
      value: 1,
    },
    {
      label: "2",
      value: 2,
    },
    {
      label: "3",
      value: 3,
    },
    {
      label: "4",
      value: 4,
    },
    {
      label: "5",
      value: 5,
    },
  ]
  const bathroomOptions = [
    {
      label: "1",
      value: 1,
    },
    {
      label: "1.5",
      value: 1.5,
    },
    {
      label: "2",
      value: 2,
    },
    {
      label: "2.5",
      value: 2.5,
    },
    {
      label: "3",
      value: 3,
    },
    {
      label: "4",
      value: 4,
    },
    {
      label: "5",
      value: 5,
    },
  ]
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <FilterPopoverButton
            enabled={hasMinBeds || hasMaxBeds || hasMinBaths || hasMaxBaths}
            open={open}
          >
            <span>{labels.length > 0 ? labels.join(", ") : "Rooms"}</span>
          </FilterPopoverButton>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Popover.Panel className="absolute left-0 z-10 mt-1 flex -translate-x-0">
              <div className="w-64 flex-auto rounded-xl border border-gray-200 bg-white text-sm leading-6 shadow-xl">
                <form className="p-4" onSubmit={onUpdate}>
                  <Label className="mb-1 font-semibold">Bedrooms</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Select
                      value={minBedsValue > -1 ? minBedsValue : undefined}
                      options={bedroomOptions.slice(0, -1)}
                      onChange={(opt) =>
                        setMinBedsValue(
                          opt.value !== minBedsValue
                            ? parseInt(opt.value.toString())
                            : -1
                        )
                      }
                      placeholder="Min"
                    />
                    <Select
                      value={maxBedsValue > -1 ? maxBedsValue : undefined}
                      options={bedroomOptions.filter((opt) =>
                        minBedsValue ? opt.value > minBedsValue : true
                      )}
                      onChange={(opt) =>
                        setMaxBedsValue(
                          opt.value !== maxBedsValue
                            ? parseInt(opt.value.toString())
                            : -1
                        )
                      }
                      placeholder="Max"
                    />
                  </div>
                  <Label className="mb-1 pt-2 font-semibold">Bathrooms</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Select
                      value={minBathsValue > -1 ? minBathsValue : undefined}
                      options={bathroomOptions.slice(0, -1)}
                      onChange={(opt) =>
                        setMinBathsValue(
                          opt.value !== minBathsValue
                            ? parseInt(opt.value.toString())
                            : -1
                        )
                      }
                      placeholder="Min"
                    />
                    <Select
                      value={maxBathsValue > -1 ? maxBathsValue : undefined}
                      options={bathroomOptions.filter((opt) =>
                        minBathsValue ? opt.value > minBathsValue : true
                      )}
                      onChange={(opt) =>
                        setMaxBathsValue(
                          opt.value !== maxBathsValue
                            ? parseInt(opt.value.toString())
                            : -1
                        )
                      }
                      placeholder="Max"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!hasUpdated}
                    className="mt-4 flex w-full justify-center rounded-full bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:bg-blue-400"
                  >
                    Update filters
                  </button>
                </form>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}

type FilterPopoverButtonProps = {
  children: React.ReactNode
  enabled?: boolean
  open?: boolean
}
function FilterPopoverButton({
  children,
  enabled,
  open,
}: FilterPopoverButtonProps) {
  return (
    <Popover.Button
      className={cn(
        "relative w-full cursor-pointer rounded-md bg-white py-1.5 pl-3 pr-8 text-left ring-1 ring-inset hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:text-sm sm:leading-6",
        enabled
          ? "bg-blue-100 font-semibold text-blue-500 ring-blue-300"
          : "font-medium text-gray-500 ring-gray-300"
      )}
    >
      <span>{children}</span>
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <IconChevronDown
          className={cn(
            "h-5 w-5 opacity-70 transition-all duration-75",
            open && "rotate-180"
          )}
        />
      </span>
    </Popover.Button>
  )
}
