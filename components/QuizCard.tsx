"use client";

import { useState } from "react";
import type { Question, QuizContent } from "@/lib/types";
import { Check, X, CornerDownRight } from "lucide-react";

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
    <div className="animate-slide-up rounded-2xl border border-border bg-bg-card p-6">
      {/* Topic tag */}
      <div className="mb-4 flex items-center gap-2">
        <span className="rounded-lg bg-bg-input px-2.5 py-1 text-xs font-medium text-text-secondary">
          {question.topic.replace(/-/g, " ")}
        </span>
        <span className="text-text-tertiary">·</span>
        <span className="text-xs text-text-tertiary">
          {question.subtopic.replace(/-/g, " ")}
        </span>
      </div>

      {/* Question */}
      <p className="text-xl font-semibold leading-snug tracking-tight">
        {content.prompt}
      </p>

      {/* Answer area */}
      <form onSubmit={handleSubmit} className="mt-6">
        {content.answer_type === "multiple-choice" && content.choices && (
          <div className="space-y-2.5">
            {content.choices.map((choice, i) => {
              const isSelected = selectedChoice === choice;
              const isCorrectChoice =
                disabled && choice === String(content.correct_answer);
              const isWrongChoice =
                disabled && isSelected && choice !== String(content.correct_answer);

              return (
                <button
                  key={i}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelectedChoice(choice)}
                  className={`group flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-200 ${
                    isCorrectChoice
                      ? "border-ok/40 bg-ok/10"
                      : isWrongChoice
                      ? "border-err/40 bg-err/10 animate-shake"
                      : isSelected
                      ? "border-accent bg-accent/10"
                      : "border-border bg-bg-input hover:border-border-strong hover:bg-bg-hover"
                  } disabled:cursor-default`}
                >
                  <div
                    className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition ${
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
                      <Check className="h-3.5 w-3.5" />
                    ) : isWrongChoice ? (
                      <X className="h-3.5 w-3.5" />
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </div>
                  <span className="text-sm font-medium">{choice}</span>
                </button>
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
              className="w-full rounded-xl border border-border bg-bg-input px-4 py-3.5 text-lg font-medium text-text outline-none transition focus:border-accent focus:bg-bg-hover disabled:opacity-50"
              placeholder={
                content.answer_type === "numeric"
                  ? "Enter a number"
                  : "Type your answer"
              }
              autoFocus
            />
            {disabled && (
              <div className="mt-2 flex items-center gap-2 text-sm">
                <CornerDownRight className="h-4 w-4 text-text-tertiary" />
                <span className="text-text-secondary">
                  Answer:{" "}
                  <span className="font-semibold text-text">
                    {content.correct_answer}
                  </span>
                </span>
              </div>
            )}
          </div>
        )}

        {!disabled && (
          <button
            type="submit"
            disabled={
              content.answer_type === "multiple-choice"
                ? !selectedChoice
                : !userAnswer.trim()
            }
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-accent-hover to-accent py-3.5 font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Check answer
          </button>
        )}
      </form>
    </div>
  );
}
