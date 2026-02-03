package server

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"sort"

	"github.com/andreitelteu/comanager/internal/embed"
	"github.com/andreitelteu/comanager/internal/handlers"
	"github.com/andreitelteu/comanager/internal/repository"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	_ "modernc.org/sqlite"
)

type Project struct {
	ID     string
	Path   string
	DBPath string
	DB     *sql.DB
	Repo   *repository.Repository
}

type ProjectStore struct {
	DataDir  string
	Projects map[string]*Project
}

func (store *ProjectStore) Get(projectID string) (*Project, bool) {
	project, ok := store.Projects[projectID]
	return project, ok
}

func (store *ProjectStore) List() []*Project {
	projects := make([]*Project, 0, len(store.Projects))
	for _, project := range store.Projects {
		projects = append(projects, project)
	}

	sort.Slice(projects, func(i, j int) bool {
		return projects[i].ID < projects[j].ID
	})

	return projects
}

func New() (*fiber.App, error) {
	app := fiber.New()

	store, err := InitializeProjects(DataDir())
	if err != nil {
		return nil, err
	}

	app.Use(func(c *fiber.Ctx) error {
		c.Locals("projectRepoLookup", handlers.ProjectRepoLookup(func(projectID string) (*repository.Repository, bool) {
			project, ok := store.Get(projectID)
			if !ok {
				return nil, false
			}
			return project.Repo, true
		}))
		return c.Next()
	})

	handlers.RegisterRoutes(app)

	return app, nil
}

func InitializeProjects(dataDir string) (*ProjectStore, error) {
	if err := os.MkdirAll(dataDir, 0o755); err != nil {
		return nil, err
	}

	projectIDs, err := discoverProjectIDs(dataDir)
	if err != nil {
		return nil, err
	}

	if len(projectIDs) == 0 {
		projectIDs = []string{"default"}
	}

	store := &ProjectStore{
		DataDir:  dataDir,
		Projects: map[string]*Project{},
	}

	for _, projectID := range projectIDs {
		projectPath := filepath.Join(dataDir, projectID)
		attachmentsPath := filepath.Join(projectPath, "attachments")
		if err := os.MkdirAll(attachmentsPath, 0o755); err != nil {
			return nil, err
		}

		dbPath := filepath.Join(projectPath, "project.db")
		db, err := openProjectDB(dbPath)
		if err != nil {
			return nil, err
		}

		if err := runMigrations(db); err != nil {
			return nil, err
		}

		repo := repository.NewRepository(db, projectID)
		if err := repo.EnsureDefaults(context.Background()); err != nil {
			return nil, err
		}

		store.Projects[projectID] = &Project{
			ID:     projectID,
			Path:   projectPath,
			DBPath: dbPath,
			DB:     db,
			Repo:   repo,
		}
	}

	return store, nil
}

func discoverProjectIDs(dataDir string) ([]string, error) {
	entries, err := os.ReadDir(dataDir)
	if err != nil {
		return nil, err
	}

	projectIDs := []string{}
	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}
		name := entry.Name()
		if name == "." || name == ".." {
			continue
		}
		projectIDs = append(projectIDs, name)
	}

	sort.Strings(projectIDs)
	return projectIDs, nil
}

func openProjectDB(dbPath string) (*sql.DB, error) {
	dsn := fmt.Sprintf("file:%s?_pragma=foreign_keys(1)&_pragma=busy_timeout(5000)", dbPath)
	db, err := sql.Open("sqlite", dsn)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	return db, nil
}

func runMigrations(db *sql.DB) error {
	source, err := iofs.New(embed.MigrationsFS(), "migrations")
	if err != nil {
		return err
	}

	driver, err := sqlite.WithInstance(db, &sqlite.Config{})
	if err != nil {
		return err
	}

	migrator, err := migrate.NewWithInstance("iofs", source, "sqlite", driver)
	if err != nil {
		return err
	}

	if err := migrator.Up(); err != nil && !errors.Is(err, migrate.ErrNoChange) {
		return err
	}

	return nil
}
