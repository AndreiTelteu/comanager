package repository

import (
"context"
"database/sql"
"errors"
"time"

"github.com/google/uuid"
)

type Repository struct {
db        *sql.DB
projectID string
}

type Board struct {
ID        string
ProjectID string
Name      string
CreatedAt string
UpdatedAt string
Columns   []Column
}

type Column struct {
ID        string
BoardID   string
Name      string
Order     int
CreatedAt string
UpdatedAt string
Tasks     []Task
}

type Task struct {
ID        string
ColumnID  string
Title     string
Order     int
CreatedAt string
UpdatedAt string
}

type ChatThread struct {
ID        string
ProjectID string
CreatedAt string
UpdatedAt string
}

type ChatMessage struct {
ID              string
ThreadID        string
Role            string
Content         string
IsInformational bool
CreatedAt       string
}

func NewRepository(db *sql.DB, projectID string) *Repository {
return &Repository{db: db, projectID: projectID}
}

func (r *Repository) EnsureDefaults(ctx context.Context) error {
now := time.Now().UTC().Format(time.RFC3339Nano)

if err := r.ensureProject(ctx, now); err != nil {
return err
}

boardID, err := r.ensureBoard(ctx, now)
if err != nil {
return err
}

if err := r.ensureColumns(ctx, boardID, now); err != nil {
return err
}

if err := r.ensureChatThread(ctx, now); err != nil {
return err
}

return nil
}

func (r *Repository) ensureProject(ctx context.Context, now string) error {
var count int
if err := r.db.QueryRowContext(ctx, "SELECT COUNT(1) FROM projects").Scan(&count); err != nil {
return err
}

if count > 0 {
return nil
}

_, err := r.db.ExecContext(ctx, `INSERT INTO projects (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)`, r.projectID, r.projectID, now, now)
return err
}

func (r *Repository) ensureBoard(ctx context.Context, now string) (string, error) {
var boardID string
if err := r.db.QueryRowContext(ctx, "SELECT id FROM boards LIMIT 1").Scan(&boardID); err == nil {
return boardID, nil
} else if !errors.Is(err, sql.ErrNoRows) {
return "", err
}

boardID = uuid.NewString()
_, err := r.db.ExecContext(ctx, `INSERT INTO boards (id, project_id, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`, boardID, r.projectID, "Main Board", now, now)
if err != nil {
return "", err
}

return boardID, nil
}

func (r *Repository) ensureColumns(ctx context.Context, boardID, now string) error {
var count int
if err := r.db.QueryRowContext(ctx, "SELECT COUNT(1) FROM columns WHERE board_id = ?", boardID).Scan(&count); err != nil {
return err
}

if count > 0 {
return nil
}

defaultColumns := []struct {
Name  string
Order int
}{
{Name: "To Do", Order: 0},
{Name: "In Progress", Order: 1},
{Name: "Done", Order: 2},
}

for _, column := range defaultColumns {
_, err := r.db.ExecContext(ctx, `INSERT INTO columns (id, board_id, name, order_index, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`, uuid.NewString(), boardID, column.Name, column.Order, now, now)
if err != nil {
return err
}
}

return nil
}

func (r *Repository) ensureChatThread(ctx context.Context, now string) error {
var threadID string
if err := r.db.QueryRowContext(ctx, "SELECT id FROM chat_threads LIMIT 1").Scan(&threadID); err == nil {
return nil
} else if !errors.Is(err, sql.ErrNoRows) {
return err
}

_, err := r.db.ExecContext(ctx, `INSERT INTO chat_threads (id, project_id, created_at, updated_at) VALUES (?, ?, ?, ?)`, uuid.NewString(), r.projectID, now, now)
return err
}

func (r *Repository) FetchBoard(ctx context.Context) (Board, error) {
var board Board
row := r.db.QueryRowContext(ctx, "SELECT id, project_id, name, created_at, updated_at FROM boards LIMIT 1")
if err := row.Scan(&board.ID, &board.ProjectID, &board.Name, &board.CreatedAt, &board.UpdatedAt); err != nil {
return Board{}, err
}

columns, err := r.ListColumns(ctx, board.ID)
if err != nil {
return Board{}, err
}
board.Columns = columns

return board, nil
}

func (r *Repository) ListColumns(ctx context.Context, boardID string) ([]Column, error) {
rows, err := r.db.QueryContext(ctx, "SELECT id, board_id, name, order_index, created_at, updated_at FROM columns WHERE board_id = ? ORDER BY order_index", boardID)
if err != nil {
return nil, err
}
defer rows.Close()

columns := []Column{}
for rows.Next() {
var column Column
if err := rows.Scan(&column.ID, &column.BoardID, &column.Name, &column.Order, &column.CreatedAt, &column.UpdatedAt); err != nil {
return nil, err
}

tasks, err := r.ListTasks(ctx, column.ID)
if err != nil {
return nil, err
}
column.Tasks = tasks

columns = append(columns, column)
}

if err := rows.Err(); err != nil {
return nil, err
}

return columns, nil
}

