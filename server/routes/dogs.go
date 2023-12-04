package routes

import (
	"github.com/gofiber/fiber/v2"
)

type dog struct {
	Name     string   `json:"name"`
	Breed    string   `json:"breed"`
	Color    string   `json:"color"`
	Age      int      `json:"age"`
	Weight   int      `json:"weight"`
	Traits   []string `json:"traits"`
	ImageURL string   `json:"image_url"`
} //@name Dog

func setupDogsRoutes(r fiber.Router) {
	r.Get("/", getDogs)
}

type dogsResponse struct {
	Dogs []dog `json:"dogs"`
} //@name DogsResponse

// GetDogs
//
//	@Summary		Get all dogs
//	@Description	get all dogs in database
//	@ID				get-dogs
//	@Produce		json
//	@Success		200		{object}	dogsResponse
//	@Router			/api/dogs [get]
func getDogs(c *fiber.Ctx) error {
	dogs := []dog{
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
			ImageURL: "https://cdn.britannica.com/79/232779-004-9EBC7CB8/German-Shepherd-dog-Alsatian.jpg",
		},
		{
			Name:     "Daisy",
			Breed:    "Poodle",
			Color:    "Apricot",
			Age:      2,
			Weight:   45,
			Traits:   []string{"Smart", "Hypoallergenic", "Playful"},
			ImageURL: "https://www.thesprucepets.com/thmb/8SWEbYRpIyavyuTBH1DjF8GIAXs=/4368x0/filters:no_upscale():strip_icc()/white-poodle-playing-in-the-yard--182178740-59af2b3fc4124400107c9da3.jpg",
		},
		{
			Name:     "Hugo",
			Breed:    "Siberian Husky",
			Color:    "Gray and White",
			Age:      5,
			Weight:   60,
			Traits:   []string{"Adventurous", "Independent", "Friendly"},
			ImageURL: "https://cdn.britannica.com/84/232784-050-1769B477/Siberian-Husky-dog.jpg",
		},
		{
			Name:     "Ervin",
			Breed:    "Dachshund",
			Color:    "Red",
			Age:      6,
			Weight:   12,
			Traits:   []string{"Curious", "Lively", "Stubborn"},
			ImageURL: "https://dogtime.com/wp-content/uploads/sites/12/2011/01/GettyImages-700141990-e1688418771301.jpg?w=1024",
		},
		// Add more dogs here...
	}

	return c.JSON(fiber.Map{
		"dogs": dogs,
	})
}
