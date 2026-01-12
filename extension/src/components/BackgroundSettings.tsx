import { useState, useRef } from 'react';
import { BackgroundSettings as BgSettings, DEFAULT_GRADIENTS } from '../lib/background';

interface Props {
  currentBackground: BgSettings;
  onSave: (settings: BgSettings) => void;
}

export function BackgroundSettings({ currentBackground, onSave }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGradientSelect = (gradient: string) => {
    onSave({ type: 'gradient', value: gradient });
    setIsOpen(false);
  };

  const handleImageUrlSubmit = () => {
    if (imageUrl.trim()) {
      onSave({ type: 'image', value: imageUrl.trim() });
      setImageUrl('');
      setIsOpen(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        onSave({ type: 'image', value: dataUrl });
        setIsOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full glass-panel flex items-center justify-center
          hover:scale-105 transition-transform duration-200"
        style={{ color: 'var(--text-primary)' }}
        title="Background Settings"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-16 right-0 w-80 glass-panel rounded-2xl p-4 z-50">
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Background
            </h3>

            {/* Gradients */}
            <div className="mb-4">
              <p
                className="text-sm mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                Gradients
              </p>
              <div className="grid grid-cols-4 gap-2">
                {DEFAULT_GRADIENTS.map((gradient, index) => (
                  <button
                    key={index}
                    onClick={() => handleGradientSelect(gradient)}
                    className={`w-full aspect-square rounded-lg transition-transform hover:scale-105
                      ${currentBackground.type === 'gradient' && currentBackground.value === gradient
                        ? 'ring-2 ring-white shadow-lg'
                        : ''}`}
                    style={{ background: gradient }}
                  />
                ))}
              </div>
            </div>

            {/* Image URL */}
            <div className="mb-4">
              <p
                className="text-sm mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                Image URL
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 rounded-lg text-sm glass-input"
                  onKeyDown={(e) => e.key === 'Enter' && handleImageUrlSubmit()}
                />
                <button
                  onClick={handleImageUrlSubmit}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: 'white',
                  }}
                >
                  Apply
                </button>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <p
                className="text-sm mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                Upload Image
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-3 py-2 rounded-lg text-sm font-medium glass-input
                  hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Choose File
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
