import { render } from 'solid-js/web';
import 'solid-devtools';
import {
  Link,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/solid-router';
import './styles.css';
import { TanStackRouterDevtools } from '@tanstack/solid-router-devtools';
import { AppShell } from './layouts/AppShell';
import { createKanbanRoute } from './routes/kanban';
import { createChatRoute } from './routes/chat';
import { createPlaceholderRoute } from './routes/placeholders';
import { createProjectsRoute } from './routes/projects';

const rootRoute = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => (
    <div class="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200">
      <div>
        <h2 class="text-xl font-semibold">Page not found</h2>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          We couldn&apos;t find that page. Head back to the projects overview.
        </p>
      </div>
      <Link
        to="/"
        class="inline-flex items-center rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white dark:bg-white dark:text-gray-900"
      >
        Go to Projects
      </Link>
    </div>
  ),
});

function RootComponent() {
  return (
    <>
      <AppShell />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}

const projectsRoute = createProjectsRoute(rootRoute);

const projectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '$projectSlug',
});

const kanbanRoute = createKanbanRoute(projectRoute);
const chatRoute = createChatRoute(projectRoute);
const specificationsRoute = createPlaceholderRoute(projectRoute, 'specifications', {
  title: 'Specifications',
  description: 'This page is not implemented yet.',
});
const environmentRoute = createPlaceholderRoute(projectRoute, 'environment', {
  title: 'Environment',
  description: 'This page is not implemented yet.',
});
const contextRoute = createPlaceholderRoute(projectRoute, 'context', {
  title: 'Context',
  description: 'This page is not implemented yet.',
});
const memoryRoute = createPlaceholderRoute(projectRoute, 'memory', {
  title: 'Memory',
  description: 'This page is not implemented yet.',
});
const settingsRoute = createPlaceholderRoute(projectRoute, 'settings', {
  title: 'Settings',
  description: 'This page is not implemented yet.',
});

const routeTree = rootRoute.addChildren([
  projectsRoute,
  projectRoute.addChildren([
    kanbanRoute,
    chatRoute,
    specificationsRoute,
    environmentRoute,
    contextRoute,
    memoryRoute,
    settingsRoute,
  ]),
]);

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultStaleTime: 5000,
  scrollRestoration: true,
});

declare module '@tanstack/solid-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('app')!;

if (!rootElement.innerHTML) {
  render(() => <RouterProvider router={router} />, rootElement);
}
