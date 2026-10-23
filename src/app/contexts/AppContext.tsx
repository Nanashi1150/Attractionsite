import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { type TouristAttraction, mockAttractions } from '../types/TouristAttraction';

const STORAGE_KEY = 'kamphaeng-phet.attractions.v2';
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
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (Array.isArray(saved) && saved.every(a => a && typeof a.id === 'number' && typeof a.name === 'string' && typeof a.place_description === 'string' && typeof a.entrance_fee === 'number' && typeof a.open_hours === 'string')) return saved;
  } catch { /* Fall back to the verified catalogue. */ }
  return mockAttractions;
}
export function AppProvider({ children }: { children: ReactNode }) {
  const [attractions, setAttractions] = useState(loadAttractions);
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem('theme') === 'dark'; } catch { return false; }
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const clickSequence = useRef({ count: 0, last: 0 });
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
      if (sequence.count >= 10) { sequence.count = 0; setIsAdmin(true); }
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [isAdmin]);
  const exitAdmin = useCallback(() => {
    clickSequence.current = { count: 0, last: 0 };
    setIsAdmin(false);
  }, []);
  const toggleTheme = useCallback(() => {
    setIsDark(value => !value);
  }, []);
  const save = useCallback((next: TouristAttraction[]) => {
    // This local UI gate is not authentication; there is no backend.
    if (!isAdmin) throw new Error('Administrator mode is required.');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setAttractions(next);
  }, [isAdmin]);
  const addAttraction = useCallback((attraction: Omit<TouristAttraction, 'id'>) => {
    save([...attractions, { ...attraction, id: Math.max(0, ...attractions.map(a => a.id)) + 1 }]);
  }, [attractions, save]);
  const updateAttraction = useCallback((id: number, attraction: Omit<TouristAttraction, 'id'>) => {
    save(attractions.map(a => a.id === id ? { ...a, ...attraction, id } : a));
  }, [attractions, save]);
  const deleteAttraction = useCallback((id: number) => save(attractions.filter(a => a.id !== id)), [attractions, save]);
  const getAttractionById = useCallback((id: number) => attractions.find(a => a.id === id), [attractions]);
  return <AppContext.Provider value={{ attractions, isDark, isAdmin, exitAdmin, toggleTheme, addAttraction, updateAttraction, deleteAttraction, getAttractionById }}>{children}</AppContext.Provider>;
}
export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
