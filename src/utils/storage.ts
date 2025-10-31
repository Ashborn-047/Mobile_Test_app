const storage = {
  setItem: (key: string, value: any): void => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key: string): any => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  },
  clear: (): void => {
    localStorage.clear();
  },

  // ✅ Legacy aliases (for compatibility)
  set<T = any>(key: string, value: T): void {
    this.setItem(key, value);
  },
  get<T = any>(key: string): T | null {
    return this.getItem(key);
  },
};

export { storage };
export default storage;
