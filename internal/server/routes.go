package server

import (
	"github.com/andreitelteu/comanager/internal/handlers"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(app *fiber.App) {
	handlers.RegisterRoutes(app)
}
