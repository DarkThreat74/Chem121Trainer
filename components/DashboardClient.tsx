"use client";

import Link from "next/link";
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
  Sparkles,
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
};

interface DashboardClientProps {
  streak: number;
  dueCount: number;
  topicMastery: Record<
    string,
    { mastery: number; totalReviews: number; seen: number; total: number }
  >;
  topicsWithCounts: (TopicInfo & { count: number })[];
}

export default function DashboardClient({
  streak,
  dueCount,
  topicMastery,
  topicsWithCounts,
}: DashboardClientProps) {
  const totalQuestions = topicsWithCounts.reduce((sum, t) => sum + t.count, 0);
  const totalSeen = Object.values(topicMastery).reduce(
    (sum, t) => sum + t.seen,
    0
  );
  const overallProgress =
    totalQuestions > 0 ? Math.round((totalSeen / totalQuestions) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Hero stats */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-bg-card to-bg-elevated p-5">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/5 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-text-secondary">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">Your Progress</span>
          </div>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-4xl font-bold tracking-tight">
              {overallProgress}
              <span className="text-2xl text-text-secondary">%</span>
            </span>
            <span className="mb-1 text-sm text-text-tertiary">
              {totalSeen} of {totalQuestions} questions seen
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-bg-input">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-purple-400 transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-bg-card p-4 transition hover:border-border-strong">
          <div className="flex items-center gap-2 text-text-secondary">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warn/10">
              <Flame className="h-4 w-4 text-warn" />
            </div>
            <span className="text-sm font-medium">Streak</span>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight">
            {streak}
            <span className="ml-1 text-sm font-normal text-text-tertiary">
              {streak === 1 ? "day" : "days"}
            </span>
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-bg-card p-4 transition hover:border-border-strong">
          <div className="flex items-center gap-2 text-text-secondary">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
              <CalendarClock className="h-4 w-4 text-accent" />
            </div>
            <span className="text-sm font-medium">Due</span>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight">
            {dueCount}
            <span className="ml-1 text-sm font-normal text-text-tertiary">
              {dueCount === 1 ? "card" : "cards"}
            </span>
          </p>
        </div>
      </div>

      {/* Start review CTA */}
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
            {dueCount > 0 ? `Review ${dueCount} due cards` : "Start practice session"}
          </span>
        </div>
        <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </Link>

      {/* Topic list */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-tertiary">
          Topics
        </h2>
        <div className="space-y-2">
          {topicsWithCounts.map((topic) => {
            const mastery = topicMastery[topic.id];
            const hasContent = topic.count > 0;
            const Icon = ICON_MAP[topic.icon] || Atom;

            return (
              <Link
                key={topic.id}
                href={`/practice/${topic.id}`}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-bg-card p-4 transition-all duration-200 hover:border-border-strong hover:bg-bg-hover"
              >
                {/* Icon */}
                <div
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
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
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-bg-input">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${mastery.mastery}%`,
                            backgroundColor: topic.color,
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium text-text-tertiary">
                        {mastery.mastery}%
                      </span>
                    </div>
                  )}
                  {hasContent && (!mastery || mastery.seen === 0) && (
                    <p className="mt-1 text-xs text-text-tertiary">Not started</p>
                  )}
                </div>

                <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
