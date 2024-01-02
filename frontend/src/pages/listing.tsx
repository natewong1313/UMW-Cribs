import Navbar from "../components/Navbar"
import { Tab } from "@headlessui/react"
import {
  IconArrowLeft,
  IconArrowUpRight,
  IconBookmark,
  IconBookmarkFilled,
} from "@tabler/icons-react"
import cn from "../utils/cn"
import { getListingQuery, getUserLikesQuery, queryClient } from "../query"
import { useQuery } from "react-query"
import { GetUserLikesResponse, ListingResponse } from "../types/types"
import { Link, useParams } from "react-router-dom"
import { useMemo } from "react"

// const product = {
//   name: "Zip Tote Basket",
//   price: "$140",
//   rating: 4,
//   images: [
//     {
//       id: 1,
//       name: "Angled view",
//       src: "https://d36xftgacqn2p.cloudfront.net/listingphotos382/VAFB2005204-1.jpg",
//       alt: "Angled front view with bag zipped and handles upright.",
//     },
//     {
//       id: 2,
//       name: "",
//       src: "https://d36xftgacqn2p.cloudfront.net/listingphotos382/VAFB2005204-2.jpg",
//       alt: "Front view with bag unzipped and handles upright.",
//     },
//     // More images...
//   ],
//   colors: [
//     {
//       name: "Washed Black",
//       bgColor: "bg-gray-700",
//       selectedColor: "ring-gray-700",
//     },
//     { name: "White", bgColor: "bg-white", selectedColor: "ring-gray-400" },
//     {
//       name: "Washed Gray",
//       bgColor: "bg-gray-500",
//       selectedColor: "ring-gray-500",
//     },
//   ],
//   description: `
//     <p>The Zip Tote Basket is the perfect midpoint between shopping tote and comfy backpack. With convertible straps, you can hand carry, should sling, or backpack this convenient and spacious bag. The zip top and durable canvas construction keeps your goods protected for all-day use.</p>
//   `,
//   details: [
//     {
//       name: "Features",
//       items: [
//         "Multiple strap configurations",
//         "Spacious interior with top zip",
//         "Leather handle and tabs",
//         "Interior dividers",
//         "Stainless strap loops",
//         "Double stitched construction",
//         "Water-resistant",
//       ],
//     },
//     // More sections...
//   ],
// }

