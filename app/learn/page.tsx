"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Hash,
  FlaskConical,
  Atom,
  Scale,
  ArrowLeftRight,
  Beaker,
  Ruler,
  ChevronDown,
  Lightbulb,
  RotateCcw,
  Shuffle,
  Check,
  GraduationCap,
} from "lucide-react";

// ─── Data from CHEM 121 PDFs ───

const SIG_FIG_RULES = [
  {
    rule: "Non-zero digits are always significant",
    example: "12.3 → 3 sig figs",
  },
  {
    rule: "Captive zeros (between non-zero digits) are significant",
    example: "12.03 → 4 sig figs",
  },
  {
    rule: "Leading zeros (before first non-zero) are insignificant",
    example: "0.0123 → 3 sig figs",
  },
  {
    rule: "Trailing zeros after decimal point are significant",
    example: "123.0 → 4 sig figs",
  },
  {
    rule: "Trailing zeros before decimal point are ambiguous (count as insignificant)",
    example: "123,000 → 3 sig figs; use 1.23000 × 10⁵ for 6 sig figs",
  },
  {
    rule: "Defined conversions have infinite sig figs (e.g., 1 inch ≡ 2.54 cm)",
    example: "1000 mg = 1 g (exact, infinite sig figs)",
  },
];

const SIG_FIG_CALCULATION_RULES = [
  {
    op: "Multiplication / Division",
    rule: "Result has the same number of sig figs as the measurement with the fewest sig figs",
    example: "2.5 × 3.21 = 8.0 (2 sig figs, limited by 2.5)",
  },
  {
    op: "Addition / Subtraction",
    rule: "Result has the same number of decimal places as the measurement with the fewest decimal places",
    example: "12.1 + 3.45 = 15.6 (1 decimal place, limited by 12.1)",
  },
];

const METRIC_PREFIXES = [
  { prefix: "kilo (k)", factor: "10³", value: 1000 },
  { prefix: "deci (d)", factor: "10⁻¹", value: 0.1 },
  { prefix: "centi (c)", factor: "10⁻²", value: 0.01 },
  { prefix: "milli (m)", factor: "10⁻³", value: 0.001 },
  { prefix: "micro (µ)", factor: "10⁻⁶", value: 0.000001 },
  { prefix: "nano (n)", factor: "10⁻⁹", value: 0.000000001 },
];

const BASE_UNITS = [
  { quantity: "Length", unit: "meter (m)" },
  { quantity: "Mass", unit: "gram (g)" },
  { quantity: "Volume", unit: "liter (L)" },
  { quantity: "Molarity", unit: "moles/liter (mol/L = M)" },
];

const KEY_FORMULAS = [
  {
    name: "Molarity",
    formula: "M = moles of solute / liters of solution",
    desc: "Concentration = amount per volume",
  },
  {
    name: "Dilution Equation",
    formula: "C₁V₁ = C₂V₂",
    desc: "C₁V₁ = concentrated solution; C₂V₂ = dilute solution. Units must match on both sides.",
  },
  {
    name: "Avogadro's Number",
    formula: "1 mole = 6.02 × 10²³ particles",
    desc: "Connects the mole (count) to individual molecules/atoms",
  },
  {
    name: "Molar Mass",
    formula: "Molar mass = mass (g) / moles (mol)",
    desc: "Grams per mole — found on the periodic table",
  },
  {
    name: "Density",
    formula: "D = mass / volume",
    desc: "e.g., water = 1.00 g/mL by definition",
  },
  {
    name: "Percent Yield",
    formula: "% yield = (actual / theoretical) × 100",
    desc: "Compares what you actually made to what you should have made",
  },
];

const ATOMIC_PARTICLES = [
  { particle: "Proton", charge: "+1", mass: "1 amu", location: "Nucleus", note: "Number defines the element" },
  { particle: "Neutron", charge: "0", mass: "1 amu", location: "Nucleus", note: "Stabilizes the nucleus" },
  { particle: "Electron", charge: "-1", mass: "≈0 (1/1836)", location: "Orbitals", note: "Responsible for chemical reactivity" },
];

