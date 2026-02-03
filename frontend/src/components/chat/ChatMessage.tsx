import type { ChatMessage as ChatMessageType } from '../../api';

type ChatMessageProps = {
  message: ChatMessageType;
};

export function ChatMessage(props: ChatMessageProps) {
  const isUser = () => props.message.role === 'user';
  return (
    <div
      class={`flex flex-col gap-1 ${
        isUser() ? 'items-end text-right' : 'items-start'
      }`}
    >
      <div
        class={`max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
          isUser()
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100'
        }`}
      >
        <div class="flex items-center justify-between gap-3">
          <p class="text-xs font-semibold opacity-70">
            {isUser() ? 'You' : 'System'}
          </p>
          {props.message.isInformational ? (
            <span class="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:bg-amber-500/20 dark:text-amber-200">
              Informational
            </span>
          ) : null}
        </div>
        <p class="mt-2 leading-relaxed">{props.message.content}</p>
      </div>
      <span class="text-[10px] text-gray-400">
        {new Date(props.message.createdAt).toLocaleString()}
      </span>
    </div>
  );
}
