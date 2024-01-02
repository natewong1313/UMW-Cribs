package scrapers

import (
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/natewong1313/web-app-template/server/config"
	"github.com/natewong1313/web-app-template/server/database"
	"github.com/rs/zerolog"
)

type scraper struct {
	client   *http.Client
	logger   zerolog.Logger
	listings map[string]*database.Listing
}

func Start() {
	log := zerolog.New(zerolog.ConsoleWriter{Out: os.Stderr}).With().Timestamp().Logger()
	if err := godotenv.Load("../.env"); err != nil && (os.Getenv("APP_ENV") != "production" && !os.IsNotExist(err)) {
		log.Fatal().Err(err).Msg("Failed to load .env file")
	}
	cfg, err := config.Init()
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to init config")
	}

	var oldListingsArr []*database.Listing
	cfg.DB.Find(&oldListingsArr)
	oldListings := make(map[string]*database.Listing)
	for _, listing := range oldListingsArr {
		oldListings[listing.ID] = listing
	}

	scrapedListings := make(map[string]*database.Listing)

	weichertListings := ScrapeWeichert()
	for _, listing := range weichertListings {
		scrapedListings[listing.ID] = listing
	}

	aptsDotComListings := ScrapeApartmentsDotCom()
	for _, listing := range aptsDotComListings {
		scrapedListings[listing.ID] = listing
	}

	var unavailableListingIDs []string
	for _, listing := range oldListings {
		if _, ok := scrapedListings[listing.ID]; !ok {
			unavailableListingIDs = append(unavailableListingIDs, listing.ID)
		}
	}

	var newListings []*database.Listing
	for _, listing := range scrapedListings {
		if _, ok := oldListings[listing.ID]; !ok {
			newListings = append(newListings, listing)
		}
	}

	if len(unavailableListingIDs) > 0 {
		log.Info().Msgf("Marking %d listings as unavailable", len(unavailableListingIDs))
		cfg.DB.Model(&database.Listing{}).Where("id IN ?", unavailableListingIDs).Update("available", false)
	}

	if len(newListings) > 0 {
		log.Info().Msgf("Creating %d new listings", len(newListings))
		cfg.DB.Create(newListings)
	}

}
