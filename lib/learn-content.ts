// Learn content for each topic — teaches concepts before quizzes
// Each topic has: intro, concepts, formulas (optional), worked examples, vocabulary

export interface Concept {
  title: string;
  body: string;
  example?: string;
}

export interface Formula {
  name: string;
  formula: string;
  desc: string;
}

export interface WorkedStep {
  label: string;
  detail: string;
}

export interface WorkedExample {
  problem: string;
  steps: WorkedStep[];
  answer: string;
}

export interface VocabCard {
  term: string;
  def: string;
}

export interface TopicContent {
  topicId: string;
  title: string;
  subtitle: string;
  color: string;
  intro: string;
  concepts: Concept[];
  formulas?: Formula[];
  workedExamples: WorkedExample[];
  vocabulary: VocabCard[];
}

export const LEARN_CONTENT: Record<string, TopicContent> = {
  fundamentals: {
    topicId: "fundamentals",
    title: "Fundamentals",
    subtitle: "Measurement, matter classification, accuracy vs precision",
    color: "#818cf8",
    intro:
      "Chemistry is the study of matter and the changes it undergoes. Before you can do any chemistry, you need to understand what matter is, how we classify it, and how we measure it precisely. This section covers the foundational concepts that everything else in CHEM 121 builds on.",
    concepts: [
      {
        title: "What is Matter?",
        body: "Matter is anything that has mass and takes up space. Everything you can see, touch, and weigh is matter — including gases like air. Light, heat, and electricity are NOT matter (they are energy).",
        example: "A rock, a glass of water, the air in a balloon — all matter. A flashlight beam — not matter.",
      },
      {
        title: "Classification of Matter",
        body: "Matter is divided into two main categories: pure substances and mixtures. Pure substances have a fixed composition and distinct properties. Mixtures contain two or more substances physically combined, not chemically bonded.",
        example: "Pure water (H₂O) is a pure substance. Salt water is a mixture — you can separate the salt by evaporation.",
      },
      {
        title: "Elements vs Compounds",
        body: "Elements are pure substances made of only one type of atom (Fe, O₂, He). Compounds are pure substances made of two or more different elements chemically bonded in a fixed ratio (H₂O, NaCl, CO₂). Compounds can only be separated by chemical reactions, not physical means.",
        example: "Iron (Fe) is an element. Rust (Fe₂O₃) is a compound made of iron and oxygen.",
      },
      {
        title: "Homogeneous vs Heterogeneous Mixtures",
        body: "A homogeneous mixture is uniform throughout — you cannot see the individual parts. A heterogeneous mixture has distinct, visible phases or regions.",
        example: "Salt dissolved in water = homogeneous (looks the same throughout). Sand mixed with water = heterogeneous (you can see the sand separate from the water).",
      },
      {
        title: "Physical vs Chemical Changes",
        body: "A physical change does not produce a new substance — the identity is preserved. A chemical change produces one or more new substances with different properties.",
        example: "Physical: melting ice, boiling water, dissolving salt. Chemical: burning wood, rusting iron, cooking an egg.",
      },
      {
        title: "Measurements: Number + Unit",
        body: "Every measurement consists of a number (the magnitude) and a unit (what is being measured). A number alone is meaningless in science — '5' tells you nothing, but '5 grams' tells you exactly what you have.",
        example: "25 mL has the number 25 and the unit mL (milliliters). Without the unit, '25' could mean anything.",
      },
      {
        title: "Accuracy vs Precision",
        body: "Accuracy is how close a measurement is to the true or accepted value. Precision is how close repeated measurements are to each other. You can be precise but not accurate (all measurements cluster together but are far from the true value).",
        example: "If the true mass is 10.00 g: measurements of 10.01, 10.02, 10.01 are accurate AND precise. Measurements of 8.50, 8.51, 8.50 are precise but NOT accurate.",
      },
      {
        title: "Mass vs Weight",
        body: "Mass is the amount of matter in an object — it does NOT change with location. Weight is the force of gravity on that mass — it changes depending on where you are. An astronaut has the same mass on Earth and the Moon, but weighs less on the Moon.",
        example: "A 70 kg astronaut has mass = 70 kg everywhere. On the Moon, their weight is about 1/6 of their Earth weight.",
      },
      {
        title: "Density",
        body: "Density is the amount of mass per unit volume. It tells you how 'packed' a substance is. Density is an intensive property — it does not depend on how much you have. Every pure substance has a characteristic density.",
        example: "Water has a density of 1.00 g/mL. A 10 mL sample and a 1000 mL sample of water both have density = 1.00 g/mL.",
      },
    ],
    formulas: [
      { name: "Density", formula: "D = mass / volume", desc: "Mass divided by volume. Units: g/mL, g/cm³, or kg/m³" },
    ],
    workedExamples: [
      {
        problem: "An object has a mass of 27.0 g and a volume of 10.0 mL. What is its density?",
        steps: [
          { label: "Identify the formula", detail: "Density = mass / volume" },
          { label: "Plug in values", detail: "D = 27.0 g / 10.0 mL" },
          { label: "Calculate", detail: "D = 2.70 g/mL" },
          { label: "Check sig figs", detail: "Both values have 3 sig figs, so the answer has 3 sig figs: 2.70 g/mL. This is the density of aluminum." },
        ],
        answer: "2.70 g/mL (3 sig figs)",
      },
    ],
    vocabulary: [
      { term: "Matter", def: "Anything that has mass and takes up space" },
      { term: "Element", def: "Pure substance made of only one type of atom" },
      { term: "Compound", def: "Two or more elements chemically bonded in a fixed ratio" },
      { term: "Mixture", def: "Two or more substances physically combined" },
      { term: "Homogeneous Mixture", def: "Uniform composition throughout (e.g., salt water)" },
      { term: "Heterogeneous Mixture", def: "Non-uniform composition (e.g., sand and water)" },
      { term: "Physical Change", def: "Change that does not produce a new substance" },
      { term: "Chemical Change", def: "Change that produces one or more new substances" },
      { term: "Accuracy", def: "How close a measurement is to the true value" },
      { term: "Precision", def: "How close repeated measurements are to each other" },
      { term: "Density", def: "Mass per unit volume (D = m/V)" },
      { term: "Mass", def: "Amount of matter — does not change with location" },
    ],
  },

  "metric-system": {
    topicId: "metric-system",
    title: "Metric System",
    subtitle: "SI prefixes, base units, unit conversions",
    color: "#34d399",
    intro:
      "The metric system is the universal language of science. It uses a set of base units and prefixes that scale those units by powers of 10. Once you understand the pattern, you can convert between any metric units without memorizing dozens of conversion factors.",
    concepts: [
      {
        title: "SI Base Units",
        body: "The International System of Units (SI) defines base units for each physical quantity. In chemistry, the most important are: meter (m) for length, gram (g) for mass, liter (L) for volume, and mole (mol) for amount of substance.",
        example: "You measure the length of a desk in meters, the mass of a sample in grams, and the volume of a solution in liters.",
      },
      {
        title: "Metric Prefixes",
        body: "Prefixes scale base units by powers of 10. Each prefix has a symbol and a power of 10. Going up from the base unit: kilo (k) = 10³. Going down: deci (d) = 10⁻¹, centi (c) = 10⁻², milli (m) = 10⁻³, micro (µ) = 10⁻⁶, nano (n) = 10⁻⁹.",
        example: "1 kilometer = 1000 meters. 1 millimeter = 0.001 meters. 1 microgram = 0.000001 grams.",
      },
      {
        title: "Converting Within the Metric System",
        body: "To convert between metric units, use the prefix to determine the conversion factor. If going from a larger unit to a smaller unit, multiply. If going from a smaller unit to a larger unit, divide.",
        example: "Convert 3.5 km to meters: 3.5 × 1000 = 3500 m. Convert 500 mg to grams: 500 ÷ 1000 = 0.500 g.",
      },
      {
        title: "The Factor-Label Method",
        body: "Also called dimensional analysis. Write the conversion as a fraction (factor) so the unwanted unit cancels. Multiply the given value by the factor, and the unit you do not want appears in both numerator and denominator, so it cancels.",
        example: "Convert 250 mL to L: 250 mL × (1 L / 1000 mL) = 0.250 L. The mL cancels.",
      },
      {
        title: "Temperature Scales",
        body: "Three temperature scales: Celsius (°C), Kelvin (K), and Fahrenheit (°F). In chemistry, we use Celsius and Kelvin. Kelvin is the SI unit — it starts at absolute zero (0 K = -273.15 °C). To convert: K = °C + 273.15, or °C = K - 273.15.",
        example: "Room temperature is about 25 °C = 298 K. Water freezes at 0 °C = 273 K.",
      },
      {
        title: "Common Conversion Factors",
        body: "Some conversions are exact definitions: 1 km = 1000 m, 1 m = 100 cm, 1 cm = 10 mm, 1 kg = 1000 g, 1 g = 1000 mg, 1 L = 1000 mL. These are exact and have infinite significant figures.",
        example: "1 inch = 2.54 cm is an exact definition. 1 mile = 1.609 km is a measured conversion (4 sig figs).",
      },
    ],
    formulas: [
      { name: "Celsius to Kelvin", formula: "K = °C + 273.15", desc: "Add 273.15 to Celsius to get Kelvin" },
      { name: "Kelvin to Celsius", formula: "°C = K − 273.15", desc: "Subtract 273.15 from Kelvin to get Celsius" },
    ],
    workedExamples: [
      {
        problem: "Convert 4.50 km to centimeters.",
        steps: [
          { label: "Start with the given", detail: "4.50 km — need to get to cm" },
          { label: "Convert km to m", detail: "4.50 km × (1000 m / 1 km) = 4500 m" },
          { label: "Convert m to cm", detail: "4500 m × (100 cm / 1 m) = 450000 cm" },
          { label: "Check sig figs", detail: "4.50 has 3 sig figs → 4.50 × 10⁵ cm, or 450000 cm (3 sig figs)" },
        ],
        answer: "4.50 × 10⁵ cm (3 sig figs)",
      },
    ],
    vocabulary: [
      { term: "SI Unit", def: "International System of Units — the standard metric units" },
      { term: "Prefix", def: "A modifier that scales a base unit by a power of 10" },
      { term: "Kilo (k)", def: "Prefix meaning 1000 (10³)" },
      { term: "Centi (c)", def: "Prefix meaning 0.01 (10⁻²)" },
      { term: "Milli (m)", def: "Prefix meaning 0.001 (10⁻³)" },
      { term: "Micro (µ)", def: "Prefix meaning 0.000001 (10⁻⁶)" },
      { term: "Kelvin (K)", def: "SI temperature unit; 0 K = absolute zero" },
      { term: "Conversion Factor", def: "A ratio used to convert one unit to another" },
    ],
  },

  "atomic-structure": {
    topicId: "atomic-structure",
    title: "Atomic Structure",
    subtitle: "Subatomic particles, isotopes, ions, electron configuration",
    color: "#a78bfa",
    intro:
      "The atom is the fundamental building block of all matter. Understanding what's inside an atom — protons, neutrons, and electrons — is essential for everything in chemistry. The number of protons determines the element, the number of neutrons determines the isotope, and the number of electrons determines the charge.",
    concepts: [
      {
        title: "Three Subatomic Particles",
        body: "Atoms are made of three particles: Protons (charge +1, mass ≈ 1 amu, located in the nucleus). Neutrons (charge 0, mass ≈ 1 amu, located in the nucleus). Electrons (charge -1, mass ≈ 0, located in orbitals around the nucleus).",
        example: "A carbon atom has 6 protons, 6 neutrons, and 6 electrons. The protons and neutrons are in the nucleus; the electrons orbit around it.",
      },
      {
        title: "Atomic Number (Z)",
        body: "The atomic number is the number of protons in the nucleus. It defines the element — every atom of the same element has the same number of protons. In a neutral atom, the number of electrons equals the number of protons.",
        example: "Carbon has Z = 6 (always 6 protons). Oxygen has Z = 8. Hydrogen has Z = 1.",
      },
      {
        title: "Mass Number (A)",
        body: "The mass number is the total number of protons plus neutrons in the nucleus. It can vary between atoms of the same element because the number of neutrons can vary. Mass number = protons + neutrons.",
        example: "Carbon-12: A = 12 (6 protons + 6 neutrons). Carbon-14: A = 14 (6 protons + 8 neutrons).",
      },
      {
        title: "Isotopes",
        body: "Isotopes are atoms of the same element (same number of protons) but with different numbers of neutrons (different mass numbers). Isotopes have the same chemical behavior because they have the same number of electrons.",
        example: "Hydrogen has 3 isotopes: ¹H (protium, 0 neutrons), ²H (deuterium, 1 neutron), ³H (tritium, 2 neutrons). All are hydrogen.",
      },
      {
        title: "Atomic Mass",
        body: "The atomic mass on the periodic table is a weighted average of all naturally occurring isotopes of an element. It accounts for both the mass and the abundance of each isotope.",
        example: "Chlorine has two isotopes: ³⁵Cl (75%) and ³⁷Cl (25%). Atomic mass = 0.75 × 35 + 0.25 × 37 = 35.5 amu.",
      },
      {
        title: "Ions",
        body: "An ion is an atom (or group of atoms) with an unequal number of protons and electrons. A cation has lost electrons and has a positive charge. An anion has gained electrons and has a negative charge. The number of protons never changes — only the electrons.",
        example: "Na has 11 protons and 11 electrons (neutral). Na⁺ has 11 protons and 10 electrons (lost 1 electron, charge = +1).",
      },
      {
        title: "Electron Configuration",
        body: "Electrons fill orbitals in order of increasing energy. The filling order is: 1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p. Each orbital holds a maximum of 2 electrons. The s subshell has 1 orbital (2 e⁻), p has 3 orbitals (6 e⁻), d has 5 orbitals (10 e⁻).",
        example: "Oxygen (8 electrons): 1s² 2s² 2p⁴. Sodium (11 electrons): 1s² 2s² 2p⁶ 3s¹.",
      },
    ],
    workedExamples: [
      {
        problem: "An atom has 17 protons, 18 neutrons, and 18 electrons. What is the element, mass number, and charge?",
        steps: [
          { label: "Identify the element", detail: "17 protons → atomic number 17 → Chlorine (Cl)" },
          { label: "Calculate mass number", detail: "A = protons + neutrons = 17 + 18 = 35" },
          { label: "Calculate charge", detail: "Charge = protons - electrons = 17 - 18 = -1" },
          { label: "Write the symbol", detail: "³⁵Cl⁻ (chloride ion)" },
        ],
        answer: "Chlorine, mass number = 35, charge = -1 (Cl⁻)",
      },
    ],
    vocabulary: [
      { term: "Proton", def: "Positively charged particle in the nucleus; defines the element" },
      { term: "Neutron", def: "Neutral particle in the nucleus; determines the isotope" },
      { term: "Electron", def: "Negatively charged particle in orbitals; responsible for chemistry" },
      { term: "Atomic Number (Z)", def: "Number of protons; defines the element" },
      { term: "Mass Number (A)", def: "Protons + neutrons in the nucleus" },
      { term: "Isotope", def: "Atoms of the same element with different numbers of neutrons" },
      { term: "Ion", def: "Atom with unequal protons and electrons (charged)" },
      { term: "Cation", def: "Positively charged ion (lost electrons)" },
      { term: "Anion", def: "Negatively charged ion (gained electrons)" },
      { term: "Atomic Mass", def: "Weighted average mass of an element's isotopes" },
      { term: "Orbital", def: "Region of space where an electron is likely found" },
    ],
  },

  "significant-figures": {
    topicId: "significant-figures",
    title: "Significant Figures",
    subtitle: "Counting sig figs, rounding in calculations",
    color: "#fbbf24",
    intro:
      "Significant figures (sig figs) are the digits in a measurement that carry meaning — all the certain digits plus the first uncertain one. They tell other scientists how precise a measurement is. Getting sig figs right is critical in chemistry because wrong sig figs mean you are claiming more (or less) precision than you actually have.",
    concepts: [
      {
        title: "Why Sig Figs Matter",
        body: "When you write 2.000 g, you are saying you measured to the nearest milligram. When you write 2 g, you are saying you only measured to the nearest gram. The extra zeros are not decoration — they communicate precision. Reporting the wrong number of sig figs is a scientific error.",
        example: "2.000 g means the measurement is between 1.999 and 2.001 g. 2 g means the measurement is between 1 and 3 g — much less precise.",
      },
      {
        title: "Rule 1: Non-zero digits are always significant",
        body: "Any digit that is not zero counts as a significant figure. This is the simplest rule.",
        example: "12.3 has 3 sig figs. 456 has 3 sig figs. 9.81 has 3 sig figs.",
      },
      {
        title: "Rule 2: Captive zeros are significant",
        body: "Zeros between non-zero digits are called captive zeros, and they are always significant. They are part of the measurement.",
        example: "12.03 has 4 sig figs. 1005 has 4 sig figs. 3.005 has 4 sig figs.",
      },
      {
        title: "Rule 3: Leading zeros are NOT significant",
        body: "Zeros at the beginning of a number (before the first non-zero digit) are just placeholders. They do not count as significant figures. They only show the decimal point position.",
        example: "0.0123 has 3 sig figs (the two leading zeros don't count). 0.5 has 1 sig fig. 0.0042 has 2 sig figs.",
      },
      {
        title: "Rule 4: Trailing zeros after a decimal are significant",
        body: "Zeros at the end of a number, after a decimal point, are significant. They were measured — someone chose to write them.",
        example: "123.0 has 4 sig figs. 2.500 has 4 sig figs. 0.0100 has 3 sig figs (leading zeros don't count, trailing zeros after decimal do).",
      },
      {
        title: "Rule 5: Trailing zeros without a decimal are ambiguous",
        body: "Zeros at the end of a whole number without a decimal point are ambiguous. We cannot tell if they were measured or are just placeholders. Use scientific notation to make it clear.",
        example: "123,000 could have 3, 4, 5, or 6 sig figs. Write 1.23 × 10⁵ for 3 sig figs, or 1.23000 × 10⁵ for 6 sig figs.",
      },
      {
        title: "Rule 6: Exact numbers have infinite sig figs",
        body: "Counted numbers (3 apples) and defined conversions (1 inch = 2.54 cm, 1000 mg = 1 g) are exact. They do not limit the number of sig figs in a calculation.",
        example: "If you count 5 students, that '5' is exact. If you convert 2.50 g to mg using 1000 mg/g, the 1000 is exact and does not limit sig figs.",
      },
      {
        title: "Multiplication and Division",
        body: "The result has the same number of sig figs as the measurement with the FEWEST sig figs. Count the sig figs in each number, find the smallest, and round the answer to that many.",
        example: "2.5 × 3.21 = 8.025 → round to 2 sig figs (limited by 2.5) → 8.0",
      },
      {
        title: "Addition and Subtraction",
        body: "The result has the same number of DECIMAL PLACES as the measurement with the fewest decimal places. Line up the decimal points, add/subtract, then round to the least precise decimal place.",
        example: "12.1 + 3.45 = 15.55 → round to 1 decimal place (limited by 12.1) → 15.6",
      },
    ],
    workedExamples: [
      {
        problem: "How many significant figures are in 0.0100?",
        steps: [
          { label: "Identify leading zeros", detail: "The first two zeros (0.0) are leading zeros — they do NOT count." },
          { label: "Identify the non-zero digits", detail: "The '1' is significant (non-zero digit)." },
          { label: "Identify trailing zeros after decimal", detail: "The two zeros after the 1 (00) are trailing zeros after a decimal — they DO count." },
          { label: "Count", detail: "1 + 2 = 3 significant figures" },
        ],
        answer: "3 significant figures",
      },
      {
        problem: "Calculate the density: mass = 27.0 g, volume = 10.0 mL. How many sig figs?",
        steps: [
          { label: "Identify the operation", detail: "Density = mass / volume → this is division" },
          { label: "Count sig figs in each value", detail: "27.0 has 3 sig figs, 10.0 has 3 sig figs" },
          { label: "Apply the rule", detail: "Division → result has the fewest sig figs = 3" },
          { label: "Calculate", detail: "27.0 / 10.0 = 2.70 g/mL (3 sig figs)" },
        ],
        answer: "2.70 g/mL (3 sig figs)",
      },
    ],
    vocabulary: [
      { term: "Significant Figures", def: "Digits in a measurement that carry meaning (all certain + first uncertain)" },
      { term: "Captive Zero", def: "Zero between non-zero digits — always significant" },
      { term: "Leading Zero", def: "Zero before the first non-zero digit — NOT significant" },
      { term: "Trailing Zero", def: "Zero at the end of a number — significant if after a decimal" },
      { term: "Exact Number", def: "A counted or defined number with infinite sig figs" },
      { term: "Scientific Notation", def: "Format like 1.23 × 10⁵ that makes sig figs unambiguous" },
    ],
  },

  "dimensional-analysis": {
    topicId: "dimensional-analysis",
    title: "Dimensional Analysis",
    subtitle: "Unit conversion chains, single to multi-step",
    color: "#f0abfc",
    intro:
      "Dimensional analysis is the most powerful problem-solving tool in chemistry. It lets you convert any quantity from one unit to another by multiplying by conversion factors arranged as fractions. The units guide you — if you set up the problem correctly, the unwanted units cancel and you are left with the unit you want.",
    concepts: [
      {
        title: "What is a Conversion Factor?",
        body: "A conversion factor is a fraction equal to 1, written from an equality. For example, from 1 m = 100 cm, you get two conversion factors: (100 cm / 1 m) and (1 m / 100 cm). Both equal 1, so multiplying by either does not change the value — only the units.",
        example: "From 1 hour = 60 minutes: (60 min / 1 hr) and (1 hr / 60 min). Both equal 1.",
      },
      {
        title: "Setting Up the Problem",
        body: "Start with the given value and its unit. Write it as a fraction (value / 1). Then multiply by conversion factors, arranging each factor so the unit you want to cancel is in the opposite position (numerator vs denominator). The unit you want to keep should end up in the numerator.",
        example: "Convert 5 km to m: 5 km × (1000 m / 1 km). The km cancels, leaving m.",
      },
      {
        title: "Single-Step Conversions",
        body: "For a simple conversion, you need one conversion factor. Identify the given unit and the target unit, write the conversion factor so the given unit cancels, and multiply.",
        example: "Convert 2500 g to kg: 2500 g × (1 kg / 1000 g) = 2.5 kg.",
      },
      {
        title: "Multi-Step Conversions",
        body: "Sometimes you need to go through intermediate units. Chain multiple conversion factors together, each one canceling the previous unit. The key is that each factor's denominator must match the previous numerator's unit.",
        example: "Convert 3.50 km to cm: 3.50 km × (1000 m / 1 km) × (100 cm / 1 m) = 350000 cm.",
      },
      {
        title: "Converting Complex Units",
        body: "Some units are combinations, like mi/hr or g/mL. You may need to convert the numerator and denominator separately. Treat each part independently, chaining conversion factors for each.",
        example: "Convert 55 mph to m/s: convert mi → km → m (numerator), then hr → s (denominator).",
      },
      {
        title: "Choosing Which Factor to Use",
        body: "From any equality A = B, you get two factors: (A/B) and (B/A). Choose the one that puts the unit you want to cancel in the denominator and the unit you want to keep in the numerator. If the unit is in the numerator of the given, it needs to be in the denominator of the factor.",
        example: "Given km (in numerator), want m: use (1000 m / 1 km) — km is in denominator, cancels. m stays in numerator.",
      },
    ],
    workedExamples: [
      {
        problem: "Convert 65.0 miles per hour to meters per second. (1 mi = 1.609 km)",
        steps: [
          { label: "Start with the given", detail: "65.0 mi/h — need to convert mi → m and h → s" },
          { label: "Convert miles to km", detail: "65.0 × (1.609 km / 1 mi) = 104.585 km/h" },
          { label: "Convert km to m", detail: "104.585 × (1000 m / 1 km) = 104585 m/h" },
          { label: "Convert hours to seconds", detail: "104585 × (1 h / 3600 s) = 24.58 m/s" },
          { label: "Round to sig figs", detail: "65.0 has 3 sig figs → 24.6 m/s" },
        ],
        answer: "24.6 m/s (3 sig figs)",
      },
    ],
    vocabulary: [
      { term: "Dimensional Analysis", def: "Problem-solving method using unit cancellation" },
      { term: "Conversion Factor", def: "A fraction equal to 1, used to convert units" },
      { term: "Unit Cancellation", def: "When a unit appears in both numerator and denominator, it cancels" },
      { term: "Given", def: "The starting value and unit you are converting from" },
      { term: "Target Unit", def: "The unit you want to end up with" },
    ],
  },

  "the-mole": {
    topicId: "the-mole",
    title: "The Mole",
    subtitle: "Mole-to-particle, mole-to-mass, Avogadro's number",
    color: "#60a5fa",
    intro:
      "The mole is the chemist's counting unit. Just as a dozen means 12, a mole means 6.02 × 10²³. It is the bridge between the microscopic world of atoms and molecules and the macroscopic world of grams and liters that we can measure in the lab. Understanding the mole is essential for stoichiometry.",
    concepts: [
      {
        title: "What is a Mole?",
        body: "A mole is a quantity — specifically, 6.02 × 10²³ particles. The particles can be atoms, molecules, ions, or anything else. The mole lets us count particles by weighing them, because we know the mass of one mole of any substance (its molar mass).",
        example: "1 mole of carbon atoms = 6.02 × 10²³ carbon atoms. 1 mole of water molecules = 6.02 × 10²³ water molecules.",
      },
      {
        title: "Avogadro's Number",
        body: "6.02 × 10²³ is called Avogadro's number. It is the number of particles in exactly 1 mole. This number was chosen so that 1 mole of any element has a mass in grams equal to its atomic mass in amu.",
        example: "Carbon has an atomic mass of 12.01 amu. So 1 mole of carbon = 12.01 g. Both contain 6.02 × 10²³ atoms.",
      },
      {
        title: "Molar Mass",
        body: "The molar mass of a substance is the mass of one mole, in grams. For elements, it is the atomic mass from the periodic table (in g/mol). For compounds, add up the molar masses of all the atoms in the formula.",
        example: "H₂O: 2(1.008) + 16.00 = 18.02 g/mol. NaCl: 22.99 + 35.45 = 58.44 g/mol.",
      },
      {
        title: "Mole ↔ Particles Conversion",
        body: "To convert between moles and number of particles, use Avogadro's number as a conversion factor: (6.02 × 10²³ particles / 1 mol) or (1 mol / 6.02 × 10²³ particles).",
        example: "3.50 mol of H₂O × (6.02 × 10²³ molecules / 1 mol) = 2.11 × 10²⁴ molecules.",
      },
      {
        title: "Mole ↔ Mass Conversion",
        body: "To convert between moles and mass (grams), use the molar mass as a conversion factor: (molar mass g / 1 mol) or (1 mol / molar mass g).",
        example: "2.00 mol of NaCl × (58.44 g / 1 mol) = 117 g NaCl. Or: 117 g NaCl × (1 mol / 58.44 g) = 2.00 mol.",
      },
      {
        title: "Mass ↔ Particles (Two-Step)",
        body: "To go from mass to particles (or vice versa), you need two steps: first convert mass to moles (using molar mass), then convert moles to particles (using Avogadro's number).",
        example: "10.0 g H₂O → moles: 10.0 / 18.02 = 0.555 mol → molecules: 0.555 × 6.02 × 10²³ = 3.34 × 10²³ molecules.",
      },
    ],
    formulas: [
      { name: "Avogadro's Number", formula: "1 mole = 6.02 × 10²³ particles", desc: "The number of particles in one mole" },
      { name: "Molar Mass", formula: "Molar mass = mass (g) / moles (mol)", desc: "Grams per mole — from the periodic table" },
    ],
    workedExamples: [
      {
        problem: "How many molecules are in 3.50 moles of H₂O?",
        steps: [
          { label: "Identify the conversion", detail: "1 mole = 6.02 × 10²³ particles (Avogadro's number)" },
          { label: "Set up the calculation", detail: "3.50 mol × (6.02 × 10²³ molecules / 1 mol)" },
          { label: "Calculate", detail: "3.50 × 6.02 × 10²³ = 21.1 × 10²³ = 2.11 × 10²⁴" },
        ],
        answer: "2.11 × 10²⁴ molecules (3 sig figs)",
      },
    ],
    vocabulary: [
      { term: "Mole", def: "A quantity: 6.02 × 10²³ particles (like a dozen = 12)" },
      { term: "Avogadro's Number", def: "6.02 × 10²³ — the number of particles in one mole" },
      { term: "Molar Mass", def: "Mass of one mole of a substance (g/mol)" },
      { term: "Particle", def: "An atom, molecule, ion, or other unit being counted" },
    ],
  },

  stoichiometry: {
    topicId: "stoichiometry",
    title: "Stoichiometry",
    subtitle: "Grams/moles/molecules, limiting reactants, % yield",
    color: "#fb923c",
    intro:
      "Stoichiometry is the mathematics of chemical reactions. It answers questions like: 'If I burn 5 grams of methane, how much CO₂ is produced?' The key is the balanced chemical equation, which gives you the mole ratios between reactants and products. Everything flows from the balanced equation.",
    concepts: [
      {
        title: "The Balanced Equation is Key",
        body: "A balanced chemical equation tells you the mole ratios between all reactants and products. The coefficients (the numbers in front) represent moles. For example, in 2H₂ + O₂ → 2H₂O, the ratio is 2 moles H₂ : 1 mole O₂ : 2 moles H₂O.",
        example: "CH₄ + 2O₂ → CO₂ + 2H₂O means 1 mol CH₄ reacts with 2 mol O₂ to produce 1 mol CO₂ and 2 mol H₂O.",
      },
      {
        title: "The Stoichiometry Roadmap",
        body: "The general process: 1) Balance the equation. 2) Convert the given quantity to moles. 3) Use the mole ratio from the balanced equation to convert to moles of the desired substance. 4) Convert moles of the desired substance to the target unit (grams, molecules, etc.).",
        example: "Given grams of A, want grams of B: g A → mol A → mol B → g B.",
      },
      {
        title: "Mole Ratios",
        body: "The mole ratio is the ratio of coefficients from the balanced equation. It is the conversion factor that connects one substance to another. Always write the ratio as (coefficient of what you want / coefficient of what you have).",
        example: "In 2H₂ + O₂ → 2H₂O, to find moles of H₂O from moles of O₂: use (2 mol H₂O / 1 mol O₂).",
      },
      {
        title: "Limiting Reactant",
        body: "The limiting reactant is the reactant that runs out first, limiting how much product can be made. To find it: calculate how much product each reactant could make. The reactant that produces the LESS product is the limiting reactant. The other is the excess reactant.",
        example: "If you have 5 mol H₂ and 1 mol O₂ for 2H₂ + O₂ → 2H₂O: 5 mol H₂ makes 5 mol H₂O, 1 mol O₂ makes 2 mol H₂O. O₂ is limiting (makes less).",
      },
      {
        title: "Theoretical Yield",
        body: "The theoretical yield is the maximum amount of product possible, calculated from the limiting reactant. It assumes 100% conversion — no losses. In practice, you always get less.",
        example: "If the limiting reactant allows 10.0 g of product, the theoretical yield is 10.0 g.",
      },
      {
        title: "Actual Yield and Percent Yield",
        body: "The actual yield is how much product you actually obtained in the lab. Percent yield = (actual / theoretical) × 100. It measures efficiency. A percent yield of 85% means you got 85% of what was theoretically possible.",
        example: "Theoretical = 10.0 g, actual = 8.5 g. Percent yield = (8.5 / 10.0) × 100 = 85%.",
      },
    ],
    formulas: [
      { name: "Percent Yield", formula: "% yield = (actual / theoretical) × 100", desc: "Compares actual product to theoretical maximum" },
      { name: "Mole Ratio", formula: "mole ratio = coefficient of wanted / coefficient of given", desc: "From the balanced equation" },
    ],
    workedExamples: [
      {
        problem: "How many grams of CO₂ are produced when 5.00 g of CH₄ burns? (MM CH₄ = 16.0, CO₂ = 44.0)",
        steps: [
          { label: "Balance the equation", detail: "CH₄ + 2O₂ → CO₂ + 2H₂O (1 mol CH₄ → 1 mol CO₂)" },
          { label: "Convert grams to moles", detail: "5.00 g CH₄ ÷ 16.0 g/mol = 0.313 mol CH₄" },
          { label: "Apply mole ratio", detail: "0.313 mol CH₄ × (1 mol CO₂ / 1 mol CH₄) = 0.313 mol CO₂" },
          { label: "Convert moles to grams", detail: "0.313 mol CO₂ × 44.0 g/mol = 13.8 g CO₂" },
        ],
        answer: "13.8 g CO₂ (3 sig figs)",
      },
    ],
    vocabulary: [
      { term: "Stoichiometry", def: "The mathematics of chemical reactions and quantities" },
      { term: "Mole Ratio", def: "Ratio of coefficients from a balanced equation" },
      { term: "Limiting Reactant", def: "The reactant that runs out first and limits product" },
      { term: "Excess Reactant", def: "The reactant that remains after the limiting reactant is consumed" },
      { term: "Theoretical Yield", def: "Maximum product possible based on stoichiometry" },
      { term: "Actual Yield", def: "Amount of product actually obtained in a reaction" },
      { term: "Percent Yield", def: "(actual yield / theoretical yield) × 100" },
      { term: "Balanced Equation", def: "Equation with equal atoms on both sides (conservation of mass)" },
    ],
  },

  "molarity-dilutions": {
    topicId: "molarity-dilutions",
    title: "Molarity & Dilutions",
    subtitle: "Molarity, C1V1=C2V2, stock solutions",
    color: "#2dd4bf",
    intro:
      "Solutions are mixtures where a solute is dissolved in a solvent. In chemistry, we need to know how concentrated a solution is — that is molarity. And we often need to dilute a concentrated stock solution to a working concentration — that is where the dilution equation comes in.",
    concepts: [
      {
        title: "Solutions: Solute + Solvent",
        body: "A solution is a homogeneous mixture of a solute (the dissolved substance) and a solvent (what does the dissolving, usually water). The solute is present in a smaller amount; the solvent is present in a larger amount.",
        example: "In salt water: salt is the solute, water is the solvent. In sugar water: sugar is the solute, water is the solvent.",
      },
      {
        title: "What is Molarity?",
        body: "Molarity (M) is the most common measure of concentration in chemistry. It is defined as moles of solute per liter of solution: M = moles / liters. A 1.0 M solution has 1.0 mole of solute dissolved in 1.0 liter of solution.",
        example: "A 0.500 M NaCl solution has 0.500 moles of NaCl in every 1.00 L of solution.",
      },
      {
        title: "Calculating Molarity",
        body: "To find molarity, divide the moles of solute by the volume of solution in liters. If you are given mass instead of moles, first convert mass to moles using molar mass, then divide by volume in liters.",
        example: "5.85 g NaCl (0.100 mol) in 0.250 L: M = 0.100 / 0.250 = 0.400 M.",
      },
      {
        title: "Making a Solution of Known Molarity",
        body: "To make a solution: 1) Calculate the moles of solute needed (M × V). 2) Convert moles to grams (moles × molar mass). 3) Weigh the solute. 4) Dissolve in some solvent. 5) Add solvent until the total volume reaches the desired amount.",
        example: "To make 250 mL of 0.100 M NaCl: 0.100 M × 0.250 L = 0.0250 mol → 0.0250 × 58.44 = 1.46 g. Weigh 1.46 g, dissolve, fill to 250 mL.",
      },
      {
        title: "The Dilution Equation: C₁V₁ = C₂V₂",
        body: "When you dilute a solution, you add solvent. The amount of solute stays the same — it is just spread over a larger volume. C₁V₁ = C₂V₂ relates the concentrated solution (C₁, V₁) to the diluted solution (C₂, V₂). C is concentration, V is volume. The units just need to match on both sides.",
        example: "How much 12.0 M HCl do you need to make 250 mL of 2.00 M? V₁ = (C₂V₂) / C₁ = (2.00 × 250) / 12.0 = 41.7 mL.",
      },
      {
        title: "Stock Solutions",
        body: "Labs keep concentrated stock solutions and dilute them as needed. This is faster than making solutions from scratch each time, and it avoids weighing very small masses (which is error-prone). A stock solution is diluted using C₁V₁ = C₂V₂.",
        example: "A 12.0 M HCl stock is diluted to 1.0 M for lab use. You measure a small volume of stock and add water.",
      },
      {
        title: "Molarity in Reactions",
        body: "Molarity connects to stoichiometry. If you know the volume and molarity of a solution, you can find the moles: moles = M × V. These moles can then be used in stoichiometric calculations just like moles from mass.",
        example: "0.100 L of 0.500 M HCl contains 0.100 × 0.500 = 0.0500 mol HCl. This can react with 0.0500 mol NaOH.",
      },
    ],
    formulas: [
      { name: "Molarity", formula: "M = moles of solute / liters of solution", desc: "Concentration in moles per liter (mol/L)" },
      { name: "Dilution Equation", formula: "C₁V₁ = C₂V₂", desc: "C₁V₁ = concentrated solution; C₂V₂ = dilute solution" },
      { name: "Moles from Molarity", formula: "moles = M × V (in liters)", desc: "Find moles from concentration and volume" },
    ],
    workedExamples: [
      {
        problem: "How many mL of 12.0 M HCl stock are needed to make 250 mL of 2.00 M solution?",
        steps: [
          { label: "Identify the formula", detail: "C₁V₁ = C₂V₂ → V₁ = (C₂ × V₂) / C₁" },
          { label: "Plug in values", detail: "V₁ = (2.00 M × 250 mL) / 12.0 M" },
          { label: "Calculate", detail: "V₁ = 500 / 12.0 = 41.7 mL" },
          { label: "Interpret", detail: "Measure 41.7 mL of stock, add solvent to reach 250 mL total" },
        ],
        answer: "41.7 mL of stock (3 sig figs)",
      },
      {
        problem: "What is the molarity of a solution made by dissolving 5.85 g NaCl in enough water to make 250 mL?",
        steps: [
          { label: "Convert mass to moles", detail: "5.85 g ÷ 58.44 g/mol = 0.100 mol NaCl" },
          { label: "Convert volume to liters", detail: "250 mL ÷ 1000 = 0.250 L" },
          { label: "Calculate molarity", detail: "M = moles / liters = 0.100 / 0.250 = 0.400 M" },
        ],
        answer: "0.400 M (3 sig figs)",
      },
    ],
    vocabulary: [
      { term: "Solution", def: "Homogeneous mixture of solute dissolved in solvent" },
      { term: "Solute", def: "The substance dissolved in a solution" },
      { term: "Solvent", def: "The substance that dissolves the solute (usually water)" },
      { term: "Molarity (M)", def: "Concentration in moles per liter (mol/L)" },
      { term: "Concentration", def: "Amount of solute per volume of solution" },
      { term: "Dilution", def: "Reducing concentration by adding solvent" },
      { term: "Stock Solution", def: "A concentrated solution kept on hand for dilution" },
      { term: "Aqueous", def: "Dissolved in water (aq)" },
    ],
  },
};
