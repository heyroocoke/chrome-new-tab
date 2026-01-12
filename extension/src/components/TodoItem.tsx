import type { Todo } from '../lib/api';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, done: boolean) => void;
}

export function TodoItem({ todo, onToggle }: TodoItemProps) {
  return (
    <label
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
        todo.done ? 'opacity-60' : 'glass-panel-hover'
      }`}
      style={{
        background: todo.done ? 'var(--input-bg)' : 'var(--input-bg)',
      }}
    >
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id, !todo.done)}
        className="w-5 h-5 rounded border-2 bg-transparent cursor-pointer transition-colors"
        style={{
          borderColor: todo.done ? 'var(--accent)' : 'var(--text-tertiary)',
          backgroundColor: todo.done ? 'var(--accent)' : 'transparent',
        }}
      />
      <span
        className={`flex-1 transition-all ${todo.done ? 'line-through' : ''}`}
        style={{
          color: todo.done ? 'var(--text-tertiary)' : 'var(--text-primary)',
        }}
      >
        {todo.title}
      </span>
    </label>
  );
}
