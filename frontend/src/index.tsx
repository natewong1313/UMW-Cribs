import React from "react"
import ReactDOM from "react-dom/client"
import { QueryClientProvider } from "react-query"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./index.css"
import ListingsPage from "./pages/listings"
import { queryClient } from "./query"
import "@fontsource-variable/manrope"
import SavedListingsPage from "./pages/saved"

const router = createBrowserRouter([
  {
    path: "/",
    element: <ListingsPage />,
  },
  {
    path: "/saved",
    element: <SavedListingsPage />,
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
