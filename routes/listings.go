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
