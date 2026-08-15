"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  RotateCcw,
  Shuffle,
  Lightbulb,
  GraduationCap,
  FlaskConical,
  Calculator,
  Volume2,
  Square,
  Settings as SettingsIcon,
} from "lucide-react";
import { LEARN_CONTENT, type Diagram } from "@/lib/learn-content";
import { TOPICS } from "@/lib/types";
import { useSettings } from "@/components/SettingsProvider";
import SettingsPanel from "@/components/SettingsPanel";

// ─── Text-to-Speech helpers ─────────────────────────────────────────────────
// Clean up text for natural narration: strip ASCII art, expand symbols, etc.
function cleanTextForSpeech(raw: string): string {
  return raw
    // Replace common math/chemistry symbols with spoken equivalents
    .replace(/→/g, " becomes ")
    .replace(/←/g, " becomes ")
    .replace(/×/g, " times ")
    .replace(/÷/g, " divided by ")
    .replace(/·/g, " times ")
    .replace(/≈/g, " approximately ")
    .replace(/≤/g, " less than or equal to ")
    .replace(/≥/g, " greater than or equal to ")
    .replace(/≠/g, " not equal to ")
    .replace(/±/g, " plus or minus ")
    .replace(/°/g, " degrees ")
    .replace(/µ/g, " micro ")
    .replace(/Ω/g, " ohm ")
    // Scientific notation: 6.02 x 10^23 -> "6.02 times 10 to the 23rd"
    .replace(/(\d+\.?\d*)\s*[xX]\s*10\^?(\d+)/g, "$1 times 10 to the power of $2")
    .replace(/10\^(\d+)/g, "10 to the power of $1")
    // Subscripts/superscripts in chemical formulas: H2O -> "H 2 O"
    .replace(/([A-Z])(\d)/g, "$1 $2 ")
    // Remove ASCII art lines (lines with mostly symbols/brackets)
    .split("\n")
    .filter((line) => {
      const stripped = line.trim();
      if (stripped.length === 0) return true; // keep blank lines as pauses
      const symbolChars = (stripped.match(/[\[\]{}|#<>+\-=*_^|/\\().~]/g) || []).length;
      const ratio = symbolChars / stripped.length;
      // If more than 40% symbols, it's probably ASCII art — skip it
      return ratio < 0.4;
    })
    .join(". ")
    // Clean up multiple spaces and periods
    .replace(/\s+/g, " ")
    .replace(/\.\s*\.\s*/g, ". ")
    .replace(/^\s*\.+\s*/g, "")
    .trim();
}

// Pick the best available voice for natural narration
function pickBestVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;

  // Preference order — these are the most natural-sounding voices available
  // without an API key
  const preferred = [
    // Google voices (Chrome desktop) — very natural
    "Google US English",
    // Microsoft Natural voices (Edge) — extremely natural
    "Microsoft Aria Online (Natural) - English (United States)",
    "Microsoft Jenny Online (Natural) - English (United States)",
    "Microsoft Guy Online (Natural) - English (United States)",
    "Microsoft Aria",
    "Microsoft Jenny",
    "Microsoft Guy",
    // Apple voices (Safari/iOS) — decent
    "Samantha",
    "Allison",
    "Ava",
    // Fallback: any en-US or en voice
  ];

  for (const name of preferred) {
    const match = voices.find((v) => v.name === name);
    if (match) return match;
  }

  // Try to find any natural/premium voice
  const natural = voices.find(
    (v) => v.lang.startsWith("en") && /natural|premium|enhanced|neural/i.test(v.name)
  );
  if (natural) return natural;

  // Fall back to any en-US voice
  const enUS = voices.find((v) => v.lang === "en-US");
  if (enUS) return enUS;

  // Last resort: any English voice
  const en = voices.find((v) => v.lang.startsWith("en"));
  return en || voices[0];
}

// Split text into sentence-sized chunks for natural pausing
function splitIntoChunks(text: string, maxLen = 200): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + sentence).length > maxLen && current) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current += sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

