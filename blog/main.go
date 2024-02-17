package main

import (
	"fmt"
	"github.com/bamzi/jobrunner"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	// Register routes from different files
	registerBlogRoutes(router)
	registerMetricsRoute(router)
	registerBlogGroupRoutes(router)
	registerLSRoutes(router)

	jobrunner.Start()
	jobrunner.Schedule("@every 5s", CollectUsDaReg{})

	err := router.Run("0.0.0.0:8080")
	if err != nil {
		fmt.Println(err)
	}
}
