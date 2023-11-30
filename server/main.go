package main

import (
	"flag"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html/v2"
	"github.com/natewong1313/web-app-template/server/routes"
)

func main() {
	// err := godotenv.Load()
	appEnvPtr := flag.String("app_env", "development", "production or development")
	flag.Parse()
	os.Setenv("APP_ENV", *appEnvPtr)

	config := fiber.Config{}
	if os.Getenv("APP_ENV") == "production" {
		config.Views = html.New("./dist", ".html")
	}
	app := fiber.New(config)

	routes.Setup(app)

	if os.Getenv("APP_ENV") == "production" && os.Getenv("PORT") != "" {
		app.Listen(":" + os.Getenv("PORT"))
	} else {
		app.Listen(":8080")
	}
}
