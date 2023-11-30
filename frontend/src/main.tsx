import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import HomePage from "./pages/Home"
import SigninPage from "./pages/Signin"
import ComponentsPage from "./pages/Components"
import "./styles/index.css"

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/signin",
    element: <SigninPage />,
  },
  {
    path: "/components",
    element: <ComponentsPage />,
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
