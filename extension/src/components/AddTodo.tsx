import { useState } from 'react';

interface AddTodoProps {
  onAdd: (title: string) => Promise<void>;
}

export function AddTodo({ onAdd }: AddTodoProps) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    try {
      await onAdd(trimmed);
      setTitle('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg
          text-slate-200 placeholder:text-slate-500
          focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
          transition-all"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !title.trim()}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600
          text-white font-medium rounded-lg
          focus:outline-none focus:ring-2 focus:ring-emerald-500/50
          transition-colors disabled:cursor-not-allowed"
      >
        {loading ? '...' : '+'}
      </button>
    </form>
  );
}
