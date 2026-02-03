package docker

import (
	"context"

	"github.com/moby/moby/client"
)

func NewClient() (*client.Client, error) {
	return client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
}

func Ping(ctx context.Context, cli *client.Client) error {
	_, err := cli.Ping(ctx, client.PingOptions{})
	return err
}
