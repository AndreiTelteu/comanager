import type { JSX } from 'solid-js';
import type { Task } from '../../api';

type CardProps = {
  columnId: string;
  task: Task;
};

export function KanbanCard(props: CardProps) {
  const handleDragStart: JSX.EventHandlerUnion<HTMLDivElement, DragEvent> = (
    event,
  ) => {
    event.dataTransfer?.setData(
      'application/json',
      JSON.stringify({ taskId: props.task.id, fromColumnId: props.columnId }),
    );
    event.dataTransfer?.setData('text/plain', props.task.id);
    event.dataTransfer?.setDragImage(event.currentTarget, 16, 16);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      class="group cursor-grab rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md active:cursor-grabbing dark:border-gray-800 dark:bg-gray-900"
    >
      <p class="break-words text-sm font-semibold text-gray-900 dark:text-gray-100">
        {props.task.title}
      </p>
      <p class="mt-2 text-[11px] text-gray-400">
        Order {props.task.orderIndex + 1}
      </p>
    </div>
  );
}
