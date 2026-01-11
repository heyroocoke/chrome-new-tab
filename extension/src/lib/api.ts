// 환경변수 또는 기본값 (빌드 시 교체 필요)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';
const API_KEY = import.meta.env.VITE_API_KEY || 'dev-api-key-change-me';

export interface Todo {
  id: string;
  title: string;
  done: boolean;
  date: string;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export async function fetchTodos(): Promise<Todo[]> {
  const data = await request<{ todos: Todo[] }>('/todos');
  return data.todos;
}

export async function updateTodo(id: string, done: boolean): Promise<void> {
  await request(`/todos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ done }),
  });
}

export async function createTodo(title: string): Promise<Todo> {
  return request<Todo>('/todos', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
}
