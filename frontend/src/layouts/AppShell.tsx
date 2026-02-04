import { Show, createResource } from 'solid-js';
import { Link, Outlet, useLocation, useNavigate, useParams } from '@tanstack/solid-router';
import { ThemeToggle } from '../components/ThemeToggle';
import { getProjectBySlug } from '../api';

const navItems = [
  { label: 'Kanban Board', to: 'kanban' },
  { label: 'Specifications', to: 'specifications' },
  { label: 'Chat', to: 'chat' },
  { label: 'Environment', to: 'environment' },
  { label: 'Context', to: 'context' },
  { label: 'Memory', to: 'memory' },
  { label: 'Settings', to: 'settings' },
];

export function AppShell() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isProjectRoute = () => !!params.projectSlug;
  const isRootRoute = () => location.pathname === '/';

  const [project] = createResource(() => params.projectSlug, getProjectBySlug);

  return (
    <div class="min-h-screen bg-gray-50 text-gray-950 dark:bg-gray-950 dark:text-gray-100">
      <div class="flex min-h-screen">
        <aside class="w-64 border-r border-gray-200 bg-white px-4 py-6 dark:border-gray-800 dark:bg-gray-900">
          <div class="mb-8 flex items-center justify-between">
            <div class="flex-1">
              <p class="text-xs uppercase tracking-[0.2em] text-gray-400">Comanager</p>
              <Show when={isProjectRoute()} fallback={
                <p class="text-lg font-semibold">Projects</p>
              }>
                <div class="flex items-center gap-2">
                  <Show when={isProjectRoute()}>
                    <button 
                      onClick={() => navigate({ to: '/' })}
                      class="flex h-6 w-6 items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                      title="Back to projects"
                    >
                      <span class="text-gray-600 dark:text-gray-400">←</span>
                    </button>
                  </Show>
                  <p 
                    class="text-lg font-semibold truncate max-w-[150px]" 
                    title={project()?.name}
                  >
                    <Show when={!project.loading} fallback="Loading...">
                      {project()?.name || 'Project not found'}
                    </Show>
                  </p>
                </div>
              </Show>
            </div>
          </div>
          <Show when={!isRootRoute()}>
            <nav class="space-y-1">
              {navItems.map((item) => (
                <Link
                  class="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  to={`/${params.projectSlug}/${item.to}`}
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
          </Show>
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
