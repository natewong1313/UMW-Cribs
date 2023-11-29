package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/natewong1313/web-app-template/server/routes"
)

func main() {
	app := fiber.New()

	routes.Setup(app)

	app.Listen("127.0.0.1:3000")
}
