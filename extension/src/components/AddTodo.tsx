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
        className="flex-1 px-4 py-2 rounded-lg glass-input transition-all"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !title.trim()}
        className="px-4 py-2 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: loading || !title.trim() ? 'var(--text-tertiary)' : 'var(--accent)',
        }}
      >
        {loading ? '...' : '+'}
      </button>
    </form>
  );
}
