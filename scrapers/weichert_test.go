package scrapers

import (
	"testing"

	"github.com/joho/godotenv"
	"github.com/natewong1313/web-app-template/server/config"
)

func TestWeichert(t *testing.T) {
	if err := godotenv.Load("../.env"); err != nil {
		panic(err)
	}
	cfg, err := config.Init()
	if err != nil {
		panic(err)
	}
	db := cfg.DB
	listings := ScrapeWeichert()
	for _, listing := range listings {
		db.Create(&listing)
	}
}
