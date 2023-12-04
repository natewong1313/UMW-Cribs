import { useQuery } from "react-query"
import { Link } from "react-router-dom"
import { getDogsQuery } from "./query"
import { DogsResponse } from "./types/types"

export default function App() {
  const { isLoading, isError, data } = useQuery<DogsResponse>(getDogsQuery)
  return (
    <div className="content p-4">
      <Link to="/" className="text-blue-500">
        Home
      </Link>
      <p>View dogs for sale</p>
      <div className="mt-4 flex space-x-2">
        {isLoading
          ? [...Array(5).keys()].map((i) => (
              <div className="w-72 rounded-md p-4 ring-1 ring-gray-300" key={i}>
                <div className="h-48 w-full animate-pulse rounded-md bg-gray-200" />
                <div className="mt-2 h-4 w-full animate-pulse rounded-full bg-gray-200" />
                <div className="mt-2.5 h-6 w-full animate-pulse rounded-full bg-gray-200" />
              </div>
            ))
          : !isError &&
            data?.dogs.map((dog) => (
              <div
                className="w-72 rounded-md p-4 ring-1 ring-gray-300"
                key={dog.name}
              >
                <img
                  src={dog.image_url}
                  className="h-48 w-full rounded-md bg-gray-200"
                  loading="eager"
                />
                <h1 className="mt-1 font-semibold">{dog.name}</h1>
                <div className="mt-1 space-x-2">
                  {dog.traits.map((trait: string) => (
                    <span
                      className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-500"
                      key={trait}
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            ))}
      </div>
    </div>
  )
}
