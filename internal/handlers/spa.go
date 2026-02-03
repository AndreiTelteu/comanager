package handlers

import (
	"io/fs"
	"mime"
	"path"
	"strings"

	"github.com/andreitelteu/comanager/internal/embed"
	"github.com/gofiber/fiber/v2"
)

func RegisterSPA(app *fiber.App) {
	assets, err := embed.AssetFS()
	if err != nil {
		panic(err)
	}

	app.Use(func(c *fiber.Ctx) error {
		if strings.HasPrefix(c.Path(), "/api") {
			return c.Next()
		}

		if c.Path() == "/" {
			return sendFile(c, assets, "index.html")
		}

		cleanPath := path.Clean(c.Path())
		if cleanPath == "." || cleanPath == "/" {
			return sendFile(c, assets, "index.html")
		}

		fsPath := strings.TrimPrefix(cleanPath, "/")
		if isFile(assets, fsPath) {
			return sendFile(c, assets, fsPath)
		}

		return sendFile(c, assets, "index.html")
	})
}

func isFile(assets fs.FS, filePath string) bool {
	file, err := assets.Open(filePath)
	if err != nil {
		return false
	}
	defer file.Close()

	info, err := file.Stat()
	if err != nil {
		return false
	}

	return !info.IsDir()
}

func sendFile(c *fiber.Ctx, assets fs.FS, filePath string) error {
	file, err := assets.Open(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	if contentType := mime.TypeByExtension(path.Ext(filePath)); contentType != "" {
		c.Set(fiber.HeaderContentType, contentType)
	}

	return c.SendStream(file)
}
