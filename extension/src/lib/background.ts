export interface BackgroundSettings {
  type: 'gradient' | 'image';
  value: string;
}

const STORAGE_KEY = 'backgroundSettings';

const DEFAULT_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
  'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
];

export const DEFAULT_BACKGROUND: BackgroundSettings = {
  type: 'gradient',
  value: DEFAULT_GRADIENTS[0],
};

export { DEFAULT_GRADIENTS };

const isExtensionEnvironment = (): boolean => {
  return typeof chrome !== 'undefined' && chrome.storage !== undefined;
};

export const backgroundStorage = {
  async get(): Promise<BackgroundSettings> {
    if (isExtensionEnvironment()) {
      const result = await chrome.storage.sync.get(STORAGE_KEY);
      return result[STORAGE_KEY] || DEFAULT_BACKGROUND;
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_BACKGROUND;
  },

  async set(settings: BackgroundSettings): Promise<void> {
    if (isExtensionEnvironment()) {
      await chrome.storage.sync.set({ [STORAGE_KEY]: settings });
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
  },
};