// Compact text-to-speech button using the browser's built-in Web Speech API
function SpeakButton({ text, color }: { text: string; color: string }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const cancelledRef = useRef(false);
  const { settings, voices } = useSettings();

  // Resolve the voice to use: user-selected or auto-pick best
  const getVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (typeof window === "undefined" || !window.speechSynthesis) return null;
    const allVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();

    // If user selected a specific voice, use it
    if (settings.voiceURI) {
      const selected = allVoices.find((v) => v.voiceURI === settings.voiceURI);
      if (selected) return selected;
    }

    // Auto-pick best voice
    return pickBestVoice(allVoices);
  }, [settings.voiceURI, voices]);

  const handleSpeak = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // If already speaking, stop it
    if (isSpeaking) {
      cancelledRef.current = true;
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Cancel any ongoing speech first
    cancelledRef.current = false;
    window.speechSynthesis.cancel();

    const cleaned = cleanTextForSpeech(text);
    if (!cleaned) return;

    const chunks = splitIntoChunks(cleaned);
    const voice = getVoice();

    let chunkIndex = 0;

    const speakNext = () => {
      if (cancelledRef.current) {
        setIsSpeaking(false);
        return;
      }
      if (chunkIndex >= chunks.length) {
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[chunkIndex]);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      }
      utterance.rate = settings.rate;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => {
        chunkIndex++;
        // Small natural pause between chunks
        setTimeout(speakNext, 150);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    };

    setIsSpeaking(true);
    speakNext();
  }, [text, isSpeaking, settings.rate, getVoice]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <button
      onClick={handleSpeak}
      aria-label={isSpeaking ? "Stop reading" : "Read aloud"}
      className="flex flex-shrink-0 items-center justify-center rounded-lg p-1.5 transition-all duration-200 hover:bg-bg-hover"
      style={{ color: isSpeaking ? color : undefined }}
    >
      {isSpeaking ? (
        <motion.span
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="flex items-center justify-center"
        >
          <Square className="h-3.5 w-3.5 fill-current" />
        </motion.span>
      ) : (
        <Volume2 className="h-4 w-4 text-text-tertiary" />
      )}
    </button>
  );
}

