import { Menu, Transition } from "@headlessui/react"
import { IconBookmarkFilled, IconSearch, IconX } from "@tabler/icons-react"
import { Fragment, useEffect, useRef, useState } from "react"
// import type { Listing } from "../types/listings"
import cn from "../utils/cn"
import AuthModal from "./AuthModal"
import LogoImg from "../assets/logo.png"
import {
  AuthUserRecord,
  DatabaseListing,
  ListingsResponse,
} from "../types/types"
import { UserResponse } from "../types/types"
import { useQuery } from "react-query"
import { getUserQuery } from "../query"

type Props = {
  user: AuthUserRecord | null
}
export default function Navbar() {
  const { isLoading, data } = useQuery<UserResponse>(getUserQuery)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalPage, setAuthModalPage] = useState(0)
  const user = data?.user
  return (
    <>
      <div className="border-b border-slate-200">
        <div className="mx-auto flex items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center hover:opacity-90">
            <img src={LogoImg} height="48" width="48" />
            <h1 className="ml-2 text-lg font-semibold">UMW Cribs</h1>
          </a>
          <SearchBar />
          {user ? (
            <UserOnlyDetails user={user} />
          ) : (
            <div className={cn("space-x-2", isLoading && "invisible")}>
              <button
                className="rounded-full px-6 py-2.5 font-medium hover:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                onClick={() => {
                  setAuthModalOpen(true)
                  setAuthModalPage(0)
                }}
              >
                Log in
              </button>
              <button
                className="rounded-full bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                onClick={() => {
                  setAuthModalOpen(true)
                  setAuthModalPage(1)
                }}
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        page={authModalPage}
        setPage={setAuthModalPage}
      />
    </>
  )
}

function SearchBar() {
  const searchRef = useRef<HTMLDivElement>(null)
  const [searchValue, setSearchValue] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<DatabaseListing[]>([])
  useEffect(() => {
    setShowDropdown(searchValue !== "")
    setIsSearching(true)
    const delayDebounceFn = setTimeout(async () => {
      if (searchValue !== "") {
        const response = await fetch(
          "/api/listings/search?query=" + searchValue
        )
        const data: ListingsResponse = await response.json()
        setSearchResults(data.listings)
      }
      setIsSearching(false)
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchValue])
  useEffect(() => {
    function handleClickOutside(event: TouchEvent | MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [searchRef])

  return (
    <Menu as="div" className="relative inline-block text-left" ref={searchRef}>
      <div className="relative hidden sm:block">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-1.5">
          <IconSearch className="h-7 w-7 rounded-full bg-gray-100 p-1.5 text-gray-400" />
        </div>
        <input
          className="block rounded-full border-0 py-2 pl-10 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-200 sm:w-64 sm:text-sm sm:leading-6 md:w-80"
          placeholder="Search for a home by address"
          value={searchValue}
          onChange={(e) =>
            setSearchValue(e.target.value.replace(/[^A-Za-z0-9]/gi, ""))
          }
          onClick={() => setShowDropdown(searchValue !== "")}
        />
        {searchValue !== "" && (
          <button
            className="absolute inset-y-0 right-2"
            onClick={() => setSearchValue("")}
          >
            <IconX className="h-5 w-5 text-gray-400 hover:text-gray-500" />
          </button>
        )}
      </div>

      <Transition
        show={showDropdown}
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0"
        enterTo="transform opacity-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100"
        leaveTo="transform opacity-0"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-lg bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none md:w-80">
          {isSearching && (
            <Menu.Item>
              <div className="flex justify-center py-6">
                <svg
                  className="h-8 w-8 animate-spin fill-blue-600 text-gray-200"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
            </Menu.Item>
          )}
          {!isSearching &&
            searchResults &&
            searchResults.map((listing) => (
              <Menu.Item key={listing.id}>
                {({ active }) => (
                  <a
                    href={`/listings/${listing.id}`}
                    className={cn(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "flex px-4 py-2 text-sm"
                    )}
                  >
                    <img
                      src={listing.images[0].url}
                      alt={listing.address.line1 + " " + listing.address.line2}
                      className="h-16 w-16"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {listing.address.line1 + " " + listing.address.line2}
                      </div>
                      <div className="text-sm text-gray-500">
                        {listing.bedrooms} bed(s) &bull; {listing.bathrooms}{" "}
                        bath(s)
                      </div>
                      <div className="text-sm text-gray-500">
                        ${listing.rent.toLocaleString()}
                      </div>
                    </div>
                  </a>
                )}
              </Menu.Item>
            ))}
          {searchResults.length === 0 && !isSearching && (
            <Menu.Item>
              <div className="flex justify-center py-6 text-sm font-medium text-gray-900">
                No results found
              </div>
            </Menu.Item>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

function UserOnlyDetails({ user }: Props) {
  const initials = user?.displayName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
  return (
    <div className="flex items-center space-x-4">
      <a
        href="/saved"
        className="flex items-center rounded-[0.4rem] p-2 font-medium text-gray-600 hover:bg-gray-100"
      >
        <IconBookmarkFilled size={18} className="mr-1.5 text-gray-400" />
        Saved
      </a>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-500 font-medium text-white transition-colors duration-150 hover:bg-gray-400 focus:outline-none">
            {initials}
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={cn(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Account settings
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={cn(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Support
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={cn(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    License
                  </a>
                )}
              </Menu.Item>
              <form method="POST" action="#">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="submit"
                      className={cn(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block w-full px-4 py-2 text-left text-sm"
                      )}
                    >
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </form>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
