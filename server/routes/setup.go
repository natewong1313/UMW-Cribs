package routes

import "github.com/gofiber/fiber/v2"

func Setup(app *fiber.App) {
	parentGroup := app.Group("/api")
	parentGroup.Get("/test", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World 👋!")
	})
}
