package handlers

import (
	"database/sql"
	"errors"
	"strings"

	"github.com/andreitelteu/comanager/internal/repository"
	"github.com/gofiber/fiber/v2"
)

const informationalChatResponse = "This is an informational response only. No changes have been made."

type ProjectRepoLookup func(projectID string) (*repository.Repository, bool)

type boardResponse struct {
	ID        string           `json:"id"`
	ProjectID string           `json:"projectId"`
	Name      string           `json:"name"`
	Columns   []columnResponse `json:"columns"`
}

type columnResponse struct {
	ID         string         `json:"id"`
	BoardID    string         `json:"boardId"`
	Name       string         `json:"name"`
	OrderIndex int            `json:"orderIndex"`
	Tasks      []taskResponse `json:"tasks"`
}

type taskResponse struct {
	ID        string `json:"id"`
	ColumnID  string `json:"columnId"`
	Title     string `json:"title"`
	OrderIndex int   `json:"orderIndex"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
}

type chatMessageResponse struct {
	ID              string `json:"id"`
	ThreadID        string `json:"threadId"`
	Role            string `json:"role"`
	Content         string `json:"content"`
	IsInformational bool   `json:"isInformational"`
	CreatedAt       string `json:"createdAt"`
}

type createTaskRequest struct {
	ColumnID string `json:"columnId"`
	Title    string `json:"title"`
}

type updateTaskRequest struct {
	ColumnID   string `json:"columnId"`
	OrderIndex *int   `json:"orderIndex"`
	Title      *string `json:"title"`
}

type createChatRequest struct {
	Content string `json:"content"`
}

func Health(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"status": "ok"})
}

func GetBoard(c *fiber.Ctx) error {
	repo, err := getProjectRepo(c)
	if err != nil {
		return err
	}

	board, err := repo.FetchBoard(c.Context())
	if err != nil {
		return err
	}

	return c.JSON(mapBoard(board))
}

func CreateTask(c *fiber.Ctx) error {
	repo, err := getProjectRepo(c)
	if err != nil {
		return err
	}

	var req createTaskRequest
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
	}

	columnID := strings.TrimSpace(req.ColumnID)
	if columnID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "columnId is required")
	}

	title := strings.TrimSpace(req.Title)
	if err := validateTitle(title); err != nil {
		return err
	}

	tasks, err := repo.ListTasks(c.Context(), columnID)
	if err != nil {
		return err
	}

	orderIndex := 0
	if len(tasks) > 0 {
		orderIndex = tasks[len(tasks)-1].Order + 1
	}

	created, err := repo.CreateTask(c.Context(), columnID, title, orderIndex)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusCreated).JSON(mapTask(created))
}

func UpdateTask(c *fiber.Ctx) error {
	repo, err := getProjectRepo(c)
	if err != nil {
		return err
	}

	taskID := strings.TrimSpace(c.Params("taskId"))
	if taskID == "" {
		return fiber.NewError(fiber.StatusBadRequest, "taskId is required")
	}

	var req updateTaskRequest
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
	}

	existing, err := repo.GetTask(c.Context(), taskID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return fiber.NewError(fiber.StatusNotFound, "task not found")
		}
		return err
	}

	columnID := strings.TrimSpace(req.ColumnID)
	if columnID == "" {
		columnID = existing.ColumnID
	}

	orderIndex := existing.Order
	if req.OrderIndex != nil {
		orderIndex = *req.OrderIndex
	}

	var title *string
	if req.Title != nil {
		trimmed := strings.TrimSpace(*req.Title)
		if err := validateTitle(trimmed); err != nil {
			return err
		}
		title = &trimmed
	}

	updated, err := repo.UpdateTask(c.Context(), taskID, columnID, orderIndex, title)
	if err != nil {
		return err
	}

	return c.JSON(mapTask(updated))
}

func GetChat(c *fiber.Ctx) error {
	repo, err := getProjectRepo(c)
	if err != nil {
		return err
	}

	thread, err := repo.GetChatThread(c.Context())
	if err != nil {
		return err
	}

	messages, err := repo.ListChatMessages(c.Context(), thread.ID)
	if err != nil {
		return err
	}

	response := make([]chatMessageResponse, 0, len(messages))
	for _, msg := range messages {
		response = append(response, mapChatMessage(msg))
	}

	return c.JSON(response)
}

func CreateChat(c *fiber.Ctx) error {
	repo, err := getProjectRepo(c)
	if err != nil {
		return err
	}

	var req createChatRequest
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
	}

	content := strings.TrimSpace(req.Content)
	if content == "" {
		return fiber.NewError(fiber.StatusBadRequest, "content is required")
	}

	thread, err := repo.GetChatThread(c.Context())
	if err != nil {
		return err
	}

	_, err = repo.CreateChatMessage(c.Context(), thread.ID, "user", content, false)
	if err != nil {
		return err
	}

	infoMsg, err := repo.CreateChatMessage(c.Context(), thread.ID, "system", informationalChatResponse, true)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusCreated).JSON(mapChatMessage(infoMsg))
}

func getProjectRepo(c *fiber.Ctx) (*repository.Repository, error) {
	lookup, ok := c.Locals("projectRepoLookup").(ProjectRepoLookup)
	if !ok || lookup == nil {
		return nil, fiber.NewError(fiber.StatusInternalServerError, "project lookup not configured")
	}

	projectID, ok := c.Locals("projectId").(string)
	if !ok || strings.TrimSpace(projectID) == "" {
		return nil, fiber.NewError(fiber.StatusBadRequest, "projectId is required")
	}

	repo, ok := lookup(projectID)
	if !ok || repo == nil {
		return nil, fiber.NewError(fiber.StatusNotFound, "project not found")
	}

	return repo, nil
}

func validateTitle(title string) error {
	if title == "" {
		return fiber.NewError(fiber.StatusBadRequest, "title is required")
	}
	if len([]rune(title)) > 200 {
		return fiber.NewError(fiber.StatusBadRequest, "title must be 200 characters or fewer")
	}
	return nil
}

func mapBoard(board repository.Board) boardResponse {
	columns := make([]columnResponse, 0, len(board.Columns))
	for _, column := range board.Columns {
		columns = append(columns, mapColumn(column))
	}

	return boardResponse{
		ID:        board.ID,
		ProjectID: board.ProjectID,
		Name:      board.Name,
		Columns:   columns,
	}
}

func mapColumn(column repository.Column) columnResponse {
	tasks := make([]taskResponse, 0, len(column.Tasks))
	for _, task := range column.Tasks {
		tasks = append(tasks, mapTask(task))
	}

	return columnResponse{
		ID:         column.ID,
		BoardID:    column.BoardID,
		Name:       column.Name,
		OrderIndex: column.Order,
		Tasks:      tasks,
	}
}

func mapTask(task repository.Task) taskResponse {
	return taskResponse{
		ID:         task.ID,
		ColumnID:   task.ColumnID,
		Title:      task.Title,
		OrderIndex: task.Order,
		CreatedAt:  task.CreatedAt,
		UpdatedAt:  task.UpdatedAt,
	}
}

func mapChatMessage(msg repository.ChatMessage) chatMessageResponse {
	return chatMessageResponse{
		ID:              msg.ID,
		ThreadID:        msg.ThreadID,
		Role:            msg.Role,
		Content:         msg.Content,
		IsInformational: msg.IsInformational,
		CreatedAt:       msg.CreatedAt,
	}
}
