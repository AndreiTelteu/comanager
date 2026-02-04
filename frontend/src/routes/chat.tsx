import { Show, createEffect, createResource, createSignal } from 'solid-js';
import { createRoute } from '@tanstack/solid-router';
import type { AnyRoute } from '@tanstack/solid-router';
import { DEFAULT_PROJECT_ID, getChatMessages, sendChatMessage } from '../api';
import type { ChatMessage } from '../api';
import { ChatTimeline } from '../components/chat/ChatTimeline';
import { ChatComposer } from '../components/chat/ChatComposer';

export const createChatRoute = (parentRoute: AnyRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: 'chat',
    component: ChatRouteComponent,
  });

function ChatRouteComponent() {
  const [messages, setMessages] = createSignal<ChatMessage[]>([]);
  const [error, setError] = createSignal('');
  const conversations = [
    {
      id: 'default',
      title: 'Comanager AI',
      preview: 'Plan the next delivery milestone.',
      time: 'Now',
    },
    {
      id: 'sprint',
      title: 'Sprint planning',
      preview: 'Turn requirements into tasks.',
      time: 'Today',
    },
    {
      id: 'feedback',
      title: 'Client feedback',
      preview: 'Summarize meeting notes.',
      time: 'Yesterday',
    },
  ];

  const [chatResult, { refetch }] = createResource(
    () => DEFAULT_PROJECT_ID,
    getChatMessages,
  );

  createEffect(() => {
    const current = chatResult();
    if (current) {
      setMessages(current);
      setError('');
    }
  });

  const handleSend = async (message: string) => {
    const now = new Date().toISOString();
    const optimistic: ChatMessage = {
      id: `local-${now}`,
      threadId: 'local',
      role: 'user',
      content: message,
      isInformational: false,
      createdAt: now,
    };

    setMessages((current) => [...current, optimistic]);
    setError('');

    try {
      const systemMessage = await sendChatMessage(DEFAULT_PROJECT_ID, message);
      setMessages((current) => [...current, systemMessage]);
    } catch {
      setError('Unable to send message. Please try again.');
      refetch();
    }
  };

  return (
    <div class="flex min-h-[calc(100vh-11rem)] flex-col gap-6">
      <div>
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
          AI chat
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Keep conversations with your AI assistant organized and searchable.
        </p>
      </div>
      <div class="flex flex-1 flex-col gap-6 lg:flex-row lg:items-stretch">
        <aside class="flex w-full flex-col lg:w-72 lg:items-stretch">
          <div class="flex flex-1 flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div class="flex items-center justify-between">
              <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Conversations
              </p>
              <button
                type="button"
                class="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white transition hover:bg-blue-500"
              >
                New chat
              </button>
            </div>
            <div class="mt-4 flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
              {conversations.map((conversation, index) => (
                <button
                  type="button"
                  class={`w-full rounded-xl border px-3 py-3 text-left transition ${
                    index === 0
                      ? 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-100'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  <p class="text-sm font-semibold">{conversation.title}</p>
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {conversation.preview}
                  </p>
                  <p class="mt-2 text-[10px] uppercase tracking-wide text-gray-400">
                    {conversation.time}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </aside>
        <section class="flex min-h-[32rem] flex-1 flex-col rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <header class="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <div>
              <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Comanager AI
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Ask anything about delivery, scope, or planning.
              </p>
            </div>
            <span class="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
              Online
            </span>
          </header>
          <div class="flex-1 overflow-y-auto px-6 py-6">
            <Show
              when={!chatResult.loading}
              fallback={
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  Loading conversation...
                </div>
              }
            >
              <ChatTimeline messages={messages()} />
            </Show>
          </div>
          <div class="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-950">
            <div class="space-y-3">
              {error() ? (
                <p class="text-sm text-rose-500">{error()}</p>
              ) : null}
              <ChatComposer onSend={handleSend} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
