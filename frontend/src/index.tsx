import React from "react"
import ReactDOM from "react-dom/client"
import Dogs from "./dogs"
import { QueryClientProvider } from "react-query"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./index.css"
import Listings from "./pages/listings"
import { queryClient } from "./query"
import "@fontsource-variable/manrope"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Listings />,
  },
  {
    path: "/dogs",
    element: <Dogs />,
  },
])

const root = ReactDOM.createRoot(document.getElementById("root")!)
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
