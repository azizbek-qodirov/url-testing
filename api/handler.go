package api

import (
	"net/http"

	"url-tester/models"

	"github.com/gin-gonic/gin"
)

type Handler struct {
}

func NewHandler() *Handler {
	return &Handler{}
}

func (h *Handler) PostTest(c *gin.Context) {
	var reqModel models.RequestModel
	if err := c.ShouldBindJSON(&reqModel); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	successfulRequests, failedRequests, dur, logs := performLoadTest(reqModel)

	c.JSON(http.StatusOK, gin.H{
		"successful_requests": successfulRequests,
		"failed_requests":     failedRequests,
		"time":                dur.Seconds(),
		"logs":                string(logs),
	})
}
