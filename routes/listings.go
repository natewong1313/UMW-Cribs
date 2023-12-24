package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/natewong1313/web-app-template/server/database"
)

func (r *router) setupListingsRoutes(routeGroup fiber.Router) {
	routeGroup.Get("/", r.getListings)
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
	return c.JSON(fiber.Map{
		"listings": listings,
	})
}
