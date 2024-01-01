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

export const getListingsQuery = (searchParams: URLSearchParams) => ({
  queryKey: ["getListings", searchParams.toString()],
  queryFn: () =>
    fetch(`/api/listings?${searchParams.toString()}`).then((res) => res.json()),
  retry: 5,
})

export const getUserLikesQuery = {
  queryKey: "getLikes",
  queryFn: () => fetch("/api/user/likes").then((res) => res.json()),
  retry: 5,
}
