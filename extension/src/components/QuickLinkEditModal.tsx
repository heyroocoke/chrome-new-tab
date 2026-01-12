import { useState, useEffect } from 'react';
import { QuickLink } from '../lib/storage';
import { getFaviconUrl, isValidUrl } from '../lib/favicon';

interface QuickLinkEditModalProps {
  isOpen: boolean;
  link: QuickLink | null;
  onSave: (link: Omit<QuickLink, 'id' | 'createdAt' | 'faviconUrl'>) => void;
  onClose: () => void;
}

const COLOR_OPTIONS = [
  { label: 'Green', value: 'from-green-500 to-green-600' },
  { label: 'Orange', value: 'from-orange-500 to-orange-600' },
  { label: 'Blue', value: 'from-blue-500 to-blue-600' },
  { label: 'Purple', value: 'from-purple-500 to-purple-600' },
  { label: 'Pink', value: 'from-pink-500 to-pink-600' },
  { label: 'Red', value: 'from-red-500 to-red-600' },
  { label: 'Teal', value: 'from-teal-500 to-teal-600' },
  { label: 'Indigo', value: 'from-indigo-500 to-indigo-600' },
];

export function QuickLinkEditModal({ isOpen, link, onSave, onClose }: QuickLinkEditModalProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [color, setColor] = useState(COLOR_OPTIONS[0].value);
  const [faviconPreview, setFaviconPreview] = useState('');

  useEffect(() => {
    if (link) {
      setName(link.name);
      setUrl(link.url);
      setColor(link.color);
      setFaviconPreview(link.faviconUrl);
    } else {
      setName('');
      setUrl('');
      setColor(COLOR_OPTIONS[0].value);
      setFaviconPreview('');
    }
  }, [link, isOpen]);

  useEffect(() => {
    if (isValidUrl(url)) {
      setFaviconPreview(getFaviconUrl(url));
    } else {
      setFaviconPreview('');
    }
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !isValidUrl(url)) return;

    onSave({ name: name.trim(), url, color });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700/50 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold text-white mb-4">
          {link ? 'Edit Link' : 'Add Link'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Google"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {faviconPreview && (
                <div className="flex items-center justify-center w-10 h-10 bg-slate-700 rounded-lg">
                  <img
                    src={faviconPreview}
                    alt="favicon"
                    className="w-6 h-6"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Color</label>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setColor(option.value)}
                  className={`h-10 rounded-lg bg-gradient-to-br ${option.value} transition-all
                    ${color === option.value ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800' : 'hover:scale-105'}`}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !isValidUrl(url)}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {link ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
