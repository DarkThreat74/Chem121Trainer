"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Question, QuizContent } from "@/lib/types";
import { Check, X, CornerDownRight, Lightbulb, Zap } from "lucide-react";

interface QuizCardProps {
  question: Question;
  onAnswer: (isCorrect: boolean, explanation: string) => void;
  disabled: boolean;
}

const DIFFICULTY_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: "Easy", color: "#34d399" },
  2: { label: "Medium", color: "#fbbf24" },
  3: { label: "Hard", color: "#f87171" },
};

export default function QuizCard({ question, onAnswer, disabled }: QuizCardProps) {
  const content = question.content as QuizContent;
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = useCallback(() => {
    if (disabled) return;

    let isCorrect = false;
    let answer = "";

    if (content.answer_type === "multiple-choice") {
      answer = selectedChoice || "";
      isCorrect = answer === String(content.correct_answer);
    } else if (content.answer_type === "numeric") {
      const parsed = parseFloat(userAnswer);
      isCorrect = !isNaN(parsed) && parsed === Number(content.correct_answer);
      answer = userAnswer;
    } else {
      answer = userAnswer.trim().toLowerCase();
      isCorrect = answer === String(content.correct_answer).trim().toLowerCase();
    }

    const explanation = isCorrect
      ? content.explanation
      : `Correct answer: ${content.correct_answer}. ${content.explanation}`;

    onAnswer(isCorrect, explanation);
  }, [disabled, content, selectedChoice, userAnswer, onAnswer]);

  // Keyboard shortcuts for multiple choice
  useEffect(() => {
    if (disabled || content.answer_type !== "multiple-choice") return;
    function handleKey(e: KeyboardEvent) {
      if (e.key >= "1" && e.key <= "9") {
        const idx = parseInt(e.key) - 1;
        if (content.choices && idx < content.choices.length) {
          setSelectedChoice(content.choices[idx]);
        }
      } else if (e.key === "Enter" && selectedChoice) {
        handleSubmit();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [disabled, content.answer_type, content.choices, selectedChoice, handleSubmit]);

  // Enter to submit for text/numeric
  useEffect(() => {
    if (disabled || content.answer_type === "multiple-choice") return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Enter" && userAnswer.trim()) {
        handleSubmit();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [disabled, content.answer_type, userAnswer, handleSubmit]);

  const diffInfo = DIFFICULTY_LABELS[question.difficulty] || DIFFICULTY_LABELS[1];
  const hint = content.explanation.split(".")[0] + ".";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-3xl border border-border bg-bg-card p-6"
    >
      {/* Topic tag + difficulty */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-bg-input px-2.5 py-1 text-xs font-medium capitalize text-text-secondary">
            {question.topic.replace(/-/g, " ")}
          </span>
          <span className="text-text-tertiary">·</span>
          <span className="text-xs capitalize text-text-tertiary">
            {question.subtopic.replace(/-/g, " ")}
          </span>
        </div>
        <div
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold"
          style={{ backgroundColor: `${diffInfo.color}15`, color: diffInfo.color }}
        >
          <Zap className="h-3 w-3" />
          {diffInfo.label}
        </div>
      </div>

      {/* Question */}
      <p className="text-xl font-semibold leading-snug tracking-tight">
        {content.prompt}
      </p>

      {/* Answer area */}
      <div className="mt-6">
        {content.answer_type === "multiple-choice" && content.choices && (
          <div className="space-y-2.5">
            {content.choices.map((choice, i) => {
              const isSelected = selectedChoice === choice;
              const isCorrectChoice =
                disabled && choice === String(content.correct_answer);
              const isWrongChoice =
                disabled && isSelected && choice !== String(content.correct_answer);

              return (
                <motion.button
                  key={i}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelectedChoice(choice)}
                  whileTap={{ scale: 0.98 }}
                  animate={
                    isWrongChoice
                      ? { x: [0, -6, 6, -4, 4, 0] }
                      : isCorrectChoice
                      ? { scale: [1, 1.02, 1] }
                      : {}
                  }
                  transition={{ duration: 0.4 }}
                  className={`group flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-200 ${
                    isCorrectChoice
                      ? "border-ok/40 bg-ok/10"
                      : isWrongChoice
                      ? "border-err/40 bg-err/10"
                      : isSelected
                      ? "border-accent bg-accent/10"
                      : "border-border bg-bg-input hover:border-border-strong hover:bg-bg-hover"
                  } disabled:cursor-default`}
                >
                  <div
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border-2 text-xs font-bold transition ${
                      isCorrectChoice
                        ? "border-ok bg-ok text-bg"
                        : isWrongChoice
                        ? "border-err bg-err text-bg"
                        : isSelected
                        ? "border-accent bg-accent text-white"
                        : "border-border text-text-tertiary group-hover:border-border-strong"
                    }`}
                  >
                    {isCorrectChoice ? (
                      <Check className="h-4 w-4" />
                    ) : isWrongChoice ? (
                      <X className="h-4 w-4" />
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </div>
                  <span className="flex-1 text-sm font-medium">{choice}</span>
                  {!disabled && (
                    <span className="hidden text-xs text-text-tertiary sm:inline">
                      {i + 1}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        )}

        {(content.answer_type === "numeric" ||
          content.answer_type === "short-text") && (
          <div className="relative">
            <input
              type={content.answer_type === "numeric" ? "number" : "text"}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={disabled}
              onKeyDown={(e) => {
                if (e.key === "Enter" && userAnswer.trim()) handleSubmit();
              }}
              className="w-full rounded-xl border border-border bg-bg-input px-4 py-3.5 text-lg font-medium text-text outline-none transition focus:border-accent focus:bg-bg-hover disabled:opacity-50"
              placeholder={
                content.answer_type === "numeric"
                  ? "Enter a number"
                  : "Type your answer"
              }
              autoFocus
            />
            {disabled && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center gap-2 text-sm"
              >
                <CornerDownRight className="h-4 w-4 text-text-tertiary" />
                <span className="text-text-secondary">
                  Answer:{" "}
                  <span className="font-semibold text-text">
                    {content.correct_answer}
                  </span>
                </span>
              </motion.div>
            )}
          </div>
        )}

        {/* Hint toggle */}
        {!disabled && !showHint && (
          <button
            onClick={() => setShowHint(true)}
            className="mt-3 flex items-center gap-1.5 text-sm text-text-tertiary transition hover:text-warn"
          >
            <Lightbulb className="h-4 w-4" />
            Show hint
          </button>
        )}

        <AnimatePresence>
          {showHint && !disabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 overflow-hidden"
            >
              <div className="flex items-start gap-2 rounded-xl border border-warn/20 bg-warn/5 p-3">
                <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-warn" />
                <p className="text-sm text-text-secondary">{hint}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit button */}
        {!disabled && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={
              content.answer_type === "multiple-choice"
                ? !selectedChoice
                : !userAnswer.trim()
            }
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-accent-hover to-accent py-3.5 font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Check answer
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
