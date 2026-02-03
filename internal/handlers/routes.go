package handlers

import "github.com/gofiber/fiber/v2"

func RegisterRoutes(app *fiber.App) {
	api := app.Group("/api")
	api.Get("/health", Health)

	RegisterSPA(app)
}
