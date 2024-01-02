package scrapers

import (
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
)

type aptsDotComScraper struct {
	scraper
}

func ScrapeApartmentsDotCom() map[string]*database.Listing {
	as := &aptsDotComScraper{
		scraper: scraper{
			client:   &http.Client{},
			logger:   zerolog.New(zerolog.ConsoleWriter{Out: os.Stderr}).With().Timestamp().Logger(),
			listings: make(map[string]*database.Listing),
		},
	}

	// proxyUrl, _ := url.Parse("http://127.0.0.1:8888")
	// as.client = &http.Client{Transport: &http.Transport{Proxy: http.ProxyURL(proxyUrl)}}
	as.findAllListings()
	return as.listings
}

func (as *aptsDotComScraper) findAllListings() {
	as.logger.Info().Msg("Scraping Apartments.com listings")
	reqBody := strings.NewReader(`{"rl":700,"criteria":{"geog":{"box":[-77.532575,38.270129,-77.4514771,38.326435],"id":9213,"c":[-77.49202605,38.298282],"type":2},"sort":0,"o":1},"pn":1,"ps":100,"facets":true}`)

	req, err := http.NewRequest("POST", "https://pds.apps.apartments.com/aptsnet/mobile/listing/search", reqBody)
	if err != nil {
		as.logger.Err(err).Msg("Failed to create listings data request")
		return
	}
	req.Header.Set("Host", "pds.apps.apartments.com")
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Culture-Code", "en-US")
	req.Header.Set("x-app", "apartments.apartments.mobile-ios")
	req.Header.Set("Accept", "*/*")
	req.Header.Set("User-Agent", "Apartments/12.2.7 (iPhone; iOS 17.1.2; S0)")
	req.Header.Set("Accept-Language", "en-US,en;q=0.9")
	resp, err := as.client.Do(req)
	if err != nil {
		as.logger.Err(err).Msg("Failed to get listings data")
		return
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		as.logger.Err(err).Msg("Failed to read response body")
		return
	}
	var listingIDs []string
	_, err = jsonparser.ArrayEach(body, func(value []byte, dataType jsonparser.ValueType, offset int, _ error) {
		rentRange, _ := jsonparser.GetString(value, "rentRange")
		if strings.Contains(rentRange, "-") {
			return
		}
		listingID, _ := jsonparser.GetString(value, "k")
		// listingIDs = append(listingIDs, listingID)
		listing, err := as.scrapeListingDetails(listingID)
		if err != nil {
			return
		}

		listing.Source = as.parseListingSource(listingID)
		images, err := as.scrapeListingImages(listingID)
		if err != nil {
			return
		}
		listing.Images = images
		as.listings[listingID] = listing
	}, "placards")
	if err != nil {
		as.logger.Err(err).Msg("Failed to parse placards")
		return
	}
	as.logger.Info().Msgf("Found %d listings", len(listingIDs))
}

func (as *aptsDotComScraper) scrapeListingDetails(listingID string) (*database.Listing, error) {
	as.logger.Info().Msgf("Scraping address data from Apartments.com listing with id %s", listingID)
	reqBody := strings.NewReader(fmt.Sprintf(`{"listingKey":"%s"}`, listingID))

	req, err := http.NewRequest("POST", fmt.Sprintf("https://pds.apps.apartments.com/aptsnet/mobile/listing/%s/detail", listingID), reqBody)
	if err != nil {
		as.logger.Err(err).Msg("Failed to create listing scrape request")
		return nil, err
	}
	req.Header.Set("Host", "pds.apps.apartments.com")
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Culture-Code", "en-US")
	req.Header.Set("x-app", "apartments.apartments.mobile-ios")
	req.Header.Set("Accept", "*/*")
	req.Header.Set("User-Agent", "Apartments/12.2.7 (iPhone; iOS 17.1.2; S0)")
	req.Header.Set("Accept-Language", "en-US,en;q=0.9")
	resp, err := as.client.Do(req)
	if err != nil {
		as.logger.Err(err).Msg("Failed to get listings data")
		return nil, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		as.logger.Err(err).Msg("Failed to read response body")
		return nil, err
	}
	listing := &database.Listing{
		Available: true,
	}
	listing.Description, _ = jsonparser.GetString(body, "desc")
	rent, _ := jsonparser.GetString(body, "availabilities", "[0]", "details", "[0]", "rentRange")
	listing.Rent, _ = strconv.Atoi(strings.ReplaceAll(strings.ReplaceAll(rent, "$", ""), ",", ""))
	beds, _ := jsonparser.GetString(body, "availabilities", "[0]", "details", "[0]", "bedNum")
	listing.Bedrooms, _ = strconv.Atoi(beds)
	if listing.Bedrooms == 0 {
		listing.Bedrooms = 1
	}
	baths, _ := jsonparser.GetString(body, "availabilities", "[0]", "details", "[0]", "bathNum")
	listing.Bathrooms, _ = strconv.ParseFloat(baths, 64)
	sqft, _ := jsonparser.GetString(body, "availabilities", "[0]", "details", "[0]", "area")
	listing.SquareFootage, _ = strconv.Atoi(strings.ReplaceAll(strings.ReplaceAll(sqft, "SF", ""), ",", ""))
	availDate, _ := jsonparser.GetString(body, "availabilities", "[0]", "details", "[0]", "availabilityDate")
	parsedTime, err := time.Parse("2006-01-02T15:04:05-07:00", availDate)
	if err != nil {
		listing.AvailabilityDate = time.Now()
	} else {
		listing.AvailabilityDate = parsedTime
	}

	listing.Address = as.parseListingAddress(body)
	listing.ID = createID(listing.Address.Line1, listing.Address.Line2)
	return listing, nil
}

