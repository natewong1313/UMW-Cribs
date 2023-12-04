import React from "react"
import ReactDOM from "react-dom/client"
import Dogs from "./dogs"
import { QueryClientProvider } from "react-query"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./index.css"
import Home from "./home"
import { queryClient } from "./query"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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
