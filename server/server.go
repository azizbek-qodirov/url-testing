package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	router.GET("/test", func(c *gin.Context) {
		c.Error(fmt.Errorf("DELETE request received"))
		c.JSON(http.StatusOK, gin.H{
			"message": "GET request received",
		})
	})

	router.POST("/test", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "POST request received",
		})
	})

	router.PUT("/test", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "PUT request received",
		})
	})

	router.DELETE("/test", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "DELETE request received",
		})
	})

	port := 4045
	router.Run(fmt.Sprintf(":%d", port))
}
