package database

import (
	"time"

	"github.com/google/uuid"
)

type Listing struct {
	ID               string    `json:"id" gorm:"primaryKey"`
	CreatedAt        time.Time `json:"createdAt"`
	UpdatedAt        time.Time `json:"updatedAt"`
	Available        bool      `json:"available"`
	Description      string    `json:"description"`
	Rent             int       `json:"rent"`
	Bedrooms         int       `json:"bedrooms"`
	Bathrooms        float64   `json:"bathrooms"`
	SquareFootage    int       `json:"squareFootage"`
	AvailabilityDate time.Time `json:"availabilityDate"`
	Address          Address   `json:"address"`
	Images           []Image   `json:"images"`
	Source           Source    `json:"source"`
}

type Source struct {
	ID        uuid.UUID `json:"-" gorm:"primary_key;type:uuid;default:uuid_generate_v4()"`
	ListingID string    `json:"-"`
	Site      string    `json:"site"`
	URL       string    `json:"url"`
}

type Address struct {
	ID        uuid.UUID `json:"-" gorm:"primary_key;type:uuid;default:uuid_generate_v4()"`
	ListingID string    `json:"-"`
	Line1     string    `json:"line1"`
	Line2     string    `json:"line2"`
	City      string    `json:"city"`
	State     string    `json:"state"`
	Zip       string    `json:"zip"`
	Latitude  float64   `json:"latitude"`
	Longitude float64   `json:"longitude"`
	Distance  float64   `json:"distance"`
}

type Image struct {
	ID        uuid.UUID `json:"-" gorm:"primary_key;type:uuid;default:uuid_generate_v4()"`
	ListingID string    `json:"-"`
	URL       string    `json:"url"`
}
