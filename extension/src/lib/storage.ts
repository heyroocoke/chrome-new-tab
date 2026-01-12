export interface QuickLink {
  id: string;
  name: string;
  url: string;
  color: string;
  faviconUrl: string;
  createdAt: number;
}

const STORAGE_KEY = 'quickLinks';

export const DEFAULT_LINKS: QuickLink[] = [
  {
    id: '1',
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
    color: 'from-green-500 to-green-600',
    faviconUrl: 'https://www.google.com/s2/favicons?domain=chat.openai.com&sz=64',
    createdAt: Date.now(),
  },
  {
    id: '2',
    name: 'Claude',
    url: 'https://claude.ai',
    color: 'from-orange-500 to-orange-600',
    faviconUrl: 'https://www.google.com/s2/favicons?domain=claude.ai&sz=64',
    createdAt: Date.now(),
  },
  {
    id: '3',
    name: 'Perplexity',
    url: 'https://perplexity.ai',
    color: 'from-blue-500 to-blue-600',
    faviconUrl: 'https://www.google.com/s2/favicons?domain=perplexity.ai&sz=64',
    createdAt: Date.now(),
  },
  {
    id: '4',
    name: 'GitHub',
    url: 'https://github.com',
    color: 'from-purple-500 to-purple-600',
    faviconUrl: 'https://www.google.com/s2/favicons?domain=github.com&sz=64',
    createdAt: Date.now(),
  },
];

const isExtensionEnvironment = (): boolean => {
  return typeof chrome !== 'undefined' && chrome.storage !== undefined;
};

export const storage = {
  async getQuickLinks(): Promise<QuickLink[]> {
    if (isExtensionEnvironment()) {
      const result = await chrome.storage.sync.get(STORAGE_KEY);
      return result[STORAGE_KEY] || DEFAULT_LINKS;
    }
    // Fallback for development
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_LINKS;
  },

  async setQuickLinks(links: QuickLink[]): Promise<void> {
    if (isExtensionEnvironment()) {
      await chrome.storage.sync.set({ [STORAGE_KEY]: links });
    } else {
      // Fallback for development
      localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    }
  },
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
