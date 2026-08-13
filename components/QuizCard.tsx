"use client";

import { useState } from "react";
import type { Question, QuizContent } from "@/lib/types";

interface QuizCardProps {
  question: Question;
  onAnswer: (isCorrect: boolean, explanation: string) => void;
  disabled: boolean;
}

export default function QuizCard({ question, onAnswer, disabled }: QuizCardProps) {
  const content = question.content as QuizContent;
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
  }

  return (
    <div className="rounded-xl border border-border bg-bg-card p-6">
      {/* Sample badge */}
      {question.is_sample && (
        <span className="mb-3 inline-block rounded bg-bg-input px-2 py-0.5 text-xs text-muted">
          Sample
        </span>
      )}

      {/* Topic tag */}
      <div className="mb-3 text-xs text-text-secondary">
        {question.topic} · {question.subtopic}
      </div>

      {/* Question */}
      <p className="text-lg font-medium leading-snug">{content.prompt}</p>

      {/* Answer area */}
      <form onSubmit={handleSubmit} className="mt-6">
        {content.answer_type === "multiple-choice" && content.choices && (
          <div className="space-y-2">
            {content.choices.map((choice, i) => (
              <button
                key={i}
                type="button"
                disabled={disabled}
                onClick={() => setSelectedChoice(choice)}
                className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                  selectedChoice === choice
                    ? "border-accent bg-accent-muted text-text"
                    : "border-border bg-bg-input text-text hover:border-border-subtle"
                } disabled:opacity-50`}
              >
                {choice}
              </button>
            ))}
          </div>
        )}

        {(content.answer_type === "numeric" ||
          content.answer_type === "short-text") && (
          <input
            type={content.answer_type === "numeric" ? "number" : "text"}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={disabled}
            className="w-full rounded-lg border border-border bg-bg-input px-4 py-3 text-text outline-none focus:border-accent disabled:opacity-50"
            placeholder={
              content.answer_type === "numeric"
                ? "Enter a number"
                : "Type your answer"
            }
            autoFocus
          />
        )}

        {!disabled && (
          <button
            type="submit"
            disabled={
              content.answer_type === "multiple-choice"
                ? !selectedChoice
                : !userAnswer.trim()
            }
            className="mt-4 w-full rounded-lg bg-accent py-3 font-medium text-white transition hover:bg-accent-hover disabled:opacity-30"
          >
            Check answer
          </button>
        )}
      </form>
    </div>
  );
}
