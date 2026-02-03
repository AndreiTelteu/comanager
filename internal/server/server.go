package server

import (
	"github.com/andreitelteu/comanager/internal/handlers"

	"github.com/gofiber/fiber/v2"
)

func New() (*fiber.App, error) {
	app := fiber.New()

	handlers.RegisterRoutes(app)

	return app, nil
}
