import { Link, Outlet } from '@tanstack/solid-router';
import { ThemeToggle } from '../components/ThemeToggle';

const navItems = [
  { label: 'Kanban Board', to: '/kanban' },
  { label: 'Specifications', to: '/specifications' },
  { label: 'Chat', to: '/chat' },
  { label: 'Environment', to: '/environment' },
  { label: 'Context', to: '/context' },
  { label: 'Memory', to: '/memory' },
  { label: 'Settings', to: '/settings' },
];

export function AppShell() {
  return (
    <div class="min-h-screen bg-gray-50 text-gray-950 dark:bg-gray-950 dark:text-gray-100">
      <div class="flex min-h-screen">
        <aside class="w-64 border-r border-gray-200 bg-white px-4 py-6 dark:border-gray-800 dark:bg-gray-900">
          <div class="mb-8 flex items-center justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-gray-400">Comanager</p>
              <p class="text-lg font-semibold">Workspace</p>
            </div>
          </div>
          <nav class="space-y-1">
            {navItems.map((item) => (
              <Link
                class="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                to={item.to}
                activeProps={{
                  class:
                    'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 bg-gray-100 dark:bg-gray-800 dark:text-white',
                }}
              >
                <span>{item.label}</span>
                <span class="text-[10px] text-gray-400">↗</span>
              </Link>
            ))}
          </nav>
          <div class="mt-8 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-950">
            <p class="font-medium text-gray-700 dark:text-gray-200">Tips</p>
            <p class="mt-1">Drag tasks across columns to update status.</p>
          </div>
        </aside>
        <div class="flex flex-1 flex-col">
          <header class="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-gray-400">
                Kanban + Chat Core
              </p>
              <h1 class="text-lg font-semibold">Delivery overview</h1>
            </div>
            <div class="flex items-center gap-3">
              <button class="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-300">
                Feb 3, 2026
              </button>
              <ThemeToggle />
            </div>
          </header>
          <main class="flex-1 bg-gray-50 p-6 dark:bg-gray-950">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