const STOICHIOMETRY_STEPS = [
  "Balance the chemical equation",
  "Convert given quantity to moles",
  "Use mole ratio from balanced equation",
  "Convert moles to desired unit (g, mL, molecules, etc.)",
  "For limiting reactant: calculate product from each reactant, use the smaller amount",
];

// Worked examples — step-by-step solutions for key problem types
const WORKED_EXAMPLES = [
  {
    topic: "Stoichiometry",
    problem: "How many grams of CO₂ are produced when 5.00 g of CH₄ burns? (MM CH₄ = 16.0, CO₂ = 44.0)",
    steps: [
      { label: "Balance the equation", detail: "CH₄ + 2O₂ → CO₂ + 2H₂O  (1 mol CH₄ → 1 mol CO₂)" },
      { label: "Convert grams to moles", detail: "5.00 g CH₄ ÷ 16.0 g/mol = 0.313 mol CH₄" },
      { label: "Apply mole ratio", detail: "0.313 mol CH₄ × (1 mol CO₂ / 1 mol CH₄) = 0.313 mol CO₂" },
      { label: "Convert moles to grams", detail: "0.313 mol CO₂ × 44.0 g/mol = 13.8 g CO₂" },
    ],
    answer: "13.8 g CO₂ (3 sig figs)",
  },
  {
    topic: "Dilutions",
    problem: "How many mL of 12.0 M HCl stock are needed to make 250 mL of 2.00 M solution?",
    steps: [
      { label: "Identify the formula", detail: "C₁V₁ = C₂V₂  →  V₁ = (C₂ × V₂) / C₁" },
      { label: "Plug in values", detail: "V₁ = (2.00 M × 250 mL) / 12.0 M" },
      { label: "Calculate", detail: "V₁ = 500 / 12.0 = 41.7 mL" },
      { label: "Interpret", detail: "Measure 41.7 mL of stock, add solvent to reach 250 mL total" },
    ],
    answer: "41.7 mL of stock (3 sig figs)",
  },
  {
    topic: "The Mole",
    problem: "How many molecules are in 3.50 moles of H₂O?",
    steps: [
      { label: "Identify the conversion", detail: "1 mole = 6.02 × 10²³ particles (Avogadro's number)" },
      { label: "Set up the calculation", detail: "3.50 mol × (6.02 × 10²³ molecules / 1 mol)" },
      { label: "Calculate", detail: "3.50 × 6.02 × 10²³ = 21.1 × 10²³ = 2.11 × 10²⁴" },
    ],
    answer: "2.11 × 10²⁴ molecules (3 sig figs)",
  },
];

// Vocabulary flashcards from "Terms in CHEM 121" PDF
const VOCAB_CARDS = [
  { term: "Accuracy", def: "How close a measurement is to the true value" },
  { term: "Precision", def: "How close repeated measurements are to each other" },
  { term: "Significant Figures", def: "Digits in a measurement that carry meaning (all certain digits + first uncertain)" },
  { term: "Atom", def: "Smallest unit of an element that retains its properties" },
  { term: "Molecule", def: "Two or more atoms bonded together" },
  { term: "Mole", def: "A quantity: 6.02 × 10²³ particles (like a dozen = 12)" },
  { term: "Molarity (M)", def: "Concentration in moles per liter (mol/L)" },
  { term: "Avogadro's Number", def: "6.02 × 10²³ — the number of particles in one mole" },
  { term: "Isotope", def: "Atoms of the same element with different numbers of neutrons" },
  { term: "Orbital", def: "Region of space with high probability (~95%) of finding an electron" },
  { term: "Atomic Number", def: "Number of protons — defines the element's identity" },
  { term: "Molar Mass", def: "Mass of one mole of a substance (g/mol)" },
  { term: "Stoichiometry", def: "Calculation of reactants and products in chemical reactions" },
  { term: "Limiting Reactant", def: "The reactant that runs out first, limiting product formation" },
  { term: "Dilution", def: "Reducing concentration by adding solvent (C₁V₁ = C₂V₂)" },
  { term: "Aqueous", def: "Dissolved in water (aq)" },
  { term: "Concentration", def: "Amount of solute per volume of solution" },
  { term: "Solute", def: "The substance dissolved in a solution" },
  { term: "Solvent", def: "The substance that dissolves the solute (usually water)" },
  { term: "Density", def: "Mass per unit volume (D = m/V)" },
  { term: "Conversion Factor", def: "A ratio used to convert one unit to another" },
  { term: "Dimensional Analysis", def: "Problem-solving method using unit cancellation" },
  { term: "Balanced Equation", def: "Equation with equal atoms on both sides (conservation of mass)" },
  { term: "Percent Yield", def: "(actual yield / theoretical yield) × 100" },
];

