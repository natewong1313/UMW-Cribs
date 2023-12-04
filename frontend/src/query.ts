import { QueryClient } from "react-query"

export const queryClient = new QueryClient()

export const getDogsQuery = {
  queryKey: "getDogs",
  queryFn: () => fetch("/api/dogs").then((res) => res.json()),
  retry: 5,
}
