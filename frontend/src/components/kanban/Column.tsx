import { For, createSignal } from 'solid-js';
import type { JSX } from 'solid-js';
import type { Column } from '../../api';
import { KanbanCard } from './Card';

type ColumnProps = {
  column: Column;
  onMoveTask: (taskId: string, fromColumnId: string, toColumnId: string) => void;
};

export function KanbanColumnView(props: ColumnProps) {
  const [isOver, setIsOver] = createSignal(false);

  const handleDragOver: JSX.EventHandlerUnion<HTMLDivElement, DragEvent> = (
    event,
  ) => {
    event.preventDefault();
  };

  const handleDrop: JSX.EventHandlerUnion<HTMLDivElement, DragEvent> = (
    event,
  ) => {
    event.preventDefault();
    const payload = event.dataTransfer?.getData('application/json');
    if (!payload) {
      return;
    }

    try {
      const { taskId, fromColumnId } = JSON.parse(payload) as {
        taskId: string;
        fromColumnId: string;
      };
      if (taskId && fromColumnId && fromColumnId !== props.column.id) {
        props.onMoveTask(taskId, fromColumnId, props.column.id);
      }
    } catch {
      // ignore invalid payloads
    } finally {
      setIsOver(false);
    }
  };

  return (
    <div
      class={`flex h-full flex-col gap-3 rounded-2xl border border-gray-200 bg-white/70 p-3 transition dark:border-gray-800 dark:bg-gray-900/60 ${
        isOver() ? 'ring-2 ring-blue-400/60' : ''
      }`}
      onDragOver={handleDragOver}
      onDragEnter={() => setIsOver(true)}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
    >
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-200">
          {props.column.name}
        </h3>
        <span class="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-300">
          {props.column.tasks.length}
        </span>
      </div>
      <div class="flex flex-1 flex-col gap-3">
        <For
          each={props.column.tasks}
          fallback={
            <div class="rounded-xl border border-dashed border-gray-200 p-3 text-xs text-gray-400 dark:border-gray-800">
              Drop tasks here
            </div>
          }
        >
          {(task) => (
            <KanbanCard columnId={props.column.id} task={task} />
          )}
        </For>
      </div>
    </div>
  );
}
