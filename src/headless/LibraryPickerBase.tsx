import { useState, useMemo, useCallback } from "react";
import type { LibraryItem } from "@qontinui/shared-types/library";

export interface LibraryPickerRenderProps<
  T extends LibraryItem = LibraryItem,
> {
  isOpen: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredItems: T[];
  isLoading: boolean;
  onSelect: (item: T) => void;
  onClose: () => void;
}

export interface LibraryPickerBaseProps<T extends LibraryItem = LibraryItem> {
  items: T[];
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: T) => void;
  filterFn?: (item: T, query: string) => boolean;
  children: (props: LibraryPickerRenderProps<T>) => React.ReactNode;
}

export function LibraryPickerBase<T extends LibraryItem = LibraryItem>({
  items,
  isLoading,
  isOpen,
  onClose,
  onSelect,
  filterFn,
  children,
}: LibraryPickerBaseProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");

  const defaultFilter = useCallback((item: T, query: string) => {
    const q = query.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      (item.description?.toLowerCase().includes(q) ?? false)
    );
  }, []);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    const filter = filterFn ?? defaultFilter;
    return items.filter((item) => filter(item, searchQuery));
  }, [items, searchQuery, filterFn, defaultFilter]);

  const handleSelect = useCallback(
    (item: T) => {
      onSelect(item);
      onClose();
      setSearchQuery("");
    },
    [onSelect, onClose],
  );

  const handleClose = useCallback(() => {
    onClose();
    setSearchQuery("");
  }, [onClose]);

  return (
    <>
      {children({
        isOpen,
        searchQuery,
        setSearchQuery,
        filteredItems,
        isLoading,
        onSelect: handleSelect,
        onClose: handleClose,
      })}
    </>
  );
}
