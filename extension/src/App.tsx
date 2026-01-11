import { TodoPanel } from './components/TodoPanel';
import { QuickLinks } from './components/QuickLinks';

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
  return (
    <div className="min-h-screen p-8 flex flex-col items-center">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">{getGreeting()}</h1>
        <p className="text-slate-400">{formatDate()}</p>
      </header>

      <main className="w-full max-w-4xl grid md:grid-cols-2 gap-6">
        <TodoPanel />
        <QuickLinks />
      </main>

      <footer className="mt-12 text-slate-600 text-sm">
        Powered by Notion
      </footer>
    </div>
  );
}