// ─── Components ───

function Section({
  id,
  icon: Icon,
  title,
  color,
  children,
}: {
  id: string;
  icon: any;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="scroll-mt-24"
    >
      <div className="mb-4 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}

function Flashcard({
  card,
  isFlipped,
  onClick,
}: {
  card: { term: string; def: string };
  isFlipped: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="relative h-48 cursor-pointer"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.4 }}
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-border bg-bg-card p-6 text-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <p className="text-xs uppercase tracking-wider text-text-tertiary">Term</p>
          <p className="mt-2 text-xl font-bold">{card.term}</p>
          <p className="mt-3 text-xs text-text-tertiary">Tap to flip</p>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-accent/30 bg-accent/5 p-6 text-center"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <p className="text-xs uppercase tracking-wider text-accent">Definition</p>
          <p className="mt-2 text-sm font-medium text-text-secondary">{card.def}</p>
        </div>
      </motion.div>
    </div>
  );
}

function WorkedExample({
  example,
  index,
}: {
  example: (typeof WORKED_EXAMPLES)[number];
  index: number;
}) {
  const [revealedSteps, setRevealedSteps] = useState(0);
  const isFullyRevealed = revealedSteps >= example.steps.length;

  return (
    <div className="rounded-2xl border border-border bg-bg-card p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <span className="rounded-lg bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
          {example.topic}
        </span>
      </div>
      <p className="mt-3 text-sm font-semibold leading-snug sm:text-base">
        {example.problem}
      </p>

      <div className="mt-4 space-y-2">
        {example.steps.map((step, i) => (
          <div
            key={i}
            className={`overflow-hidden transition-all duration-300 ${
              i < revealedSteps ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex gap-3 rounded-xl border border-border-subtle bg-bg-input p-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-purple-500 text-xs font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold">{step.label}</p>
                <p className="mt-0.5 font-mono text-xs text-text-secondary sm:text-sm">
                  {step.detail}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isFullyRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex items-center gap-2 rounded-xl border border-ok/20 bg-ok/5 p-3"
        >
          <Check className="h-4 w-4 flex-shrink-0 text-ok" />
          <span className="text-sm font-semibold text-ok">{example.answer}</span>
        </motion.div>
      )}

      <div className="mt-3 flex gap-2">
        {!isFullyRevealed && (
          <button
            onClick={() => setRevealedSteps((s) => s + 1)}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-accent-hover to-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <ChevronDown className="h-4 w-4" />
            {revealedSteps === 0 ? "Show step-by-step solution" : "Next step"}
          </button>
        )}
        {revealedSteps > 0 && (
          <button
            onClick={() => setRevealedSteps(0)}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-bg-input px-4 py-2 text-sm font-medium text-text-secondary transition hover:bg-bg-hover"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

export default function LearnPage() {
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffled, setShuffled] = useState(VOCAB_CARDS);

  function nextCard() {
    setFlipped(false);
    setTimeout(() => {
      setFlashcardIndex((i) => (i + 1) % shuffled.length);
    }, 200);
  }

  function prevCard() {
    setFlipped(false);
    setTimeout(() => {
      setFlashcardIndex((i) => (i - 1 + shuffled.length) % shuffled.length);
    }, 200);
  }

  function shuffleCards() {
    setFlipped(false);
    setTimeout(() => {
      const shuffledCopy = [...VOCAB_CARDS].sort(() => Math.random() - 0.5);
      setShuffled(shuffledCopy);
      setFlashcardIndex(0);
    }, 200);
  }

  const currentCard = shuffled[flashcardIndex];

  return (
    <div className="min-h-screen nav-offset safe-top safe-bottom">
      {/* Mobile header */}
      <header className="sticky top-0 z-10 border-b border-border-subtle bg-bg/80 backdrop-blur-xl md:hidden">
        <div className="px-4 py-4">
          <h1 className="text-lg font-bold tracking-tight">Study Guide</h1>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6 lg:py-8">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-3xl border border-border bg-gradient-to-br from-bg-card to-bg-elevated p-6 hero-gradient"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-purple-500">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Study Guide</h1>
              <p className="text-sm text-text-secondary">
                Key concepts, formulas, and vocabulary for Chem 121
              </p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-12">
          {/* Significant Figures */}
          <Section id="sig-figs" icon={Hash} title="Significant Figures" color="#fbbf24">
            <div className="space-y-3">
              <p className="text-sm text-text-secondary">
                Significant figures tell others how certain we are in a measurement.
                For example, 2.000 g means uncertainty in the mg place; 2 g means
                uncertainty in the gram place.
              </p>
              <div className="space-y-2">
                {SIG_FIG_RULES.map((r, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 rounded-xl border border-border bg-bg-card p-3"
                  >
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-warn/10 text-xs font-bold text-warn">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{r.rule}</p>
                      <p className="mt-0.5 font-mono text-xs text-text-tertiary">
                        {r.example}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Calculation rules */}
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-text-tertiary">
                Rounding in Calculations
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {SIG_FIG_CALCULATION_RULES.map((r, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border bg-bg-card p-4"
                  >
                    <p className="font-semibold text-warn">{r.op}</p>
                    <p className="mt-1 text-sm text-text-secondary">{r.rule}</p>
                    <p className="mt-2 font-mono text-xs text-text-tertiary">
                      {r.example}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* Metric System */}
          <Section id="metric" icon={Ruler} title="Metric System" color="#34d399">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-text-tertiary">
                  Base Units
                </h3>
                <div className="space-y-2">
                  {BASE_UNITS.map((u, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-border bg-bg-card px-3 py-2"
                    >
                      <span className="text-sm text-text-secondary">{u.quantity}</span>
                      <span className="font-mono text-sm font-semibold">{u.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-text-tertiary">
                  Prefixes
                </h3>
                <div className="space-y-2">
                  {METRIC_PREFIXES.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-border bg-bg-card px-3 py-2"
                    >
                      <span className="text-sm font-medium">{p.prefix}</span>
                      <span className="font-mono text-sm text-text-tertiary">
                        {p.factor}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Atomic Structure */}
          <Section id="atomic" icon={Atom} title="Atomic Structure" color="#a78bfa">
            <div className="overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-bg-elevated">
                    <th className="px-3 py-2.5 text-left font-semibold sm:px-4 sm:py-3">Particle</th>
                    <th className="px-3 py-2.5 text-left font-semibold sm:px-4 sm:py-3">Charge</th>
                    <th className="px-3 py-2.5 text-left font-semibold sm:px-4 sm:py-3">Mass</th>
                    <th className="hidden px-4 py-3 text-left font-semibold sm:table-cell">
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ATOMIC_PARTICLES.map((p, i) => (
                    <tr key={i} className="border-b border-border-subtle last:border-0">
                      <td className="px-3 py-2.5 font-semibold sm:px-4 sm:py-3">{p.particle}</td>
                      <td className="px-3 py-2.5 font-mono sm:px-4 sm:py-3">{p.charge}</td>
                      <td className="px-3 py-2.5 font-mono text-text-secondary sm:px-4 sm:py-3">{p.mass}</td>
                      <td className="hidden px-4 py-3 text-text-secondary sm:table-cell">
                        {p.location}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 rounded-xl border border-accent/20 bg-accent/5 p-3">
              <p className="text-sm text-text-secondary">
                <span className="font-semibold text-text">Isotopes</span> are atoms
                of the same element (same # of protons) with different numbers of
                neutrons. Periodic table masses are a{" "}
                <span className="font-semibold">weighted average</span> of all
                naturally occurring isotopes.
              </p>
            </div>
          </Section>

          {/* Key Formulas */}
          <Section id="formulas" icon={FlaskConical} title="Key Formulas" color="#2dd4bf">
            <div className="grid gap-3 sm:grid-cols-2">
              {KEY_FORMULAS.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border border-border bg-bg-card p-4"
                >
                  <p className="text-sm font-semibold text-accent">{f.name}</p>
                  <p className="mt-2 rounded-lg bg-bg-input px-3 py-2 font-mono text-sm font-semibold">
                    {f.formula}
                  </p>
                  <p className="mt-2 text-xs text-text-tertiary">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* Stoichiometry Steps */}
          <Section id="stoichiometry" icon={Scale} title="Stoichiometry Steps" color="#fb923c">
            <div className="space-y-2">
              {STOICHIOMETRY_STEPS.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 rounded-xl border border-border bg-bg-card p-3"
                >
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-purple-500 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-sm">{step}</span>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* Dimensional Analysis */}
          <Section
            id="dimensional-analysis"
            icon={ArrowLeftRight}
            title="Dimensional Analysis"
            color="#f0abfc"
          >
            <div className="rounded-2xl border border-border bg-bg-card p-5">
              <p className="text-sm text-text-secondary">
                The core idea: multiply by conversion factors (fractions equal to 1)
                so that units cancel, leaving only the desired unit.
              </p>
              <div className="mt-4 rounded-xl bg-bg-input p-4 font-mono text-sm">
                <div className="flex items-center justify-center gap-2">
                  <span className="rounded bg-bg-elevated px-2 py-1">25.0 g</span>
                  <span className="text-muted">×</span>
                  <div className="flex flex-col items-center">
                    <span className="rounded-t bg-bg-elevated px-2 py-0.5">1 mol</span>
                    <span className="h-px w-full bg-border" />
                    <span className="rounded-b bg-bg-elevated px-2 py-0.5">
                      <span className="unit-cancel text-err">58.4 g</span>
                    </span>
                  </div>
                  <span className="text-ok">=</span>
                  <span className="rounded bg-ok/10 px-2 py-1 text-ok">
                    0.428 mol
                  </span>
                </div>
              </div>
              <p className="mt-3 text-xs text-text-tertiary">
                The grams cancel, leaving moles. Always check that units cancel
                properly before calculating.
              </p>
            </div>
          </Section>

          {/* Worked Examples */}
          <Section id="worked-examples" icon={GraduationCap} title="Worked Examples" color="#34d399">
            <p className="mb-4 text-sm text-text-secondary">
              Reveal each step one at a time to follow along. Try to predict the
              next step before revealing it.
            </p>
            <div className="space-y-4">
              {WORKED_EXAMPLES.map((example, i) => (
                <WorkedExample key={i} example={example} index={i} />
              ))}
            </div>
          </Section>

          {/* Vocabulary Flashcards */}
          <Section id="vocabulary" icon={BookOpen} title="Vocabulary Flashcards" color="#60a5fa">
            <p className="mb-4 text-sm text-text-secondary">
              Tap the card to flip. Practice key terms from all Chem 121 topics.
            </p>

            {/* Flashcard */}
            <Flashcard
              card={currentCard}
              isFlipped={flipped}
              onClick={() => setFlipped(!flipped)}
            />

            {/* Controls */}
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={prevCard}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-bg-card px-4 py-2.5 text-sm font-medium transition hover:bg-bg-hover"
              >
                ← Prev
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={shuffleCards}
                  className="flex items-center gap-1.5 rounded-xl border border-border bg-bg-card px-3 py-2.5 text-sm transition hover:bg-bg-hover"
                  title="Shuffle"
                >
                  <Shuffle className="h-4 w-4" />
                </button>
                <span className="text-sm text-text-tertiary">
                  {flashcardIndex + 1} / {shuffled.length}
                </span>
              </div>
              <button
                onClick={nextCard}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-bg-card px-4 py-2.5 text-sm font-medium transition hover:bg-bg-hover"
              >
                Next →
              </button>
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="mt-12 rounded-2xl border border-border bg-bg-card p-4 text-center">
          <p className="text-sm text-text-tertiary">
            Ready to practice?{" "}
            <a href="/dashboard" className="font-semibold text-accent hover:underline">
              Go to Dashboard →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
