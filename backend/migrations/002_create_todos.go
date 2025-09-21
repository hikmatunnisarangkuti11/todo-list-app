package migrations

import (
    "todo-app/models"
    "gorm.io/gorm"
    "github.com/go-gormigrate/gormigrate/v2"
)

func CreateTodos() *gormigrate.Migration {
    return &gormigrate.Migration{
        ID: "002_create_todos",
        Migrate: func(tx *gorm.DB) error {
            return tx.AutoMigrate(&models.Todo{})
        },
        Rollback: func(tx *gorm.DB) error {
            return tx.Migrator().DropTable("todos")
        },
    }
}
