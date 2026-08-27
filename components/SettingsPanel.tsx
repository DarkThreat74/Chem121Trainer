"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Settings as SettingsIcon,
  Volume2,
  Sun,
  Moon,
  Gauge,
  Mic2,
  Play,
  Check,
} from "lucide-react";
import { useSettings } from "@/components/SettingsProvider";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const { settings, updateSettings, voices } = useSettings();
  const [testText] = useState(
    "Chemistry is the study of matter and the changes it undergoes. Let's learn together."
  );

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const testVoice = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(testText);
    if (settings.voiceURI) {
      const voice = voices.find((v) => v.voiceURI === settings.voiceURI);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      }
    }
    utterance.rate = settings.rate;
    window.speechSynthesis.speak(utterance);
  }, [settings.voiceURI, settings.rate, voices, testText]);

  useEffect(() => {
    if (!open && typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md"
          />

          {/* Panel */}
          <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4">
            <motion.div
              initial={{ y: "100%", opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: "100%", opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              className="relative flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-[28px] border border-border bg-bg-card shadow-2xl safe-bottom sm:max-w-lg sm:rounded-[28px]"
            >
              {/* Drag handle (mobile) */}
              <div className="flex justify-center pt-3 sm:hidden">
                <div className="h-1.5 w-10 rounded-full bg-border-strong" />
              </div>

              {/* Header with gradient accent */}
              <div className="relative flex items-center justify-between border-b border-border-subtle px-6 pb-4 pt-5">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-purple-500/20">
                    <SettingsIcon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold tracking-tight">Settings</h2>
                    <p className="text-xs text-text-tertiary">Customize your learning</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close settings"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-text-tertiary transition hover:bg-bg-hover hover:text-text"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">

                {/* ─── Appearance Card ─── */}
                <div className="rounded-2xl border border-border bg-bg-elevated/50 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-warn/10">
                      <Sun className="h-3.5 w-3.5 text-warn" />
                    </div>
                    <h3 className="text-sm font-bold tracking-tight">Appearance</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => updateSettings({ theme: "dark" })}
                      className={`group relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                        settings.theme === "dark"
                          ? "border-accent bg-accent/10"
                          : "border-border bg-bg-input hover:border-border-strong"
                      }`}
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                        settings.theme === "dark" ? "bg-accent/20" : "bg-bg-hover"
                      }`}>
                        <Moon className={`h-5 w-5 transition ${settings.theme === "dark" ? "text-accent" : "text-text-tertiary"}`} />
                      </div>
                      <span className={`text-sm font-semibold ${settings.theme === "dark" ? "text-accent" : "text-text-secondary"}`}>
                        Dark
                      </span>
                      {settings.theme === "dark" && (
                        <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </button>
                    <button
                      onClick={() => updateSettings({ theme: "light" })}
                      className={`group relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                        settings.theme === "light"
                          ? "border-accent bg-accent/10"
                          : "border-border bg-bg-input hover:border-border-strong"
                      }`}
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                        settings.theme === "light" ? "bg-accent/20" : "bg-bg-hover"
                      }`}>
                        <Sun className={`h-5 w-5 transition ${settings.theme === "light" ? "text-accent" : "text-text-tertiary"}`} />
                      </div>
                      <span className={`text-sm font-semibold ${settings.theme === "light" ? "text-accent" : "text-text-secondary"}`}>
                        Light
                      </span>
                      {settings.theme === "light" && (
                        <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* ─── Voice Card ─── */}
                <div className="rounded-2xl border border-border bg-bg-elevated/50 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10">
                      <Mic2 className="h-3.5 w-3.5 text-purple-400" />
                    </div>
                    <h3 className="text-sm font-bold tracking-tight">Narration Voice</h3>
                  </div>

                  <div className="space-y-2">
                    {/* Auto option */}
                    <button
                      onClick={() => updateSettings({ voiceURI: null })}
                      className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-3 text-left transition-all ${
                        settings.voiceURI === null
                          ? "border-accent bg-accent/10"
                          : "border-border bg-bg-input hover:border-border-strong"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${settings.voiceURI === null ? "bg-accent/20" : "bg-bg-hover"}`}>
                          <Volume2 className={`h-4 w-4 ${settings.voiceURI === null ? "text-accent" : "text-text-tertiary"}`} />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${settings.voiceURI === null ? "text-accent" : "text-text"}`}>
                            Auto
                          </p>
                          <p className="text-xs text-text-tertiary">Best available voice</p>
                        </div>
                      </div>
                      {settings.voiceURI === null && (
                        <Check className="h-4 w-4 text-accent" />
                      )}
                    </button>

                    {/* Voice list */}
                    {voices.length > 0 && (
                      <div className="max-h-44 overflow-y-auto rounded-xl border border-border bg-bg-input/50">
                        {voices.map((voice) => (
                          <button
                            key={voice.voiceURI}
                            onClick={() => updateSettings({ voiceURI: voice.voiceURI })}
                            className={`flex w-full items-center justify-between border-b border-border-subtle px-3.5 py-2.5 text-left transition last:border-0 hover:bg-bg-hover ${
                              settings.voiceURI === voice.voiceURI ? "bg-accent/5" : ""
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <p className={`truncate text-sm ${settings.voiceURI === voice.voiceURI ? "font-medium text-accent" : "text-text"}`}>
                                {voice.name}
                              </p>
                              <p className="text-xs text-text-tertiary">
                                {voice.lang}
                                {voice.localService ? " · Offline" : " · Online"}
                              </p>
                            </div>
                            {settings.voiceURI === voice.voiceURI && (
                              <Check className="ml-2 flex-shrink-0 h-4 w-4 text-accent" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {voices.length === 0 && (
                      <p className="rounded-xl border border-border bg-bg-input px-3.5 py-3 text-xs text-text-tertiary">
                        No voices detected. Try the Auto option — your browser may still have voices.
                      </p>
                    )}
                  </div>
                </div>

                {/* ─── Speed Card ─── */}
                <div className="rounded-2xl border border-border bg-bg-elevated/50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
                        <Gauge className="h-3.5 w-3.5 text-accent" />
                      </div>
                      <h3 className="text-sm font-bold tracking-tight">Reading Speed</h3>
                    </div>
                    <span className="rounded-lg bg-accent/10 px-2.5 py-1 text-sm font-bold text-accent">
                      {settings.rate.toFixed(2)}x
                    </span>
                  </div>

                  {/* Slider */}
                  <div className="mb-3">
                    <input
                      type="range"
                      min={0.5}
                      max={1.5}
                      step={0.01}
                      value={settings.rate}
                      onChange={(e) => updateSettings({ rate: parseFloat(e.target.value) })}
                      className="w-full"
                      style={{ accentColor: "var(--accent)" }}
                    />
                    <div className="mt-1 flex justify-between text-xs text-text-tertiary">
                      <span>0.5x</span>
                      <span>1.0x</span>
                      <span>1.5x</span>
                    </div>
                  </div>

                  {/* Presets */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: "0.75x", val: 0.75 },
                      { label: "1x", val: 1.0 },
                      { label: "1.25x", val: 1.25 },
                      { label: "1.5x", val: 1.5 },
                    ].map((preset) => (
                      <button
                        key={preset.val}
                        onClick={() => updateSettings({ rate: preset.val })}
                        className={`rounded-lg py-2 text-xs font-semibold transition ${
                          Math.abs(settings.rate - preset.val) < 0.005
                            ? "bg-accent text-white"
                            : "bg-bg-input text-text-tertiary hover:bg-bg-hover"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ─── Preview button ─── */}
                <button
                  onClick={testVoice}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent-hover to-accent py-3.5 font-semibold text-white transition hover:opacity-90 glow-accent"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Preview narration
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
