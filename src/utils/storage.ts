const storage = {
  setItem: (key: string, value: unknown): void => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: <T>(key: string): T | null => {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  },
  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  },
  clear: (): void => {
    localStorage.clear();
  },

  // ✅ Legacy aliases (for compatibility)
  set<T>(key: string, value: T): void {
    this.setItem(key, value);
  },
  get<T>(key: string): T | null {
    return this.getItem<T>(key);
  },
};

export { storage };
export default storage;
