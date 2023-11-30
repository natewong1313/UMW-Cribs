import { Link } from "react-router-dom"

export default function HomePage() {
  return (
    <div>
      Welcome
      <Link to="/signin">Sign In</Link>
    </div>
  )
}
