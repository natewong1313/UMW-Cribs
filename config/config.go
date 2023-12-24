package config

import (
	"github.com/natewong1313/web-app-template/server/database"
	"gorm.io/gorm"
)

type Config struct {
	DB *gorm.DB
}

func Init() (*Config, error) {
	db, err := database.Connect()
	if err != nil {
		return nil, err
	}
	return &Config{
		DB: db,
	}, nil
}
