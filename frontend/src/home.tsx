import { Link } from "react-router-dom"
import { getDogsQuery, queryClient } from "./query"

export default function Home() {
  return (
    <div className="p-5">
      <Link
        to="/dogs"
        onMouseOver={() => queryClient.prefetchQuery(getDogsQuery)}
      >
        View dogs
      </Link>
    </div>
  )
}
