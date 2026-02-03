package server

import "os"

const (
	defaultListenHost = "0.0.0.0"
	defaultListenPort = "8080"
	defaultDataDir    = "/app/data"
)

func ListenAddress() string {
	host := getenv("LISTEN_HOST", defaultListenHost)
	port := getenv("LISTEN_PORT", defaultListenPort)

	return host + ":" + port
}

func DataDir() string {
	return getenv("DATA_DIR", defaultDataDir)
}

func getenv(key, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	return value
}
