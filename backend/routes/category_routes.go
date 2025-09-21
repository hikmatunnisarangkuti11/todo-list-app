package routes

import (
	"todo-app/database"
	"todo-app/models"

	"github.com/gin-gonic/gin"
)

func CategoryRoutes(r *gin.Engine) {
	api := r.Group("/api/categories")

	api.GET("/", func(c *gin.Context) {
		var cats []models.Category
		database.DB.Find(&cats)
		c.JSON(200, cats)
	})

	api.POST("/", func(c *gin.Context) {
		var cat models.Category
		if err := c.ShouldBindJSON(&cat); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		database.DB.Create(&cat)
		c.JSON(201, cat)
	})

	api.PUT("/:id", func(c *gin.Context) {
		id := c.Param("id")
		var cat models.Category
		if err := database.DB.First(&cat, id).Error; err != nil {
			c.JSON(404, gin.H{"error": "Category not found"})
			return
		}
		if err := c.ShouldBindJSON(&cat); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		database.DB.Save(&cat)
		c.JSON(200, cat)
	})

	api.DELETE("/:id", func(c *gin.Context) {
		id := c.Param("id")
		if err := database.DB.Delete(&models.Category{}, id).Error; err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, gin.H{"message": "Category deleted"})
	})
}
