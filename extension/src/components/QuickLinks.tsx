interface QuickLink {
  name: string;
  url: string;
  icon: string;
  color: string;
}

const quickLinks: QuickLink[] = [
  {
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
    icon: '🤖',
    color: 'from-green-500 to-green-600',
  },
  {
    name: 'Claude',
    url: 'https://claude.ai',
    icon: '🧠',
    color: 'from-orange-500 to-orange-600',
  },
  {
    name: 'Perplexity',
    url: 'https://perplexity.ai',
    icon: '🔍',
    color: 'from-blue-500 to-blue-600',
  },
  {
    name: 'GitHub',
    url: 'https://github.com',
    icon: '💻',
    color: 'from-purple-500 to-purple-600',
  },
];

export function QuickLinks() {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
      <h2 className="text-xl font-semibold text-white mb-4">Quick Links</h2>
      <div className="grid grid-cols-2 gap-3">
        {quickLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br ${link.color}
              hover:scale-105 hover:shadow-lg hover:shadow-slate-900/50
              transition-all duration-200`}
          >
            <span className="text-2xl">{link.icon}</span>
            <span className="font-medium text-white">{link.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
