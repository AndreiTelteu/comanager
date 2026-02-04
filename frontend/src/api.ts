const API_BASE = '/api';

export type Project = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
};

export const MOCK_PROJECTS: Project[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Comanager Core',
    slug: 'comanager-core',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Marketing Website Redesign',
    slug: 'marketing-website',
    createdAt: '2026-01-20T14:30:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Mobile App MVP',
    slug: 'mobile-app-mvp',
    createdAt: '2026-02-01T09:15:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Customer Portal v2',
    slug: 'customer-portal-v2',
    createdAt: '2026-02-03T11:45:00Z',
  },
];

export type Task = {
  id: string;
  columnId: string;
  title: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
};

export type Column = {
  id: string;
  boardId: string;
  name: string;
  orderIndex: number;
  tasks: Task[];
};

export type Board = {
  id: string;
  projectId: string;
  name: string;
  columns: Column[];
};

export type ChatMessage = {
  id: string;
  threadId: string;
  role: 'user' | 'system';
  content: string;
  isInformational: boolean;
  createdAt: string;
};

const handleJson = async <T,>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return (await response.json()) as T;
};

export const getProjects = async (): Promise<Project[]> => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return [...MOCK_PROJECTS];
};

export const getProjectBySlug = async (
  slug?: string,
): Promise<Project | undefined> => {
  if (!slug) {
    return undefined;
  }
  await new Promise((resolve) => setTimeout(resolve, 50));
  return MOCK_PROJECTS.find((project) => project.slug === slug);
};

export const getBoard = async (projectSlug: string): Promise<Board> =>
  handleJson(
    await fetch(`${API_BASE}/projects/${projectSlug}/board`, {
      headers: { Accept: 'application/json' },
    }),
  );

export const createTask = async (
  projectSlug: string,
  payload: { columnId: string; title: string },
): Promise<Task> =>
  handleJson(
    await fetch(`${API_BASE}/projects/${projectSlug}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  );

export const updateTask = async (
  projectSlug: string,
  taskId: string,
  payload: { columnId?: string; orderIndex?: number; title?: string },
): Promise<Task> =>
  handleJson(
    await fetch(`${API_BASE}/projects/${projectSlug}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  );

export const getChatMessages = async (
  projectSlug: string,
): Promise<ChatMessage[]> =>
  handleJson(
    await fetch(`${API_BASE}/projects/${projectSlug}/chat`, {
      headers: { Accept: 'application/json' },
    }),
  );

export const sendChatMessage = async (
  projectSlug: string,
  content: string,
): Promise<ChatMessage> =>
  handleJson(
    await fetch(`${API_BASE}/projects/${projectSlug}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    }),
  );
