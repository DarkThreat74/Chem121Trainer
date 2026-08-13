"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  newCard,
  reviewCard,
  cardToReviewState,
  reviewStateToCard,
  Rating,
  type State,
} from "@/lib/fsrs";
import type { Question } from "@/lib/types";
import QuizCard from "@/components/QuizCard";
import SolverCard from "@/components/SolverCard";
import { Check, X, ArrowRight } from "lucide-react";

interface ReviewSessionProps {
  userId: string;
  questions: Question[];
  reviewStates: Record<string, any>;
}

type FeedbackState = {
  status: "correct" | "incorrect";
  explanation: string;
} | null;

export default function ReviewSession({
  userId,
  questions,
  reviewStates,
}: ReviewSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [completed, setCompleted] = useState(0);
  const [sessionFinished, setSessionFinished] = useState(false);
  const router = useRouter();

  const question = questions[currentIndex];

  const handleAnswer = useCallback(
    async (isCorrect: boolean, explanation: string) => {
      if (feedback) return; // Prevent double-submit

      setFeedback({
        status: isCorrect ? "correct" : "incorrect",
        explanation,
      });

      // Schedule FSRS review
      const timeTaken = Date.now() - startTime;
      const supabase = createClient();

      const existingState = reviewStates[question.id];
      const card = existingState
        ? reviewStateToCard(existingState)
        : newCard();

      const rating: Rating = isCorrect ? Rating.Good : Rating.Again;
      const { card: updatedCard } = reviewCard(card, rating);

      // Upsert review state
      const stateData = cardToReviewState(updatedCard, userId, question.id);
      await supabase.from("review_state").upsert(stateData, {
        onConflict: "user_id,question_id",
      });

      // Insert review log
      await supabase.from("review_log").insert({
        user_id: userId,
        question_id: question.id,
        rating,
        state: updatedCard.state,
        due: new Date(updatedCard.due).toISOString(),
        time_taken_ms: timeTaken,
      });

      // Update local state map
      reviewStates[question.id] = stateData;
    },
    [feedback, startTime, question, userId, reviewStates]
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
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ok/10">
          <Check className="h-8 w-8 text-ok" />
        </div>
        <h2 className="text-xl font-bold">Session complete!</h2>
        <p className="mt-2 text-text-secondary">
          You reviewed {questions.length} cards.
        </p>
        <div className="mt-6 flex gap-3">
          <a
            href="/dashboard"
            className="rounded-lg bg-accent px-6 py-3 font-medium text-white transition hover:bg-accent-hover"
          >
            Back to dashboard
          </a>
        </div>
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
      {/* Progress bar */}
      <div className="sticky top-0 z-10 border-b border-border bg-bg/90 backdrop-blur">
        <div className="mx-auto max-w-2xl px-4 py-3">
          <div className="mb-2 flex items-center justify-between text-sm">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-text-secondary transition hover:text-text"
            >
              Exit
            </button>
            <span className="text-text-secondary">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-bg-input">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{
                width: `${((currentIndex) / questions.length) * 100}%`,
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

        {/* Feedback */}
        {feedback && (
          <div className="mt-4 space-y-4">
            <div
              className={`rounded-xl border p-4 ${
                feedback.status === "correct"
                  ? "border-ok/30 bg-ok/5"
                  : "border-err/30 bg-err/5"
              }`}
            >
              <div className="flex items-center gap-2">
                {feedback.status === "correct" ? (
                  <Check className="h-5 w-5 text-ok" />
                ) : (
                  <X className="h-5 w-5 text-err" />
                )}
                <span
                  className={`font-semibold ${
                    feedback.status === "correct" ? "text-ok" : "text-err"
                  }`}
                >
                  {feedback.status === "correct" ? "Correct!" : "Incorrect"}
                </span>
              </div>
              <p className="mt-2 text-sm text-text-secondary">
                {feedback.explanation}
              </p>
            </div>

            <button
              onClick={handleNext}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-4 font-semibold text-white transition hover:bg-accent-hover"
            >
              {currentIndex + 1 >= questions.length ? "Finish" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
