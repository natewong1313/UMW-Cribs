package scrapers

import (
	"os"
	"testing"

	"github.com/joho/godotenv"
	"github.com/natewong1313/web-app-template/server/config"
)

func TestStart(t *testing.T) {
	if err := godotenv.Load("../.env"); err != nil && (os.Getenv("APP_ENV") != "production" && !os.IsNotExist(err)) {
		panic(err)
	}
	cfg, err := config.Init()
	if err != nil {
		panic(err)
	}
	Start(cfg)
}

// func TestApts2(t *testing.T) {

// 	client := &http.Client{}
// 	var data = strings.NewReader(`{"listingKey":"pxv17qr"}`)
// 	req, err := http.NewRequest("POST", "https://pds.apps.apartments.com/aptsnet/mobile/listing/pxv17qr/detail", data)
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	req.Header.Set("Host", "pds.apps.apartments.com")
// 	req.Header.Set("Content-Type", "application/json")
// 	req.Header.Set("Culture-Code", "en-US")
// 	req.Header.Set("x-app", "apartments.apartments.mobile-ios")
// 	req.Header.Set("Accept", "*/*")
// 	req.Header.Set("User-Agent", "Apartments/12.2.7 (iPhone; iOS 17.1.2; S0)")
// 	req.Header.Set("Accept-Language", "en-US,en;q=0.9")
// 	resp, err := client.Do(req)
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	defer resp.Body.Close()
// 	bodyText, err := io.ReadAll(resp.Body)
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	fmt.Printf("%s\n", bodyText)

// }
