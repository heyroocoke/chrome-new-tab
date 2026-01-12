import { useState, useEffect, useCallback } from 'react';
import { QuickLink, storage, generateId } from '../lib/storage';
import { getFaviconUrl } from '../lib/favicon';

interface UseQuickLinksReturn {
  links: QuickLink[];
  loading: boolean;
  addLink: (link: Omit<QuickLink, 'id' | 'createdAt' | 'faviconUrl'>) => Promise<void>;
  updateLink: (id: string, updates: Partial<Omit<QuickLink, 'id' | 'createdAt'>>) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  reorderLinks: (fromIndex: number, toIndex: number) => Promise<void>;
}

export function useQuickLinks(): UseQuickLinksReturn {
  const [links, setLinks] = useState<QuickLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLinks = async () => {
      try {
        const data = await storage.getQuickLinks();
        setLinks(data);
      } finally {
        setLoading(false);
      }
    };
    loadLinks();
  }, []);

  const saveLinks = useCallback(async (newLinks: QuickLink[]) => {
    setLinks(newLinks);
    await storage.setQuickLinks(newLinks);
  }, []);

  const addLink = useCallback(
    async (link: Omit<QuickLink, 'id' | 'createdAt' | 'faviconUrl'>) => {
      const newLink: QuickLink = {
        ...link,
        id: generateId(),
        faviconUrl: getFaviconUrl(link.url),
        createdAt: Date.now(),
      };
      await saveLinks([...links, newLink]);
    },
    [links, saveLinks]
  );

  const updateLink = useCallback(
    async (id: string, updates: Partial<Omit<QuickLink, 'id' | 'createdAt'>>) => {
      const newLinks = links.map((link) => {
        if (link.id === id) {
          const updatedLink = { ...link, ...updates };
          if (updates.url) {
            updatedLink.faviconUrl = getFaviconUrl(updates.url);
          }
          return updatedLink;
        }
        return link;
      });
      await saveLinks(newLinks);
    },
    [links, saveLinks]
  );

  const deleteLink = useCallback(
    async (id: string) => {
      const newLinks = links.filter((link) => link.id !== id);
      await saveLinks(newLinks);
    },
    [links, saveLinks]
  );

  const reorderLinks = useCallback(
    async (fromIndex: number, toIndex: number) => {
      const newLinks = [...links];
      const [removed] = newLinks.splice(fromIndex, 1);
      newLinks.splice(toIndex, 0, removed);
      await saveLinks(newLinks);
    },
    [links, saveLinks]
  );

  return { links, loading, addLink, updateLink, deleteLink, reorderLinks };
}
