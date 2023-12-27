package routes

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/natewong1313/web-app-template/server/config"
)

type router struct {
	app *fiber.App
	cfg *config.Config
}

func Setup(app *fiber.App, cfg *config.Config) {
	r := router{
		app: app,
		cfg: cfg,
	}
	if os.Getenv("APP_ENV") == "production" {
		r.app.Static("/", "./dist")
		r.app.Get("*", func(c *fiber.Ctx) error {
			return c.Render("index", fiber.Map{})
		})
	}

	routeGroup := r.app.Group("/api")
	r.setupListingsRoutes(routeGroup.Group("/listings"))
	r.setupUserRoutes(routeGroup.Group("/user"))

}
