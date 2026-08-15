"use client";

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
  const todayLabel = new Date().toLocaleDateString("en-US", { weekday: "short" });

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
      <div className="grid grid-cols-3 gap-3">
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

      {/* Topic list */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-tertiary">
            Topics
          </h2>
          <Link
            href="/learn"
            className="flex items-center gap-1 text-xs font-medium text-accent transition hover:text-accent-hover"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Study Guide
          </Link>
        </div>
        <div className="space-y-2.5">
          {topicsWithCounts.map((topic, i) => {
            const mastery = topicMastery[topic.id];
            const hasContent = topic.count > 0;
            const Icon = ICON_MAP[topic.icon] || Atom;

            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.04, duration: 0.3 }}
              >
                <Link
                  href={`/practice/${topic.id}`}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-bg-card p-4 transition-all duration-200 hover:border-border-strong hover:bg-bg-hover"
                >
                  {/* Icon */}
                  <div
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                    style={{
                      backgroundColor: `${topic.color}15`,
                    }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: topic.color }}
                    />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{topic.label}</span>
                      {hasContent && (
                        <span className="rounded-md bg-bg-input px-1.5 py-0.5 text-xs font-medium text-text-tertiary">
                          {topic.count}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-sm text-text-secondary">
                      {hasContent
                        ? topic.description
                        : "No content yet"}
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
                          {mastery.mastery}% mastery
                        </span>
                      </div>
                    )}
                    {hasContent && (!mastery || mastery.seen === 0) && (
                      <p className="mt-1 text-xs text-text-tertiary">Not started</p>
                    )}
                  </div>

                  <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
                </Link>
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
      className="rounded-2xl border border-border bg-bg-card p-4 transition hover:border-border-strong"
    >
      <div className="flex items-center gap-2 text-text-secondary">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${pulse ? "pulse-ring" : ""}`}
          style={{ backgroundColor: `${color}10` }}
        >
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight">
        {value}
        <span className="ml-1 text-sm font-normal text-text-tertiary">
          {unit}
        </span>
      </p>
      <p className="text-xs text-text-tertiary">{label}</p>
    </motion.div>
  );
}