func (r *Repository) ListTasks(ctx context.Context, columnID string) ([]Task, error) {
rows, err := r.db.QueryContext(ctx, "SELECT id, column_id, title, order_index, created_at, updated_at FROM tasks WHERE column_id = ? ORDER BY order_index", columnID)
if err != nil {
return nil, err
}
defer rows.Close()

tasks := []Task{}
for rows.Next() {
var task Task
if err := rows.Scan(&task.ID, &task.ColumnID, &task.Title, &task.Order, &task.CreatedAt, &task.UpdatedAt); err != nil {
return nil, err
}
tasks = append(tasks, task)
}

if err := rows.Err(); err != nil {
return nil, err
}

return tasks, nil
}

func (r *Repository) GetTask(ctx context.Context, taskID string) (Task, error) {
var task Task
row := r.db.QueryRowContext(ctx, "SELECT id, column_id, title, order_index, created_at, updated_at FROM tasks WHERE id = ?", taskID)
if err := row.Scan(&task.ID, &task.ColumnID, &task.Title, &task.Order, &task.CreatedAt, &task.UpdatedAt); err != nil {
return Task{}, err
}
return task, nil
}

func (r *Repository) CreateTask(ctx context.Context, columnID, title string, order int) (Task, error) {
now := time.Now().UTC().Format(time.RFC3339Nano)
id := uuid.NewString()

_, err := r.db.ExecContext(ctx, `INSERT INTO tasks (id, column_id, title, order_index, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`, id, columnID, title, order, now, now)
if err != nil {
return Task{}, err
}

return Task{ID: id, ColumnID: columnID, Title: title, Order: order, CreatedAt: now, UpdatedAt: now}, nil
}

func (r *Repository) UpdateTask(ctx context.Context, taskID, columnID string, order int, title *string) (Task, error) {
now := time.Now().UTC().Format(time.RFC3339Nano)
var err error

if title != nil {
_, err = r.db.ExecContext(ctx, `UPDATE tasks SET column_id = ?, title = ?, order_index = ?, updated_at = ? WHERE id = ?`, columnID, *title, order, now, taskID)
} else {
_, err = r.db.ExecContext(ctx, `UPDATE tasks SET column_id = ?, order_index = ?, updated_at = ? WHERE id = ?`, columnID, order, now, taskID)
}

if err != nil {
return Task{}, err
}

return r.GetTask(ctx, taskID)
}

func (r *Repository) GetChatThread(ctx context.Context) (ChatThread, error) {
var thread ChatThread
row := r.db.QueryRowContext(ctx, "SELECT id, project_id, created_at, updated_at FROM chat_threads LIMIT 1")
if err := row.Scan(&thread.ID, &thread.ProjectID, &thread.CreatedAt, &thread.UpdatedAt); err != nil {
return ChatThread{}, err
}
return thread, nil
}

func (r *Repository) ListChatMessages(ctx context.Context, threadID string) ([]ChatMessage, error) {
rows, err := r.db.QueryContext(ctx, "SELECT id, thread_id, role, content, is_informational, created_at FROM chat_messages WHERE thread_id = ? ORDER BY created_at", threadID)
if err != nil {
return nil, err
}
defer rows.Close()

messages := []ChatMessage{}
for rows.Next() {
var msg ChatMessage
var informational int
if err := rows.Scan(&msg.ID, &msg.ThreadID, &msg.Role, &msg.Content, &informational, &msg.CreatedAt); err != nil {
return nil, err
}
msg.IsInformational = informational != 0
messages = append(messages, msg)
}

if err := rows.Err(); err != nil {
return nil, err
}

return messages, nil
}

func (r *Repository) CreateChatMessage(ctx context.Context, threadID, role, content string, isInformational bool) (ChatMessage, error) {
now := time.Now().UTC().Format(time.RFC3339Nano)
id := uuid.NewString()
info := 0
if isInformational {
info = 1
}

_, err := r.db.ExecContext(ctx, `INSERT INTO chat_messages (id, thread_id, role, content, is_informational, created_at) VALUES (?, ?, ?, ?, ?, ?)`, id, threadID, role, content, info, now)
if err != nil {
return ChatMessage{}, err
}

return ChatMessage{ID: id, ThreadID: threadID, Role: role, Content: content, IsInformational: isInformational, CreatedAt: now}, nil
}