import { useQuery } from "react-query"
import { DogsResponse } from "./types/types"
import { getDogsQuery } from "./query"
import { Link } from "react-router-dom"

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
              <div className="w-72 ring-1 ring-gray-300 rounded-md p-4" key={i}>
                <div className="rounded-md w-full h-48 bg-gray-200 animate-pulse" />
                <div className="mt-2 w-full bg-gray-200 h-4 rounded-full animate-pulse" />
                <div className="mt-2.5 w-full bg-gray-200 h-6 rounded-full animate-pulse" />
              </div>
            ))
          : !isError &&
            data?.dogs.map((dog) => (
              <div
                className="w-72 ring-1 ring-gray-300 rounded-md p-4"
                key={dog.name}
              >
                <img
                  src={dog.image_url}
                  className="rounded-md w-full h-48 bg-gray-200"
                  loading="eager"
                />
                <h1 className="font-semibold mt-1">{dog.name}</h1>
                <div className="space-x-2 mt-1">
                  {dog.traits.map((trait: string) => (
                    <span
                      className="py-1 px-2 bg-blue-100 rounded-full text-xs text-blue-500"
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
