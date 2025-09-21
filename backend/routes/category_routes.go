package routes

import (
	"net/http"
	"todo-app/database"
	"todo-app/models"

	"github.com/gin-gonic/gin"
)

func CategoryRoutes(r *gin.Engine) {
	api := r.Group("/api/categories")

	api.GET("/", func(c *gin.Context) {
		var cats []models.Category
		if err := database.DB.Find(&cats).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, cats)
	})

	api.POST("/", func(c *gin.Context) {
		var cat models.Category
		if err := c.ShouldBindJSON(&cat); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if err := database.DB.Create(&cat).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusCreated, cat)
	})

	api.PUT("/:id", func(c *gin.Context) {
		id := c.Param("id")
		var cat models.Category
		if err := database.DB.First(&cat, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
			return
		}

		// Bind input data to separate struct supaya tidak overwrite ID, CreatedAt dll
		var input struct {
			Name  string `json:"name" binding:"required"`
			Color string `json:"color"`
		}

		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		cat.Name = input.Name
		cat.Color = input.Color

		if err := database.DB.Save(&cat).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, cat)
	})

	api.DELETE("/:id", func(c *gin.Context) {
		id := c.Param("id")
		if err := database.DB.Delete(&models.Category{}, id).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Category deleted"})
	})
}
