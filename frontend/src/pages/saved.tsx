import { useQuery } from "react-query"
import Navbar from "../components/Navbar"
import { GetUserLikesResponse, ListingsResponse } from "../types/types"
import { getListingsQuery, getUserLikesQuery, queryClient } from "../query"
import { Link } from "react-router-dom"
import cn from "../utils/cn"
import { IconX } from "@tabler/icons-react"
import { useMemo, useState } from "react"

export default function SavedListingsPage() {
  const { isLoading: likesQueryLoading, data: likesData } =
    useQuery<GetUserLikesResponse>(getUserLikesQuery)
  if (likesData?.error) {
    window.location.href = "/"
  }
  let likesSet = new Set<string>()
  if (!likesQueryLoading && likesData?.likes) {
    likesSet = new Set(likesData.likes.map((like) => like.listingId))
  }
  const { isLoading: listingsQueryLoading, data: listingsData } =
    useQuery<ListingsResponse>(getListingsQuery(null, false))
  const [removedListingIds, setRemovedListingIds] = useState<string[]>([])
  const listings = useMemo(
    () =>
      listingsData?.listings.filter(
        (listing) =>
          likesSet.has(listing.id) && !removedListingIds.includes(listing.id)
      ),
    [listingsData, likesSet, removedListingIds]
  )

  const onDeleteBtnClick = async (listingId: string) => {
    setRemovedListingIds([...removedListingIds, listingId])
    await fetch("/api/user/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        listingId: listingId,
        action: "unlike",
      }),
    })
    queryClient.invalidateQueries("getListingsavailable=true")
    queryClient.resetQueries("getListingsavailable=true")
  }
  return (
    <div>
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="text-2xl font-bold">View saved listings</h1>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Listing
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Rent Price
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                      />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {listings &&
                      listings.map((listing) => (
                        <tr key={listing.id}>
                          <td className="py-2 pl-4 text-sm font-medium text-gray-900 hover:text-blue-600 sm:pl-6">
                            <Link
                              to={`/listings/${listing.id}`}
                              className="flex items-center space-x-2"
                            >
                              <img
                                src={listing.images[0].url}
                                className="h-12 min-w-12 max-w-12 rounded-md"
                              />
                              <span>{listing.address.line1}</span>
                            </Link>
                          </td>
                          <td className="px-2 py-4 text-sm text-gray-500">
                            ${listing.rent.toLocaleString()}
                          </td>
                          <td className="px-2 py-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <span
                                className={cn(
                                  "inline-block h-2 w-2 rounded-full",
                                  listing.available
                                    ? "bg-green-400"
                                    : "bg-red-400"
                                )}
                              ></span>
                              <span>
                                {listing.available
                                  ? "Available"
                                  : "Unavailable"}
                              </span>
                            </div>
                          </td>
                          <td className="relative py-2 text-sm font-medium">
                            <button
                              onClick={() => onDeleteBtnClick(listing.id)}
                              className="text-red-500 hover:text-red-900"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    {listingsQueryLoading && (
                      <tr>
                        <td className="py-4 pl-4 pr-3 sm:pl-6">
                          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                        </td>
                        <td className="px-3 py-4">
                          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                        </td>
                        <td className="px-3 py-4">
                          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                        </td>
                        <td className="px-3 py-4">
                          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                        </td>
                      </tr>
                    )}
                    {!listingsQueryLoading &&
                      listings &&
                      listings.length === 0 && (
                        <tr>
                          <td className="py-4 pl-4 pr-3 sm:pl-6">
                            <div className="text-sm text-gray-500">
                              You haven&apos;t saved any listings yet.
                            </div>
                          </td>
                          <td className="px-3 py-4"></td>
                          <td className="px-3 py-4"></td>
                          <td className="px-3 py-4"></td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
