import type { Todo } from '../lib/api';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, done: boolean) => void;
}

export function TodoItem({ todo, onToggle }: TodoItemProps) {
  return (
    <label
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
        ${
          todo.done
            ? 'bg-slate-800/30 opacity-60'
            : 'bg-slate-700/50 hover:bg-slate-700/70'
        }`}
    >
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id, !todo.done)}
        className="w-5 h-5 rounded border-2 border-slate-500 bg-transparent
          checked:bg-emerald-500 checked:border-emerald-500
          focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-0
          cursor-pointer transition-colors"
      />
      <span
        className={`flex-1 text-slate-200 transition-all ${
          todo.done ? 'line-through text-slate-500' : ''
        }`}
      >
        {todo.title}
      </span>
    </label>
  );
}
