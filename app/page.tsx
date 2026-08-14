"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FlaskConical,
  Sparkles,
  Brain,
  TrendingUp,
  Target,
  ArrowRight,
  Atom,
  Hash,
  Scale,
  Beaker,
  Ruler,
  ArrowLeftRight,
} from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "Spaced Repetition",
    desc: "FSRS algorithm schedules reviews at the optimal moment for long-term retention",
    color: "#818cf8",
  },
  {
    icon: Target,
    title: "Guided Solver",
    desc: "Build dimensional analysis chains step-by-step with real-time unit cancellation",
    color: "#34d399",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    desc: "Streaks, mastery scores, and per-topic analytics keep you motivated",
    color: "#fbbf24",
  },
];

const TOPIC_PREVIEW = [
  { icon: Atom, label: "Fundamentals", color: "#818cf8" },
  { icon: Ruler, label: "Metric System", color: "#34d399" },
  { icon: Hash, label: "Sig Figures", color: "#fbbf24" },
  { icon: ArrowLeftRight, label: "Dim Analysis", color: "#f0abfc" },
  { icon: Beaker, label: "The Mole", color: "#60a5fa" },
  { icon: Scale, label: "Stoichiometry", color: "#fb923c" },
  { icon: FlaskConical, label: "Dilutions", color: "#2dd4bf" },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden hero-gradient">
      {/* Floating background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-accent/5 blur-3xl"
          animate={{ y: [0, 30, 0], x: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-0 top-40 h-80 w-80 rounded-full bg-purple-500/5 blur-3xl"
          animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 h-72 w-72 rounded-full bg-ok/5 blur-3xl"
          animate={{ y: [0, 25, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 py-12 text-center safe-top safe-bottom">
        {/* Logo badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-purple-500 glow-accent"
        >
          <FlaskConical className="h-8 w-8 text-white" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl"
        >
          <span className="gradient-text">Chem 121</span> Trainer
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-4 max-w-xl text-lg text-text-secondary"
        >
          Master introductory chemistry through interactive practice, guided
          problem-solving, and science-backed spaced repetition.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <Link
            href="/dashboard"
            className="group flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent-hover to-accent px-8 py-4 font-semibold text-white transition-all duration-200 hover:opacity-90 glow-accent"
          >
            Start Learning
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/learn"
            className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-bg-card px-8 py-4 font-semibold text-text transition-all duration-200 hover:border-border-strong hover:bg-bg-hover"
          >
            <Sparkles className="h-4 w-4 text-accent" />
            Study Guide
          </Link>
        </motion.div>

        {/* Topic preview pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 flex flex-wrap justify-center gap-2"
        >
          {TOPIC_PREVIEW.map((topic, i) => {
            const Icon = topic.icon;
            return (
              <motion.div
                key={topic.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.05, type: "spring", stiffness: 200 }}
                className="flex items-center gap-2 rounded-full border border-border bg-bg-card/50 px-3.5 py-2 backdrop-blur-sm"
              >
                <Icon className="h-4 w-4" style={{ color: topic.color }} />
                <span className="text-sm font-medium text-text-secondary">
                  {topic.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 grid w-full gap-4 sm:grid-cols-3"
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-bg-card/50 p-5 text-left backdrop-blur-sm transition hover:border-border-strong"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <Icon className="h-5 w-5" style={{ color: feature.color }} />
                </div>
                <h3 className="mt-3 font-semibold">{feature.title}</h3>
                <p className="mt-1 text-sm text-text-secondary">{feature.desc}</p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
