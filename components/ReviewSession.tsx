"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import QuizCard from "@/components/QuizCard";
import SolverCard from "@/components/SolverCard";
import {
  Check,
  X,
  ArrowRight,
  XCircle,
  Trophy,
  Flame,
  Clock,
  Zap,
  RotateCcw,
} from "lucide-react";
import type { Question } from "@/lib/types";

interface ReviewSessionProps {
  questions: Question[];
  reviewStates: Record<string, any>;
}

type FeedbackState = {
  status: "correct" | "incorrect";
  explanation: string;
} | null;

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${rem.toString().padStart(2, "0")}`;
}

function Confetti() {
  const colors = ["#818cf8", "#34d399", "#fbbf24", "#f0abfc", "#fb923c", "#2dd4bf"];
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    color: colors[i % colors.length],
    rotation: Math.random() * 360,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function ReviewSession({
  questions,
  reviewStates,
}: ReviewSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [startTime, setStartTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionStreak, setSessionStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const question = questions[currentIndex];

  // Initialize timer after mount to avoid hydration mismatch
  useEffect(() => {
    const now = Date.now();
    setStartTime(now);
    setCurrentTime(now);
  }, []);

  // Live timer
  useEffect(() => {
    if (feedback || sessionFinished) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => setCurrentTime(Date.now()), 100);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [feedback, sessionFinished]);

  const elapsedThisQuestion = currentTime - startTime;

  const handleAnswer = useCallback(
    async (isCorrect: boolean, explanation: string) => {
      if (feedback) return;

      setFeedback({ status: isCorrect ? "correct" : "incorrect", explanation });
      if (isCorrect) {
        setCorrectCount((c) => c + 1);
        setSessionStreak((s) => {
          const newStreak = s + 1;
          setBestStreak((b) => Math.max(b, newStreak));
          return newStreak;
        });
      } else {
        setSessionStreak(0);
      }

      const timeTaken = Date.now() - startTime;
      setTotalTime((t) => t + timeTaken);

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
      // Show confetti if accuracy >= 80%
      const pct = Math.round((correctCount / questions.length) * 100);
      if (pct >= 80) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } else {
      setCurrentIndex(nextIndex);
      setFeedback(null);
      setStartTime(Date.now());
      setCurrentTime(Date.now());
    }
  }

  if (sessionFinished) {
    const pct = Math.round((correctCount / questions.length) * 100);
    const avgTime = totalTime / questions.length;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8 text-center safe-top safe-bottom">
        {showConfetti && <Confetti />}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-accent/20 to-purple-500/20 glow-accent sm:h-24 sm:w-24"
        >
          <Trophy className="h-10 w-10 text-accent sm:h-12 sm:w-12" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-5 text-2xl font-bold tracking-tight sm:mt-6 sm:text-3xl"
        >
          Session Complete
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-2 text-sm text-text-secondary sm:text-base"
        >
          You reviewed {questions.length} cards
        </motion.p>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 grid w-full max-w-md grid-cols-2 gap-2.5 sm:mt-8 sm:gap-3"
        >
          <div className="rounded-2xl border border-ok/20 bg-ok/5 p-3 sm:p-4">
            <Check className="mx-auto h-5 w-5 text-ok" />
            <p className="mt-2 text-2xl font-bold text-ok sm:text-3xl">{correctCount}</p>
            <p className="text-xs text-text-tertiary">Correct</p>
          </div>
          <div className="rounded-2xl border border-err/20 bg-err/5 p-3 sm:p-4">
            <X className="mx-auto h-5 w-5 text-err" />
            <p className="mt-2 text-2xl font-bold text-err sm:text-3xl">
              {questions.length - correctCount}
            </p>
            <p className="text-xs text-text-tertiary">Missed</p>
          </div>
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-3 sm:p-4">
            <Zap className="mx-auto h-5 w-5 text-accent" />
            <p className="mt-2 text-2xl font-bold text-accent sm:text-3xl">{pct}%</p>
            <p className="text-xs text-text-tertiary">Accuracy</p>
          </div>
          <div className="rounded-2xl border border-warn/20 bg-warn/5 p-3 sm:p-4">
            <Flame className="mx-auto h-5 w-5 text-warn" />
            <p className="mt-2 text-2xl font-bold text-warn sm:text-3xl">{bestStreak}</p>
            <p className="text-xs text-text-tertiary">Best streak</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 flex items-center gap-2 text-xs text-text-tertiary sm:text-sm"
        >
          <Clock className="h-4 w-4" />
          <span>
            Total: {formatTime(totalTime)} · Avg: {formatTime(avgTime)}/card
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 flex w-full max-w-md flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row"
        >
          <a
            href="/dashboard"
            className="rounded-xl bg-gradient-to-r from-accent-hover to-accent px-6 py-3.5 font-semibold text-white transition hover:opacity-90 glow-accent sm:px-8"
          >
            Back to dashboard
          </a>
          <a
            href={window.location.pathname}
            className="flex items-center justify-center gap-2 rounded-xl border border-border bg-bg-card px-6 py-3.5 font-semibold text-text transition hover:bg-bg-hover sm:px-8"
          >
            <RotateCcw className="h-4 w-4" />
            Practice again
          </a>
        </motion.div>
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
      <div className="sticky top-0 z-10 border-b border-border-subtle bg-bg/80 backdrop-blur-xl safe-top">
        <div className="mx-auto max-w-2xl px-4 py-2.5 sm:py-3">
          <div className="mb-2 flex items-center justify-between sm:mb-2.5">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-1 text-sm text-text-tertiary transition hover:text-text"
            >
              <XCircle className="h-4 w-4" />
              Exit
            </button>
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Session streak */}
              {sessionStreak >= 2 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 text-sm font-semibold text-warn"
                >
                  <Flame className="h-3.5 w-3.5" />
                  {sessionStreak}
                </motion.div>
              )}
              {/* Timer */}
              <div className="flex items-center gap-1 text-sm text-text-tertiary">
                <Clock className="h-3.5 w-3.5" />
                {formatTime(elapsedThisQuestion)}
              </div>
              <span className="text-sm font-medium text-text-secondary">
                {currentIndex + 1} / {questions.length}
              </span>
            </div>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-input">
            <motion.div
              animate={{
                width: `${((currentIndex + (feedback ? 1 : 0)) / questions.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
              className="h-full rounded-full bg-gradient-to-r from-accent to-purple-400"
            />
          </div>
        </div>
      </div>

      {/* Question card */}
      <div className="mx-auto max-w-2xl px-4 py-4 sm:py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
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
          </motion.div>
        </AnimatePresence>

        {/* Feedback panel */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 space-y-4"
            >
              <div
                className={`rounded-2xl border p-5 ${
                  feedback.status === "correct"
                    ? "border-ok/30 bg-ok/10"
                    : "border-err/30 bg-err/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      feedback.status === "correct" ? "bg-ok/20" : "bg-err/20"
                    }`}
                  >
                    {feedback.status === "correct" ? (
                      <Check className="h-5 w-5 text-ok" />
                    ) : (
                      <X className="h-5 w-5 text-err" />
                    )}
                  </motion.div>
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

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent-hover to-accent py-4 font-semibold text-white transition-all duration-200 hover:opacity-90 glow-accent"
              >
                {currentIndex + 1 >= questions.length
                  ? "Finish session"
                  : "Next question"}
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
