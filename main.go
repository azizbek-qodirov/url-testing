package main

import (
	"fmt"
	"path/filepath"
	"runtime"
	"url-tester/api"
	"url-tester/config/logger"
)

var (
	_, b, _, _ = runtime.Caller(0)
	basepath   = filepath.Dir(b)
)

func main() {
	logger := logger.NewLogger(basepath, "logs/info.log")
	// em := config.NewErrorManager(logger)

	router := api.NewRouter()

	// Start the server
	logger.INFO.Printf("Starting server on port %d", 4044)
	if err := router.Run(":4044"); err != nil {
		fmt.Println("Failed to start server:", err)
	}
}
