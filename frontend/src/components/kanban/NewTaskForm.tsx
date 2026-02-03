import { createSignal } from 'solid-js';
import type { JSX } from 'solid-js';

type NewTaskFormProps = {
  onCreate: (title: string) => void;
};

export function NewTaskForm(props: NewTaskFormProps) {
  const [title, setTitle] = createSignal('');
  const [error, setError] = createSignal('');

  const handleSubmit: JSX.EventHandlerUnion<HTMLFormElement, SubmitEvent> = (
    event,
  ) => {
    event.preventDefault();
    const nextTitle = title().trim();
    if (!nextTitle) {
      setError('Please enter a task title.');
      return;
    }
    props.onCreate(nextTitle);
    setTitle('');
    setError('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      class="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div>
        <label class="text-xs font-semibold uppercase tracking-wide text-gray-500">
          New task
        </label>
        <input
          value={title()}
          onInput={(event) => {
            setTitle(event.currentTarget.value);
            if (error()) {
              setError('');
            }
          }}
          class="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
          placeholder="Name the next task"
        />
        {error() ? (
          <p class="mt-2 text-xs text-rose-500">{error()}</p>
        ) : null}
      </div>
      <button
        type="submit"
        class="self-start rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
      >
        Add task
      </button>
    </form>
  );
}
