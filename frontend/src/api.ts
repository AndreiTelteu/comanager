const API_BASE = '/api';

export const DEFAULT_PROJECT_ID = 'default';

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

export const getBoard = async (projectId = DEFAULT_PROJECT_ID): Promise<Board> =>
  handleJson(
    await fetch(`${API_BASE}/projects/${projectId}/board`, {
      headers: { Accept: 'application/json' },
    }),
  );

export const createTask = async (
  projectId: string,
  payload: { columnId: string; title: string },
): Promise<Task> =>
  handleJson(
    await fetch(`${API_BASE}/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  );

export const updateTask = async (
  projectId: string,
  taskId: string,
  payload: { columnId?: string; orderIndex?: number; title?: string },
): Promise<Task> =>
  handleJson(
    await fetch(`${API_BASE}/projects/${projectId}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  );

export const getChatMessages = async (
  projectId = DEFAULT_PROJECT_ID,
): Promise<ChatMessage[]> =>
  handleJson(
    await fetch(`${API_BASE}/projects/${projectId}/chat`, {
      headers: { Accept: 'application/json' },
    }),
  );

export const sendChatMessage = async (
  projectId: string,
  content: string,
): Promise<ChatMessage> =>
  handleJson(
    await fetch(`${API_BASE}/projects/${projectId}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    }),
  );
