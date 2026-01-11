import { useState, useEffect, useCallback } from 'react';
import { Todo, fetchTodos, updateTodo, createTodo } from '../lib/api';

interface UseTodosReturn {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  toggleTodo: (id: string, done: boolean) => Promise<void>;
  addTodo: (title: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useTodos(): UseTodosReturn {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTodos();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggleTodo = useCallback(async (id: string, done: boolean) => {
    // Optimistic update
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, done } : todo))
    );

    try {
      await updateTodo(id, done);
    } catch (err) {
      // Revert on error
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, done: !done } : todo))
      );
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  }, []);

  const addTodo = useCallback(async (title: string) => {
    try {
      const newTodo = await createTodo(title);
      setTodos((prev) => [...prev, newTodo]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
      throw err;
    }
  }, []);

  return { todos, loading, error, toggleTodo, addTodo, refresh };
}
