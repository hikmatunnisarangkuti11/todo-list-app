package routes

import (
	"net/http"
	"time"
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
		var input struct {
			Name  string `json:"name" binding:"required"`
			Color string `json:"color" binding:"required"`
		}
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		cat := models.Category{
			Name:      input.Name,
			Color:     input.Color,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
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

		var input struct {
			Name  string `json:"name" binding:"required"`
			Color string `json:"color" binding:"required"`
		}
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		cat.Name = input.Name
		cat.Color = input.Color
		cat.UpdatedAt = time.Now()

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
