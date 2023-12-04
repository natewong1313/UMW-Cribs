package main

import (
	"flag"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/swagger"
	"github.com/gofiber/template/html/v2"
	_ "github.com/natewong1313/web-app-template/server/docs"
	"github.com/natewong1313/web-app-template/server/routes"
)

// @title Web App Template API
// @version 1.0
// @description This is a sample api
// @termsOfService http://swagger.io/terms/
// @contact.name API Support
// @contact.email fiber@swagger.io
// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html
// @host localhost:3000
// @BasePath /
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
	app.Use(logger.New())
	app.Get("/swagger/*", swagger.HandlerDefault) // default

	routes.Setup(app)

	if os.Getenv("APP_ENV") == "production" && os.Getenv("PORT") != "" {
		app.Listen(":" + os.Getenv("PORT"))
	} else {
		app.Listen(":3000")
	}
}
