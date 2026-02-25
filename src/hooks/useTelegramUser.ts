import { useState, useEffect } from "react";

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: { user?: TelegramUser };
      };
    };
  }
}

export function useTelegramUser(): TelegramUser | null {
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    const u = window.Telegram?.WebApp?.initDataUnsafe?.user ?? null;
    setUser(u ?? null);
  }, []);

  return user;
}
