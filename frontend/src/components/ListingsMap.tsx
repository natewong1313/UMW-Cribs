import { useStore } from "@nanostores/react"
import { Icon } from "leaflet"
import "leaflet/dist/leaflet.css"
import { Marker, Popup } from "react-leaflet"
import { MapContainer } from "react-leaflet/MapContainer"
import { TileLayer } from "react-leaflet/TileLayer"
import { DatabaseListing } from "../types/types"
import shortenNum from "../utils/shortenNum"
import "./ListingsMap.css"
import { hoveredListingId } from "../stores/listingStore"

type Props = {
  listings: DatabaseListing[]
}
export default function ListingsMap({ listings }: Props) {
  const $hoveredListingId = useStore(hoveredListingId)

  return (
    <div className="flex flex-1">
      <MapContainer
        center={[38.303779245076335, -77.46786117553712]}
        zoom={14}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
        />
        {listings.map((listing) => {
          const icon = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg width="109" height="49" viewBox="0 0 109 49" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_1_4)">
<rect x="4" width="101" height="41" rx="20.5" fill="${
            $hoveredListingId !== "" && $hoveredListingId !== listing.id
              ? "#9ca3af"
              : "#374cf4"
          }"/>
</g>
 <text x="50%" y="60%" text-anchor="middle" fill="white" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="1.7em">$${shortenNum(
   listing.rent
 )}</text>
<defs>
<filter id="filter0_d_1_4" x="0" y="0" width="109" height="49" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_4"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_4" result="shape"/>
</filter>
</defs>
</svg>
`)}`
          return (
            <Marker
              key={listing.id}
              position={[listing.address.latitude, listing.address.longitude]}
              icon={
                new Icon({
                  iconUrl: icon,
                  iconSize: [45, 45],
                  className:
                    $hoveredListingId !== "" && $hoveredListingId == listing.id
                      ? "hovered-listing-marker"
                      : "",
                })
              }
            >
              <Popup>
                <div className="flex flex-col">
                  <img
                    src={listing.images[0].url}
                    alt="listing"
                    className="h-32"
                  />
                  <div className="mt-1 text-base font-semibold">
                    {listing.address.line1}
                  </div>
                  <div className="mt-1">
                    {listing.bedrooms} bedroom{listing.bedrooms > 1 && "s"},{" "}
                    {listing.bathrooms} bathroom
                    {listing.bathrooms > 1 && "s"}
                  </div>
                  <a
                    target="_blank"
                    href={`/listings/${listing.id}`}
                    rel="noreferrer"
                  >
                    <div className="mt-1 text-sm font-medium text-blue-500 hover:text-blue-700">
                      View Listing
                    </div>
                  </a>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
