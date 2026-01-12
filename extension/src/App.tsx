import { useState, useEffect } from 'react';
import { TodoPanel } from './components/TodoPanel';
import { QuickLinks } from './components/QuickLinks';
import { BackgroundSettings } from './components/BackgroundSettings';
import {
  BackgroundSettings as BgSettings,
  backgroundStorage,
  DEFAULT_BACKGROUND,
} from './lib/background';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(): string {
  return new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
}

export default function App() {
  const [background, setBackground] = useState<BgSettings>(DEFAULT_BACKGROUND);

  useEffect(() => {
    backgroundStorage.get().then(setBackground);
  }, []);

  const handleBackgroundChange = async (settings: BgSettings) => {
    setBackground(settings);
    await backgroundStorage.set(settings);
  };

  const backgroundStyle =
    background.type === 'gradient'
      ? { background: background.value }
      : {
          backgroundImage: `url(${background.value})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };

  return (
    <div className="min-h-screen relative">
      {/* Background Layer */}
      <div
        className="fixed inset-0 -z-10 transition-all duration-500"
        style={backgroundStyle}
      />

      {/* Content */}
      <div className="min-h-screen p-8 flex flex-col items-center relative">
        <header className="text-center mb-12">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            {getGreeting()}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>{formatDate()}</p>
        </header>

        <main className="w-full max-w-4xl grid md:grid-cols-2 gap-6">
          <TodoPanel />
          <QuickLinks />
        </main>

        <footer
          className="mt-12 text-sm"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Powered by Notion
        </footer>
      </div>

      {/* Background Settings Button */}
      <BackgroundSettings
        currentBackground={background}
        onSave={handleBackgroundChange}
      />
    </div>
  );
}
