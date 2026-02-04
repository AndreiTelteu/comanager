import { createResource, For } from 'solid-js';
import { createRoute, useNavigate } from '@tanstack/solid-router';
import type { AnyRoute } from '@tanstack/solid-router';
import { getProjects } from '../api';

export const createProjectsRoute = (parentRoute: AnyRoute) =>
  createRoute({
    getParentRoute: () => parentRoute,
    path: '/',
    component: ProjectsOrganizerComponent,
  });

function ProjectsOrganizerComponent() {
  const navigate = useNavigate();
  const [projects] = createResource(getProjects);

  const handleProjectClick = (slug: string) => {
    navigate({ to: `/${slug}/kanban` });
  };

  return (
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Projects</h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Select a project to view its kanban board
          </p>
        </div>
        <button class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100">
          Create project
        </button>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <For each={projects()}>
          {(project) => (
            <button
              onClick={() => handleProjectClick(project.slug)}
              class="flex flex-col items-start rounded-xl border border-gray-200 bg-white p-6 text-left transition hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
            >
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {project.name}
              </h3>
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Created {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </button>
          )}
        </For>
      </div>
    </div>
  );
}
