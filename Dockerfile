FROM node:18-alpine3.17 as build-frontend
ADD ./frontend ./build
WORKDIR /build

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build

FROM golang:1.20 as build-server

ADD . /app
WORKDIR /app
COPY --from=build-frontend /build/dist ./dist

RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags "-w" -a -o main

RUN chmod +x ./main
EXPOSE 8080
ENTRYPOINT ["./main"]  
CMD ["-app_env=production"]