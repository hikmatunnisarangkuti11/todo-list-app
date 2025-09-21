package migrations

import (
    "todo-app/models"
    "gorm.io/gorm"
    "github.com/go-gormigrate/gormigrate/v2"
)

func CreateCategories() *gormigrate.Migration {
    return &gormigrate.Migration{
        ID: "001_create_categories",
        Migrate: func(tx *gorm.DB) error {
            return tx.AutoMigrate(&models.Category{})
        },
        Rollback: func(tx *gorm.DB) error {
            return tx.Migrator().DropTable("categories")
        },
    }
}
