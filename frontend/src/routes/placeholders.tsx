import { createRoute } from '@tanstack/solid-router';
import type { AnyRoute } from '@tanstack/solid-router';

type PlaceholderConfig = {
  title: string;
  description: string;
};

export const createPlaceholderRoute = (
  parentRoute: AnyRoute,
  path: string,
  config: PlaceholderConfig,
) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path,
    component: () => (
      <div class="space-y-4">
        <div>
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
            {config.title}
          </h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {config.description}
          </p>
        </div>
        <div class="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
          This page is not implemented yet.
        </div>
      </div>
    ),
  });
