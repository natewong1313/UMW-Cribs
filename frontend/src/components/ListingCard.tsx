import { IconBookmark } from "@tabler/icons-react"
import cn from "../utils/cn"
import { useState } from "react"
import { DatabaseListing } from "../types/types"
import { Link } from "react-router-dom"

type Props = {
  listing: DatabaseListing
  isLiked: boolean
  onMouseOver?: () => void
  onMouseOut?: () => void
}

export default function ListingCard({
  listing,
  isLiked,
  onMouseOver,
  onMouseOut,
}: Props) {
  const [optimisticLike, setOptimisticLike] = useState(isLiked)
  const onLikeBtnClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setOptimisticLike(!optimisticLike)
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
    <Link
      className="rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
      key={listing.id}
      to={`/listings/${listing.id}`}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      {listing.images.length > 0 ? <img
        alt={listing.address.line1}
        src={listing.images[0].url}
        className="h-48 w-full rounded-t-lg object-cover"
      /> : <div className="h-48 w-full bg-gray-200 rounded-t-lg">
        <div className="flex items-center justify-center h-full text-gray-500">
          No Image
        </div>
        </div>}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-ld font-semibold">
            {listing.address.line1}{" "}
            {listing.address.line2 && "#" + listing.address.line2}
          </h3>
          <button className="group py-2 pl-2" onClick={onLikeBtnClick}>
            <IconBookmark
              className={cn(
                "h-5 w-5 group-hover:text-blue-500",
                optimisticLike ? "fill-blue-500 text-blue-500" : "text-gray-700"
              )}
            />
          </button>
        </div>
        <div className="space-x-0.5 text-gray-600">
          <span>
            {listing.bedrooms} bd{listing.bedrooms > 1 && "s"}
          </span>
          <span className="text-gray-400">•</span>
          <span>
            {listing.bathrooms} bth{listing.bathrooms > 1 && "s"}
          </span>
          <span className="text-gray-400">•</span>
          <span>{listing.address.distance.toFixed(2)} mi.</span>
          {/* {listing.squareFootage > 0 && (
            <>
              <span className="text-gray-400">•</span>
              <span>{listing.squareFootage.toLocaleString()} sqft</span>
            </>
          )} */}
        </div>
        <p className="mt-1 text-lg font-semibold">
          ${listing.rent}{" "}
          <span className="font-normal text-gray-500">/ month</span>
        </p>
      </div>
    </Link>
  )
}
