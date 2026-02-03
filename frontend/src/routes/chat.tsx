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
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
          Team chat
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Keep updates moving with a shared timeline.
        </p>
      </div>
      <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <Show
            when={!chatResult.loading}
            fallback={
              <div class="text-sm text-gray-500 dark:text-gray-400">
                Loading chat...
              </div>
            }
          >
            <ChatTimeline messages={messages()} />
          </Show>
          {error() ? (
            <p class="mt-3 text-sm text-rose-500">{error()}</p>
          ) : null}
        </div>
        <div class="space-y-4">
          <div class="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            <p class="font-semibold text-gray-700 dark:text-gray-200">
              Active now
            </p>
            <ul class="mt-3 space-y-2 text-xs">
              {['Ava', 'Noah', 'Liam', 'Sophia'].map((member) => (
                <li class="flex items-center gap-2">
                  <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
                  {member}
                </li>
              ))}
            </ul>
          </div>
          <div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Send update
            </p>
            <div class="mt-3">
              <ChatComposer onSend={handleSend} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
