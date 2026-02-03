package embed

import (
	"embed"
	"errors"
	"io/fs"
)

//go:embed frontend/dist/**
var assets embed.FS

func AssetFS() (fs.FS, error) {
	sub, err := fs.Sub(assets, "frontend/dist")
	if err != nil {
		return nil, errors.New("frontend build not found; run `bun run build` in ./frontend first")
	}

	return sub, nil
}
