package routes

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/natewong1313/web-app-template/server/database"
)

func (r *router) setupListingsRoutes(routeGroup fiber.Router) {
	routeGroup.Get("/", r.getListings)
	routeGroup.Get("/search", r.searchListings)
}

type listingsResponse struct {
	Listings []database.Listing `json:"listings"`
} //@name ListingsResponse

var distances = map[string]float64{
	"walking": 0.5,
	"biking":  1,
	"driving": 5,
}

// GetListings
//
//	@Summary		Get all listings
//	@Description	get all listings in database
//	@ID				get-listings
//	@Produce		json
//	@Success		200		{object}	listingsResponse
//	@Router			/api/listings [get]
func (r *router) getListings(c *fiber.Ctx) error {
	var listings []database.Listing
	query := r.cfg.DB.Preload("Address").Preload("Source").Preload("Images")
	if c.Query("available") != "" {
		query = query.Where("available = ?", c.Query("available"))
	}
	if c.Query("distance") != "" {
		query = query.Joins("Address").Where("distance <= ?", distances[c.Query("distance")])
	}
	if c.Query("minPrice") != "" {
		query = query.Where("rent >= ?", c.Query("minPrice"))
	}
	if c.Query("maxPrice") != "" {
		query = query.Where("rent <= ?", c.Query("maxPrice"))
	}
	if c.Query("minBeds") != "" {
		query = query.Where("bedrooms >= ?", c.Query("minBeds"))
	}
	if c.Query("maxBeds") != "" {
		query = query.Where("bedrooms <= ?", c.Query("maxBeds"))
	}
	if c.Query("minBaths") != "" {
		query = query.Where("bathrooms >= ?", c.Query("minBaths"))
	}
	if c.Query("maxBaths") != "" {
		query = query.Where("bathrooms <= ?", c.Query("maxBaths"))
	}
	if c.Query("sort") == "price:asc" {
		query = query.Order("rent ASC")
	} else if c.Query("sort") == "price:desc" {
		query = query.Order("rent DESC")
	} else if c.Query("sort") == "distance" {
		query = query.Joins("Address").Order("distance ASC")
	}
	if err := query.Find(&listings).Error; err != nil {
		return err
	}
	return c.JSON(listingsResponse{
		Listings: listings,
	})
}

func (r *router) searchListings(c *fiber.Ctx) error {
	searchQuery := c.Query("query")
	log.Info(searchQuery)

	var listings []database.Listing
	r.cfg.DB.Preload("Source").Preload("Images").Joins("Address").Where("LOWER(line1) LIKE ?", "%"+strings.ToLower(searchQuery)+"%").Find(&listings)
	return c.JSON(listingsResponse{
		Listings: listings,
	})
}
