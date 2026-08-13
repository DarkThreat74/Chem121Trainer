"use client";

import { useState } from "react";
import type { Question, SolverContent, ConversionFactor } from "@/lib/types";
import { Plus, X, Check, AlertTriangle } from "lucide-react";

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

  // Determine the current "output unit" that the next step's denominator must cancel
  function getCurrentOutputUnit(): string {
    if (steps.length === 0) {
      // Start with the given value's unit
      return content.given[0].unit;
    }
    // After a step, the output unit is the numerator of the last step
    return steps[steps.length - 1].numeratorUnit;
  }

  // Normalize a unit string for comparison (lowercase, trim, remove extra spaces)
  function normalizeUnit(unit: string): string {
    return unit.toLowerCase().trim().replace(/\s+/g, " ");
  }

  // Check if two units match (considering common variations)
  function unitsMatch(a: string, b: string): boolean {
    const na = normalizeUnit(a);
    const nb = normalizeUnit(b);
    if (na === nb) return true;
    // Handle common aliases
    const aliases: Record<string, string[]> = {
      "ug": ["µg", "mcg"],
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
        error: `Units don't cancel — the previous step outputs "${expectedDenominator}" but you put "${step.denominatorUnit}" in the denominator here. The denominator of this step must match the numerator/output of the previous step so they cancel out.`,
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

    // Check if we've reached the target unit
    if (unitsMatch(currentStep.numeratorUnit, content.target_unit)) {
      setPhase("answering");
    }

    // Reset current step form
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

  // Count significant figures in a number string
  function countSigFigs(numStr: string): number {
    const s = numStr.trim();
    if (!s) return 0;

    // Remove scientific notation part for sig fig counting
    const parts = s.split(/[eE]/);
    let mantissa = parts[0];

    // Remove decimal point
    const withoutDecimal = mantissa.replace(/\./g, "");

    // Remove leading zeros
    const noLeadingZeros = withoutDecimal.replace(/^0+/, "");

    if (noLeadingZeros.length === 0) return 0;

    // For numbers with a decimal point, all remaining digits are significant
    if (mantissa.includes(".")) {
      // Remove leading zeros but keep trailing zeros
      const trimmed = mantissa.replace(/^0+/, "");
      // Count all digits (including zeros) after removing leading zeros
      return trimmed.replace(/\./g, "").length;
    }

    // For numbers without a decimal point, trailing zeros are ambiguous
    // Remove trailing zeros
    const noTrailingZeros = noLeadingZeros.replace(/0+$/, "");
    return noTrailingZeros.length || 1;
  }

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

    // Check sig figs
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

  return (
    <div className="rounded-xl border border-border bg-bg-card p-6">
      {/* Sample badge */}
      {question.is_sample && (
        <span className="mb-3 inline-block rounded bg-bg-input px-2 py-0.5 text-xs text-muted">
          Sample
        </span>
      )}

      {/* Topic tag */}
      <div className="mb-3 text-xs text-text-secondary">
        {question.topic} · {question.subtopic}
      </div>

      {/* Problem prompt */}
      <p className="text-lg font-medium leading-snug">{content.prompt}</p>

      {/* Given values */}
      <div className="mt-4 space-y-1">
        {content.given.map((g, i) => (
          <div key={i} className="text-sm">
            <span className="text-text-secondary">Given: </span>
            <span className="font-mono font-medium">
              {g.value} {g.unit}
            </span>
          </div>
        ))}
        <div className="text-sm">
          <span className="text-text-secondary">Find: </span>
          <span className="font-mono font-medium text-accent">
            ? {content.target_unit}
          </span>
        </div>
      </div>

      {/* Solution chain visualization */}
      {steps.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Your solution:
          </p>
          {content.given.map((g, i) => (
            <div key={i} className="flex items-center gap-2 font-mono text-sm">
              <span className="rounded bg-bg-input px-2 py-1">
                {g.value} {g.unit}
              </span>
            </div>
          ))}
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-muted">×</span>
              <div className="flex flex-col items-center font-mono text-sm">
                <span className="rounded-t border border-b-0 border-border bg-bg-input px-3 py-1">
                  {step.numeratorValue} {step.numeratorUnit}
                </span>
                <span className="h-px w-full bg-border" />
                <span className="rounded-b border border-t-0 border-border bg-bg-input px-3 py-1">
                  {step.denominatorValue} {step.denominatorUnit}
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
            </div>
          ))}
        </div>
      )}

      {/* Step builder */}
      {phase === "building" && !disabled && (
        <div className="mt-6 border-t border-border pt-4">
          <p className="mb-3 text-sm text-text-secondary">
            Add a conversion factor. The denominator must be{" "}
            <span className="font-mono font-medium text-text">
              {currentOutputUnit}
            </span>{" "}
            to cancel the previous unit.
          </p>

          <div className="flex items-end gap-3">
            <span className="pb-3 font-mono text-muted">×</span>
            <div className="flex flex-col items-center">
              <input
                type="text"
                placeholder="value"
                value={currentStep.numeratorValue}
                onChange={(e) =>
                  setCurrentStep({
                    ...currentStep,
                    numeratorValue: e.target.value,
                  })
                }
                className="w-24 rounded-t border border-b-0 border-border bg-bg-input px-2 py-1.5 text-center font-mono text-sm outline-none focus:border-accent"
              />
              <input
                type="text"
                placeholder="unit"
                value={currentStep.numeratorUnit}
                onChange={(e) =>
                  setCurrentStep({
                    ...currentStep,
                    numeratorUnit: e.target.value,
                  })
                }
                className="w-24 border-x border-border bg-bg-input px-2 py-1.5 text-center font-mono text-xs outline-none focus:border-accent"
              />
              <div className="h-px w-full bg-border" />
              <input
                type="text"
                placeholder="value"
                value={currentStep.denominatorValue}
                onChange={(e) =>
                  setCurrentStep({
                    ...currentStep,
                    denominatorValue: e.target.value,
                  })
                }
                className="w-24 border-x border-border bg-bg-input px-2 py-1.5 text-center font-mono text-sm outline-none focus:border-accent"
              />
              <input
                type="text"
                placeholder={currentOutputUnit}
                value={currentStep.denominatorUnit}
                onChange={(e) =>
                  setCurrentStep({
                    ...currentStep,
                    denominatorUnit: e.target.value,
                  })
                }
                className="w-24 rounded-b border border-t-0 border-border bg-bg-input px-2 py-1.5 text-center font-mono text-xs outline-none focus:border-accent"
              />
            </div>
            <button
              onClick={handleAddStep}
              className="flex items-center gap-1 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>

          {currentStep.error && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-err/30 bg-err/5 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-err" />
              <p className="text-sm text-err">{currentStep.error}</p>
            </div>
          )}
        </div>
      )}

      {/* Final answer input */}
      {phase === "answering" && !disabled && (
        <div className="mt-6 border-t border-border pt-4">
          <div className="mb-3 flex items-center gap-2 text-sm text-ok">
            <Check className="h-4 w-4" />
            <span>Unit chain complete! Now enter your final numeric answer.</span>
          </div>
          <form onSubmit={handleFinalSubmit} className="flex items-end gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-sm text-text-secondary">
                Final answer (in {content.target_unit})
              </label>
              <input
                type="number"
                value={finalAnswer}
                onChange={(e) => setFinalAnswer(e.target.value)}
                autoFocus
                className="w-full rounded-lg border border-border bg-bg-input px-4 py-3 font-mono text-text outline-none focus:border-accent"
                placeholder="Enter numeric answer"
              />
            </div>
            <button
              type="submit"
              disabled={!finalAnswer.trim()}
              className="rounded-lg bg-accent px-6 py-3 font-medium text-white transition hover:bg-accent-hover disabled:opacity-30"
            >
              Check
            </button>
          </form>
          {finalError && (
            <p className="mt-2 text-sm text-err">{finalError}</p>
          )}
          <p className="mt-2 text-xs text-muted">
            Check your significant figures — the answer should have the correct
            number of sig figs based on the given data.
          </p>
        </div>
      )}

      {/* Disabled state (after answer) */}
      {disabled && phase === "answering" && (
        <div className="mt-4 border-t border-border pt-4">
          <p className="text-sm text-text-secondary">
            Final answer: <span className="font-mono">{finalAnswer} {content.target_unit}</span>
          </p>
        </div>
      )}
    </div>
  );
}
