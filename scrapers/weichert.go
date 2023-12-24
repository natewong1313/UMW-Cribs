package scrapers

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/buger/jsonparser"
	"github.com/natewong1313/web-app-template/server/database"
	"github.com/rs/zerolog"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

type weichertScraper struct {
	scraper
}

func ScrapeWeichert() map[string]*database.Listing {
	ws := &weichertScraper{
		scraper: scraper{
			client:   &http.Client{},
			logger:   zerolog.New(zerolog.ConsoleWriter{Out: os.Stderr}).With().Timestamp().Logger(),
			listings: make(map[string]*database.Listing),
		},
	}

	// proxyUrl, _ := url.Parse("http://127.0.0.1:8888")
	// ws.client = &http.Client{Transport: &http.Transport{Proxy: http.ProxyURL(proxyUrl)}}
	ws.findAllListings(1)
	return ws.listings
}

func (ws *weichertScraper) findAllListings(currentPage int) {
	ws.logger.Info().Msgf("Scraping Weichert page %d", currentPage)
	reqBody := []byte(fmt.Sprintf(`{"redirectRequired":false,"currentSearch":"pg=%d&stypeid=3&zip=22401","form":null}`, currentPage))

	req, err := http.NewRequest("POST", "https://www.weichert.com/api/search", bytes.NewBuffer(reqBody))
	if err != nil {
		ws.logger.Err(err).Msg("Failed to create listings data request")
		return
	}
	req.Header.Set("Authority", "www.weichert.com")
	req.Header.Set("Accept", "*/*")
	req.Header.Set("Accept-Language", "en-US,en;q=0.9")
	req.Header.Set("Content-Type", "application/json; charset=UTF-8")
	req.Header.Set("Origin", "https://www.weichert.com")
	req.Header.Set("Referer", "https://www.weichert.com/VA/Stafford/Fredericksburg/for-rent/")
	req.Header.Set("Sec-Ch-Ua", "^^Google")
	resp, err := ws.client.Do(req)
	if err != nil {
		ws.logger.Err(err).Msg("Failed to get listings data")
		return
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		ws.logger.Err(err).Msg("Failed to read response body")
		return
	}
	if err = ws.parseListings(body); err != nil {
		ws.logger.Err(err).Msg("Failed to parse listings")
		return
	}

	totalPages, _ := jsonparser.GetFloat(body, "pages")
	if currentPage < int(totalPages) {
		ws.findAllListings(currentPage + 1)
	}
}

func (ws *weichertScraper) parseListings(body []byte) error {
	_, err := jsonparser.ArrayEach(body, func(listingData []byte, dataType jsonparser.ValueType, offset int, err error) {
		description, _ := jsonparser.GetString(listingData, "description")
		price, _ := jsonparser.GetFloat(listingData, "price")
		bedsStr, _ := jsonparser.GetString(listingData, "beds")
		beds, _ := strconv.Atoi(strings.Split(bedsStr, " ")[0])
		bathsStr, _ := jsonparser.GetString(listingData, "bathsshort")
		bathsStr = strings.ReplaceAll(strings.Split(bathsStr, " ")[0], ".1", ".5")
		baths, _ := strconv.ParseFloat(bathsStr, 64)
		sqftStr, _ := jsonparser.GetString(listingData, "sqft")
		sqftStr = strings.ReplaceAll(sqftStr, ",", "")
		sqft, _ := strconv.Atoi(sqftStr)
		address := ws.parseListingAddress(listingData)
		id := createID(address.Line1, address.Line2)

		ws.listings[id] = &database.Listing{
			ID:               id,
			Available:        true,
			Description:      description,
			Rent:             int(price),
			Bedrooms:         beds,
			Bathrooms:        baths,
			SquareFootage:    sqft,
			AvailabilityDate: time.Now(),
			Address:          address,
			Images:           ws.parseListingImages(listingData),
			Source:           ws.parseListingSource(listingData),
		}
	}, "listings")
	return err
}

func (ws *weichertScraper) parseListingAddress(listingData []byte) database.Address {
	var address database.Address

	address1, _ := jsonparser.GetString(listingData, "addr")
	address.Line1 = cases.Title(language.Und, cases.NoLower).String(strings.ToLower(address1))
	address.City, _ = jsonparser.GetString(listingData, "city")
	address.State, _ = jsonparser.GetString(listingData, "state")
	address.Zip, _ = jsonparser.GetString(listingData, "zip")
	address.Latitude, _ = jsonparser.GetFloat(listingData, "lat")
	address.Longitude, _ = jsonparser.GetFloat(listingData, "lng")
	address.Distance = calcDistanceFromUMW(address.Latitude, address.Longitude)
	return address
}

func (ws *weichertScraper) parseListingSource(listingData []byte) database.Source {
	var source database.Source
	url, _ := jsonparser.GetString(listingData, "url")
	source.URL = "https://www.weichert.com/" + url
	source.Site = "Weichert"
	return source
}

func (ws *weichertScraper) parseListingImages(listingData []byte) []database.Image {
	var images []database.Image
	_, _ = jsonparser.ArrayEach(listingData, func(photoData []byte, dataType jsonparser.ValueType, offset int, err error) {
		images = append(images, database.Image{URL: "https:" + string(photoData)})
	}, "images")
	return images
}
