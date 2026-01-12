import { useState, DragEvent } from 'react';
import { useQuickLinks } from '../hooks/useQuickLinks';
import { QuickLinkEditModal } from './QuickLinkEditModal';
import { QuickLink } from '../lib/storage';

export function QuickLinks() {
  const { links, loading, addLink, updateLink, deleteLink, reorderLinks } = useQuickLinks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>, toIndex: number) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (fromIndex !== toIndex) {
      await reorderLinks(fromIndex, toIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleEdit = (link: QuickLink) => {
    setEditingLink(link);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingLink(null);
    setIsModalOpen(true);
  };

  const handleSave = async (linkData: Omit<QuickLink, 'id' | 'createdAt' | 'faviconUrl'>) => {
    if (editingLink) {
      await updateLink(editingLink.id, linkData);
    } else {
      await addLink(linkData);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteLink(id);
  };

  if (loading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-700 rounded w-32 mb-4"></div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-slate-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Quick Links</h2>
        <button
          onClick={handleAdd}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
          title="Add link"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {links.map((link, index) => (
          <div
            key={link.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`group relative rounded-xl bg-gradient-to-br ${link.color}
              transition-all duration-200 cursor-grab active:cursor-grabbing
              ${draggedIndex === index ? 'opacity-50 scale-95' : ''}
              ${dragOverIndex === index ? 'ring-2 ring-white/50' : ''}`}
          >
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 hover:scale-105 transition-transform duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={link.faviconUrl}
                alt=""
                className="w-6 h-6 rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="font-medium text-white truncate">{link.name}</span>
            </a>

            <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleEdit(link);
                }}
                className="w-6 h-6 flex items-center justify-center rounded bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition-colors"
                title="Edit"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDelete(link.id);
                }}
                className="w-6 h-6 flex items-center justify-center rounded bg-black/30 hover:bg-red-500/80 text-white/80 hover:text-white transition-colors"
                title="Delete"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {links.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <p>No links yet. Click + to add one.</p>
        </div>
      )}

      <QuickLinkEditModal
        isOpen={isModalOpen}
        link={editingLink}
        onSave={handleSave}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