export default function ListingPage() {
  const { listingId } = useParams<{ listingId: string }>()
  const { isLoading: listingQueryLoading, data: listingData } =
    useQuery<ListingResponse>(getListingQuery(listingId || ""))
  const { isLoading: likesQueryLoading, data: likesData } =
    useQuery<GetUserLikesResponse>(getUserLikesQuery)

  // const likesSet = useMemo(() => {
  //   if (!likesQueryLoading && likesData?.likes) {
  //     return new Set(likesData.likes.map((like) => like.listingId))
  //   }
  //   return new Set<string>()
  // }, [likesData, likesQueryLoading])
  const isLiked = useMemo(() => {
    if (!likesQueryLoading && likesData?.likes) {
      return likesData.likes.some((like) => like.listingId === listingId)
    }
    return false
  }, [likesData, likesQueryLoading, listingId])

  if (!listingQueryLoading && !listingData?.listing) {
    window.location.href = "/"
    return <div></div>
  }
  if (listingQueryLoading) {
    return (
      <div>
        <Navbar />
        <ListingSkeleton />
      </div>
    )
  }
  const { listing } = listingData

  const onLikeBtnClick = async () => {
    // optimistic update
    queryClient.setQueryData(["getLikes"], {
      likes: [{ listingId: isLiked ? "" : listing.id }],
    })
    await fetch("/api/user/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        listingId: listing.id,
        action: isLiked ? "unlike" : "like",
      }),
    })
  }
  return (
    <div>
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 py-5 sm:px-6 lg:max-w-7xl lg:px-8">
        <Link
          to="/"
          className="group flex text-sm font-medium text-gray-600 hover:text-blue-600"
        >
          <IconArrowLeft className="mr-1.5 h-5 w-5 text-gray-400 group-hover:text-blue-500" />
          Back to listings
        </Link>
        <div className="mt-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          <Tab.Group as="div" className="flex flex-col-reverse">
            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <Tab.List className="grid grid-cols-4 gap-6">
                {listing.images.map((image) => (
                  <Tab
                    key={image.url}
                    className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50"
                  >
                    {({ selected }) => (
                      <>
                        <span className="absolute inset-0 overflow-hidden rounded-md">
                          <img
                            src={image.url}
                            alt={listing.address.line1}
                            className="h-full w-full object-cover object-center"
                          />
                        </span>
                        <span
                          className={cn(
                            selected ? "ring-blue-500" : "ring-transparent",
                            "pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2"
                          )}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </Tab>
                ))}
              </Tab.List>
            </div>

            <Tab.Panels className="aspect-h-1 aspect-w-1 w-full">
              {listing.images.map((image) => (
                <Tab.Panel key={image.url}>
                  <img
                    src={image.url}
                    alt={listing.address.line1}
                    className="h-full max-h-[26rem] w-full rounded-lg object-cover object-center"
                  />
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>

          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {listing.address.line1}{" "}
              {listing.address.line2 && "#" + listing.address.line2}
            </h1>
            <h2 className="text-gray-500">
              {listing.address.city}, {listing.address.state}{" "}
              {listing.address.zip}
            </h2>

            <div className="mt-3">
              <p className="text-3xl font-medium tracking-tight text-gray-900">
                ${listing.rent.toLocaleString()}{" "}
                <span className="text-lg font-normal text-gray-500">
                  / month
                </span>
              </p>
            </div>

            <div className="mt-3 flex text-gray-500">
              <p>
                <span className="font-semibold text-gray-700">
                  {listing.bedrooms}
                </span>{" "}
                bedrooms
              </p>
              <p className="ml-4 border-l border-gray-200 pl-2 text-gray-500 sm:pl-4">
                <span className="font-semibold text-gray-700">
                  {listing.bathrooms}
                </span>{" "}
                bathrooms
              </p>
              {listing.squareFootage && (
                <p className="ml-4 border-l border-gray-200 pl-2 text-gray-500 sm:pl-4">
                  <span className="font-semibold text-gray-700">
                    {listing.squareFootage.toLocaleString()}
                  </span>{" "}
                  <span className="hidden md:inline">square feet</span>
                  <span className="md:hidden">sqft</span>
                </p>
              )}
              <p className="ml-4 border-l border-gray-200 pl-2 text-gray-500 sm:pl-4">
                <span className="font-semibold text-gray-700">
                  {listing.address.distance.toFixed(2)}
                </span>{" "}
                miles from UMW
              </p>
            </div>

            <div className="mt-6">
              <p className="space-y-6 text-base text-gray-600">
                {listing.description}
              </p>
            </div>

            <div className="mt-6 flex">
              <a
                href={listing.source.url}
                target="_blank"
                rel="noreferrer"
                className="flex w-fit items-center justify-center rounded-full border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                View on {listing.source.site}{" "}
                <IconArrowUpRight className="ml-2 h-6 w-6 text-blue-300" />
              </a>

              <button
                type="button"
                onClick={onLikeBtnClick}
                className={cn(
                  "ml-4 flex items-center justify-center rounded-full px-3 py-3 ring-1 transition-colors",
                  isLiked
                    ? "bg-blue-100 ring-blue-300 hover:bg-blue-200"
                    : "ring-gray-300 hover:bg-gray-100"
                )}
              >
                {isLiked ? (
                  <IconBookmarkFilled className="h-6 w-6 flex-shrink-0 text-blue-500" />
                ) : (
                  <IconBookmark className="h-6 w-6 flex-shrink-0 text-gray-400" />
                )}
              </button>
            </div>

            {/* <section aria-labelledby="details-heading" className="mt-12">
              <h2 id="details-heading" className="sr-only">
                Additional details
              </h2>

              <div className="divide-y divide-gray-200 border-t">
                {product.details.map((detail) => (
                  <Disclosure as="div" key={detail.name}>
                    {({ open }) => (
                      <>
                        <h3>
                          <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                            <span
                              className={cn(
                                open ? "text-blue-600" : "text-gray-900",
                                "text-sm font-medium"
                              )}
                            >
                              {detail.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <IconMinus
                                  className="block h-6 w-6 text-blue-400 group-hover:text-blue-500"
                                  aria-hidden="true"
                                />
                              ) : (
                                <IconPlus
                                  className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel
                          as="div"
                          className="prose prose-sm pb-6"
                        >
                          <ul role="list">
                            {detail.items.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </div>
            </section> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ListingSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-5 sm:px-6 lg:max-w-7xl lg:px-8">
      <Link
        to="/"
        className="group flex text-sm font-medium text-gray-600 hover:text-blue-600"
      >
        <IconArrowLeft className="mr-1.5 h-5 w-5 text-gray-400 group-hover:text-blue-500" />
        Back to listings
      </Link>
      {/* <div className="h-5 w-64 animate-pulse rounded-full bg-gray-200" /> */}
      <div className="mt-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
        <div>
          <div className="mb-6 h-[26rem] w-full animate-pulse rounded-lg bg-gray-200" />
          <div className="flex space-x-4">
            <div className="h-24 w-36 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-24 w-36 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-24 w-36 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-24 w-36 animate-pulse rounded-lg bg-gray-200" />
          </div>
        </div>
        <div>
          <div className="h-12 w-1/2 animate-pulse rounded-full bg-gray-200" />
          <div className="mt-4 h-8 w-1/4 animate-pulse rounded-full bg-gray-200" />
          <div className="mt-4 h-6 w-3/4 animate-pulse rounded-full bg-gray-200" />
          <div className="mt-4 h-64 w-3/4 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>
      {/* <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
        <div className="h-6 w-1/2 animate-pulse rounded-lg bg-gray-200" />
      </div> */}
    </div>
  )
}
