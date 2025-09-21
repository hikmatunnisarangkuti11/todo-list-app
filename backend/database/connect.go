package database

import (
    "fmt"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
	"todo-app/models"
)

var DB *gorm.DB

func Connect() {
    dsn := "host=localhost user=postgres password=postgres dbname=todoapp port=5432 sslmode=disable TimeZone=Asia/Jakarta"
    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        panic("Failed to connect database: " + err.Error())
    }
    DB = db
    fmt.Println("Database connected")

	db.AutoMigrate(&models.Category{}, &models.Todo{})
}
