# Web App Template

This is my go-to project template for builing a web app. It features

- A React frontend (powered by [Rsbuild](https://rsbuild.dev/)) with Tailwind + Prettier & Eslint configured
- Go backend (fiber) with hot-reloading using [Air](https://github.com/cosmtrek/air)
- Typesafe communication between the frontend and backend using [Swagger](https://github.com/gofiber/swagger), [swagger-typescript-api](https://www.npmjs.com/package/swagger-typescript-api) and [Tanstack query](https://tanstack.com/query/latest)
- Frontend proxies requests to the backend to avoid CORS errors in dev
- Included Dockerfile to easily deploy, which bundles the frontend and the backend onto one server

## Getting Started

Clone the repo

```console
$ gh repo clone natewong1313/web-app-template
$ cd web-app-template
```

Then, install the frontend dependencies

```console
$ cd frontend
$ pnpm install
$ cd ../
```

And the backend

```console
$ cd server
$ go mod download
$ cd ../
```

## Running the app

You'll want to run the following sets of commands in two different terminal windows to run both the frontend and the backend at the same time

### Frontend

```console
$ cd frontend
$ pnpm run dev
```

### Backend

```console
$ cd backend
$ air .
```
