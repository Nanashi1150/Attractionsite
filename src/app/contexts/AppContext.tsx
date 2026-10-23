import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { type TouristAttraction, mockAttractions } from '../types/TouristAttraction';
import { CATALOGUE_STORAGE_KEY, MAX_CATALOGUE_LENGTH, normalizeCatalogue, parseStoredCatalogue } from '../utils/catalogueStorage';

interface AppContextType {
  attractions: TouristAttraction[];
  isDark: boolean;
  isAdmin: boolean;
  exitAdmin: () => void;
  toggleTheme: () => void;
  addAttraction: (attraction: Omit<TouristAttraction, 'id'>) => void;
  updateAttraction: (id: number, attraction: Omit<TouristAttraction, 'id'>) => void;
  deleteAttraction: (id: number) => void;
  getAttractionById: (id: number) => TouristAttraction | undefined;
}
const AppContext = createContext<AppContextType | undefined>(undefined);
function loadAttractions(): TouristAttraction[] {
  try {
    const saved = parseStoredCatalogue(localStorage.getItem(CATALOGUE_STORAGE_KEY));
    if (saved) return saved;
  } catch { /* Fall back to the verified catalogue. */ }
  return mockAttractions;
}
export function AppProvider({ children }: { children: ReactNode }) {
  const [attractions, setAttractions] = useState(loadAttractions);
  const catalogueRef = useRef(attractions);
  const adminRef = useRef(false);
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem('theme') === 'dark'; } catch { return false; }
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const clickSequence = useRef({ count: 0, last: 0 });
  useEffect(() => () => { adminRef.current = false; }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch { /* Session only. */ }
  }, [isDark]);
  useEffect(() => {
    if (isAdmin) return;
    const onClick = (event: MouseEvent) => {
      if (!event.isTrusted || event.button !== 0) return;
      const now = performance.now();
      const sequence = clickSequence.current;
      sequence.count = now - sequence.last <= 1000 ? sequence.count + 1 : 1;
      sequence.last = now;
      if (sequence.count >= 10) { sequence.count = 0; adminRef.current = true; setIsAdmin(true); }
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [isAdmin]);
  const exitAdmin = useCallback(() => {
    clickSequence.current = { count: 0, last: 0 };
    adminRef.current = false;
    setIsAdmin(false);
  }, []);
  const toggleTheme = useCallback(() => {
    setIsDark(value => !value);
  }, []);
  const save = useCallback((update: (current: TouristAttraction[]) => TouristAttraction[]) => {
    // This local UI gate is not authentication; there is no backend.
    if (!adminRef.current) throw new Error('Administrator mode is required.');
    const next = normalizeCatalogue(update(catalogueRef.current));
    if (!next) throw new Error('Invalid attraction data or catalogue limit exceeded.');
    const serialized = JSON.stringify(next);
    if (serialized.length > MAX_CATALOGUE_LENGTH) throw new Error('Catalogue storage limit exceeded. Use smaller images.');
    localStorage.setItem(CATALOGUE_STORAGE_KEY, serialized);
    catalogueRef.current = next;
    setAttractions(next);
  }, []);
  const addAttraction = useCallback((attraction: Omit<TouristAttraction, 'id'>) => {
    save(current => [...current, { ...attraction, id: Math.max(0, ...current.map(a => a.id)) + 1 }]);
  }, [save]);
  const updateAttraction = useCallback((id: number, attraction: Omit<TouristAttraction, 'id'>) => {
    save(current => {
      if (!current.some(a => a.id === id)) throw new Error('Attraction not found.');
      return current.map(a => a.id === id ? { ...a, ...attraction, id } : a);
    });
  }, [save]);
  const deleteAttraction = useCallback((id: number) => save(current => {
    if (!current.some(a => a.id === id)) throw new Error('Attraction not found.');
    return current.filter(a => a.id !== id);
  }), [save]);
  const getAttractionById = useCallback((id: number) => attractions.find(a => a.id === id), [attractions]);
  return <AppContext.Provider value={{ attractions, isDark, isAdmin, exitAdmin, toggleTheme, addAttraction, updateAttraction, deleteAttraction, getAttractionById }}>{children}</AppContext.Provider>;
}
export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
