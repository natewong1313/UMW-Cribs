package main

import (
	"os"

	"github.com/go-co-op/gocron/v2"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/swagger"
	"github.com/gofiber/template/html/v2"
	"github.com/joho/godotenv"
	"github.com/natewong1313/web-app-template/server/config"
	"github.com/natewong1313/web-app-template/server/routes"
	"github.com/natewong1313/web-app-template/server/scrapers"
	_ "github.com/natewong1313/web-app-template/server/swagger"
)

// @title UMW Cribs API
// @version 1.0
// @description This is the UMW Cribs API
// @host localhost:3000
// @BasePath /
func main() {
	if err := godotenv.Load(); err != nil && (os.Getenv("APP_ENV") != "production" && !os.IsNotExist(err)) {
		log.Error(err)
		return
	}
	isProduction := os.Getenv("APP_ENV") == "production"
	cfg, err := config.Init()
	if err != nil {
		log.Error(err)
		return
	}

	if isProduction {
		s, err := gocron.NewScheduler()
		if err != nil {
			log.Error(err)
			return
		}
		_, err = s.NewJob(
			gocron.DailyJob(1, gocron.NewAtTimes(
				gocron.NewAtTime(11, 0, 0))),
			gocron.NewTask(
				func() {
					log.Info("Starting scraper")
					scrapers.Start(cfg)
				},
			),
		)
		if err != nil {
			log.Error(err)
			return
		}
		s.Start()
		defer s.Shutdown()
	}

	fiberCFG := fiber.Config{}
	if isProduction {
		fiberCFG.Views = html.New("./dist", ".html")
	}
	app := fiber.New(fiberCFG)
	app.Use(logger.New())
	if !isProduction {
		app.Get("/swagger/*", swagger.HandlerDefault)
	}
	routes.Setup(app, cfg)

	if isProduction && os.Getenv("PORT") != "" {
		if err = app.Listen(":" + os.Getenv("PORT")); err != nil {
			log.Error(err)
		}
	} else {
		if err = app.Listen(":3000"); err != nil {
			log.Error(err)
		}
	}
}
