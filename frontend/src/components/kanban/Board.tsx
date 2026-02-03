import { For } from 'solid-js';
import type { Column } from '../../api';
import { KanbanColumnView } from './Column';

type BoardProps = {
  columns: Column[];
  onMoveTask: (taskId: string, fromColumnId: string, toColumnId: string) => void;
};

export function KanbanBoard(props: BoardProps) {
  return (
    <div class="grid gap-4 lg:grid-cols-4">
      <For each={props.columns}>
        {(column) => (
          <KanbanColumnView column={column} onMoveTask={props.onMoveTask} />
        )}
      </For>
    </div>
  );
}
