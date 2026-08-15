"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Question, SolverContent } from "@/lib/types";
import {
  Plus,
  X,
  Check,
  AlertTriangle,
  ArrowRight,
  Target,
  Lightbulb,
  Zap,
  Calculator,
} from "lucide-react";

interface SolverCardProps {
  question: Question;
  onAnswer: (isCorrect: boolean, explanation: string) => void;
  disabled: boolean;
}

interface Step {
  numeratorUnit: string;
  denominatorUnit: string;
  numeratorValue: string;
  denominatorValue: string;
  error?: string;
  accepted?: boolean;
}

const DIFFICULTY_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: "Easy", color: "#34d399" },
  2: { label: "Medium", color: "#fbbf24" },
  3: { label: "Hard", color: "#f87171" },
};

export default function SolverCard({ question, onAnswer, disabled }: SolverCardProps) {
  const content = question.content as SolverContent;
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<Step>({
    numeratorUnit: "",
    denominatorUnit: "",
    numeratorValue: "",
    denominatorValue: "",
  });
  const [finalAnswer, setFinalAnswer] = useState("");
  const [finalError, setFinalError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"building" | "answering">("building");
  const [showHint, setShowHint] = useState(false);

  function getCurrentOutputUnit(): string {
    if (steps.length === 0) return content.given[0].unit;
    return steps[steps.length - 1].numeratorUnit;
  }

  function normalizeUnit(unit: string): string {
    return unit.toLowerCase().trim().replace(/\s+/g, " ");
  }

  function unitsMatch(a: string, b: string): boolean {
    const na = normalizeUnit(a);
    const nb = normalizeUnit(b);
    if (na === nb) return true;
    const aliases: Record<string, string[]> = {
      ug: ["µg", "mcg"],
      "µg": ["ug", "mcg"],
    };
    for (const [key, vals] of Object.entries(aliases)) {
      const allVariants = [key, ...vals].map(normalizeUnit);
      if (allVariants.includes(na) && allVariants.includes(nb)) return true;
    }
    return false;
  }

  function validateStep(step: Step): { valid: boolean; error?: string } {
    if (!step.numeratorUnit.trim() || !step.denominatorUnit.trim()) {
      return { valid: false, error: "Fill in both units" };
    }
    if (!step.numeratorValue.trim() || !step.denominatorValue.trim()) {
      return { valid: false, error: "Fill in both values" };
    }
    const expectedDenominator = getCurrentOutputUnit();
    if (!unitsMatch(step.denominatorUnit, expectedDenominator)) {
      return {
        valid: false,
        error: `Units don't cancel — the denominator must be "${expectedDenominator}" to cancel the previous unit.`,
      };
    }
    return { valid: true };
  }

  function handleAddStep() {
    if (disabled) return;
    const validation = validateStep(currentStep);
    if (!validation.valid) {
      setCurrentStep({ ...currentStep, error: validation.error });
      return;
    }
    const newStep = { ...currentStep, accepted: true, error: undefined };
    setSteps([...steps, newStep]);
    if (unitsMatch(currentStep.numeratorUnit, content.target_unit)) {
      setPhase("answering");
    }
    setCurrentStep({
      numeratorUnit: "",
      denominatorUnit: "",
      numeratorValue: "",
      denominatorValue: "",
    });
  }

  function handleRemoveStep(index: number) {
    if (disabled) return;
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
    setPhase("building");
  }

  function countSigFigs(numStr: string): number {
    const s = numStr.trim();
    if (!s) return 0;
    const parts = s.split(/[eE]/);
    let mantissa = parts[0];
    // If there's a decimal point, all digits after the first non-zero digit count
    if (mantissa.includes(".")) {
      // Remove the decimal point, then strip leading zeros
      const digits = mantissa.replace(/\./g, "");
      const noLeadingZeros = digits.replace(/^0+/, "");
      if (noLeadingZeros.length === 0) return 0;
      return noLeadingZeros.length;
    }
    // No decimal point: trailing zeros are NOT significant
    const noLeadingZeros = mantissa.replace(/^0+/, "");
    if (noLeadingZeros.length === 0) return 0;
    const noTrailingZeros = noLeadingZeros.replace(/0+$/, "");
    return noTrailingZeros.length || 1;
  }

  // Running calculation
  const runningResult = useMemo(() => {
    if (steps.length === 0) return null;
    let value = content.given[0].value;
    for (const step of steps) {
      const num = parseFloat(step.numeratorValue);
      const den = parseFloat(step.denominatorValue);
      if (!isNaN(num) && !isNaN(den) && den !== 0) {
        value = (value * num) / den;
      } else {
        return null;
      }
    }
    return value;
  }, [steps, content.given]);

  function handleFinalSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (disabled) return;
    const parsed = parseFloat(finalAnswer);
    if (isNaN(parsed)) {
      setFinalError("Enter a valid number");
      return;
    }
    const expected = content.final_answer;
    const tolerance = (expected.tolerance_pct / 100) * expected.value;
    const numericCorrect = Math.abs(parsed - expected.value) <= tolerance;
    if (!numericCorrect) {
      onAnswer(
        false,
        `The correct answer is ${expected.value} ${expected.unit}. ${content.explanation}`
      );
      return;
    }
    const userSigFigs = countSigFigs(finalAnswer);
    if (userSigFigs !== expected.sigfigs) {
      onAnswer(
        false,
        `Your numeric value is correct (${parsed}), but you have ${userSigFigs} significant figure(s) — the answer should have ${expected.sigfigs}. ${content.explanation}`
      );
      return;
    }
    onAnswer(true, content.explanation);
  }

  const currentOutputUnit = getCurrentOutputUnit();
  const diffInfo = DIFFICULTY_LABELS[question.difficulty] || DIFFICULTY_LABELS[1];
  const hint = `Start from "${content.given[0].unit}" and work toward "${content.target_unit}". What conversion factor cancels the current unit?`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-3xl border border-border bg-bg-card p-4 sm:p-6"
    >
      {/* Topic tag + difficulty */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex-shrink-0 rounded-lg bg-bg-input px-2.5 py-1 text-xs font-medium capitalize text-text-secondary">
            {question.topic.replace(/-/g, " ")}
          </span>
          <span className="flex-shrink-0 text-text-tertiary">·</span>
          <span className="truncate text-xs capitalize text-text-tertiary">
            {question.subtopic.replace(/-/g, " ")}
          </span>
        </div>
        <div
          className="flex flex-shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold"
          style={{ backgroundColor: `${diffInfo.color}15`, color: diffInfo.color }}
        >
          <Zap className="h-3 w-3" />
          {diffInfo.label}
        </div>
      </div>

      {/* Problem prompt */}
      <p className="text-lg font-semibold leading-snug tracking-tight sm:text-xl">
        {content.prompt}
      </p>

      {/* Given values + target */}
      <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
        {content.given.map((g, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-xl border border-border bg-bg-input px-3 py-2"
          >
            <span className="text-xs font-medium text-text-tertiary">Given</span>
            <span className="font-mono text-sm font-semibold">
              {g.value} {g.unit}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-3 py-2">
          <Target className="h-3.5 w-3.5 text-accent" />
          <span className="text-xs font-medium text-accent">Find</span>
          <span className="font-mono text-sm font-semibold text-accent">
            ? {content.target_unit}
          </span>
        </div>
      </div>

      {/* Solution chain visualization */}
      {steps.length > 0 && (
        <div className="mt-5 space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
            Your solution
          </p>
          {content.given.map((g, i) => (
            <div key={i} className="flex items-center gap-2 font-mono text-sm">
              <span className="rounded-lg bg-bg-input px-3 py-1.5 font-semibold">
                {g.value} {g.unit}
              </span>
            </div>
          ))}
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <span className="text-muted">×</span>
              <div className="flex flex-col items-center font-mono text-sm">
                <span className="rounded-t-lg border border-b-0 border-border bg-bg-input px-3 py-1 font-semibold">
                  {step.numeratorValue}{" "}
                  <span className="text-accent">{step.numeratorUnit}</span>
                </span>
                <span className="h-px w-full bg-border" />
                <span className="rounded-b-lg border border-t-0 border-border bg-bg-input px-3 py-1 font-semibold">
                  {step.denominatorValue}{" "}
                  <span className="unit-cancel text-err">{step.denominatorUnit}</span>
                </span>
              </div>
              {!disabled && (
                <button
                  onClick={() => handleRemoveStep(i)}
                  className="text-muted transition hover:text-err"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </motion.div>
          ))}

          {/* Running calculation */}
          {runningResult !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2 font-mono text-sm"
            >
              <Calculator className="h-3.5 w-3.5 text-text-tertiary" />
              <span className="text-text-tertiary">Running:</span>
              <span className="font-semibold text-text">
                {runningResult.toPrecision(4)} {getCurrentOutputUnit()}
              </span>
            </motion.div>
          )}

          {phase === "answering" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <ArrowRight className="h-4 w-4 text-ok" />
              <span className="text-sm font-semibold text-ok">
                Units cancel to {content.target_unit}
              </span>
            </motion.div>
          )}
        </div>
      )}

      {/* Hint */}
      {!disabled && !showHint && (
        <button
          onClick={() => setShowHint(true)}
          className="mt-4 flex items-center gap-1.5 text-sm text-text-tertiary transition hover:text-warn"
        >
          <Lightbulb className="h-4 w-4" />
          Show hint
        </button>
      )}

      <AnimatePresence>
        {showHint && !disabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <div className="flex items-start gap-2 rounded-xl border border-warn/20 bg-warn/5 p-3">
              <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-warn" />
              <p className="text-sm text-text-secondary">{hint}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step builder */}
      {phase === "building" && !disabled && (
        <div className="mt-5 border-t border-border-subtle pt-4">
          <p className="mb-3 text-sm text-text-secondary">
            Add a conversion factor. The denominator must be{" "}
            <span className="font-mono font-semibold text-text">
              {currentOutputUnit}
            </span>{" "}
            to cancel.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-3">
            <div className="flex items-center gap-3">
              <span className="pb-3 font-mono text-muted">×</span>
              <div className="flex flex-col items-center">
                <input
                  type="text"
                  placeholder="value"
                  value={currentStep.numeratorValue}
                  onChange={(e) =>
                    setCurrentStep({ ...currentStep, numeratorValue: e.target.value })
                  }
                  className="w-28 rounded-t-lg border border-b-0 border-border bg-bg-input px-2 py-1.5 text-center font-mono text-sm outline-none transition focus:border-accent sm:w-24"
                />
                <input
                  type="text"
                  placeholder="unit"
                  value={currentStep.numeratorUnit}
                  onChange={(e) =>
                    setCurrentStep({ ...currentStep, numeratorUnit: e.target.value })
                  }
                  className="w-28 border-x border-border bg-bg-input px-2 py-1.5 text-center font-mono text-xs outline-none transition focus:border-accent sm:w-24"
                />
                <div className="h-px w-full bg-border" />
                <input
                  type="text"
                  placeholder="value"
                  value={currentStep.denominatorValue}
                  onChange={(e) =>
                    setCurrentStep({ ...currentStep, denominatorValue: e.target.value })
                  }
                  className="w-28 border-x border-border bg-bg-input px-2 py-1.5 text-center font-mono text-sm outline-none transition focus:border-accent sm:w-24"
                />
                <input
                  type="text"
                  placeholder={currentOutputUnit}
                  value={currentStep.denominatorUnit}
                  onChange={(e) =>
                    setCurrentStep({ ...currentStep, denominatorUnit: e.target.value })
                  }
                  className="w-28 rounded-b-lg border border-t-0 border-border bg-bg-input px-2 py-1.5 text-center font-mono text-xs outline-none transition focus:border-accent sm:w-24"
                />
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddStep}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-accent-hover to-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 sm:justify-start"
            >
              <Plus className="h-4 w-4" />
              Add step
            </motion.button>
          </div>

          {currentStep.error && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: [0, -6, 6, 0] }}
              className="mt-3 flex items-start gap-2 rounded-xl border border-err/30 bg-err/10 p-3"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-err" />
              <p className="text-sm text-err">{currentStep.error}</p>
            </motion.div>
          )}
        </div>
      )}

      {/* Final answer input */}
      {phase === "answering" && !disabled && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 border-t border-border-subtle pt-4"
        >
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-ok">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ok/20">
              <Check className="h-3.5 w-3.5" />
            </div>
            <span>Unit chain complete! Enter your final answer.</span>
          </div>
          <form onSubmit={handleFinalSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1.5 block text-sm text-text-secondary">
                Final answer (in {content.target_unit})
              </label>
              <input
                type="number"
                value={finalAnswer}
                onChange={(e) => setFinalAnswer(e.target.value)}
                autoFocus
                className="w-full rounded-xl border border-border bg-bg-input px-4 py-3 font-mono text-lg font-medium text-text outline-none transition focus:border-accent focus:bg-bg-hover"
                placeholder="Enter numeric answer"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!finalAnswer.trim()}
              className="rounded-xl bg-gradient-to-r from-accent-hover to-accent px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-30"
            >
              Check
            </motion.button>
          </form>
          {finalError && (
            <p className="mt-2 text-sm text-err">{finalError}</p>
          )}
          <p className="mt-2 text-xs text-text-tertiary">
            Check your significant figures — the answer should have the correct
            number of sig figs based on the given data.
          </p>
        </motion.div>
      )}

      {/* Disabled state */}
      {disabled && phase === "answering" && (
        <div className="mt-4 border-t border-border-subtle pt-4">
          <p className="text-sm text-text-secondary">
            Final answer:{" "}
            <span className="font-mono font-semibold text-text">
              {finalAnswer} {content.target_unit}
            </span>
          </p>
        </div>
      )}
    </motion.div>
  );
}
