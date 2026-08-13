"use client";

import Link from "next/link";
import { Flame, CalendarClock, TrendingUp, ChevronRight } from "lucide-react";
import type { TopicInfo } from "@/lib/types";

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
  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-bg-card p-4">
          <div className="flex items-center gap-2 text-text-secondary">
            <Flame className="h-4 w-4 text-warn" />
            <span className="text-sm">Streak</span>
          </div>
          <p className="mt-1 text-2xl font-bold">
            {streak} <span className="text-base font-normal text-text-secondary">days</span>
          </p>
        </div>

        <div className="rounded-xl border border-border bg-bg-card p-4">
          <div className="flex items-center gap-2 text-text-secondary">
            <CalendarClock className="h-4 w-4 text-accent" />
            <span className="text-sm">Due today</span>
          </div>
          <p className="mt-1 text-2xl font-bold">
            {dueCount} <span className="text-base font-normal text-text-secondary">cards</span>
          </p>
        </div>
      </div>

      {/* Start review button */}
      <Link
        href="/review"
        className="block rounded-xl bg-accent py-4 text-center font-semibold text-white transition hover:bg-accent-hover"
      >
        {dueCount > 0 ? `Start Review (${dueCount})` : "Start Practice"}
      </Link>

      {/* Topic list */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-text-secondary">
          <TrendingUp className="h-4 w-4" />
          Topics
        </h2>
        <div className="space-y-2">
          {topicsWithCounts.map((topic) => {
            const mastery = topicMastery[topic.id];
            const hasContent = topic.count > 0;
            return (
              <Link
                key={topic.id}
                href={`/practice/${topic.id}`}
                className="flex items-center justify-between rounded-xl border border-border bg-bg-card p-4 transition hover:border-border-subtle hover:bg-bg-elevated"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{topic.label}</span>
                    {topic.count > 0 && (
                      <span className="rounded bg-bg-input px-1.5 py-0.5 text-xs text-muted">
                        {topic.count}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-sm text-text-secondary">
                    {hasContent ? topic.description : "No content yet — import needed"}
                  </p>
                  {mastery && mastery.totalReviews > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-bg-input">
                        <div
                          className="h-full rounded-full bg-accent transition-all"
                          style={{ width: `${mastery.mastery}%` }}
                        />
                      </div>
                      <span className="text-xs text-text-secondary">
                        {mastery.mastery}% mastery
                      </span>
                    </div>
                  )}
                  {hasContent && (!mastery || mastery.seen === 0) && (
                    <p className="mt-1 text-xs text-muted">Not started</p>
                  )}
                  {!hasContent && (
                    <p className="mt-1 text-xs text-warn">
                      Awaiting content import from course materials
                    </p>
                  )}
                </div>
                <ChevronRight className="ml-2 h-5 w-5 flex-shrink-0 text-muted" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
