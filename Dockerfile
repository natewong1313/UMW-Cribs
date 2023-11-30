FROM node:20-slim as build-frontend
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
ADD ./frontend ./build
WORKDIR /build

FROM build-frontend AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM build-frontend AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM golang:1.20 as build-server

ADD ./server /app
WORKDIR /app
COPY --from=build-frontend /build/dist ./dist

RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags "-w" -a -o main

RUN chmod +x ./main
EXPOSE 8080
ENTRYPOINT ["./main"]  
CMD ["-app_env=production"]