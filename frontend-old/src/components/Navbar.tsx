import { Link } from "react-router-dom"
import { IconUser } from "@tabler/icons-react"

const links = [
  {
    href: "/components",
    title: "Component Library",
  },
  {
    href: "https://github.com/natewong1313/web-app-template",
    title: "Source code",
  },
]

export default function Navbar() {
  return (
    <nav className="bg-blue-900">
      <div className="px-8 h-16 justify-between flex items-center text-white">
        <Link to="/" className="font-semibold text-lg">
          Web App Template
        </Link>
        <div className="space-x-2">
          {links.map(link => (
            <Link
              to={link.href}
              className="hover:bg-blue-800 py-2 px-3 font-medium rounded-md text-gray-200 transition-colors duration-150"
            >
              {link.title}
            </Link>
          ))}
        </div>
        <Link
          to="/signin"
          className="flex ring-1 ring-blue-100 hover:bg-blue-800 py-2 px-3 font-medium rounded-md text-gray-200 transition-colors duration-150"
        >
          <IconUser className="mr-1" />
          Sign in
        </Link>
      </div>
    </nav>
  )
}
