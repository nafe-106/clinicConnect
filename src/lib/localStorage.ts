export function getFromLocalStorage(key: string, fallback: any = null): any {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function setToLocalStorage(key: string, value: any): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
}

export function removeFromLocalStorage(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}