package scrapers

import (
	"math"
	"strings"
)

func createID(address1, address2 string) string {
	return strings.ReplaceAll(strings.TrimSuffix(strings.ToLower(strings.TrimSpace(address1)+"-"+address2), "-"), " ", "-")
}

func calcDistanceFromUMW(lat float64, lng float64) float64 {
	umwLatitude := 38.3013
	umwLongitude := -77.4745
	radlat1 := math.Pi * lat / 180
	radlat2 := math.Pi * umwLatitude / 180

	theta := lng - umwLongitude
	radtheta := math.Pi * theta / 180

	dist := math.Sin(radlat1)*math.Sin(radlat2) + math.Cos(radlat1)*math.Cos(radlat2)*math.Cos(radtheta)
	if dist > 1 {
		dist = 1
	}

	dist = math.Acos(dist)

	return (dist * 180 / math.Pi) * 60 * 1.1515
}
