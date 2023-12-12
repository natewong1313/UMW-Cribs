package routes

import (
	"os"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	parentGroup := app.Group("/api")
	parentGroup.Get("/test", func(c *fiber.Ctx) error {
		return c.SendString(os.Getenv("APP_ENV"))
	})
	setupDogsRoutes(parentGroup.Group("/dogs"))

	if os.Getenv("APP_ENV") == "production" {
		app.Static("/", "./dist")
		app.Get("*", func(c *fiber.Ctx) error {
			return c.Render("index", fiber.Map{})
		})
	}
}
