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

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Test the current voice
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

  // Stop any speech when closing
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
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          />

          {/* Panel — bottom sheet on mobile, centered modal on desktop */}
          <motion.div
            initial={{ y: "100%", opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.5 }}
            transition={{ type: "spring", stiffness: 400, damping: 38 }}
            className="fixed inset-x-0 bottom-0 z-[70] mx-auto max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-border bg-bg-card safe-bottom sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:border"
          >
            {/* Drag handle (mobile only) */}
            <div className="flex justify-center pt-3 sm:hidden">
              <div className="h-1.5 w-10 rounded-full bg-border-strong" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3 pt-4">
              <div className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5 text-accent" />
                <h2 className="text-lg font-bold">Settings</h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close settings"
                className="rounded-lg p-1.5 text-text-tertiary transition hover:bg-bg-hover hover:text-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 px-5 pb-8">
              {/* ─── Theme ─── */}
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <Sun className="h-4 w-4 text-text-tertiary" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-text-tertiary">
                    Appearance
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => updateSettings({ theme: "dark" })}
                    className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-medium transition-all ${
                      settings.theme === "dark"
                        ? "border-accent bg-accent-muted text-accent"
                        : "border-border bg-bg-input text-text-secondary hover:border-border-strong"
                    }`}
                  >
                    <Moon className="h-4 w-4" />
                    Dark
                  </button>
                  <button
                    onClick={() => updateSettings({ theme: "light" })}
                    className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-medium transition-all ${
                      settings.theme === "light"
                        ? "border-accent bg-accent-muted text-accent"
                        : "border-border bg-bg-input text-text-secondary hover:border-border-strong"
                    }`}
                  >
                    <Sun className="h-4 w-4" />
                    Light
                  </button>
                </div>
              </section>

              {/* ─── Voice Selection ─── */}
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <Mic2 className="h-4 w-4 text-text-tertiary" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-text-tertiary">
                    Narration Voice
                  </h3>
                </div>
                <div className="space-y-2">
                  {/* Auto option */}
                  <button
                    onClick={() => updateSettings({ voiceURI: null })}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                      settings.voiceURI === null
                        ? "border-accent bg-accent-muted"
                        : "border-border bg-bg-input hover:border-border-strong"
                    }`}
                  >
                    <span className={settings.voiceURI === null ? "font-medium text-accent" : "text-text-secondary"}>
                      Auto (best available)
                    </span>
                    {settings.voiceURI === null && (
                      <span className="text-xs text-accent">Selected</span>
                    )}
                  </button>

                  {/* Voice list */}
                  {voices.length > 0 ? (
                    <div className="max-h-48 overflow-y-auto rounded-xl border border-border">
                      {voices.map((voice) => (
                        <button
                          key={voice.voiceURI}
                          onClick={() => updateSettings({ voiceURI: voice.voiceURI })}
                          className={`flex w-full items-center justify-between border-b border-border-subtle px-4 py-2.5 text-left text-sm transition last:border-0 hover:bg-bg-hover ${
                            settings.voiceURI === voice.voiceURI ? "bg-accent-muted" : ""
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <p className={`truncate ${settings.voiceURI === voice.voiceURI ? "font-medium text-accent" : "text-text"}`}>
                              {voice.name}
                            </p>
                            <p className="text-xs text-text-tertiary">
                              {voice.lang}
                              {voice.localService ? " · Offline" : " · Online"}
                            </p>
                          </div>
                          {settings.voiceURI === voice.voiceURI && (
                            <span className="ml-2 flex-shrink-0 text-xs text-accent">Selected</span>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-xl border border-border bg-bg-input px-4 py-3 text-xs text-text-tertiary">
                      No voices detected. Your browser may still have voices available — try the Auto option.
                    </p>
                  )}

                  {/* Test voice button */}
                  <button
                    onClick={testVoice}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-bg-input py-2.5 text-sm font-medium text-text-secondary transition hover:bg-bg-hover"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Test voice
                  </button>
                </div>
              </section>

              {/* ─── Speed ─── */}
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-text-tertiary" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-text-tertiary">
                    Reading Speed
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-tertiary">Slow</span>
                    <span className="text-sm font-bold text-accent">
                      {settings.rate.toFixed(2)}x
                    </span>
                    <span className="text-xs text-text-tertiary">Fast</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={1.5}
                    step={0.01}
                    value={settings.rate}
                    onChange={(e) => updateSettings({ rate: parseFloat(e.target.value) })}
                    className="w-full accent-accent"
                    style={{ accentColor: "var(--accent)" }}
                  />
                  <div className="flex justify-between gap-2">
                    {[
                      { label: "0.75x", val: 0.75 },
                      { label: "1x", val: 1.0 },
                      { label: "1.25x", val: 1.25 },
                      { label: "1.5x", val: 1.5 },
                    ].map((preset) => (
                      <button
                        key={preset.val}
                        onClick={() => updateSettings({ rate: preset.val })}
                        className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition ${
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
              </section>

              {/* ─── Quick test ─── */}
              <button
                onClick={testVoice}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-hover to-accent py-3 font-semibold text-white transition hover:opacity-90"
              >
                <Volume2 className="h-4 w-4" />
                Preview narration
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
