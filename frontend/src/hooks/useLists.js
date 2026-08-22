import { useState, useCallback } from 'react';

const STORAGE_KEY = 'scrape_expectations_lists';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveToStorage(lists) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function useLists() {
  const [lists, setLists] = useState(loadFromStorage);

  const persist = useCallback((updater) => {
    setLists(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveToStorage(next);
      return next;
    });
  }, []);

  // Create a new list; returns false if name already exists
  const createList = useCallback((name) => {
    const trimmed = name.trim();
    if (!trimmed) return { ok: false, error: 'Name cannot be empty.' };
    
    let conflict = false;
    persist(prev => {
      if (Object.keys(prev).some(k => k.toLowerCase() === trimmed.toLowerCase())) {
        conflict = true;
        return prev;
      }
      return { ...prev, [trimmed]: [] };
    });
    
    if (conflict) return { ok: false, error: `A list named "${trimmed}" already exists.` };
    return { ok: true };
  }, [persist]);

  // Delete a list by name
  const deleteList = useCallback((name) => {
    persist(prev => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, [persist]);

  // Add a product to a list; skip if already there (match by productUrl)
  const addToList = useCallback((listName, product) => {
    persist(prev => {
      const current = prev[listName] || [];
      const alreadyIn = current.some(p => p.productUrl === product.productUrl);
      if (alreadyIn) return prev;
      return { ...prev, [listName]: [...current, { ...product, savedAt: Date.now() }] };
    });
  }, [persist]);

  // Remove a product from a list by productUrl
  const removeFromList = useCallback((listName, productUrl) => {
    persist(prev => ({
      ...prev,
      [listName]: (prev[listName] || []).filter(p => p.productUrl !== productUrl)
    }));
  }, [persist]);

  // Check if a product is in any list; returns list names it's in
  const getListsForProduct = useCallback((productUrl) => {
    return Object.keys(lists).filter(name =>
      (lists[name] || []).some(p => p.productUrl === productUrl)
    );
  }, [lists]);

  return { lists, createList, deleteList, addToList, removeFromList, getListsForProduct };
}
