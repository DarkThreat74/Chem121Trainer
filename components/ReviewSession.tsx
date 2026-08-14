"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import QuizCard from "@/components/QuizCard";
import SolverCard from "@/components/SolverCard";
import { Check, X, ArrowRight, XCircle, Trophy } from "lucide-react";
import type { Question } from "@/lib/types";

interface ReviewSessionProps {
  questions: Question[];
  reviewStates: Record<string, any>;
}

type FeedbackState = {
  status: "correct" | "incorrect";
  explanation: string;
} | null;

export default function ReviewSession({
  questions,
  reviewStates,
}: ReviewSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [sessionFinished, setSessionFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const router = useRouter();

  const question = questions[currentIndex];

  const handleAnswer = useCallback(
    async (isCorrect: boolean, explanation: string) => {
      if (feedback) return;

      setFeedback({ status: isCorrect ? "correct" : "incorrect", explanation });
      if (isCorrect) setCorrectCount((c) => c + 1);

      const timeTaken = Date.now() - startTime;

      try {
        await fetch("/api/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionId: question.id,
            isCorrect,
            timeTakenMs: timeTaken,
          }),
        });
      } catch (error) {
        console.error("Failed to save review:", error);
      }
    },
    [feedback, startTime, question]
  );

  function handleNext() {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      setSessionFinished(true);
    } else {
      setCurrentIndex(nextIndex);
      setFeedback(null);
      setStartTime(Date.now());
    }
  }

  if (sessionFinished) {
    const pct = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center safe-top safe-bottom">
        <div className="animate-scale-in flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-accent/20 to-purple-500/20">
          <Trophy className="h-10 w-10 text-accent" />
        </div>
        <h2 className="mt-6 text-2xl font-bold tracking-tight">Session Complete</h2>
        <p className="mt-2 text-text-secondary">
          You reviewed {questions.length} cards
        </p>
        <div className="mt-6 flex items-center gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-ok">{correctCount}</p>
            <p className="text-xs text-text-tertiary">Correct</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="text-center">
            <p className="text-3xl font-bold text-err">
              {questions.length - correctCount}
            </p>
            <p className="text-xs text-text-tertiary">Missed</p>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="text-center">
            <p className="text-3xl font-bold">{pct}%</p>
            <p className="text-xs text-text-tertiary">Accuracy</p>
          </div>
        </div>
        <a
          href="/dashboard"
          className="mt-8 rounded-xl bg-gradient-to-r from-accent-hover to-accent px-8 py-3.5 font-semibold text-white transition hover:opacity-90 glow-accent"
        >
          Back to dashboard
        </a>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-text-secondary">No questions available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen safe-top safe-bottom">
      {/* Progress header */}
      <div className="sticky top-0 z-10 border-b border-border-subtle bg-bg/80 backdrop-blur-xl">
        <div className="mx-auto max-w-2xl px-4 py-3">
          <div className="mb-2.5 flex items-center justify-between">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-1 text-sm text-text-tertiary transition hover:text-text"
            >
              <XCircle className="h-4 w-4" />
              Exit
            </button>
            <span className="text-sm font-medium text-text-secondary">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-input">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-purple-400 transition-all duration-500"
              style={{
                width: `${(currentIndex / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Question card */}
      <div className="mx-auto max-w-2xl px-4 py-6">
        {question.mode === "quiz" ? (
          <QuizCard
            key={question.id}
            question={question}
            onAnswer={handleAnswer}
            disabled={!!feedback}
          />
        ) : (
          <SolverCard
            key={question.id}
            question={question}
            onAnswer={handleAnswer}
            disabled={!!feedback}
          />
        )}

        {/* Feedback panel */}
        {feedback && (
          <div className="mt-4 animate-slide-up space-y-4">
            <div
              className={`rounded-2xl border p-5 ${
                feedback.status === "correct"
                  ? "border-ok/30 bg-ok/10"
                  : "border-err/30 bg-err/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    feedback.status === "correct"
                      ? "bg-ok/20"
                      : "bg-err/20"
                  }`}
                >
                  {feedback.status === "correct" ? (
                    <Check className="h-5 w-5 text-ok" />
                  ) : (
                    <X className="h-5 w-5 text-err" />
                  )}
                </div>
                <span
                  className={`text-lg font-bold ${
                    feedback.status === "correct" ? "text-ok" : "text-err"
                  }`}
                >
                  {feedback.status === "correct" ? "Correct!" : "Not quite"}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {feedback.explanation}
              </p>
            </div>

            <button
              onClick={handleNext}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent-hover to-accent py-4 font-semibold text-white transition-all duration-200 hover:opacity-90 glow-accent"
            >
              {currentIndex + 1 >= questions.length ? "Finish session" : "Next question"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
