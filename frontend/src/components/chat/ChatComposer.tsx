import { createSignal } from 'solid-js';
import type { JSX } from 'solid-js';

type ChatComposerProps = {
  onSend: (message: string) => void;
};

export function ChatComposer(props: ChatComposerProps) {
  const [draft, setDraft] = createSignal('');
  const [error, setError] = createSignal('');

  const handleSubmit: JSX.EventHandlerUnion<HTMLFormElement, SubmitEvent> = (
    event,
  ) => {
    event.preventDefault();
    const trimmed = draft().trim();
    if (!trimmed) {
      setError('Please enter a message before sending.');
      return;
    }
    props.onSend(trimmed);
    setDraft('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} class="flex flex-col gap-3">
      <div class="flex gap-3">
        <input
          value={draft()}
          onInput={(event) => {
            setDraft(event.currentTarget.value);
            if (error()) {
              setError('');
            }
          }}
          class="flex-1 rounded-full border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
          placeholder="Share an update..."
        />
        <button
          type="submit"
          class="rounded-full bg-blue-600 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-blue-500"
        >
          Send
        </button>
      </div>
      {error() ? <p class="text-xs text-rose-500">{error()}</p> : null}
    </form>
  );
}
