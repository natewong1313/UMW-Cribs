package routes

import "github.com/gofiber/fiber/v2"

type Dog struct {
	Breed    string   `json:"breed"`
	Color    string   `json:"color"`
	Age      int      `json:"age"`
	Weight   int      `json:"weight"`
	Traits   []string `json:"traits"`
	ImageURL string   `json:"image_url"`
}

func setupDogsRoutes(r fiber.Router) {
	r.Get("/", getDogs)
}
func getDogs(c *fiber.Ctx) error {
	dogs := []Dog{
		{
			Breed:    "Labrador Retriever",
			Color:    "Yellow",
			Age:      3,
			Weight:   70,
			Traits:   []string{"Friendly", "Energetic", "Intelligent"},
			ImageURL: "https://example.com/labrador.jpg",
		},
		{
			Breed:    "German Shepherd",
			Color:    "Black and Tan",
			Age:      4,
			Weight:   85,
			Traits:   []string{"Loyal", "Courageous", "Alert"},
			ImageURL: "https://example.com/german_shepherd.jpg",
		},
		{
			Breed:    "Poodle",
			Color:    "Apricot",
			Age:      2,
			Weight:   45,
			Traits:   []string{"Smart", "Hypoallergenic", "Playful"},
			ImageURL: "https://example.com/poodle.jpg",
		},
		{
			Breed:    "Siberian Husky",
			Color:    "Gray and White",
			Age:      5,
			Weight:   60,
			Traits:   []string{"Adventurous", "Independent", "Friendly"},
			ImageURL: "https://example.com/husky.jpg",
		},
		{
			Breed:    "Dachshund",
			Color:    "Red",
			Age:      6,
			Weight:   12,
			Traits:   []string{"Curious", "Lively", "Stubborn"},
			ImageURL: "https://example.com/dachshund.jpg",
		},
		// Add more dogs here...
	}

	return c.JSON(fiber.Map{
		"dogs": dogs,
	})
}
