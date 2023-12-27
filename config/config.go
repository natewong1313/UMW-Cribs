package config

import (
	"context"
	"encoding/json"
	"os"

	firebase "firebase.google.com/go"
	"firebase.google.com/go/auth"
	"github.com/natewong1313/web-app-template/server/database"
	"google.golang.org/api/option"
	"gorm.io/gorm"
)

type Config struct {
	DB             *gorm.DB
	FirebaseClient *auth.Client
}

func Init() (*Config, error) {
	db, err := database.Connect()
	if err != nil {
		return nil, err
	}
	fbApp, err := firebase.NewApp(context.Background(), nil, getFirebaseOptions())
	if err != nil {
		return nil, err
	}
	fbClient, err := fbApp.Auth(context.Background())
	if err != nil {
		return nil, err
	}
	return &Config{
		DB:             db,
		FirebaseClient: fbClient,
	}, nil
}

type FirebaseCredentials struct {
	Type                    string `json:"type"`
	ProjectID               string `json:"project_id"`
	PrivateKeyID            string `json:"private_key_id"`
	PrivateKey              string `json:"private_key"`
	ClientEmail             string `json:"client_email"`
	ClientID                string `json:"client_id"`
	AuthURI                 string `json:"auth_uri"`
	TokenURI                string `json:"token_uri"`
	AuthProviderX509CertURL string `json:"auth_provider_x509_cert_url"`
	ClientX509CertURL       string `json:"client_x509_cert_url"`
	UniverseDomain          string `json:"universe_domain"`
}

func getFirebaseOptions() option.ClientOption {
	credentials := FirebaseCredentials{
		Type:                    "service_account",
		ProjectID:               os.Getenv("FIREBASE_PROJECT_ID"),
		PrivateKeyID:            os.Getenv("FIREBASE_PRIVATE_KEY_ID"),
		PrivateKey:              os.Getenv("FIREBASE_PRIVATE_KEY"),
		ClientEmail:             os.Getenv("FIREBASE_CLIENT_EMAIL"),
		ClientID:                os.Getenv("FIREBASE_CLIENT_ID"),
		AuthURI:                 os.Getenv("FIREBASE_AUTH_URI"),
		TokenURI:                os.Getenv("FIREBASE_TOKEN_URI"),
		AuthProviderX509CertURL: os.Getenv("FIREBASE_AUTH_PROVIDER_X509_CERT_URL"),
		ClientX509CertURL:       os.Getenv("FIREBASE_CLIENT_X509_CERT_URL"),
		UniverseDomain:          "googleapis.com",
	}
	credentialsJSON, _ := json.Marshal(credentials)
	return option.WithCredentialsJSON(credentialsJSON)
}
