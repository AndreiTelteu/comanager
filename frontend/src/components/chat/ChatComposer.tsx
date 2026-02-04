import { createSignal } from 'solid-js';
import type { JSX } from 'solid-js';

type ChatComposerProps = {
  onSend: (message: string) => void;
};

export function ChatComposer(props: ChatComposerProps) {
  const [draft, setDraft] = createSignal('');
  const [error, setError] = createSignal('');
  let fileInputRef: HTMLInputElement | undefined;

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
      <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Message</span>
          <button
            type="button"
            class="rounded-full border border-gray-200 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            onClick={() => fileInputRef?.click()}
          >
            Attach files
          </button>
        </div>
        <input
          value={draft()}
          onInput={(event) => {
            setDraft(event.currentTarget.value);
            if (error()) {
              setError('');
            }
          }}
          class="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
          placeholder="Ask the assistant anything..."
        />
        <input
          ref={(element) => {
            fileInputRef = element;
          }}
          type="file"
          multiple
          class="hidden"
        />
        <button
          type="submit"
          class="self-end rounded-full bg-blue-600 px-6 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-blue-500"
        >
          Send to AI
        </button>
      </div>
      {error() ? <p class="text-xs text-rose-500">{error()}</p> : null}
    </form>
  );
}
