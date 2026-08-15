"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

export interface Settings {
  voiceURI: string | null; // null = auto-pick best voice
  rate: number; // 0.5 - 1.5
  theme: "dark" | "light";
}

const DEFAULT_SETTINGS: Settings = {
  voiceURI: null,
  rate: 0.92,
  theme: "dark",
};

const STORAGE_KEY = "chem121-settings";

interface SettingsContextValue {
  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => void;
  // Available voices (loaded from browser)
  voices: SpeechSynthesisVoice[];
  // Refresh voices (browsers load them async)
  refreshVoices: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch {}
    setLoaded(true);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings, loaded]);

  // Apply theme class to <html>
  useEffect(() => {
    if (!loaded) return;
    const html = document.documentElement;
    if (settings.theme === "light") {
      html.classList.remove("dark");
      html.classList.add("light");
    } else {
      html.classList.remove("light");
      html.classList.add("dark");
    }
  }, [settings.theme, loaded]);

  // Load available voices
  const refreshVoices = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const v = window.speechSynthesis.getVoices();
    // Filter to English voices, sort by name
    const english = v
      .filter((voice) => voice.lang.startsWith("en"))
      .sort((a, b) => a.name.localeCompare(b.name));
    setVoices(english.length > 0 ? english : v);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    refreshVoices();
    window.speechSynthesis.onvoiceschanged = refreshVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [refreshVoices]);

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, voices, refreshVoices }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    // Fallback for components used outside provider (shouldn't happen)
    return {
      settings: DEFAULT_SETTINGS,
      updateSettings: () => {},
      voices: [],
      refreshVoices: () => {},
    };
  }
  return ctx;
}
