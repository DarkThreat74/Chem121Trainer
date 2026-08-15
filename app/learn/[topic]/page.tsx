"use client";

import { useState, use } from "react";
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
} from "lucide-react";
import { LEARN_CONTENT } from "@/lib/learn-content";
import { TOPICS } from "@/lib/types";

export default function TopicLearnPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic: topicId } = use(params);
  const content = LEARN_CONTENT[topicId];
  const topicInfo = TOPICS.find((t) => t.id === topicId);

  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffled, setShuffled] = useState(content?.vocabulary || []);
  const [revealedSteps, setRevealedSteps] = useState<number[]>([]);

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
            <span className="text-xs font-bold text-text-tertiary">
              STEP {topicInfo.order}
            </span>
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
          <p className="relative mt-4 text-sm leading-relaxed text-text-secondary sm:text-base">
            {content.intro}
          </p>
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
                    <h3 className="font-semibold text-text">{concept.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                      {concept.body}
                    </p>
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
                  <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                    {formula.name}
                  </p>
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
                  <p className="text-sm font-semibold leading-snug sm:text-base">
                    {example.problem}
                  </p>
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