var line1NormalizeMap = map[string]string{
	"St":   "Street",
	"Cir":  "Circle",
	"Dr":   "Drive",
	"Ln":   "Lane",
	"Pl":   "Place",
	"Rd":   "Road",
	"Ave":  "Avenue",
	"Blvd": "Boulevard",
	"Ter":  "Terrace",
	"Ct":   "Court",
}

func (as *aptsDotComScraper) parseListingAddress(body []byte) database.Address {
	var address database.Address
	line1, _ := jsonparser.GetString(body, "address", "lineOne")
	line1Split := strings.Split(line1, " ")
	for i, word := range line1Split {
		if _, ok := line1NormalizeMap[word]; ok {
			line1Split[i] = line1NormalizeMap[word]
		}
	}
	address.Line1 = strings.Join(line1Split, " ")
	// for k, v := range line1NormalizeMap {
	// 	line1 = strings.ReplaceAll(line1, k, v)
	// }
	address.Line2, _ = jsonparser.GetString(body, "availabilities", "[0]", "details", "[0]", "unitNumber")
	address.Line2 = strings.ReplaceAll(address.Line2, "#", "")
	address.City, _ = jsonparser.GetString(body, "address", "l")
	address.State, _ = jsonparser.GetString(body, "address", "s")
	address.Zip, _ = jsonparser.GetString(body, "address", "pc")
	address.Latitude, _ = jsonparser.GetFloat(body, "location", "[1]")
	address.Longitude, _ = jsonparser.GetFloat(body, "location", "[0]")
	address.Distance = calcDistanceFromUMW(address.Latitude, address.Longitude)
	return address
}

func (as *aptsDotComScraper) scrapeListingImages(listingID string) ([]database.Image, error) {
	as.logger.Info().Msgf("Scraping images for Apartments.com listing with id %s", listingID)
	reqBody := strings.NewReader(`{"sizes":[17],"types":[10, 1, 3, 4, 6, 7, 33]}`)

	req, err := http.NewRequest("POST", fmt.Sprintf("https://pds.apps.apartments.com/aptsnet/mobile/listing/%s/attachments", listingID), reqBody)
	if err != nil {
		as.logger.Err(err).Msg("Failed to create request for scraping listing images")
		return nil, err
	}
	req.Header.Set("Host", "pds.apps.apartments.com")
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Culture-Code", "en-US")
	req.Header.Set("x-app", "apartments.apartments.mobile-ios")
	req.Header.Set("Accept", "*/*")
	req.Header.Set("User-Agent", "Apartments/12.2.7 (iPhone; iOS 17.1.2; S0)")
	req.Header.Set("Accept-Language", "en-US,en;q=0.9")
	resp, err := as.client.Do(req)
	if err != nil {
		as.logger.Err(err).Msg("Failed to get listings data")
		return nil, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		as.logger.Err(err).Msg("Failed to read response body")
		return nil, err
	}
	var images []database.Image
	_, err = jsonparser.ArrayEach(body, func(value []byte, dataType jsonparser.ValueType, offset int, err error) {
		imageURL, _ := jsonparser.GetString(value, "u")
		images = append(images, database.Image{
			URL: imageURL,
		})
	}, "items")
	if err != nil {
		as.logger.Err(err).Msg("Failed to parse attachments")
		return nil, err
	}
	return images, nil
}

func (as *aptsDotComScraper) parseListingSource(listingID string) database.Source {
	var source database.Source
	source.Site = "Apartments.com"
	source.URL = "https://www.apartments.com/umw-cribs/" + listingID
	return source
}
