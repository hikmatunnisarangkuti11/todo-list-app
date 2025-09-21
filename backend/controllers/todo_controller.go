package controllers

import (
    "net/http"
    "strconv"
    "todo-app/database"
    "todo-app/models"

    "github.com/gin-gonic/gin"
)

func GetTodos(c *gin.Context) {
    var todos []models.Todo
    page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
    limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
    offset := (page - 1) * limit

    search := c.Query("search")

    query := database.DB.Preload("Category")
    if search != "" {
        query = query.Where("title ILIKE ?", "%"+search+"%")
    }
    var total int64
    query.Model(&models.Todo{}).Count(&total)
    query.Limit(limit).Offset(offset).Find(&todos)

    c.JSON(http.StatusOK, gin.H{
        "data": todos,
        "pagination": gin.H{
            "current_page": page,
            "per_page":     limit,
            "total":        total,
            "total_pages":  (total + int64(limit) - 1) / int64(limit),
        },
    })

func ToggleTodoCompletion(c *gin.Context) {
    id := c.Param("id")
    var todo models.Todo

    if err := database.DB.First(&todo, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
        return
    }

    todo.Completed = !todo.Completed

    if err := database.DB.Save(&todo).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update todo"})
        return
    }

    c.JSON(http.StatusOK, todo)
}

}
