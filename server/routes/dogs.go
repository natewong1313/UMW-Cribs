package routes

import "github.com/gofiber/fiber/v2"

type Dog struct {
	Name     string   `json:"name"`
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
			Name:     "Arthur",
			Breed:    "Labrador Retriever",
			Color:    "Yellow",
			Age:      3,
			Weight:   70,
			Traits:   []string{"Friendly", "Energetic", "Intelligent"},
			ImageURL: "https://www.marthastewart.com/thmb/gCXKR-31DYnpsLi7uUj0S4zyfqc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/happy-labrador-retriever-getty-0322-2000-eb585d9e672e47da8b1b7e9d3215a5cb.jpg",
		},
		{
			Name:     "Bella",
			Breed:    "German Shepherd",
			Color:    "Black and Tan",
			Age:      4,
			Weight:   85,
			Traits:   []string{"Loyal", "Courageous", "Alert"},
			ImageURL: "https://example.com/german_shepherd.jpg",
		},
		{
			Name:     "Daisy",
			Breed:    "Poodle",
			Color:    "Apricot",
			Age:      2,
			Weight:   45,
			Traits:   []string{"Smart", "Hypoallergenic", "Playful"},
			ImageURL: "https://example.com/poodle.jpg",
		},
		{
			Name:     "Hugo",
			Breed:    "Siberian Husky",
			Color:    "Gray and White",
			Age:      5,
			Weight:   60,
			Traits:   []string{"Adventurous", "Independent", "Friendly"},
			ImageURL: "https://example.com/husky.jpg",
		},
		{
			Name:     "Ervin",
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
