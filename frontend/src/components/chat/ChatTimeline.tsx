import { For, Show } from 'solid-js';
import type { ChatMessage as ChatMessageType } from '../../api';
import { ChatMessage } from './ChatMessage';

type ChatTimelineProps = {
  messages: ChatMessageType[];
};

export function ChatTimeline(props: ChatTimelineProps) {
  return (
    <div class="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <Show
        when={props.messages.length > 0}
        fallback={
          <div class="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
            Start a new conversation by asking the assistant a question.
          </div>
        }
      >
        <For each={props.messages}>
          {(message) => <ChatMessage message={message} />}
        </For>
      </Show>
    </div>
  );
}
