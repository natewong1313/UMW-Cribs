package database

import (
	"gorm.io/gorm/logger"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Connect() (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(os.Getenv("DATABASE_URL")), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		return nil, err
	}
	if err = db.AutoMigrate(&Listing{}, &Address{}, &Image{}, &Source{}); err != nil {
		return nil, err
	}
	return db, nil
}
