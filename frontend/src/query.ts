import { QueryClient } from "react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

export const getDogsQuery = {
  queryKey: "getDogs",
  queryFn: () => fetch("/api/dogs").then((res) => res.json()),
  retry: 5,
}

export const getUserQuery = {
  queryKey: "getUser",
  queryFn: () => fetch("/api/user").then((res) => res.json()),
  retry: 5,
}

export const getListingsQuery = (
  searchParams: URLSearchParams | null,
  showOnlyAvailable: boolean
) => {
  const params = searchParams
    ? new URLSearchParams(searchParams)
    : new URLSearchParams()
  if (showOnlyAvailable) {
    params.append("available", "true")
  }
  return {
    queryKey: ["getListings" + searchParams?.toString()],
    queryFn: () =>
      fetch(`/api/listings?${searchParams?.toString()}`).then((res) =>
        res.json()
      ),
    retry: 5,
  }
}

export const getListingQuery = (id: string) => ({
  queryKey: ["getListing", id],
  queryFn: () =>
    fetch(`/api/listings/listing?id=${id}`).then((res) => res.json()),
  retry: 5,
})

export const getUserLikesQuery = {
  queryKey: "getLikes",
  queryFn: () => fetch("/api/user/likes").then((res) => res.json()),
  retry: 5,
}
