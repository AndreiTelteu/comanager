import { For } from 'solid-js';
import type { ChatMessage as ChatMessageType } from '../../api';
import { ChatMessage } from './ChatMessage';

type ChatTimelineProps = {
  messages: ChatMessageType[];
};

export function ChatTimeline(props: ChatTimelineProps) {
  return (
    <div class="flex flex-col gap-4">
      <For each={props.messages}>
        {(message) => <ChatMessage message={message} />}
      </For>
    </div>
  );
}
