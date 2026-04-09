const STORAGE_KEY = "groq-api-key";

export function getGroqKey(): string | null {
  if (typeof window === "undefined") return null;
  const key = localStorage.getItem(STORAGE_KEY)?.trim();
  return key || null;
}

export function setGroqKey(key: string): void {
  localStorage.setItem(STORAGE_KEY, key.trim());
}

export function removeGroqKey(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function isValidGroqKeyFormat(key: string): boolean {
  return /^gsk_[a-zA-Z0-9]{20,}$/.test(key.trim());
}
