"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Flame,
  CalendarClock,
  TrendingUp,
  ChevronRight,
  Atom,
  Ruler,
  Hash,
  ArrowLeftRight,
  Beaker,
  Scale,
  FlaskConical,
  Orbit,
  Sparkles,
  BookOpen,
  Lock,
  CheckCircle2,
  PlayCircle,
  type LucideIcon,
} from "lucide-react";
import type { TopicInfo } from "@/lib/types";

const ICON_MAP: Record<string, LucideIcon> = {
  atom: Atom,
  ruler: Ruler,
  hash: Hash,
  "arrow-left-right": ArrowLeftRight,
  molecule: Beaker,
  scale: Scale,
  "flask-conical": FlaskConical,
  orbit: Orbit,
};

interface DashboardClientProps {
  streak: number;
  dueCount: number;
  topicMastery: Record<
    string,
    { mastery: number; totalReviews: number; seen: number; total: number }
  >;
  topicsWithCounts: (TopicInfo & { count: number })[];
  weeklyActivity: { date: string; label: string; count: number }[];
  totalReviews: number;
}

export default function DashboardClient({
  streak,
  dueCount,
  topicMastery,
  topicsWithCounts,
  weeklyActivity,
  totalReviews,
}: DashboardClientProps) {
  const totalQuestions = topicsWithCounts.reduce((sum, t) => sum + t.count, 0);
  const totalSeen = Object.values(topicMastery).reduce(
    (sum, t) => sum + t.seen,
    0
  );
  const overallProgress =
    totalQuestions > 0 ? Math.round((totalSeen / totalQuestions) * 100) : 0;

  const maxActivity = Math.max(...weeklyActivity.map((d) => d.count), 1);
  const [todayLabel, setTodayLabel] = useState("");
  useEffect(() => {
    setTodayLabel(new Date().toLocaleDateString("en-US", { weekday: "short" }));
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero progress card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-bg-card to-bg-elevated p-5"
      >
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-purple-500/5 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-text-secondary">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">Your Progress</span>
          </div>
          <div className="mt-3 flex items-end gap-2">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-bold tracking-tight"
            >
              {overallProgress}
              <span className="text-3xl text-text-secondary">%</span>
            </motion.span>
            <span className="mb-1.5 text-sm text-text-tertiary">
              {totalSeen} of {totalQuestions} questions seen
            </span>
          </div>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-bg-input">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-accent to-purple-400"
            />
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-3">
        <StatCard
          icon={Flame}
          label="Streak"
          value={streak}
          unit={streak === 1 ? "day" : "days"}
          color="#fbbf24"
          delay={0.1}
          pulse={streak > 0}
        />
        <StatCard
          icon={CalendarClock}
          label="Due"
          value={dueCount}
          unit={dueCount === 1 ? "card" : "cards"}
          color="#818cf8"
          delay={0.15}
        />
        <StatCard
          icon={TrendingUp}
          label="Reviews"
          value={totalReviews}
          unit="total"
          color="#34d399"
          delay={0.2}
        />
      </div>

      {/* Weekly activity chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="rounded-3xl border border-border bg-bg-card p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-tertiary">
            This Week
          </h2>
          <span className="text-xs text-text-tertiary">
            {weeklyActivity.reduce((s, d) => s + d.count, 0)} reviews
          </span>
        </div>
        <div className="flex items-end justify-between gap-2">
          {weeklyActivity.map((day, i) => {
            const height = maxActivity > 0 ? (day.count / maxActivity) * 100 : 0;
            const isToday = day.label === todayLabel;
            return (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-24 w-full items-end justify-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(height, day.count > 0 ? 8 : 2)}%` }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.5, ease: "easeOut" }}
                    className={`w-full max-w-[28px] rounded-lg ${
                      day.count > 0
                        ? isToday
                          ? "bg-gradient-to-t from-accent to-purple-400"
                          : "bg-accent/40"
                        : "bg-bg-input"
                    }`}
                  />
                </div>
                <span
                  className={`text-xs ${
                    isToday ? "font-bold text-accent" : "text-text-tertiary"
                  }`}
                >
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Start review CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <Link
          href="/review"
          className={`group relative flex items-center justify-between overflow-hidden rounded-2xl p-5 font-semibold text-white transition-all duration-300 ${
            dueCount > 0
              ? "bg-gradient-to-r from-accent-hover to-accent glow-accent"
              : "bg-gradient-to-r from-bg-elevated to-bg-card border border-border hover:border-border-strong"
          }`}
        >
          <div className="flex items-center gap-3">
            {dueCount > 0 ? (
              <Sparkles className="h-5 w-5" />
            ) : (
              <TrendingUp className="h-5 w-5 text-accent" />
            )}
            <span className={dueCount > 0 ? "" : "text-text"}>
              {dueCount > 0
                ? `Review ${dueCount} due card${dueCount > 1 ? "s" : ""}`
                : "Start a practice session"}
            </span>
          </div>
          <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>

      {/* Guided learning path */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-tertiary">
            Learning Path
          </h2>
          <Link
            href="/learn"
            className="flex items-center gap-1 text-xs font-medium text-accent transition hover:text-accent-hover"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Study Guide
          </Link>
        </div>

        {/* Guidance banner */}
        {(() => {
          const sortedTopics = [...topicsWithCounts].sort((a, b) => (a.order || 0) - (b.order || 0));
          const currentTopic = sortedTopics.find((t) => {
            const m = topicMastery[t.id] || { mastery: 0, totalReviews: 0, seen: 0, total: t.count };
            return m.seen < t.count;
          }) || sortedTopics[sortedTopics.length - 1];
          const currentMastery = topicMastery[currentTopic.id] || { mastery: 0, totalReviews: 0, seen: 0, total: currentTopic.count };
          const isStarted = currentMastery.seen > 0;

          return (
            <div className="mb-4 rounded-2xl border border-accent/20 bg-accent/5 p-4">
              <div className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5 flex-shrink-0 text-accent" />
                <p className="text-sm font-medium">
                  {isStarted
                    ? `Continue with "${currentTopic.label}" — ${currentMastery.seen}/${currentTopic.count} questions done`
                    : `Start here: "${currentTopic.label}"`}
                </p>
              </div>
              <p className="mt-1.5 pl-7 text-xs text-text-secondary">
                {isStarted
                  ? "Keep going! Finish this topic to unlock the next one."
                  : `Step ${currentTopic.order} of ${sortedTopics.length}. ${currentTopic.description}`}
              </p>
            </div>
          );
        })()}

        <div className="space-y-2.5">
          {[...topicsWithCounts].sort((a, b) => (a.order || 0) - (b.order || 0)).map((topic, i) => {
            const mastery = topicMastery[topic.id] || { mastery: 0, totalReviews: 0, seen: 0, total: topic.count };
            const hasContent = topic.count > 0;
            const Icon = ICON_MAP[topic.icon] || Atom;
            const sortedTopics = [...topicsWithCounts].sort((a, b) => (a.order || 0) - (b.order || 0));
            const prevTopic = i > 0 ? sortedTopics[i - 1] : null;
            const prevMastery = prevTopic ? (topicMastery[prevTopic.id] || { mastery: 0, totalReviews: 0, seen: 0, total: prevTopic.count }) : null;
            const isUnlocked = i === 0 || (prevMastery !== null && prevTopic !== null && prevMastery.seen >= prevTopic.count * 0.5);
            const isComplete = mastery.seen >= topic.count && topic.count > 0;
            const isCurrent = isUnlocked && !isComplete;

            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.04, duration: 0.3 }}
              >
                {isUnlocked ? (
                  <Link
                    href={`/practice/${topic.id}`}
                    className={`group flex items-center gap-3 rounded-2xl border p-3.5 transition-all duration-200 sm:gap-4 sm:p-4 ${
                      isCurrent
                        ? "border-accent/40 bg-accent/5 hover:border-accent/60 hover:bg-accent/10"
                        : "border-border bg-bg-card hover:border-border-strong hover:bg-bg-hover"
                    }`}
                  >
                    {/* Step number / status icon */}
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12" style={{ backgroundColor: isComplete ? `${topic.color}20` : `${topic.color}15` }}>
                      {isComplete ? (
                        <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: topic.color }} />
                      ) : (
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: topic.color }} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-text-tertiary">STEP {topic.order}</span>
                        {isCurrent && (
                          <span className="rounded-md bg-accent/20 px-1.5 py-0.5 text-xs font-semibold text-accent">
                            START HERE
                          </span>
                        )}
                        {isComplete && (
                          <span className="rounded-md bg-ok/20 px-1.5 py-0.5 text-xs font-semibold text-ok">
                            DONE
                          </span>
                        )}
                      </div>
                      <span className="mt-0.5 block font-semibold">{topic.label}</span>
                      <p className="mt-0.5 truncate text-sm text-text-secondary">
                        {topic.description}
                      </p>

                      {/* Progress bar */}
                      {mastery && mastery.totalReviews > 0 && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-bg-input">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${mastery.mastery}%` }}
                              transition={{ delay: 0.5 + i * 0.04, duration: 0.5 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: topic.color }}
                            />
                          </div>
                          <span className="text-xs font-medium text-text-tertiary">
                            {mastery.seen}/{topic.count} done · {mastery.mastery}%
                          </span>
                        </div>
                      )}
                      {(!mastery || mastery.seen === 0) && isCurrent && (
                        <p className="mt-1 text-xs text-accent">Not started yet — tap to begin!</p>
                      )}
                    </div>

                    <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 rounded-2xl border border-border bg-bg-card/50 p-3.5 opacity-60 sm:gap-4 sm:p-4">
                    {/* Locked icon */}
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-bg-input sm:h-12 sm:w-12">
                      <Lock className="h-4 w-4 text-text-tertiary sm:h-5 sm:w-5" />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-text-tertiary">STEP {topic.order}</span>
                        <span className="rounded-md bg-bg-input px-1.5 py-0.5 text-xs font-medium text-text-tertiary">
                          LOCKED
                        </span>
                      </div>
                      <span className="mt-0.5 block font-semibold text-text-secondary">{topic.label}</span>
                      <p className="mt-0.5 truncate text-sm text-text-tertiary">
                        Complete "{prevTopic?.label}" to unlock
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  color,
  delay,
  pulse,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  unit: string;
  color: string;
  delay: number;
  pulse?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="rounded-2xl border border-border bg-bg-card p-3 transition hover:border-border-strong sm:p-4"
    >
      <div className="flex items-center gap-2 text-text-secondary">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-lg sm:h-8 sm:w-8 ${pulse ? "pulse-ring" : ""}`}
          style={{ backgroundColor: `${color}10` }}
        >
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" style={{ color }} />
        </div>
      </div>
      <p className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
        {value}
        <span className="ml-1 text-xs font-normal text-text-tertiary sm:text-sm">
          {unit}
        </span>
      </p>
      <p className="text-xs text-text-tertiary">{label}</p>
    </motion.div>
  );
}
