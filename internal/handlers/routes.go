package handlers

import "github.com/gofiber/fiber/v2"

func RegisterRoutes(app *fiber.App) {
	api := app.Group("/api")
	api.Get("/health", Health)

	projects := api.Group("/projects/:projectId", func(c *fiber.Ctx) error {
		c.Locals("projectId", c.Params("projectId"))
		return c.Next()
	})
	projects.Get("/board", GetBoard)
	projects.Post("/tasks", CreateTask)
	projects.Patch("/tasks/:taskId", UpdateTask)
	projects.Get("/chat", GetChat)
	projects.Post("/chat", CreateChat)

	RegisterSPA(app)
}
