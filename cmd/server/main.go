package main

import (
	"log"

	"github.com/andreitelteu/comanager/internal/server"
)

func main() {
	app, err := server.New()
	if err != nil {
		log.Fatalf("failed to initialize server: %v", err)
	}

	if err := app.Listen(server.ListenAddress()); err != nil {
		log.Fatalf("server stopped with error: %v", err)
	}
}
