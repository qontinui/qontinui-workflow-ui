import { useState, useEffect, useCallback } from "react";
import type { LibraryItem } from "@qontinui/shared-types/library";

export interface UseLibraryItemsResult<T extends LibraryItem = LibraryItem> {
  items: T[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useLibraryItems<T extends LibraryItem = LibraryItem>(
  fetcher: () => Promise<T[]>,
): UseLibraryItemsResult<T> {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setError(null);
    fetcher()
      .then(setItems)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setIsLoading(false));
  }, [fetcher]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, isLoading, error, refresh };
}
