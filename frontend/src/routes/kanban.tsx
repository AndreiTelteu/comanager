import { Show, createEffect, createResource, createSignal } from 'solid-js';
import { createRoute, useParams } from '@tanstack/solid-router';
import type { AnyRoute } from '@tanstack/solid-router';
import { createTask, getBoard, updateTask } from '../api';
import type { Column, Task } from '../api';
import { KanbanBoard } from '../components/kanban/Board';
import { NewTaskForm } from '../components/kanban/NewTaskForm';
const moveTask = (
  columns: Column[],
  taskId: string,
  fromColumnId: string,
  toColumnId: string,
): { next: Column[]; moved?: Task; nextOrderIndex?: number } => {
  if (fromColumnId === toColumnId) {
    return { next: columns };
  }

  let movedTask: Task | undefined;

  const stripped = columns.map((column) => {
    if (column.id === fromColumnId) {
      const nextTasks = column.tasks.filter((task) => {
        if (task.id === taskId) {
          movedTask = task;
          return false;
        }
        return true;
      });
      return { ...column, tasks: nextTasks };
    }
    return column;
  });

  if (!movedTask) {
    return { next: columns };
  }

  const next = stripped.map((column) => {
    if (column.id === toColumnId) {
      const nextOrderIndex = column.tasks.length;
      const updatedTask = { ...movedTask!, orderIndex: nextOrderIndex };
      return { ...column, tasks: [...column.tasks, updatedTask] };
    }
    return column;
  });

  const targetColumn = next.find((column) => column.id === toColumnId);
  const orderIndex = targetColumn ? targetColumn.tasks.length - 1 : undefined;

  return { next, moved: movedTask, nextOrderIndex: orderIndex };
};

export const createKanbanRoute = (parentRoute: AnyRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: 'kanban',
    component: KanbanRouteComponent,
  });

function KanbanRouteComponent() {
  const params = useParams({ strict: false });
  const projectSlug = () => params()?.projectSlug;
  const [columns, setColumns] = createSignal<Column[]>([]);
  const [loadError, setLoadError] = createSignal<string>('');

  const [boardResult, { refetch }] = createResource(
    () => projectSlug(),
    getBoard,
  );

  createEffect(() => {
    const current = boardResult();
    if (current) {
      const ordered = [...current.columns].sort(
        (a, b) => a.orderIndex - b.orderIndex,
      );
      setColumns(ordered);
      setLoadError('');
    }
  });

  const handleMoveTask = (
    taskId: string,
    fromColumnId: string,
    toColumnId: string,
  ) => {
    setColumns((current) => {
      const { next, moved, nextOrderIndex } = moveTask(
        current,
        taskId,
        fromColumnId,
        toColumnId,
      );
      if (moved && nextOrderIndex !== undefined) {
        updateTask(projectSlug(), taskId, {
          columnId: toColumnId,
          orderIndex: nextOrderIndex,
        }).catch(() => {
          refetch();
        });
      }
      return next;
    });
  };

  const handleCreateTask = async (title: string) => {
    const sorted = [...columns()].sort((a, b) => a.orderIndex - b.orderIndex);
    const firstColumn = sorted[0];
    if (!firstColumn) {
      setLoadError('No columns available to add a task.');
      return;
    }

    try {
      const created = await createTask(projectSlug(), {
        columnId: firstColumn.id,
        title,
      });
      setColumns((current) =>
        current.map((column) =>
          column.id === firstColumn.id
            ? { ...column, tasks: [...column.tasks, created] }
            : column,
        ),
      );
    } catch {
      setLoadError('Unable to create the task. Please try again.');
    }
  };

  return (
    <div class="space-y-6">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
            Product delivery board
          </h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track priorities across design, build, and review stages.
          </p>
        </div>
        <div class="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-600 shadow-sm dark:bg-gray-900 dark:text-gray-300">
          <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
          Sprint 04 · 6 active tasks
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div class="space-y-4">
          <Show when={!boardResult.loading} fallback={<div class="rounded-2xl border border-dashed border-gray-200 p-6 text-sm text-gray-500 dark:border-gray-800">Loading board...</div>}>
            <KanbanBoard columns={columns()} onMoveTask={handleMoveTask} />
          </Show>
          {loadError() ? (
            <p class="text-sm text-rose-500">{loadError()}</p>
          ) : null}
        </div>
        <div class="space-y-4">
          <NewTaskForm onCreate={handleCreateTask} />
          <div class="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            <p class="font-semibold text-gray-700 dark:text-gray-200">
              Quick filters
            </p>
            <div class="mt-3 flex flex-wrap gap-2">
              {['High priority', 'Design', 'Frontend', 'Due this week'].map(
                (tag) => (
                  <span class="rounded-full border border-gray-200 px-3 py-1 text-xs dark:border-gray-700">
                    {tag}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
