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
    <div class="min-h-screen bg-gray-50 px-6 py-12 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <div class="mx-auto flex max-w-4xl flex-col items-center gap-10">
        <div class="text-center">
          <p class="text-xs uppercase tracking-[0.4em] text-gray-400">CoManager</p>
          <h1 class="mt-4 text-4xl font-semibold text-gray-900 dark:text-white">
            Project Organizer
          </h1>
          <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Select a project to jump into its kanban board.
          </p>
        </div>

        <button class="rounded-full bg-gray-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100">
          Create project
        </button>

        <div class="grid w-full gap-4 sm:grid-cols-2">
          <For each={projects()}>
            {(project) => (
              <button
                onClick={() => handleProjectClick(project.slug)}
                class="flex flex-col items-start gap-2 rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
              >
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {project.name}
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </button>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}
