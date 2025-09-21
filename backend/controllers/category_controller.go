package controllers

import (
    "net/http"
    "time"
    "todo-app/database"
    "todo-app/models"
    "github.com/gin-gonic/gin"
)

func GetCategories(c *gin.Context) {
    var categories []models.Category
    database.DB.Find(&categories)
    c.JSON(http.StatusOK, categories)
}

func CreateCategory(c *gin.Context) {
    var input struct {
        Name  string `json:"name" binding:"required"`
        Color string `json:"color"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    category := models.Category{
        Name:      input.Name,
        Color:     input.Color,
        CreatedAt: time.Now(),
        UpdatedAt: time.Now(),
    }

    if err := database.DB.Create(&category).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, category)
}


func UpdateCategory(c *gin.Context) {
    id := c.Param("id")
    var category models.Category
    if err := database.DB.First(&category, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
        return
    }
    var input models.Category
    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    category.Name = input.Name
    category.Color = input.Color
    category.UpdatedAt = time.Now()
    database.DB.Save(&category)
    c.JSON(http.StatusOK, category)
}

func DeleteCategory(c *gin.Context) {
    id := c.Param("id")
    database.DB.Delete(&models.Category{}, id)
    c.JSON(http.StatusOK, gin.H{"message": "Category deleted"})
}
