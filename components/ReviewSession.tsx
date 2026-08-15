"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import QuizCard from "@/components/QuizCard";
import SolverCard from "@/components/SolverCard";
import Confetti from "@/components/Confetti";
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
  autoAdvance?: boolean;
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

export default function ReviewSession({
  questions,
  reviewStates,
  autoAdvance = false,
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
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [questionQueue, setQuestionQueue] = useState<number[]>([]); // indices into questions[]
  const [currentPath, setCurrentPath] = useState("");
  const masteryRef = useRef(0); // consecutive correct for "6 in a row" completion
  const correctQuestionsRef = useRef<Set<string>>(new Set()); // question IDs answered correctly
  const MASTERY_THRESHOLD = 6;
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const question = questions[questionQueue[currentIndex] ?? currentIndex];

  // Guard against empty questions array
  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center safe-top safe-bottom">
        <p className="text-text-secondary">No questions available.</p>
        <a
          href="/dashboard"
          className="mt-4 rounded-xl border border-border bg-bg-card px-6 py-3 font-medium text-text transition hover:bg-bg-hover"
        >
          Back to dashboard
        </a>
      </div>
    );
  }

  // Initialize timer after mount to avoid hydration mismatch
  useEffect(() => {
    const now = Date.now();
    setStartTime(now);
    setCurrentTime(now);
    // Initialize question queue (shuffled indices)
    setQuestionQueue(Array.from({ length: questions.length }, (_, i) => i).sort(() => Math.random() - 0.5));
    // Capture current path for "practice again" link (avoid SSR hydration mismatch)
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
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

  // Auto-advance: when feedback is shown and autoAdvance is enabled,
  // wait a few seconds then automatically go to the next question
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState(0);
  const AUTO_ADVANCE_DELAY = 4; // seconds to show explanation before auto-advancing

  useEffect(() => {
    if (!autoAdvance || !feedback || sessionFinished) {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
      setAutoAdvanceCountdown(0);
      return;
    }

    setAutoAdvanceCountdown(AUTO_ADVANCE_DELAY);

    const countdownInterval = setInterval(() => {
      setAutoAdvanceCountdown((c) => Math.max(0, c - 1));
    }, 1000);

    autoAdvanceTimerRef.current = setTimeout(() => {
      handleNext();
    }, AUTO_ADVANCE_DELAY * 1000);

    return () => {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
      clearInterval(countdownInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback, autoAdvance, sessionFinished]);

  const elapsedThisQuestion = currentTime - startTime;

  const handleAnswer = useCallback(
    async (isCorrect: boolean, explanation: string) => {
      if (feedback) return;

      setFeedback({ status: isCorrect ? "correct" : "incorrect", explanation });
      if (isCorrect) {
        setCorrectCount((c) => c + 1);
        masteryRef.current += 1;
        correctQuestionsRef.current.add(question.id);
        setSessionStreak((s) => {
          const newStreak = s + 1;
          setBestStreak((b) => Math.max(b, newStreak));
          // Celebrate on 3-streak and every 5 after that
          if (newStreak === 3 || (newStreak > 3 && newStreak % 5 === 0)) {
            setConfettiTrigger((t) => t + 1);
          }
          return newStreak;
        });
      } else {
        masteryRef.current = 0;
        setSessionStreak(0);
        // Move this question to the end of the queue so it comes back
        setQuestionQueue((prev) => {
          if (prev.length <= 1) return prev;
          const currentQIdx = prev[currentIndex];
          return [...prev.filter((_, i) => i !== currentIndex), currentQIdx];
        });
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
    // In review (autoAdvance) mode: go through all due questions once, then finish
    if (autoAdvance) {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= questionQueue.length) {
        // All due questions reviewed
        setSessionFinished(true);
        const pct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
        if (pct >= 80) {
          setConfettiTrigger((t) => t + 1);
        }
      } else {
        setCurrentIndex(nextIndex);
        setFeedback(null);
        setStartTime(Date.now());
        setCurrentTime(Date.now());
      }
      return;
    }

    // In practice/quiz mode: 6-in-a-row mastery system
    if (masteryRef.current >= MASTERY_THRESHOLD) {
      const allMastered = correctQuestionsRef.current.size >= questions.length;
      setSessionFinished(true);
      if (allMastered) {
        setConfettiTrigger((t) => t + 1);
      }
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex >= questionQueue.length) {
      // Reached end of queue but haven't hit 6-in-a-row yet
      // Reshuffle remaining unseen questions and continue
      setCurrentIndex(0);
      setFeedback(null);
      setStartTime(Date.now());
      setCurrentTime(Date.now());
    } else {
      setCurrentIndex(nextIndex);
      setFeedback(null);
      setStartTime(Date.now());
      setCurrentTime(Date.now());
    }
  }

  if (sessionFinished) {
    const allMastered = correctQuestionsRef.current.size >= questions.length;
    const pct = autoAdvance
      ? (questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0)
      : (questions.length > 0 ? Math.round((correctQuestionsRef.current.size / questions.length) * 100) : 0);
    const avgTime = questions.length > 0 ? totalTime / questions.length : 0;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8 text-center safe-top safe-bottom">
        <Confetti trigger={confettiTrigger} />
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
          {autoAdvance ? "Review Complete!" : allMastered ? "Mastered!" : "Completed!"}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-2 text-sm text-text-secondary sm:text-base"
        >
          {autoAdvance
            ? `You reviewed ${questions.length} cards`
            : allMastered
            ? `You got all ${questions.length} questions correct and hit ${MASTERY_THRESHOLD} in a row`
            : `You got ${MASTERY_THRESHOLD} in a row correct (${correctQuestionsRef.current.size}/${questions.length} questions mastered)`}
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
            href={currentPath || "/dashboard"}
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
        <div className="mx-auto max-w-3xl px-4 py-2.5 sm:py-3 lg:max-w-4xl">
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
                {autoAdvance
                  ? `${currentIndex + 1} / ${questionQueue.length || questions.length}`
                  : `Q${currentIndex + 1}`}
              </span>
            </div>
          </div>
          {/* Mastery streak indicator: 6 in a row (only in practice/quiz mode) */}
          {!autoAdvance && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs font-medium text-text-tertiary">
                Get {MASTERY_THRESHOLD} in a row to finish:
              </span>
              <div className="flex gap-1">
                {Array.from({ length: MASTERY_THRESHOLD }, (_, i) => (
                  <motion.div
                    key={i}
                    initial={false}
                    animate={{
                      backgroundColor: i < masteryRef.current ? "#34d399" : "#27272a",
                      scale: i < masteryRef.current ? [1, 1.2, 1] : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="h-2 w-5 rounded-full"
                  />
                ))}
              </div>
            </div>
          )}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-bg-input">
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
      <div className="mx-auto max-w-3xl px-4 py-4 sm:py-6 lg:max-w-4xl">
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
        <AnimatePresence mode="wait">
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="mt-4 space-y-3"
            >
              <div
                className={`relative overflow-hidden rounded-3xl border p-5 sm:p-6 ${
                  feedback.status === "correct"
                    ? "border-ok/30 bg-gradient-to-br from-ok/10 to-ok/5"
                    : "border-err/30 bg-gradient-to-br from-err/10 to-err/5"
                }`}
              >
                {/* Decorative glow */}
                <div
                  className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl ${
                    feedback.status === "correct" ? "bg-ok/20" : "bg-err/20"
                  }`}
                />

                <div className="relative flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 12, delay: 0.1 }}
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                      feedback.status === "correct"
                        ? "bg-ok/20 ring-2 ring-ok/30"
                        : "bg-err/20 ring-2 ring-err/30"
                    }`}
                  >
                    {feedback.status === "correct" ? (
                      <Check className="h-6 w-6 text-ok" strokeWidth={3} />
                    ) : (
                      <X className="h-6 w-6 text-err" strokeWidth={3} />
                    )}
                  </motion.div>
                  <div>
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className={`block text-xl font-bold ${
                        feedback.status === "correct" ? "text-ok" : "text-err"
                      }`}
                    >
                      {feedback.status === "correct" ? "Correct!" : "Not quite"}
                    </motion.span>
                    {feedback.status === "correct" && sessionStreak >= 2 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-0.5 flex items-center gap-1 text-xs font-medium text-warn"
                      >
                        <Flame className="h-3 w-3" />
                        {sessionStreak} streak!
                      </motion.div>
                    )}
                  </div>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="relative mt-4 text-sm leading-relaxed text-text-secondary"
                >
                  {feedback.explanation}
                </motion.p>
              </div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.01 }}
                onClick={handleNext}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent-hover to-accent py-4 font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-accent/20"
              >
                {autoAdvance && autoAdvanceCountdown > 0 ? (
                  <>
                    {currentIndex + 1 >= questions.length
                      ? "Finishing"
                      : "Continuing"}
                    {" in "}
                    {autoAdvanceCountdown}
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <Clock className="h-4 w-4" />
                    </motion.div>
                  </>
                ) : (
                  <>
                    {currentIndex + 1 >= questions.length
                      ? "Finish session"
                      : "Next question"}
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