function DiagramRenderer({ diagram, color }: { diagram: Diagram; color: string }) {
  if (diagram.type === "visual" && diagram.visual) {
    return (
      <div className="mt-3 overflow-x-auto rounded-xl border border-border-subtle bg-bg-input p-4">
        {diagram.title && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            {diagram.title}
          </p>
        )}
        <pre
          className="text-xs leading-relaxed text-text-secondary sm:text-sm"
          style={{ fontFamily: "ui-monospace, 'JetBrains Mono', monospace" }}
        >
          {diagram.visual}
        </pre>
        {diagram.caption && (
          <p className="mt-2 text-xs italic text-text-tertiary">
            {diagram.caption}
          </p>
        )}
      </div>
    );
  }

  if (diagram.type === "table" && diagram.headers && diagram.rows) {
    return (
      <div className="mt-3 overflow-x-auto rounded-xl border border-border-subtle">
        {diagram.title && (
          <p className="border-b border-border-subtle bg-bg-input px-4 py-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            {diagram.title}
          </p>
        )}
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: `${color}10` }}>
              {diagram.headers.map((h, i) => (
                <th
                  key={i}
                  className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-text-tertiary sm:px-4"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {diagram.rows.map((row, i) => (
              <tr
                key={i}
                className={i % 2 === 0 ? "bg-bg-card" : "bg-bg-input/50"}
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className="px-3 py-2 text-text-secondary sm:px-4"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (diagram.type === "comparison" && diagram.left && diagram.right) {
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {[diagram.left, diagram.right].map((side, idx) => (
          <div
            key={idx}
            className="rounded-xl border p-4"
            style={{
              borderColor: idx === 0 ? `${color}30` : `${color}30`,
              backgroundColor: idx === 0 ? `${color}08` : `${color}08`,
            }}
          >
            <p
              className="mb-2 text-sm font-bold uppercase tracking-wider"
              style={{ color }}
            >
              {side.title}
            </p>
            <ul className="space-y-1.5">
              {side.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  if (diagram.type === "flowchart" && diagram.nodes) {
    return (
      <div className="mt-3 space-y-2 rounded-xl border border-border-subtle bg-bg-input p-4">
        {diagram.title && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            {diagram.title}
          </p>
        )}
        {diagram.nodes.map((node, i) => {
          const depth = node.label === "MATTER" ? 0 :
            ["Pure Substances", "Mixtures"].includes(node.label) ? 1 :
            ["Elements", "Compounds", "Homogeneous", "Heterogeneous"].includes(node.label) ? 2 : 0;
          return (
            <div key={i} style={{ marginLeft: `${depth * 24}px` }}>
              <div
                className="inline-block rounded-lg px-3 py-1.5 text-sm font-semibold"
                style={{
                  backgroundColor: `${color}15`,
                  color,
                  border: `1px solid ${color}30`,
                }}
              >
                {node.label}
              </div>
              {node.note && (
                <p className="mt-1 text-xs text-text-tertiary">{node.note}</p>
              )}
              {node.children && node.children.length > 0 && (
                <div className="mt-1 pl-4 text-text-tertiary">
                  {node.children.map((c, j) => (
                    <span key={j} className="text-xs">
                      {j > 0 && " | "}
                      <span style={{ color }}>{c}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  if (diagram.type === "steps" && diagram.steps) {
    return (
      <div className="mt-3 space-y-2">
        {diagram.steps.map((step, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-border-subtle bg-bg-input p-3"
          >
            <span
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: color }}
            >
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-semibold">{step.label}</p>
              <p className="mt-0.5 font-mono text-xs text-text-secondary">
                {step.visual}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export default function TopicLearnPage({
  params,
}: {
  params: { topic: string };
}) {
  const { topic: topicId } = params;
  const content = LEARN_CONTENT[topicId];
  const topicInfo = TOPICS.find((t) => t.id === topicId);

  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffled, setShuffled] = useState(content?.vocabulary || []);
  const [revealedSteps, setRevealedSteps] = useState<number[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (!content || !topicInfo) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h2 className="text-xl font-bold">Topic not found</h2>
        <Link
          href="/dashboard"
          className="mt-6 rounded-xl bg-accent px-6 py-3 font-semibold text-white"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  function nextCard() {
    setFlipped(false);
    setTimeout(() => {
      setFlashcardIndex((i) => (i + 1) % shuffled.length);
    }, 200);
  }

  function prevCard() {
    setFlipped(false);
    setTimeout(() => {
      setFlashcardIndex((i) => (i - 1 + shuffled.length) % shuffled.length);
    }, 200);
  }

  function shuffleCards() {
    setFlipped(false);
    setTimeout(() => {
      const copy = [...content.vocabulary].sort(() => Math.random() - 0.5);
      setShuffled(copy);
      setFlashcardIndex(0);
    }, 200);
  }

  const currentCard = shuffled[flashcardIndex];
  const color = content.color;

  return (
    <div className="min-h-screen safe-top safe-bottom">
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border-subtle bg-bg/80 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-sm text-text-secondary transition hover:text-text"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-text-tertiary">
                STEP {topicInfo.order}
              </span>
              <button
                onClick={() => setSettingsOpen(true)}
                aria-label="Settings"
                className="rounded-lg p-1.5 text-text-tertiary transition hover:bg-bg-hover hover:text-text"
              >
                <SettingsIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6 lg:py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-bg-card to-bg-elevated p-5 sm:p-7"
        >
          <motion.div
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl"
            style={{ backgroundColor: `${color}15` }}
          />
          <div className="relative flex items-start gap-4">
            <div
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl sm:h-14 sm:w-14"
              style={{ backgroundColor: `${color}20` }}
            >
              <BookOpen className="h-6 w-6 sm:h-7 sm:w-7" style={{ color }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {content.title}
              </h1>
              <p className="mt-1 text-sm text-text-secondary sm:text-base">
                {content.subtitle}
              </p>
            </div>
          </div>
          <div className="relative mt-4 flex items-start gap-2">
            <p className="flex-1 text-sm leading-relaxed text-text-secondary sm:text-base">
              {content.intro}
            </p>
            <SpeakButton text={content.intro} color={color} />
          </div>
        </motion.div>

        {/* Concepts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8"
        >
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5" style={{ color }} />
            <h2 className="text-lg font-bold sm:text-xl">Key Concepts</h2>
          </div>
          <div className="space-y-3">
            {content.concepts.map((concept, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="rounded-2xl border border-border bg-bg-card p-4 sm:p-5"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                    style={{ backgroundColor: `${color}15`, color }}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <h3 className="font-semibold text-text">{concept.title}</h3>
                      <SpeakButton
                        text={`${concept.title}. ${concept.body}${concept.example ? `. Example: ${concept.example}` : ""}${concept.misconception ? `. Common mistake: ${concept.misconception}` : ""}`}
                        color={color}
                      />
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                      {concept.body}
                    </p>
                    {concept.diagram && (
                      <DiagramRenderer diagram={concept.diagram} color={color} />
                    )}
                    {concept.example && (
                      <div className="mt-3 rounded-xl border border-border-subtle bg-bg-input p-3">
                        <p className="text-xs font-medium text-text-tertiary">
                          Example
                        </p>
                        <p className="mt-1 text-sm text-text-secondary">
                          {concept.example}
                        </p>
                      </div>
                    )}
                    {concept.misconception && (
                      <div className="mt-3 rounded-xl border border-warn/20 bg-warn/5 p-3">
                        <p className="text-xs font-semibold text-warn">
                          Common Mistake
                        </p>
                        <p className="mt-1 text-sm text-text-secondary">
                          {concept.misconception}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Formulas */}
        {content.formulas && content.formulas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <div className="mb-4 flex items-center gap-2">
              <Calculator className="h-5 w-5" style={{ color }} />
              <h2 className="text-lg font-bold sm:text-xl">Key Formulas</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {content.formulas.map((formula, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                  className="rounded-2xl border border-border bg-bg-card p-4"
                >
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                      {formula.name}
                    </p>
                    <SpeakButton
                      text={`${formula.name}. ${formula.formula}. ${formula.desc}${formula.example ? `. Example: ${formula.example}` : ""}`}
                      color={color}
                    />
                  </div>
                  <p
                    className="mt-2 font-mono text-base font-bold sm:text-lg"
                    style={{ color }}
                  >
                    {formula.formula}
                  </p>
                  <p className="mt-1.5 text-xs text-text-secondary">
                    {formula.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Worked Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <div className="mb-4 flex items-center gap-2">
            <GraduationCap className="h-5 w-5" style={{ color }} />
            <h2 className="text-lg font-bold sm:text-xl">Worked Examples</h2>
          </div>
          <div className="space-y-4">
            {content.workedExamples.map((example, idx) => {
              const revealed = revealedSteps[idx] || 0;
              const isFullyRevealed = revealed >= example.steps.length;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-bg-card p-4 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold leading-snug sm:text-base">
                      {example.problem}
                    </p>
                    <SpeakButton
                      text={`${example.problem}. ${example.steps.map((s, i) => `Step ${i + 1}: ${s.label}. ${s.detail}`).join(". ")}. The answer is ${example.answer}.`}
                      color={color}
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    {example.steps.map((step, i) => (
                      <div
                        key={i}
                        className={`overflow-hidden transition-all duration-300 ${
                          i < revealed
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="flex gap-3 rounded-xl border border-border-subtle bg-bg-input p-3">
                          <span
                            className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                            style={{ backgroundColor: color }}
                          >
                            {i + 1}
                          </span>
                          <div>
                            <p className="text-sm font-semibold">{step.label}</p>
                            <p className="mt-0.5 font-mono text-xs text-text-secondary sm:text-sm">
                              {step.detail}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {isFullyRevealed && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 flex items-center gap-2 rounded-xl border border-ok/20 bg-ok/5 p-3"
                    >
                      <Check className="h-4 w-4 flex-shrink-0 text-ok" />
                      <span className="text-sm font-semibold text-ok">
                        {example.answer}
                      </span>
                    </motion.div>
                  )}
                  <div className="mt-3 flex gap-2">
                    {!isFullyRevealed && (
                      <button
                        onClick={() =>
                          setRevealedSteps((prev) => ({
                            ...prev,
                            [idx]: (prev[idx] || 0) + 1,
                          }))
                        }
                        className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                        style={{ backgroundColor: color }}
                      >
                        <ChevronDown className="h-4 w-4" />
                        {revealed === 0
                          ? "Show step-by-step solution"
                          : "Next step"}
                      </button>
                    )}
                    {revealed > 0 && (
                      <button
                        onClick={() =>
                          setRevealedSteps((prev) => ({ ...prev, [idx]: 0 }))
                        }
                        className="flex items-center gap-1.5 rounded-lg border border-border bg-bg-input px-4 py-2 text-sm font-medium text-text-secondary transition hover:bg-bg-hover"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Vocabulary Flashcards */}
        {content.vocabulary.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <div className="mb-4 flex items-center gap-2">
              <FlaskConical className="h-5 w-5" style={{ color }} />
              <h2 className="text-lg font-bold sm:text-xl">Vocabulary</h2>
            </div>
            <div className="rounded-2xl border border-border bg-bg-card p-4 sm:p-6">
              <div
                onClick={() => setFlipped(!flipped)}
                className="relative h-48 cursor-pointer"
                style={{ perspective: "1000px" }}
              >
                <motion.div
                  animate={{ rotateY: flipped ? 180 : 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative h-full w-full"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Front */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-border bg-bg-input p-6 text-center"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <p className="text-xs uppercase tracking-wider text-text-tertiary">
                      Term
                    </p>
                    <p className="mt-2 text-xl font-bold">{currentCard.term}</p>
                    <p className="mt-3 text-xs text-text-tertiary">Tap to flip</p>
                  </div>
                  {/* Back */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border p-6 text-center"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      borderColor: `${color}40`,
                      backgroundColor: `${color}08`,
                    }}
                  >
                    <p
                      className="text-xs uppercase tracking-wider"
                      style={{ color }}
                    >
                      Definition
                    </p>
                    <p className="mt-2 text-sm font-medium text-text-secondary">
                      {currentCard.def}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Flashcard controls */}
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={prevCard}
                  className="flex items-center gap-1 rounded-lg border border-border bg-bg-input px-3 py-2 text-sm font-medium text-text-secondary transition hover:bg-bg-hover"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Prev
                </button>
                <span className="text-xs text-text-tertiary">
                  {flashcardIndex + 1} / {shuffled.length}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={shuffleCards}
                    className="flex items-center gap-1 rounded-lg border border-border bg-bg-input px-3 py-2 text-sm font-medium text-text-secondary transition hover:bg-bg-hover"
                  >
                    <Shuffle className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={nextCard}
                    className="flex items-center gap-1 rounded-lg border border-border bg-bg-input px-3 py-2 text-sm font-medium text-text-secondary transition hover:bg-bg-hover"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Start Quiz CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 mb-4"
        >
          <Link
            href={`/practice/${topicId}`}
            className="group flex items-center justify-between rounded-2xl p-5 font-semibold text-white transition-all duration-300 hover:shadow-lg"
            style={{
              background: `linear-gradient(to right, ${color}dd, ${color})`,
            }}
          >
            <div className="flex items-center gap-3">
              <FlaskConical className="h-5 w-5" />
              <span>Ready to practice? Start the quiz</span>
            </div>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
