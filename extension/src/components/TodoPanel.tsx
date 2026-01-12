import { useTodos } from '../hooks/useTodos';
import { TodoItem } from './TodoItem';
import { AddTodo } from './AddTodo';

export function TodoPanel() {
  const { todos, loading, error, toggleTodo, addTodo, refresh } = useTodos();

  const completedCount = todos.filter((t) => t.done).length;
  const totalCount = todos.length;

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Today's Tasks</h2>
        <button
          onClick={refresh}
          className="p-2 rounded-lg transition-colors hover:opacity-70"
          style={{ color: 'var(--text-secondary)' }}
          title="Refresh"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {totalCount > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
            <span>Progress</span>
            <span>
              {completedCount}/{totalCount}
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--input-bg)' }}>
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%`, background: 'var(--accent)' }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8" style={{ color: 'var(--text-secondary)' }}>
          <svg
            className="w-6 h-6 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="ml-2">Loading...</span>
        </div>
      ) : (
        <>
          <div className="space-y-2 mb-4 max-h-[400px] overflow-y-auto">
            {todos.length === 0 ? (
              <p className="text-center py-8" style={{ color: 'var(--text-tertiary)' }}>
                No tasks for today. Add one below!
              </p>
            ) : (
              todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} />
              ))
            )}
          </div>
          <AddTodo onAdd={addTodo} />
        </>
      )}
    </div>
  );
}
