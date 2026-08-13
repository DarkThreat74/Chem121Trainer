import type { Question } from "./types";

// SAMPLE DATA ONLY — clearly marked. Real content to be imported from course worksheets.
export const SAMPLE_QUESTIONS: Question[] = [
  // ============================================================
  // FUNDAMENTALS & DEFINITIONS (quiz mode) — 5 sample questions
  // ============================================================
  {
    id: "fund-001",
    topic: "fundamentals",
    subtopic: "measurement-definition",
    mode: "quiz",
    difficulty: 1,
    is_sample: true,
    content: {
      prompt: "What two components make up every measurement?",
      answer_type: "multiple-choice",
      correct_answer: "A number and a unit",
      choices: [
        "A number and a unit",
        "A number only",
        "A unit only",
        "A number, a unit, and an uncertainty",
      ],
      explanation:
        "A measurement consists of a number (the magnitude) and a unit (what is being measured).",
    },
  },
  {
    id: "fund-002",
    topic: "fundamentals",
    subtopic: "accuracy-vs-precision",
    mode: "quiz",
    difficulty: 1,
    is_sample: true,
    content: {
      prompt: "Accuracy refers to how close a measurement is to:",
      answer_type: "multiple-choice",
      correct_answer: "The true value",
      choices: [
        "The true value",
        "Each other",
        "The average of all measurements",
        "The last digit of the measurement",
      ],
      explanation:
        "Accuracy = closeness to the true/accepted value. Precision = closeness of repeated measurements to each other.",
    },
  },
  {
    id: "fund-003",
    topic: "fundamentals",
    subtopic: "physical-vs-chemical",
    mode: "quiz",
    difficulty: 2,
    is_sample: true,
    content: {
      prompt:
        'A piece of paper burns when lit on fire. Is "flammability" a physical or chemical property?',
      answer_type: "multiple-choice",
      correct_answer: "Chemical property",
      choices: ["Physical property", "Chemical property", "Neither", "Both"],
      explanation:
        "Flammability is a chemical property — it describes the ability to undergo a chemical change (combustion).",
    },
  },
  {
    id: "fund-004",
    topic: "fundamentals",
    subtopic: "atom-vs-molecule",
    mode: "quiz",
    difficulty: 1,
    is_sample: true,
    content: {
      prompt: "What is the relationship between an atom and a molecule?",
      answer_type: "multiple-choice",
      correct_answer: "A molecule is two or more atoms bonded together",
      choices: [
        "A molecule is two or more atoms bonded together",
        "An atom is made of molecules",
        "Atoms and molecules are the same thing",
        "A molecule is a single atom",
      ],
      explanation:
        "An atom is the smallest unit of an element. A molecule is two or more atoms held together by chemical bonds.",
    },
  },
  {
    id: "fund-005",
    topic: "fundamentals",
    subtopic: "mass-vs-weight",
    mode: "quiz",
    difficulty: 1,
    is_sample: true,
    content: {
      prompt: "What is the difference between mass and weight?",
      answer_type: "multiple-choice",
      correct_answer: "Mass is constant; weight depends on gravity",
      choices: [
        "Mass is constant; weight depends on gravity",
        "Weight is constant; mass depends on gravity",
        "Mass and weight are the same thing",
        "Mass is measured in newtons",
      ],
      explanation:
        "Mass = amount of matter (constant everywhere). Weight = gravitational force on that mass (changes with location).",
    },
  },

  // ============================================================
  // METRIC SYSTEM & PREFIXES (quiz mode) — 5 sample questions
  // ============================================================
  {
    id: "metric-001",
    topic: "metric-system",
    subtopic: "prefix-meaning",
    mode: "quiz",
    difficulty: 1,
    is_sample: true,
    content: {
      prompt: "What does the prefix 'kilo' mean?",
      answer_type: "multiple-choice",
      correct_answer: "1000",
      choices: ["100", "1000", "0.01", "0.001"],
      explanation: "The prefix 'kilo' means 1000, so 1 kg = 1000 g.",
    },
  },
  {
    id: "metric-002",
    topic: "metric-system",
    subtopic: "prefix-meaning",
    mode: "quiz",
    difficulty: 1,
    is_sample: true,
    content: {
      prompt: "What does the prefix 'milli' mean?",
      answer_type: "multiple-choice",
      correct_answer: "0.001",
      choices: ["0.1", "0.01", "0.001", "0.000001"],
      explanation: "The prefix 'milli' means 0.001, so 1 mL = 0.001 L.",
    },
  },
  {
    id: "metric-003",
    topic: "metric-system",
    subtopic: "prefix-meaning",
    mode: "quiz",
    difficulty: 2,
    is_sample: true,
    content: {
      prompt: "What does the prefix 'micro' (µ) mean?",
      answer_type: "multiple-choice",
      correct_answer: "0.000001",
      choices: ["0.001", "0.0001", "0.000001", "0.000000001"],
      explanation: "The prefix 'micro' (µ) means 10⁻⁶ = 0.000001.",
    },
  },
  {
    id: "metric-004",
    topic: "metric-system",
    subtopic: "prefix-conversion",
    mode: "quiz",
    difficulty: 2,
    is_sample: true,
    content: {
      prompt: "Convert 2.5 g to mg.",
      answer_type: "numeric",
      correct_answer: 2500,
      explanation: "1 g = 1000 mg, so 2.5 g × 1000 mg/g = 2500 mg.",
    },
  },
  {
    id: "metric-005",
    topic: "metric-system",
    subtopic: "prefix-conversion",
    mode: "quiz",
    difficulty: 2,
    is_sample: true,
    content: {
      prompt: "Convert 375 mg to g.",
      answer_type: "numeric",
      correct_answer: 0.375,
      explanation: "1 mg = 0.001 g, so 375 mg × 0.001 g/mg = 0.375 g.",
    },
  },

  // ============================================================
  // SIGNIFICANT FIGURES (quiz mode) — 15 sample questions
  // ============================================================
  {
    id: "sigfig-001",
    topic: "significant-figures",
    subtopic: "counting-rules",
    mode: "quiz",
    difficulty: 1,
    is_sample: true,
    content: {
      prompt: "How many significant figures are in 3.45?",
      answer_type: "numeric",
      correct_answer: 3,
      explanation:
        "All non-zero digits are significant. 3.45 has 3 significant figures.",
    },
  },
  {
    id: "sigfig-002",
    topic: "significant-figures",
    subtopic: "counting-rules",
    mode: "quiz",
    difficulty: 1,
    is_sample: true,
    content: {
      prompt: "How many significant figures are in 2006?",
      answer_type: "numeric",
      correct_answer: 4,
      explanation:
        "Non-zero digits are significant, and captive zeros (between significant digits) are significant. 2006 has 4 sig figs.",
    },
  },
  {
    id: "sigfig-003",
    topic: "significant-figures",
    subtopic: "counting-rules",
    mode: "quiz",
    difficulty: 2,
    is_sample: true,
    content: {
      prompt: "How many significant figures are in 0.0042?",
      answer_type: "numeric",
      correct_answer: 2,
      explanation:
        "Leading zeros are NOT significant. 0.0042 has 2 sig figs (the 4 and 2).",
    },
  },
  {
    id: "sigfig-004",
    topic: "significant-figures",
    subtopic: "counting-rules",
    mode: "quiz",
    difficulty: 2,
    is_sample: true,
    content: {
      prompt: "How many significant figures are in 8370.00?",
      answer_type: "numeric",
      correct_answer: 6,
      explanation:
        "Non-zero digits are significant, captive zeros are significant, and trailing zeros after the decimal are significant. 8370.00 has 6 sig figs.",
    },
  },
  {
    id: "sigfig-005",
    topic: "significant-figures",
    subtopic: "counting-rules",
    mode: "quiz",
    difficulty: 2,
    is_sample: true,
    content: {
      prompt: "How many significant figures are in 100.0?",
      answer_type: "numeric",
      correct_answer: 4,
      explanation:
        "The 1, the two captive zeros, and the trailing zero after the decimal are all significant. 100.0 has 4 sig figs.",
    },
  },
  {
    id: "sigfig-006",
    topic: "significant-figures",
    subtopic: "counting-rules",
    mode: "quiz",
    difficulty: 1,
    is_sample: true,
    content: {
      prompt: "How many significant figures are in 4.0200?",
      answer_type: "numeric",
      correct_answer: 5,
      explanation:
        "All digits are significant: 4, 0 (captive), 2, 0 (trailing), 0 (trailing). 4.0200 has 5 sig figs.",
    },
  },
  {
    id: "sigfig-007",
    topic: "significant-figures",
    subtopic: "counting-rules",
    mode: "quiz",
    difficulty: 2,
    is_sample: true,
    content: {
      prompt: "How many significant figures are in 1.007?",
      answer_type: "numeric",
      correct_answer: 4,
      explanation:
        "The captive zeros between 1 and 7 are significant. 1.007 has 4 sig figs.",
    },
  },
  {
    id: "sigfig-008",
    topic: "significant-figures",
    subtopic: "counting-rules",
    mode: "quiz",
    difficulty: 2,
    is_sample: true,
    content: {
      prompt: "How many significant figures are in 0.0005?",
      answer_type: "numeric",
      correct_answer: 1,
      explanation:
        "Leading zeros are never significant; only the 5 counts. 0.0005 has 1 sig fig.",
    },
  },
  {
    id: "sigfig-009",
    topic: "significant-figures",
    subtopic: "counting-rules",
    mode: "quiz",
    difficulty: 3,
    is_sample: true,
    content: {
      prompt: "How many significant figures are in 10.030?",
      answer_type: "numeric",
      correct_answer: 5,
      explanation:
        "1, 0 (captive), 0 (captive), 3, and 0 (trailing after decimal) are all significant. 10.030 has 5 sig figs.",
    },
  },
  {
    id: "sigfig-010",
    topic: "significant-figures",
    subtopic: "counting-rules",
    mode: "quiz",
    difficulty: 1,
    is_sample: true,
    content: {
      prompt: "How many significant figures are in 25.0?",
      answer_type: "numeric",
      correct_answer: 3,
      explanation:
        "The trailing zero after the decimal is significant. 25.0 has 3 sig figs.",
    },
  },
  {
    id: "sigfig-011",
    topic: "significant-figures",
    subtopic: "counting-rules",
    mode: "quiz",
    difficulty: 3,
    is_sample: true,
    content: {
      prompt: "How many significant figures are in 0.03040?",
      answer_type: "numeric",
      correct_answer: 4,
      explanation:
        "Leading zeros don't count. The 3, 0 (captive), 4, and 0 (trailing after decimal) are significant. 0.03040 has 4 sig figs.",
    },
  },
  {
    id: "sigfig-012",
    topic: "significant-figures",
    subtopic: "rounding-mult-div",
    mode: "quiz",
    difficulty: 2,
    is_sample: true,
    content: {
      prompt:
        "For 2.5 × 2.5, how many significant figures should the answer have?",
      answer_type: "numeric",
      correct_answer: 2,
      explanation:
        "For multiplication/division, the result has the same number of sig figs as the factor with the fewest. Both factors have 2 sig figs, so the answer should have 2.",
    },
  },
  {
    id: "sigfig-013",
    topic: "significant-figures",
    subtopic: "rounding-add-sub",
    mode: "quiz",
    difficulty: 2,
    is_sample: true,
    content: {
      prompt:
        "For 12.1 + 3.447, how many decimal places should the answer have?",
      answer_type: "numeric",
      correct_answer: 1,
      explanation:
        "For addition/subtraction, the result has the same number of decimal places as the term with the fewest. 12.1 has 1 decimal place, so the answer should have 1.",
    },
  },
  {
    id: "sigfig-014",
    topic: "significant-figures",
    subtopic: "rounding-mult-div",
    mode: "quiz",
    difficulty: 3,
    is_sample: true,
    content: {
      prompt:
        "For 4.56 × 1.4, how many significant figures should the answer have?",
      answer_type: "numeric",
      correct_answer: 2,
      explanation:
        "For multiplication, use the fewest sig figs among the factors. 1.4 has 2 sig figs (fewest), so the answer should have 2 sig figs.",
    },
  },
  {
    id: "sigfig-015",
    topic: "significant-figures",
    subtopic: "counting-rules",
    mode: "quiz",
    difficulty: 2,
    is_sample: true,
    content: {
      prompt: "How many significant figures are in 0.0100?",
      answer_type: "numeric",
      correct_answer: 3,
      explanation:
        "Leading zeros don't count. The 1 and the two trailing zeros after the decimal are significant. 0.0100 has 3 sig figs.",
    },
  },

  // ============================================================
  // DIMENSIONAL ANALYSIS (solver mode) — 10 sample problems
  // ============================================================
  {
    id: "diman-001",
    topic: "dimensional-analysis",
    subtopic: "single-step",
    mode: "solver",
    difficulty: 1,
    is_sample: true,
    content: {
      prompt: "Convert 5.00 km to meters.",
      given: [{ value: 5.0, unit: "km", sigfigs: 3 }],
      target_unit: "m",
      solution_chain: [
        { numerator: "1000 m", denominator: "1 km" },
      ],
      final_answer: { value: 5000, unit: "m", sigfigs: 3, tolerance_pct: 1 },
      explanation: "1 km = 1000 m. Multiply by 1000 m/km to cancel km and get m.",
    },
  },
  {
    id: "diman-002",
    topic: "dimensional-analysis",
    subtopic: "single-step",
    mode: "solver",
    difficulty: 1,
    is_sample: true,
    content: {
      prompt: "Convert 2500 mg to grams.",
      given: [{ value: 2500, unit: "mg", sigfigs: 2 }],
      target_unit: "g",
      solution_chain: [
        { numerator: "1 g", denominator: "1000 mg" },
      ],
      final_answer: { value: 2.5, unit: "g", sigfigs: 2, tolerance_pct: 1 },
      explanation: "1 g = 1000 mg. Multiply by 1 g/1000 mg to cancel mg and get g.",
    },
  },
  {
    id: "diman-003",
    topic: "dimensional-analysis",
    subtopic: "two-step",
    mode: "solver",
    difficulty: 2,
    is_sample: true,
    content: {
      prompt: "Convert 3.00 km to cm.",
      given: [{ value: 3.0, unit: "km", sigfigs: 3 }],
      target_unit: "cm",
      solution_chain: [
        { numerator: "1000 m", denominator: "1 km" },
        { numerator: "100 cm", denominator: "1 m" },
      ],
      final_answer: { value: 300000, unit: "cm", sigfigs: 3, tolerance_pct: 1 },
      explanation:
        "First convert km → m (×1000), then m → cm (×100). 3.00 km = 300,000 cm.",
    },
  },
  {
    id: "diman-004",
    topic: "dimensional-analysis",
    subtopic: "single-step",
    mode: "solver",
    difficulty: 1,
    is_sample: true,
    content: {
      prompt: "Convert 45.0 mL to L.",
      given: [{ value: 45.0, unit: "mL", sigfigs: 3 }],
      target_unit: "L",
      solution_chain: [
        { numerator: "1 L", denominator: "1000 mL" },
      ],
      final_answer: { value: 0.045, unit: "L", sigfigs: 3, tolerance_pct: 1 },
      explanation: "1 L = 1000 mL. 45.0 mL × (1 L / 1000 mL) = 0.0450 L.",
    },
  },
  {
    id: "diman-005",
    topic: "dimensional-analysis",
    subtopic: "three-step",
    mode: "solver",
    difficulty: 3,
    is_sample: true,
    content: {
      prompt:
        "Convert 65.0 miles per hour to meters per second. (1 mile = 1.609 km)",
      given: [{ value: 65.0, unit: "mile/h", sigfigs: 3 }],
      target_unit: "m/s",
      solution_chain: [
        { numerator: "1.609 km", denominator: "1 mile" },
        { numerator: "1000 m", denominator: "1 km" },
        { numerator: "1 h", denominator: "3600 s" },
      ],
      final_answer: { value: 29.1, unit: "m/s", sigfigs: 3, tolerance_pct: 1 },
      explanation:
        "65.0 mile/h × (1.609 km/mile) × (1000 m/km) × (1 h/3600 s) = 29.1 m/s.",
    },
  },
  {
    id: "diman-006",
    topic: "dimensional-analysis",
    subtopic: "single-step",
    mode: "solver",
    difficulty: 1,
    is_sample: true,
    content: {
      prompt: "Convert 0.500 L to mL.",
      given: [{ value: 0.5, unit: "L", sigfigs: 3 }],
      target_unit: "mL",
      solution_chain: [
        { numerator: "1000 mL", denominator: "1 L" },
      ],
      final_answer: { value: 500, unit: "mL", sigfigs: 3, tolerance_pct: 1 },
      explanation: "1 L = 1000 mL. 0.500 L × 1000 mL/L = 500 mL.",
    },
  },
  {
    id: "diman-007",
    topic: "dimensional-analysis",
    subtopic: "two-step",
    mode: "solver",
    difficulty: 2,
    is_sample: true,
    content: {
      prompt: "Convert 2.50 g/cm³ to kg/m³.",
      given: [{ value: 2.5, unit: "g/cm^3", sigfigs: 3 }],
      target_unit: "kg/m^3",
      solution_chain: [
        { numerator: "1 kg", denominator: "1000 g" },
        { numerator: "1000000 cm^3", denominator: "1 m^3" },
      ],
      final_answer: { value: 2500, unit: "kg/m^3", sigfigs: 3, tolerance_pct: 1 },
      explanation:
        "2.50 g/cm³ × (1 kg/1000 g) × (10⁶ cm³/1 m³) = 2500 kg/m³.",
    },
  },
  {
    id: "diman-008",
    topic: "dimensional-analysis",
    subtopic: "three-step",
    mode: "solver",
    difficulty: 3,
    is_sample: true,
    content: {
      prompt:
        "A car travels 120. km in 2.00 hours. What is the speed in m/s?",
      given: [
        { value: 120, unit: "km", sigfigs: 3 },
        { value: 2.0, unit: "h", sigfigs: 3 },
      ],
      target_unit: "m/s",
      solution_chain: [
        { numerator: "1000 m", denominator: "1 km" },
        { numerator: "1 h", denominator: "3600 s" },
        { numerator: "1", denominator: "2.00 h" },
      ],
      final_answer: { value: 16.7, unit: "m/s", sigfigs: 3, tolerance_pct: 1 },
      explanation:
        "120 km / 2.00 h = 60.0 km/h. Then 60.0 km/h × (1000 m/km) × (1 h/3600 s) = 16.7 m/s.",
    },
  },
  {
    id: "diman-009",
    topic: "dimensional-analysis",
    subtopic: "two-step",
    mode: "solver",
    difficulty: 2,
    is_sample: true,
    content: {
      prompt: "Convert 450 µg to mg.",
      given: [{ value: 450, unit: "ug", sigfigs: 3 }],
      target_unit: "mg",
      solution_chain: [
        { numerator: "1 g", denominator: "1000000 ug" },
        { numerator: "1000 mg", denominator: "1 g" },
      ],
      final_answer: { value: 0.45, unit: "mg", sigfigs: 3, tolerance_pct: 1 },
      explanation:
        "450 µg × (1 g/10⁶ µg) × (1000 mg/1 g) = 0.450 mg.",
    },
  },
  {
    id: "diman-010",
    topic: "dimensional-analysis",
    subtopic: "two-step",
    mode: "solver",
    difficulty: 2,
    is_sample: true,
    content: {
      prompt: "How many seconds are in 2.50 days?",
      given: [{ value: 2.5, unit: "day", sigfigs: 3 }],
      target_unit: "s",
      solution_chain: [
        { numerator: "24 h", denominator: "1 day" },
        { numerator: "3600 s", denominator: "1 h" },
      ],
      final_answer: { value: 216000, unit: "s", sigfigs: 3, tolerance_pct: 1 },
      explanation:
        "2.50 days × (24 h/1 day) × (3600 s/1 h) = 216,000 s = 2.16 × 10⁵ s.",
    },
  },

  // ============================================================
  // THE MOLE (solver mode) — 5 sample problems
  // ============================================================
  {
    id: "mole-001",
    topic: "the-mole",
    subtopic: "mole-to-particles",
    mode: "solver",
    difficulty: 1,
    is_sample: true,
    content: {
      prompt: "How many molecules are in 2.50 moles of H2O?",
      given: [{ value: 2.5, unit: "mol H2O", sigfigs: 3 }],
      target_unit: "molecules H2O",
      solution_chain: [
        { numerator: "6.022e23 molecules H2O", denominator: "1 mol H2O" },
      ],
      final_answer: { value: 1.51e24, unit: "molecules H2O", sigfigs: 3, tolerance_pct: 1 },
      explanation:
        "2.50 mol × (6.022 × 10²³ molecules / 1 mol) = 1.51 × 10²⁴ molecules.",
    },
  },
  {
    id: "mole-002",
    topic: "the-mole",
    subtopic: "mole-to-mass",
    mode: "solver",
    difficulty: 2,
    is_sample: true,
    content: {
      prompt: "What is the mass of 0.500 moles of NaCl? (Molar mass of NaCl = 58.44 g/mol)",
      given: [{ value: 0.5, unit: "mol NaCl", sigfigs: 3 }],
      target_unit: "g NaCl",
      solution_chain: [
        { numerator: "58.44 g NaCl", denominator: "1 mol NaCl" },
      ],
      final_answer: { value: 29.2, unit: "g NaCl", sigfigs: 3, tolerance_pct: 1 },
      explanation:
        "0.500 mol NaCl × (58.44 g/mol) = 29.2 g NaCl.",
    },
  },
  {
    id: "mole-003",
    topic: "the-mole",
    subtopic: "mass-to-mole",
    mode: "solver",
    difficulty: 2,
    is_sample: true,
    content: {
      prompt: "How many moles are in 100.0 g of CaCO3? (Molar mass = 100.09 g/mol)",
      given: [{ value: 100.0, unit: "g CaCO3", sigfigs: 4 }],
      target_unit: "mol CaCO3",
      solution_chain: [
        { numerator: "1 mol CaCO3", denominator: "100.09 g CaCO3" },
      ],
      final_answer: { value: 0.999, unit: "mol CaCO3", sigfigs: 4, tolerance_pct: 1 },
      explanation:
        "100.0 g ÷ 100.09 g/mol = 0.9991 mol CaCO3.",
    },
  },
  {
    id: "mole-004",
    topic: "the-mole",
    subtopic: "mole-to-volume-stp",
    mode: "solver",
    difficulty: 2,
    is_sample: true,
    content: {
      prompt: "What volume (in L) does 3.00 moles of O2 gas occupy at STP?",
      given: [{ value: 3.0, unit: "mol O2", sigfigs: 3 }],
      target_unit: "L O2",
      solution_chain: [
        { numerator: "22.4 L O2", denominator: "1 mol O2" },
      ],
      final_answer: { value: 67.2, unit: "L O2", sigfigs: 3, tolerance_pct: 1 },
      explanation:
        "At STP, 1 mole of any gas occupies 22.4 L. 3.00 mol × 22.4 L/mol = 67.2 L.",
    },
  },
  {
    id: "mole-005",
    topic: "the-mole",
    subtopic: "mass-to-particles",
    mode: "solver",
    difficulty: 3,
    is_sample: true,
    content: {
      prompt: "How many molecules are in 18.0 g of H2O? (Molar mass = 18.02 g/mol)",
      given: [{ value: 18.0, unit: "g H2O", sigfigs: 3 }],
      target_unit: "molecules H2O",
      solution_chain: [
        { numerator: "1 mol H2O", denominator: "18.02 g H2O" },
        { numerator: "6.022e23 molecules H2O", denominator: "1 mol H2O" },
      ],
      final_answer: { value: 6.02e23, unit: "molecules H2O", sigfigs: 3, tolerance_pct: 1 },
      explanation:
        "18.0 g ÷ 18.02 g/mol = 0.999 mol. Then 0.999 mol × 6.022 × 10²³ molecules/mol = 6.02 × 10²³ molecules.",
    },
  },

  // ============================================================
  // STOICHIOMETRY (solver mode) — 5 sample problems
  // ============================================================
  {
    id: "stoich-001",
    topic: "stoichiometry",
    subtopic: "mole-to-mole",
    mode: "solver",
    difficulty: 2,
    is_sample: true,
    content: {
      prompt:
        "In the reaction 2 H2 + O2 → 2 H2O, how many moles of H2O are produced from 3.50 moles of H2?",
      given: [{ value: 3.5, unit: "mol H2", sigfigs: 3 }],
      target_unit: "mol H2O",
      solution_chain: [
        { numerator: "2 mol H2O", denominator: "2 mol H2" },
      ],
      final_answer: { value: 3.5, unit: "mol H2O", sigfigs: 3, tolerance_pct: 1 },
      explanation:
        "From the balanced equation, 2 mol H2 produces 2 mol H2O, so the ratio is 1:1. 3.50 mol H2 → 3.50 mol H2O.",
    },
  },
  {
    id: "stoich-002",
    topic: "stoichiometry",
    subtopic: "mass-to-mass",
    mode: "solver",
    difficulty: 3,
    is_sample: true,
    content: {
      prompt:
        "In the reaction C3H8 + 5 O2 → 3 CO2 + 4 H2O, how many grams of CO2 are produced from 44.0 g of C3H8? (Molar masses: C3H8 = 44.10 g/mol, CO2 = 44.01 g/mol)",
      given: [{ value: 44.0, unit: "g C3H8", sigfigs: 3 }],
      target_unit: "g CO2",
      solution_chain: [
        { numerator: "1 mol C3H8", denominator: "44.10 g C3H8" },
        { numerator: "3 mol CO2", denominator: "1 mol C3H8" },
        { numerator: "44.01 g CO2", denominator: "1 mol CO2" },
      ],
      final_answer: { value: 132, unit: "g CO2", sigfigs: 3, tolerance_pct: 1 },
      explanation:
        "44.0 g C3H8 ÷ 44.10 g/mol = 0.998 mol C3H8. × (3 mol CO2 / 1 mol C3H8) = 2.99 mol CO2. × 44.01 g/mol = 132 g CO2.",
    },
  },
  {
    id: "stoich-003",
    topic: "stoichiometry",
    subtopic: "mole-to-mole",
    mode: "solver",
    difficulty: 2,
    is_sample: true,
    content: {
      prompt:
        "In the reaction N2 + 3 H2 → 2 NH3, how many moles of NH3 are produced from 1.50 moles of N2?",
      given: [{ value: 1.5, unit: "mol N2", sigfigs: 3 }],
      target_unit: "mol NH3",
      solution_chain: [
        { numerator: "2 mol NH3", denominator: "1 mol N2" },
      ],
      final_answer: { value: 3.0, unit: "mol NH3", sigfigs: 3, tolerance_pct: 1 },
      explanation:
        "From the balanced equation, 1 mol N2 produces 2 mol NH3. 1.50 mol N2 × 2 = 3.00 mol NH3.",
    },
  },
  {
    id: "stoich-004",
    topic: "stoichiometry",
    subtopic: "limiting-reactant",
    mode: "solver",
    difficulty: 3,
    is_sample: true,
    content: {
      prompt:
        "In the reaction 2 Na + Cl2 → 2 NaCl, if you have 2.30 g Na and 3.55 g Cl2, which is the limiting reactant? (Molar masses: Na = 22.99 g/mol, Cl2 = 70.90 g/mol). How many grams of NaCl are produced? (Molar mass NaCl = 58.44 g/mol)",
      given: [
        { value: 2.3, unit: "g Na", sigfigs: 3 },
        { value: 3.55, unit: "g Cl2", sigfigs: 3 },
      ],
      target_unit: "g NaCl",
      solution_chain: [
        { numerator: "1 mol Na", denominator: "22.99 g Na" },
        { numerator: "2 mol NaCl", denominator: "2 mol Na" },
        { numerator: "58.44 g NaCl", denominator: "1 mol NaCl" },
      ],
      final_answer: { value: 5.85, unit: "g NaCl", sigfigs: 3, tolerance_pct: 2 },
      explanation:
        "Na is limiting (2.30 g Na = 0.100 mol → 0.100 mol NaCl = 5.85 g). Cl2 is in excess (3.55 g Cl2 = 0.0501 mol → could make 0.100 mol NaCl, same amount — actually both are stoichiometric here). Na produces 5.85 g NaCl.",
    },
  },
  {
    id: "stoich-005",
    topic: "stoichiometry",
    subtopic: "mass-to-mass",
    mode: "solver",
    difficulty: 3,
    is_sample: true,
    content: {
      prompt:
        "Oleic acid (C18H34O2) burns: 2 C18H34O2 + 51 O2 → 36 CO2 + 34 H2O. How many grams of CO2 are produced from 1.00 g of C18H34O2? (Molar masses: C18H34O2 = 282.5 g/mol, CO2 = 44.01 g/mol)",
      given: [{ value: 1.0, unit: "g C18H34O2", sigfigs: 3 }],
      target_unit: "g CO2",
      solution_chain: [
        { numerator: "1 mol C18H34O2", denominator: "282.5 g C18H34O2" },
        { numerator: "36 mol CO2", denominator: "2 mol C18H34O2" },
        { numerator: "44.01 g CO2", denominator: "1 mol CO2" },
      ],
      final_answer: { value: 2.80, unit: "g CO2", sigfigs: 3, tolerance_pct: 1 },
      explanation:
        "1.00 g ÷ 282.5 g/mol = 0.00354 mol C18H34O2. × (36/2) = 0.0637 mol CO2. × 44.01 g/mol = 2.80 g CO2.",
    },
  },

  // ============================================================
  // MOLARITY & DILUTIONS (solver mode) — 5 sample problems
  // ============================================================
  {
    id: "molarity-001",
    topic: "molarity-dilutions",
    subtopic: "molarity-calculation",
    mode: "solver",
    difficulty: 1,
    is_sample: true,
    content: {
      prompt:
        "What is the molarity of a solution containing 0.250 moles of NaCl dissolved in 0.500 L of solution?",
      given: [
        { value: 0.25, unit: "mol NaCl", sigfigs: 3 },
        { value: 0.5, unit: "L solution", sigfigs: 3 },
      ],
      target_unit: "mol/L",
      solution_chain: [
        { numerator: "1", denominator: "0.500 L solution" },
      ],
      final_answer: { value: 0.5, unit: "mol/L", sigfigs: 3, tolerance_pct: 1 },
      explanation:
        "Molarity = moles / volume. 0.250 mol ÷ 0.500 L = 0.500 M.",
    },
  },
  {
    id: "molarity-002",
    topic: "molarity-dilutions",
    subtopic: "c1v1-c2v2",
    mode: "solver",
    difficulty: 2,
    is_sample: true,
    content: {
      prompt:
        "How many mL of 6.00 M HCl are needed to prepare 250. mL of 1.50 M HCl?",
      given: [
        { value: 6.0, unit: "mol/L HCl", sigfigs: 3 },
        { value: 0.25, unit: "L HCl", sigfigs: 3 },
        { value: 1.5, unit: "mol/L HCl", sigfigs: 3 },
      ],
      target_unit: "L HCl",
      solution_chain: [
        { numerator: "1.50 mol HCl", denominator: "1 L HCl" },
        { numerator: "1 L HCl", denominator: "6.00 mol HCl" },
      ],
      final_answer: { value: 0.0625, unit: "L HCl", sigfigs: 3, tolerance_pct: 1 },
      explanation:
        "C1V1 = C2V2. V1 = C2V2/C1 = (1.50 M × 0.250 L) / 6.00 M = 0.0625 L = 62.5 mL.",
    },
  },
  {
    id: "molarity-003",
    topic: "molarity-dilutions",
    subtopic: "moles-from-molarity",
    mode: "solver",
    difficulty: 2,
    is_sample: true,
    content: {
      prompt:
        "How many moles of KCl are in 75.0 mL of 0.250 M KCl solution?",
      given: [
        { value: 0.075, unit: "L solution", sigfigs: 3 },
        { value: 0.25, unit: "mol/L KCl", sigfigs: 3 },
      ],
      target_unit: "mol KCl",
      solution_chain: [
        { numerator: "0.250 mol KCl", denominator: "1 L solution" },
      ],
      final_answer: { value: 0.0188, unit: "mol KCl", sigfigs: 3, tolerance_pct: 1 },
      explanation:
        "M = mol/L, so mol = M × L. 0.250 mol/L × 0.0750 L = 0.0188 mol KCl.",
    },
  },
  {
    id: "molarity-004",
    topic: "molarity-dilutions",
    subtopic: "c1v1-c2v2",
    mode: "solver",
    difficulty: 2,
    is_sample: true,
    content: {
      prompt:
        "What is the final concentration when 50.0 mL of 12.0 M H2SO4 is diluted to 500. mL?",
      given: [
        { value: 0.05, unit: "L H2SO4", sigfigs: 3 },
        { value: 12.0, unit: "mol/L H2SO4", sigfigs: 3 },
        { value: 0.5, unit: "L solution", sigfigs: 3 },
      ],
      target_unit: "mol/L H2SO4",
      solution_chain: [
        { numerator: "12.0 mol H2SO4", denominator: "1 L H2SO4" },
        { numerator: "1", denominator: "0.500 L solution" },
      ],
      final_answer: { value: 1.2, unit: "mol/L H2SO4", sigfigs: 3, tolerance_pct: 1 },
      explanation:
        "C1V1 = C2V2. C2 = C1V1/V2 = (12.0 M × 0.0500 L) / 0.500 L = 1.20 M.",
    },
  },
  {
    id: "molarity-005",
    topic: "molarity-dilutions",
    subtopic: "stock-solution",
    mode: "solver",
    difficulty: 3,
    is_sample: true,
    content: {
      prompt:
        "You need 0.150 moles of NaOH for a reaction. You have a 5.00 M NaOH stock solution. What volume (in mL) of stock should you use?",
      given: [
        { value: 0.15, unit: "mol NaOH", sigfigs: 3 },
        { value: 5.0, unit: "mol/L NaOH", sigfigs: 3 },
      ],
      target_unit: "L NaOH",
      solution_chain: [
        { numerator: "1 L NaOH", denominator: "5.00 mol NaOH" },
      ],
      final_answer: { value: 0.03, unit: "L NaOH", sigfigs: 3, tolerance_pct: 1 },
      explanation:
        "Volume = moles / molarity. 0.150 mol ÷ 5.00 mol/L = 0.0300 L = 30.0 mL of stock.",
    },
  },
];
