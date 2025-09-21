package routes

import (
	"time"
	"todo-app/database"
	"todo-app/models"

	"github.com/gin-gonic/gin"
)

func TodoRoutes(r *gin.Engine) {
	api := r.Group("/api/todos")

	api.GET("/", func(c *gin.Context) {
		var todos []models.Todo
		database.DB.Find(&todos)
		c.JSON(200, gin.H{"data": todos})
	})

	api.POST("/", func(c *gin.Context) {
		var todo models.Todo
		if err := c.ShouldBindJSON(&todo); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		todo.CreatedAt = time.Now()
		todo.UpdatedAt = time.Now()
		database.DB.Create(&todo)
		c.JSON(201, todo)
	})

	api.PUT("/:id", func(c *gin.Context) {
		id := c.Param("id")
		var todo models.Todo
		if err := database.DB.First(&todo, id).Error; err != nil {
			c.JSON(404, gin.H{"error": "Todo not found"})
			return
		}
		if err := c.ShouldBindJSON(&todo); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		todo.UpdatedAt = time.Now()
		database.DB.Save(&todo)
		c.JSON(200, todo)
	})

	api.DELETE("/:id", func(c *gin.Context) {
		id := c.Param("id")
		if err := database.DB.Delete(&models.Todo{}, id).Error; err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, gin.H{"message": "Todo deleted"})
	})

	api.PATCH("/:id/complete", func(c *gin.Context) {
		id := c.Param("id")
		var todo models.Todo
		if err := database.DB.First(&todo, id).Error; err != nil {
			c.JSON(404, gin.H{"error": "Todo not found"})
			return
		}
		todo.Completed = !todo.Completed
		todo.UpdatedAt = time.Now()
		database.DB.Save(&todo)
		c.JSON(200, todo)
	})
}
