package config

import (
	"github.com/natewong1313/web-app-template/server/database"
	"gorm.io/gorm"
)

type Config struct {
	db *gorm.DB
}

func Init() (*Config, error) {
	db, err := database.Connect()
	if err != nil {
		return nil, err
	}
	return &Config{
		db: db,
	}, nil
}
