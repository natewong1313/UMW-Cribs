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
      ) : err ? (
        <span>Error: {err}</span>
      ) : (
        <ul className="mt-5 space-y-3">
          {data.dogs.map((dog: any) => (
            <li key={dog}>{dog}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
