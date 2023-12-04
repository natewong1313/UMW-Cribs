import "./App.css"
import { useQuery } from "react-query"

const App = () => {
  const { isLoading, err, data } = useQuery("getDogs", () =>
    fetch("/api/dogs").then((res) => res.json())
  )
  return (
    <div className="content">
      <h1 className="text-blue-500">Rsbuild with React</h1>
      <p>Start building amazing things with Rsbuild.</p>
      {/* <h3 className="h-4 bg-gray-200 rounded-full"></h3> */}

      {isLoading ? (
        <ul className="mt-5 space-y-3">
          <li className="w-full h-4 bg-gray-200 rounded-full animate-pulse"></li>
          <li className="w-full h-4 bg-gray-200 rounded-full animate-pulse"></li>
          <li className="w-full h-4 bg-gray-200 rounded-full animate-pulse"></li>
          <li className="w-full h-4 bg-gray-200 rounded-full animate-pulse"></li>
        </ul>
      ) : (
        !err && (
          // <ul className="mt-5 space-y-3">
          //   {data.dogs.map((dog: any) => (
          //     <li key={dog.breed}>{dog.breed}</li>
          //   ))}
          // </ul>
          <div className="flex p-2 space-x-2">
            {data.dogs.map((dog: any) => (
              <div
                className="w-64 ring-1 ring-gray-300 rounded-md p-4"
                key={dog.name}
              >
                <img src={dog.image_url} className="w-64 rounded-md" />
                <h1 className="font-semibold mt-1">{dog.name}</h1>
                <div className="space-x-2 mt-1">
                  {dog.traits.map((trait) => (
                    <span
                      className="py-1 px-2 bg-blue-100 rounded-full text-sm text-blue-500"
                      key={trait}
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}

export default App
