// Learn content for each topic — teaches concepts before quizzes
// Written for students with ZERO chemistry knowledge
// Each topic has: intro, concepts (with diagrams), formulas, worked examples, vocabulary

export interface Diagram {
  type: "table" | "flowchart" | "steps" | "comparison" | "visual";
  title?: string;
  // For table type
  headers?: string[];
  rows?: string[][];
  // For flowchart type (tree structure)
  nodes?: { label: string; children?: string[]; note?: string }[];
  // For steps type (numbered visual steps)
  steps?: { label: string; visual: string }[];
  // For comparison type (side by side)
  left?: { title: string; items: string[] };
  right?: { title: string; items: string[] };
  // For visual type (ASCII/text-based diagram)
  visual?: string;
  caption?: string;
}

export interface Concept {
  title: string;
  body: string;
  example?: string;
  diagram?: Diagram;
  misconception?: string;
}

export interface Formula {
  name: string;
  formula: string;
  desc: string;
  example?: string;
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
    subtitle: "What chemistry is, what matter is, and how we measure it",
    color: "#818cf8",
    intro:
      "Before you can do any chemistry, you need to understand three things: what chemistry studies (matter), how we classify matter, and how we measure it. This section starts from absolute zero — no prior knowledge needed. By the end, you will understand what matter is, how to classify it, the difference between accuracy and precision, and how density works.",
    concepts: [
      {
        title: "What is Chemistry?",
        body: "Chemistry is the study of matter and the changes it undergoes. That is it. Matter is anything that has mass and takes up space. So chemistry is the study of everything physical around you — the air you breathe, the water you drink, the screen you are looking at, and every change those things go through (burning, dissolving, rusting, freezing, reacting). If it has mass and takes up space, chemistry studies it.",
        example: "A rock is matter — chemistry studies what it is made of. Burning wood is a chemical change — chemistry studies what happens. Light and heat are NOT matter (they are energy), so they are studied by physics, not chemistry.",
      },
      {
        title: "What is Matter?",
        body: "Matter is anything that has mass and takes up space (volume). Mass is how much stuff is in an object. Volume is how much space it occupies. If something has both, it is matter. If it lacks either, it is not matter. Energy (light, heat, sound, electricity) has no mass and takes no space, so it is not matter.",
        example: "Matter: a rock, water, air, your body, a metal spoon, the wood in a desk. NOT matter: light from a lamp, heat from a fire, sound from a speaker, the electricity in a wire.",
        diagram: {
          type: "comparison",
          left: {
            title: "MATTER",
            items: [
              "Has mass",
              "Takes up space (volume)",
              "Can be measured",
              "Can change (physical or chemical)",
              "Examples: rock, water, air, metal",
            ],
          },
          right: {
            title: "NOT MATTER (Energy)",
            items: [
              "No mass",
              "Takes no space",
              "Cannot be weighed",
              "Examples: light, heat, sound, electricity",
            ],
          },
        },
      },
      {
        title: "States of Matter",
        body: "Matter exists in three main states: solid, liquid, and gas. The difference is how the particles (atoms or molecules) are arranged and how much they move. In a solid, particles are packed tightly in a fixed arrangement — they vibrate but do not move around. In a liquid, particles are close but can slide past each other — they flow. In a gas, particles are far apart and move freely — they spread to fill any container.",
        example: "Water is the perfect example: ice (solid), liquid water (liquid), and steam (gas) are all the same substance — just in different states. The molecules are identical; only their arrangement and movement differ.",
        diagram: {
          type: "visual",
          visual:
            "SOLID         LIQUID        GAS\n" +
            "[#][#][#]    [#] [#]       #     #\n" +
            "[#][#][#]     [#][#]         # #\n" +
            "[#][#][#]    [#] [#]      #        #\n" +
            "\n" +
            "Fixed shape   Takes shape   Fills entire\n" +
            "Fixed volume  of container  container\n" +
            "Particles     Particles     Particles\n" +
            "packed tight  can slide     move freely\n" +
            "and vibrate   past each     and far apart",
          caption: "Particle arrangement in the three states of matter. In solids, particles are locked in place. In liquids, they stay close but can move. In gases, they spread out.",
        },
      },
      {
        title: "Classifying Matter: The Big Picture",
        body: "All matter falls into two categories: pure substances and mixtures. A pure substance has a fixed, definite composition — every sample of it is identical. A mixture contains two or more substances physically combined, and the composition can vary. Pure substances are further divided into elements (one type of atom) and compounds (two or more types of atoms chemically bonded). Mixtures are divided into homogeneous (uniform throughout) and heterogeneous (distinct visible parts).",
        diagram: {
          type: "flowchart",
          nodes: [
            {
              label: "MATTER",
              children: ["Pure Substances", "Mixtures"],
            },
            {
              label: "Pure Substances",
              children: ["Elements", "Compounds"],
              note: "Fixed composition — every sample is the same",
            },
            {
              label: "Elements",
              note: "One type of atom: Fe, O2, He, Au",
            },
            {
              label: "Compounds",
              note: "Two+ elements chemically bonded: H2O, NaCl, CO2",
            },
            {
              label: "Mixtures",
              children: ["Homogeneous", "Heterogeneous"],
              note: "Variable composition — can be physically separated",
            },
            {
              label: "Homogeneous",
              note: "Uniform throughout: salt water, air, brass",
            },
            {
              label: "Heterogeneous",
              note: "Visible distinct parts: sand+water, oil+water, salad",
            },
          ],
        },
      },
      {
        title: "Elements vs Compounds",
        body: "An element is a pure substance made of only one type of atom. You cannot break it down into anything simpler by chemical means. There are 118 known elements — they are listed on the periodic table. A compound is a pure substance made of two or more different elements chemically bonded together in a fixed ratio. Compounds can only be separated back into elements by a chemical reaction, not by physical means.",
        example: "Iron (Fe) is an element — every atom is iron. Water (H2O) is a compound — each molecule has 2 hydrogen atoms bonded to 1 oxygen atom, always in that 2:1 ratio. You cannot separate water into hydrogen and oxygen by filtering or boiling; you need a chemical reaction (electrolysis).",
        diagram: {
          type: "comparison",
          left: {
            title: "ELEMENTS",
            items: [
              "One type of atom",
              "Cannot be broken down",
              "Listed on periodic table",
              "Examples: Fe (iron), O2 (oxygen), Au (gold), He (helium)",
              "118 known elements",
            ],
          },
          right: {
            title: "COMPOUNDS",
            items: [
              "Two+ elements chemically bonded",
              "Fixed ratio (always the same)",
              "Can only be separated by chemical reactions",
              "Examples: H2O (water), NaCl (salt), CO2 (carbon dioxide)",
              "Millions of compounds exist",
            ],
          },
        },
      },
      {
        title: "Homogeneous vs Heterogeneous Mixtures",
        body: "A homogeneous mixture is uniform throughout — if you look at any part of it, it is the same as any other part. You cannot see the individual components. A heterogeneous mixture has distinct, visible parts or phases — you can see that it is not uniform. The key test: if you can see different substances or layers, it is heterogeneous. If it looks the same everywhere, it is homogeneous.",
        example: "Homogeneous: salt dissolved in water (looks like plain water — the salt is invisible), air (looks uniform), brass (a uniform metal alloy). Heterogeneous: sand mixed with water (you can see the sand separate from the water), oil and water (two visible layers), a salad (you can see each ingredient).",
        diagram: {
          type: "comparison",
          left: {
            title: "HOMOGENEOUS",
            items: [
              "Uniform throughout",
              "Cannot see individual parts",
              "Also called a 'solution'",
              "Salt water, air, steel, brass",
              "Looks the same in every sample",
            ],
          },
          right: {
            title: "HETEROGENEOUS",
            items: [
              "Non-uniform — visible parts",
              "Can see different components",
              "Has distinct phases or layers",
              "Sand+water, oil+water, salad, blood",
              "Different samples may look different",
            ],
          },
        },
      },
      {
        title: "Physical vs Chemical Changes",
        body: "A physical change does not produce a new substance. The matter changes form, state, or size, but its chemical identity stays the same. A chemical change produces one or more entirely new substances with different properties. The key question: did you end up with the same substance in a different form (physical), or a completely different substance (chemical)?",
        example: "Physical: melting ice (still water, just liquid instead of solid), tearing paper (still paper, just smaller), dissolving salt in water (still salt and water, just mixed). Chemical: burning wood (wood becomes ash, smoke, and gases — all new substances), rusting iron (iron becomes iron oxide — a new substance), cooking an egg (raw egg becomes cooked egg — new substance).",
        diagram: {
          type: "comparison",
          left: {
            title: "PHYSICAL CHANGE",
            items: [
              "No new substance formed",
              "Same matter, different form",
              "Usually reversible",
              "Melting, freezing, boiling, dissolving, cutting, tearing",
              "Identity preserved",
            ],
          },
          right: {
            title: "CHEMICAL CHANGE",
            items: [
              "New substance(s) formed",
              "Different matter with different properties",
              "Usually hard to reverse",
              "Burning, rusting, cooking, digestion, electrolysis",
              "Identity changes",
            ],
          },
        },
      },
      {
        title: "Physical vs Chemical Properties",
        body: "Every substance has two kinds of properties: physical properties and chemical properties. A physical property is a characteristic you can observe or measure without changing the substance into something new. Color, density, melting point, boiling point, hardness, and electrical conductivity are all physical properties. You can measure the melting point of ice without turning the water into a different substance. A chemical property describes how a substance reacts or fails to react with other substances — it can only be observed when the substance undergoes a chemical change. Flammability (will it burn?), reactivity with acids, toxicity, and whether it rusts or oxidizes are all chemical properties. You cannot tell if something is flammable just by looking at it; you have to try to burn it, which changes it into new substances.",
        example: "Physical properties of iron: it is gray, shiny, dense (7.87 g/mL), melts at 1538 C, conducts electricity, and is magnetic. Chemical properties of iron: it rusts when exposed to oxygen and water (forms iron oxide), it reacts with acids to produce hydrogen gas, and it is not flammable. The physical properties you can observe without changing the iron. The chemical properties require a chemical reaction to observe.",
        diagram: {
          type: "comparison",
          left: {
            title: "PHYSICAL PROPERTIES",
            items: [
              "Observed WITHOUT a chemical reaction",
              "No new substance formed",
              "Color, density, melting point, boiling point",
              "Hardness, conductivity, magnetism, odor",
              "State (solid/liquid/gas), solubility",
            ],
          },
          right: {
            title: "CHEMICAL PROPERTIES",
            items: [
              "Observed ONLY during a chemical change",
              "Describes reactivity with other substances",
              "Flammability, toxicity, acidity",
              "Reactivity with acids, water, or oxygen",
              "Whether it rusts, oxidizes, or decomposes",
            ],
          },
        },
        misconception: "Many students confuse physical properties with physical changes and chemical properties with chemical changes. A physical PROPERTY is a characteristic (like color or density). A physical CHANGE is an event (like melting). The property is what the substance has; the change is what happens to it. Similarly, a chemical PROPERTY is the potential to react (iron CAN rust); a chemical CHANGE is the actual reaction happening (iron IS rusting).",
      },
      {
        title: "The Scientific Method",
        body: "The scientific method is a systematic process scientists use to answer questions about the natural world. It is not a rigid set of steps but a general framework: make observations, ask a question, form a hypothesis, design and conduct an experiment, collect and analyze data, and draw a conclusion. The scientific method is how chemistry (and all science) progresses. You have used it yourself without realizing it — when your phone stops working, you observe the problem, guess why (hypothesis), test your guess (try charging it), and conclude what was wrong.",
        example: "Observation: a flashlight does not turn on. Question: why does it not work? Hypothesis: the batteries are dead. Experiment: replace the batteries with new ones and test. Result: the flashlight still does not work. Conclusion: the hypothesis was wrong — the batteries were not the problem. New hypothesis: the bulb is burned out. Test again: replace the bulb. It works. Conclusion: the bulb was the problem.",
        diagram: {
          type: "flowchart",
          nodes: [
            {
              label: "1. OBSERVATION",
              children: ["Notice something in the natural world"],
              note: "Use your senses or instruments to gather information",
            },
            {
              label: "2. QUESTION",
              children: ["Ask a specific, testable question"],
              note: "What do you want to find out?",
            },
            {
              label: "3. HYPOTHESIS",
              children: ["Propose a testable explanation"],
              note: "An educated guess based on prior knowledge — not a random guess",
            },
            {
              label: "4. EXPERIMENT",
              children: ["Test the hypothesis under controlled conditions"],
              note: "Change one variable, measure the result, keep everything else constant",
            },
            {
              label: "5. ANALYSIS",
              children: ["Collect and analyze the data"],
              note: "Does the data support or refute the hypothesis?",
            },
            {
              label: "6. CONCLUSION",
              children: ["Report findings and decide next steps"],
              note: "If supported, the hypothesis may lead to a theory. If not, revise and retest.",
            },
          ],
        },
        misconception: "Many people think the scientific method is always a straight line from observation to conclusion. In reality, it is a cycle. If your experiment refutes your hypothesis, you go back and form a new one. Science is iterative — you rarely get it right on the first try.",
      },
      {
        title: "Hypothesis, Theory, and Law",
        body: "These three terms are often confused, but they have distinct meanings in science. A hypothesis is a proposed, testable explanation for an observation. It is an educated guess that has not yet been thoroughly tested. A theory is a well-substantiated explanation of some aspect of the natural world that has been repeatedly confirmed through observation and experiment. Theories explain WHY things happen. A law is a statement that describes what happens in nature under certain conditions, often expressed as a mathematical equation. Laws describe WHAT happens but not WHY. The key distinction: theories explain, laws describe. A hypothesis does not 'grow up' to become a theory, and a theory does not 'graduate' into a law. They are different types of statements that serve different purposes.",
        example: "Hypothesis: 'If I increase the temperature of a gas, its volume will increase.' Theory: The Kinetic Molecular Theory explains why gases expand when heated (particles move faster and collide harder with the walls). Law: Charles's Law states that V1/T1 = V2/T2 — it describes the mathematical relationship without explaining why. The theory explains why the law works.",
        diagram: {
          type: "comparison",
          left: {
            title: "HYPOTHESIS",
            items: [
              "A testable proposed explanation",
              "Based on observation and prior knowledge",
              "Not yet confirmed by extensive testing",
              "Can be supported or refuted by one experiment",
              "Example: 'Acid rain stunts plant growth'",
            ],
          },
          right: {
            title: "THEORY vs LAW",
            items: [
              "THEORY: explains WHY (well-tested)",
              "Supported by many experiments over time",
              "Example: Kinetic Molecular Theory",
              "LAW: describes WHAT (a pattern)",
              "Example: Charles's Law (V/T = constant)",
            ],
          },
        },
        misconception: "The phrase 'just a theory' is misleading. In everyday language, 'theory' means a guess. In science, a theory is one of the strongest forms of knowledge — it is backed by overwhelming evidence. The Theory of Evolution, the Atomic Theory, and the Germ Theory of Disease are not guesses; they are rigorously tested explanations. Also, theories do not become laws — they are fundamentally different things.",
      },
      {
        title: "Variables and Controls in Experiments",
        body: "A well-designed experiment tests one thing at a time. The independent variable is what you deliberately change. The dependent variable is what you measure (it depends on the independent variable). Control variables (also called constants) are everything else that you keep the same so they do not affect the result. A control is also a specific reference point: a control group is a group that does NOT receive the treatment, so you can compare it to the group that did. Without controls, you cannot know whether the independent variable actually caused the change you observed.",
        example: "Experiment: Does fertilizer make plants grow taller? Independent variable: amount of fertilizer (0 g, 5 g, 10 g). Dependent variable: plant height after 4 weeks. Control variables: same soil, same water, same sunlight, same plant type. The 0 g group is the control group — it gets no fertilizer, so you can compare the fertilized plants to it.",
        diagram: {
          type: "table",
          title: "Types of Variables",
          headers: ["Type", "What It Is", "Example (Fertilizer Experiment)"],
          rows: [
            ["Independent Variable", "What YOU change", "Amount of fertilizer (0, 5, 10 g)"],
            ["Dependent Variable", "What you MEASURE", "Plant height after 4 weeks"],
            ["Control Variables", "What you keep the SAME", "Soil type, water, sunlight, plant species"],
            ["Control Group", "The untreated reference", "The 0 g fertilizer group"],
          ],
        },
        misconception: "A common mistake is changing more than one variable at a time. If you give one plant more fertilizer AND more water, and it grows taller, you cannot tell which change caused the growth. Change only ONE variable at a time and control everything else.",
      },
      {
        title: "Measurements: Every Measurement Has Two Parts",
        body: "Every scientific measurement consists of two parts: a number (the magnitude — how much) and a unit (what you are measuring). A number alone is meaningless in science. '5' tells you nothing. '5 grams' tells you exactly what you have. The number tells you the quantity, and the unit tells you the scale and what is being measured. Without both, a measurement is incomplete.",
        example: "25 mL has the number 25 and the unit mL (milliliters). 10.0 g has the number 10.0 and the unit g (grams). If someone says 'the mass is 5,' you cannot use that information — 5 what? 5 grams? 5 kilograms? 5 pounds? Those are very different amounts.",
        misconception: "A common mistake is writing a measurement without units, or mixing up units. Always include the unit. Always check that your units make sense for what you are measuring (mass in grams, volume in liters, length in meters).",
      },
      {
        title: "Accuracy vs Precision",
        body: "Accuracy is how close your measurement is to the true or accepted value. Precision is how close repeated measurements are to each other. These are different things. You can be precise but not accurate (all your measurements cluster together but are far from the true value). You can be accurate but not precise (your measurements average out to the true value but are scattered). The goal is to be both accurate AND precise.",
        example: "Imagine a dartboard. The bullseye is the true value (accurate). If all your darts land close to the bullseye, you are accurate. If all your darts land close to each other (even if not near the bullseye), you are precise. If your darts are scattered all over, you are neither.",
        diagram: {
          type: "visual",
          visual:
            "ACCURATE + PRECISE    PRECISE, NOT ACCURATE    ACCURATE, NOT PRECISE    NEITHER\n" +
            "\n" +
            "      .                      .                  .         .\n" +
            "    ( O )                    .                  .             .\n" +
            "      .                    .                  .         .\n" +
            "                           .                  .                .\n" +
            "\n" +
            "  Darts in center,      Darts clustered      Darts average      Darts\n" +
            "  clustered together    but off-center       to center but      scattered\n" +
            "                                              scattered          everywhere",
          caption: "The classic target diagram. Accuracy = hitting the center. Precision = tight grouping. The best measurements are both accurate and precise.",
        },
        misconception: "Many students think precision means the same thing as accuracy. It does not. A scale that always reads 2 pounds too heavy is precise (consistent) but not accurate (wrong). A scale that sometimes reads correctly but varies a lot is accurate on average but not precise.",
      },
      {
        title: "Mass vs Weight",
        body: "Mass is the amount of matter in an object. It never changes — no matter where you are. Weight is the force of gravity pulling on that mass. It changes depending on where you are. An object has the same mass on Earth, on the Moon, and in deep space. But it weighs less on the Moon (weaker gravity) and weighs nothing in deep space (no gravity). In chemistry, we almost always use mass (grams), not weight.",
        example: "A 70 kg astronaut has a mass of 70 kg everywhere — on Earth, on the Moon, and in space. But their weight changes: on Earth they weigh about 686 Newtons, on the Moon about 114 Newtons (1/6 of Earth gravity), and in deep space they weigh 0 Newtons (weightless). The mass never changed — only the gravity did.",
        misconception: "People use 'mass' and 'weight' interchangeably in everyday life. In science, they are different. Your bathroom scale measures weight (the force of gravity on you) but displays it in mass units (kg or lbs) by assuming Earth gravity. On the Moon, the same scale would read differently.",
      },
      {
        title: "Density: How Packed the Matter Is",
        body: "Density is the amount of mass per unit of volume. It tells you how tightly packed the matter is. Think of it this way: if you have a box, density tells you how much stuff is crammed into that box. High density means a lot of mass in a small space. Low density means little mass in a large space. Density is an intensive property — it does not depend on how much you have. A drop of water and an ocean of water have the same density.",
        example: "Water has a density of 1.00 g/mL. A tiny drop and a swimming pool of water both have density = 1.00 g/mL. Iron has a density of 7.87 g/mL — much higher than water, which is why iron sinks. A piece of wood has a density around 0.5 g/mL — less than water, which is why wood floats.",
        diagram: {
          type: "visual",
          visual:
            "Same volume, different mass = different density\n" +
            "\n" +
            "  [WOOD]        [WATER]       [IRON]\n" +
            "  100 mL        100 mL        100 mL\n" +
            "  50 g          100 g         787 g\n" +
            "  D = 0.5       D = 1.0       D = 7.87\n" +
            "  g/mL          g/mL          g/mL\n" +
            "  FLOATS        --            SINKS",
          caption: "Three objects with the same volume but different masses. The more mass in the same space, the higher the density. Objects less dense than water (like wood) float. Objects more dense (like iron) sink.",
        },
      },
    ],
    formulas: [
      {
        name: "Density",
        formula: "D = mass / volume",
        desc: "Mass divided by volume. Common units: g/mL, g/cm3, or kg/m3. The mass is how much stuff you have, the volume is how much space it takes up, and the density is how packed it is.",
        example: "If an object has a mass of 27.0 g and a volume of 10.0 mL: D = 27.0 / 10.0 = 2.70 g/mL",
      },
    ],
    workedExamples: [
      {
        problem: "An object has a mass of 27.0 g and a volume of 10.0 mL. What is its density?",
        steps: [
          { label: "Identify what you know", detail: "mass = 27.0 g, volume = 10.0 mL" },
          { label: "Identify the formula", detail: "Density = mass / volume" },
          { label: "Plug in the values", detail: "D = 27.0 g / 10.0 mL" },
          { label: "Calculate", detail: "D = 2.70 g/mL" },
          { label: "Check sig figs", detail: "Both 27.0 and 10.0 have 3 significant figures, so the answer has 3 sig figs: 2.70 g/mL. (This happens to be the density of aluminum.)" },
        ],
        answer: "2.70 g/mL (3 sig figs)",
      },
    ],
    vocabulary: [
      { term: "Matter", def: "Anything that has mass and takes up space" },
      { term: "Mass", def: "The amount of matter in an object — does not change with location" },
      { term: "Volume", def: "How much space an object takes up" },
      { term: "Element", def: "Pure substance made of only one type of atom (Fe, O2, He)" },
      { term: "Compound", def: "Two or more elements chemically bonded in a fixed ratio (H2O, NaCl)" },
      { term: "Mixture", def: "Two or more substances physically combined (not chemically bonded)" },
      { term: "Homogeneous Mixture", def: "Uniform throughout — cannot see individual parts (salt water, air)" },
      { term: "Heterogeneous Mixture", def: "Non-uniform — can see distinct parts (sand and water, oil and water)" },
      { term: "Physical Change", def: "Change that does not produce a new substance (melting, cutting, dissolving)" },
      { term: "Chemical Change", def: "Change that produces one or more new substances (burning, rusting, cooking)" },
      { term: "Physical Property", def: "A characteristic observed without changing the substance (color, density, melting point)" },
      { term: "Chemical Property", def: "How a substance reacts with other substances (flammability, reactivity, toxicity)" },
      { term: "Molecule", def: "Two or more atoms chemically bonded together (H2O, O2, CO2)" },
      { term: "Weight", def: "The force of gravity on an object — changes with location (unlike mass)" },
      { term: "Hypothesis", def: "A testable proposed explanation for an observation — an educated guess" },
      { term: "Theory", def: "A well-substantiated explanation of natural phenomena, confirmed by many experiments" },
      { term: "Law", def: "A statement describing what happens in nature under certain conditions (often a formula)" },
      { term: "Control", def: "Variables kept constant in an experiment so only the independent variable affects the result" },
      { term: "Variable", def: "Something that can change in an experiment — independent (changed), dependent (measured), control (kept same)" },
      { term: "Scientific Method", def: "A systematic process: observe, question, hypothesize, experiment, analyze, conclude" },
      { term: "Accuracy", def: "How close a measurement is to the true value" },
      { term: "Precision", def: "How close repeated measurements are to each other" },
      { term: "Density", def: "Mass per unit volume (D = m/V) — how packed the matter is" },
    ],
  },

  "metric-system": {
    topicId: "metric-system",
    title: "The Metric System",
    subtitle: "How scientists measure length, mass, volume, and temperature",
    color: "#34d399",
    intro:
      "The metric system is the universal language of science. Unlike the imperial system (inches, pounds, gallons), the metric system is based on powers of 10 — every unit is 10 times bigger or smaller than the next. This makes conversions incredibly simple once you understand the pattern. This section will teach you the base units, the prefixes that scale them, and how to convert between metric units.",
    concepts: [
      {
        title: "Why the Metric System?",
        body: "The metric system exists because scientists needed a universal, logical measurement system. The imperial system (used in the US) has random conversion factors: 12 inches in a foot, 3 feet in a yard, 1760 yards in a mile, 16 ounces in a pound. These numbers are hard to work with. The metric system fixes this: every unit is related by powers of 10. 1000 millimeters in a meter. 1000 meters in a kilometer. 1000 grams in a kilogram. Once you learn the pattern, you can convert any metric unit without memorizing dozens of conversion factors.",
        example: "In the imperial system, to convert inches to miles you need: 12 inches = 1 foot, 3 feet = 1 yard, 1760 yards = 1 mile. In the metric system, to convert millimeters to kilometers you just move the decimal point 6 places. That is the power of powers of 10.",
      },
      {
        title: "The SI Base Units",
        body: "The International System of Units (SI, from the French 'Systeme International') defines base units for each physical quantity. In chemistry, you need to know four base units: the meter (m) for length, the gram (g) for mass, the liter (L) for volume, and the mole (mol) for amount of substance. There are 7 SI base units total, but these four are the ones you will use constantly in chemistry.",
        diagram: {
          type: "table",
          title: "SI Base Units Used in Chemistry",
          headers: ["Quantity", "Unit Name", "Symbol", "What it Measures"],
          rows: [
            ["Length", "meter", "m", "How long something is"],
            ["Mass", "gram", "g", "How much matter something has"],
            ["Volume", "liter", "L", "How much space something takes up"],
            ["Amount", "mole", "mol", "How many particles (atoms/molecules)"],
            ["Temperature", "Kelvin", "K", "How hot or cold something is"],
            ["Time", "second", "s", "How long something takes"],
          ],
        },
      },
      {
        title: "Metric Prefixes: Scaling Units Up and Down",
        body: "Base units are just the starting point. Prefixes scale them up or down by powers of 10. For example, 'kilo' means 1000, so 1 kilometer = 1000 meters. 'Milli' means 0.001, so 1 millimeter = 0.001 meters. Each prefix has a symbol and a power of 10. You need to memorize the common prefixes — there are only about 6 that you will use regularly.",
        diagram: {
          type: "table",
          title: "Common Metric Prefixes",
          headers: ["Prefix", "Symbol", "Power of 10", "Value", "Example"],
          rows: [
            ["kilo", "k", "10^3", "1000", "1 km = 1000 m"],
            ["deci", "d", "10^-1", "0.1", "1 dm = 0.1 m (rarely used)"],
            ["centi", "c", "10^-2", "0.01", "1 cm = 0.01 m"],
            ["milli", "m", "10^-3", "0.001", "1 mm = 0.001 m"],
            ["micro", "u", "10^-6", "0.000001", "1 um = 0.000001 m"],
            ["nano", "n", "10^-9", "0.000000001", "1 nm = 0.000000001 m"],
          ],
        },
        misconception: "A common mistake is confusing 'milli' with 'million.' Milli means thousandth (0.001), not millionth. One millimeter is 1/1000 of a meter, not 1/1,000,000. The prefix for millionth is 'micro.'",
      },
      {
        title: "The Metric Staircase",
        body: "A visual way to remember metric conversions is the 'metric staircase.' Imagine a staircase where each step is a prefix. The base unit (meter, gram, liter) is in the middle. Going UP the stairs (to larger units like kilo), you DIVIDE by 10 for each step. Going DOWN the stairs (to smaller units like centi, milli), you MULTIPLY by 10 for each step. The mnemonic 'King Henry Died By Drinking Chocolate Milk' helps remember the order: Kilo, Hecto, Deca, Base, Deci, Centi, Milli.",
        diagram: {
          type: "visual",
          visual:
            "           kilo (k) = 1000\n" +
            "              |\n" +
            "           hecto (h) = 100\n" +
            "              |\n" +
            "           deca (da) = 10\n" +
            "              |\n" +
            "           BASE UNIT (m, g, L) = 1\n" +
            "              |\n" +
            "           deci (d) = 0.1\n" +
            "              |\n" +
            "           centi (c) = 0.01\n" +
            "              |\n" +
            "           milli (m) = 0.001\n" +
            "              |\n" +
            "           micro (u) = 0.000001\n" +
            "\n" +
            "Going DOWN (to smaller units): MULTIPLY by 10 each step\n" +
            "Going UP (to larger units): DIVIDE by 10 each step\n" +
            "\n" +
            "K    H    D    B    D    C    M\n" +
            "i    e    e    A    e    e    i\n" +
            "l    c    c    S    c    n    l\n" +
            "o    t    a    E    i    t    l\n" +
            "           o    i           i\n" +
            "                e           (King Henry Died By Drinking Chocolate Milk)",
          caption: "The metric staircase. Each step is a power of 10. Going down to smaller units, multiply. Going up to larger units, divide.",
        },
      },
      {
        title: "Converting Within the Metric System",
        body: "To convert between metric units, use the prefix to determine the conversion factor. The rule is simple: if you are going from a larger unit to a smaller unit, the number gets bigger (multiply). If you are going from a smaller unit to a larger unit, the number gets smaller (divide). This makes sense — there are more millimeters than meters in the same length, so the number of millimeters is bigger.",
        example: "Convert 3.5 km to meters: kilometers are bigger than meters, so there are more meters than kilometers. Multiply: 3.5 x 1000 = 3500 m. Convert 500 mg to grams: grams are bigger than milligrams, so there are fewer grams. Divide: 500 / 1000 = 0.500 g.",
        diagram: {
          type: "table",
          title: "Conversion Examples",
          headers: ["From", "To", "Direction", "Operation", "Result"],
          rows: [
            ["3.5 km", "m", "Large to small", "Multiply by 1000", "3500 m"],
            ["500 mg", "g", "Small to large", "Divide by 1000", "0.500 g"],
            ["250 mL", "L", "Small to large", "Divide by 1000", "0.250 L"],
            ["2.0 kg", "g", "Large to small", "Multiply by 1000", "2000 g"],
            ["45 cm", "m", "Small to large", "Divide by 100", "0.45 m"],
            ["1.5 m", "cm", "Large to small", "Multiply by 100", "150 cm"],
          ],
        },
      },
      {
        title: "The Factor-Label Method (Dimensional Analysis)",
        body: "The factor-label method is a systematic way to convert units. You write the conversion as a fraction (a 'conversion factor') so the unwanted unit cancels out. The key rule: arrange the factor so the unit you want to get rid of is in the opposite position (if it is in the numerator of your given value, put it in the denominator of the factor). The unit you want to keep should end up in the numerator. When the same unit appears in both the numerator and denominator, they cancel.",
        example: "Convert 250 mL to L. You know 1000 mL = 1 L. Write it as a fraction: (1 L / 1000 mL). Multiply: 250 mL x (1 L / 1000 mL). The mL in the numerator and the mL in the denominator cancel, leaving L. 250 / 1000 = 0.250 L.",
        diagram: {
          type: "visual",
          visual:
            "Convert 250 mL to Liters:\n" +
            "\n" +
            "  250 mL   1 L        250\n" +
            "  ------ x ------ = ------ = 0.250 L\n" +
            "    1     1000 mL    1000\n" +
            "\n" +
            "         ^\n" +
            "         |\n" +
            "  mL cancels (appears top and bottom)\n" +
            "  L stays in the numerator = your answer unit",
          caption: "The factor-label method. The conversion factor (1 L / 1000 mL) is a fraction equal to 1. The unwanted unit (mL) cancels, leaving the desired unit (L).",
        },
      },
      {
        title: "Temperature Scales: Celsius and Kelvin",
        body: "There are three temperature scales: Celsius (C), Fahrenheit (F), and Kelvin (K). In chemistry, we use Celsius and Kelvin. Fahrenheit is only used in the US for everyday purposes. Celsius is based on water: 0 C = freezing point of water, 100 C = boiling point of water. Kelvin is the SI temperature unit — it starts at absolute zero (0 K = -273.15 C), the coldest possible temperature. The key fact: Celsius and Kelvin use the same size degree. A change of 1 C is the same as a change of 1 K. They just have different starting points.",
        diagram: {
          type: "table",
          title: "Temperature Scale Comparison",
          headers: ["Point", "Celsius", "Kelvin", "Fahrenheit"],
          rows: [
            ["Absolute zero", "-273 C", "0 K", "-460 F"],
            ["Water freezes", "0 C", "273 K", "32 F"],
            ["Room temperature", "25 C", "298 K", "77 F"],
            ["Body temperature", "37 C", "310 K", "98.6 F"],
            ["Water boils", "100 C", "373 K", "212 F"],
          ],
        },
        misconception: "Some students think Kelvin degrees are a different size than Celsius degrees. They are the same size. The only difference is the starting point: 0 K = -273.15 C. So a 10 C increase is the same as a 10 K increase. Also, Kelvin does not use the degree symbol — you write '298 K,' not '298 degrees K.'",
      },
      {
        title: "Exact vs Measured Conversions",
        body: "Some conversion factors are exact definitions — they have infinite significant figures. For example, 1 km = 1000 m is a definition. 1 inch = 2.54 cm is an exact definition. These do not limit the precision of your calculation. Other conversions are measured and have a specific number of significant figures. For example, 1 mile = 1.609 km was measured, so it has 4 significant figures and will limit your answer to 4 sig figs.",
        example: "Exact (infinite sig figs): 1000 mg = 1 g, 100 cm = 1 m, 1 inch = 2.54 cm. Measured (limited sig figs): 1 mile = 1.609 km (4 sig figs), 1 pound = 453.6 g (4 sig figs). When doing calculations, exact conversions do not affect your sig figs, but measured ones do.",
      },
      {
        title: "SI Abbreviations You Must Know",
        body: "In chemistry, using the correct abbreviation is not optional — it is required for credit on exams, quizzes, and labs. The most confusing abbreviations involve the letter M. A capital M means molarity (mol/L) — a concentration. A lowercase m as a prefix means milli (10^-3). The word mol means mole (a quantity). So mM means millimolar (mmol/L), and mmol means millimole (a quantity). The capital M is a concentration; the lowercase m prefix is a multiplier. Getting these wrong changes the meaning of your answer entirely.",
        example: "M = molarity = mol/L (concentration). mM = millimolar = mmol/L = 10^-3 M (concentration). uM = micromolar = umol/L = 10^-6 M (concentration). mol = mole (a quantity, 6.02 x 10^23 items). mmol = millimole = 10^-3 mol (a quantity). umol = micromole = 10^-6 mol (a quantity). m = meter (length). Do NOT write 'M' when you mean 'mol' or 'm' — they are completely different.",
        diagram: {
          type: "table",
          title: "SI Abbreviations for Chemistry",
          headers: ["Abbreviation", "Full Name", "What It Is", "Meaning"],
          rows: [
            ["m", "meter", "Length (base unit)", "1 m = base unit of length"],
            ["M", "molarity", "Concentration", "mol/L — moles per liter of solution"],
            ["mol", "mole", "Quantity (amount)", "6.02 x 10^23 items"],
            ["mmol", "millimole", "Quantity (amount)", "10^-3 mol = 0.001 mol"],
            ["umol", "micromole", "Quantity (amount)", "10^-6 mol = 0.000001 mol"],
            ["mM", "millimolar", "Concentration", "mmol/L = 10^-3 M"],
            ["uM", "micromolar", "Concentration", "umol/L = 10^-6 M"],
          ],
        },
        misconception: "The most common mistake is confusing M (molarity, a concentration) with m (meter, a length) or mol (mole, a quantity). Capital M = concentration. Lowercase m = meter or the prefix milli-. The word mol = mole (a count of particles). These are three completely different things. Another mistake: writing 'mM' as 'mm' — mm is millimeters (length), not millimolar (concentration).",
      },
    ],
    formulas: [
      {
        name: "Celsius to Kelvin",
        formula: "K = C + 273.15",
        desc: "Add 273.15 to a Celsius temperature to get Kelvin. The degrees are the same size, only the starting point differs.",
        example: "25 C + 273.15 = 298 K",
      },
      {
        name: "Kelvin to Celsius",
        formula: "C = K - 273.15",
        desc: "Subtract 273.15 from a Kelvin temperature to get Celsius.",
        example: "300 K - 273.15 = 26.85 C",
      },
    ],
    workedExamples: [
      {
        problem: "Convert 4.50 km to centimeters.",
        steps: [
          { label: "Start with the given", detail: "4.50 km — we need to get to cm" },
          { label: "Plan the path", detail: "km -> m -> cm (go through the base unit)" },
          { label: "Convert km to m", detail: "4.50 km x (1000 m / 1 km) = 4500 m. The km cancels." },
          { label: "Convert m to cm", detail: "4500 m x (100 cm / 1 m) = 450000 cm. The m cancels." },
          { label: "Check sig figs", detail: "4.50 has 3 sig figs. The conversion factors (1000 and 100) are exact. So the answer has 3 sig figs: 4.50 x 10^5 cm, or 450000 cm (3 sig figs)." },
        ],
        answer: "4.50 x 10^5 cm (3 sig figs)",
      },
    ],
    vocabulary: [
      { term: "SI Unit", def: "International System of Units — the standard metric units used in science" },
      { term: "Prefix", def: "A modifier added to a base unit that scales it by a power of 10" },
      { term: "Kilo (k)", def: "Prefix meaning 1000 (10^3). 1 km = 1000 m" },
      { term: "Centi (c)", def: "Prefix meaning 0.01 (10^-2). 1 cm = 0.01 m" },
      { term: "Milli (m)", def: "Prefix meaning 0.001 (10^-3). 1 mm = 0.001 m" },
      { term: "Micro (u)", def: "Prefix meaning 0.000001 (10^-6). 1 um = 0.000001 m" },
      { term: "Kelvin (K)", def: "SI temperature unit. 0 K = absolute zero = -273.15 C" },
      { term: "Conversion Factor", def: "A fraction equal to 1, used to convert between units" },
      { term: "Factor-Label Method", def: "Converting units by multiplying by conversion factors so units cancel" },
      { term: "Molarity (M)", def: "Concentration unit: mol/L (moles per liter). Capital M = concentration" },
      { term: "Millimolar (mM)", def: "Concentration unit: mmol/L = 10^-3 M. NOT the same as mm (millimeters)" },
      { term: "Micromolar (uM)", def: "Concentration unit: umol/L = 10^-6 M" },
      { term: "Mole (mol)", def: "A quantity: 6.02 x 10^23 items. NOT a concentration" },
      { term: "Millimole (mmol)", def: "A quantity: 10^-3 mol = 0.001 mol. NOT a concentration" },
      { term: "Micromole (umol)", def: "A quantity: 10^-6 mol = 0.000001 mol. NOT a concentration" },
    ],
  },

  "atomic-structure": {
    topicId: "atomic-structure",
    title: "Atomic Structure",
    subtitle: "What atoms are made of and how they work",
    color: "#a78bfa",
    intro:
      "Everything around you — your body, the air, the screen you are looking at — is made of atoms. Atoms are the fundamental building blocks of all matter. Understanding what is inside an atom is the foundation of all chemistry. This section will teach you what atoms are made of, how they differ from each other, and how electrons are arranged around the nucleus. No prior knowledge needed — we start from scratch.",
    concepts: [
      {
        title: "What is an Atom?",
        body: "An atom is the smallest unit of an element that still has the properties of that element. If you took a piece of gold and kept cutting it in half, over and over, until you could not cut it anymore without destroying what makes it gold — that smallest piece is a single gold atom. Atoms are incredibly small. A single atom is about 10^-10 meters across (0.0000000001 m). There are more atoms in a glass of water than there are stars in the observable universe.",
        example: "A gold ring is made of gold atoms. A drop of water contains about 1.5 x 10^21 water molecules (and each molecule is made of 3 atoms). You are made of about 7 x 10^27 atoms.",
      },
      {
        title: "The Three Subatomic Particles",
        body: "Atoms are made of three smaller particles (subatomic particles): protons, neutrons, and electrons. Protons have a positive charge (+1) and are found in the nucleus (the center of the atom). Neutrons have no charge (neutral) and are also in the nucleus. Electrons have a negative charge (-1) and orbit around the nucleus in regions called orbitals or shells. Protons and neutrons have about the same mass (1 atomic mass unit, amu). Electrons are about 2000 times lighter — their mass is essentially zero compared to protons and neutrons.",
        diagram: {
          type: "table",
          title: "The Three Subatomic Particles",
          headers: ["Particle", "Charge", "Mass", "Location", "Role"],
          rows: [
            ["Proton", "+1", "1 amu", "Nucleus (center)", "Number defines the element"],
            ["Neutron", "0 (neutral)", "1 amu", "Nucleus (center)", "Stabilizes the nucleus"],
            ["Electron", "-1", "~0 (1/1836 amu)", "Orbitals (around nucleus)", "Responsible for chemical reactions"],
          ],
        },
      },
      {
        title: "The Structure of an Atom",
        body: "An atom has a tiny, dense center called the nucleus, which contains all the protons and neutrons. The nucleus is incredibly small compared to the whole atom — if an atom were the size of a football stadium, the nucleus would be a marble at the center. The electrons orbit around the nucleus in layers called shells or energy levels. Most of the atom is empty space. The nucleus contains almost all the mass (protons and neutrons are heavy), but the electrons take up almost all the volume (they orbit far from the nucleus).",
        diagram: {
          type: "visual",
          visual:
            "         . . . . .\n" +
            "       .   e-   .\n" +
            "     .         .\n" +
            "    .  [NUCLEUS] .\n" +
            "    .  p+ n0 n0  .\n" +
            "     .  p+ n0  .\n" +
            "       .  e- .\n" +
            "         . . . . .\n" +
            "\n" +
            "  e- = electron (negative, orbits outside)\n" +
            "  p+ = proton (positive, in nucleus)\n" +
            "  n0 = neutron (neutral, in nucleus)\n" +
            "\n" +
            "  Nucleus = tiny, dense, heavy center\n" +
            "  Electrons = light, orbit far from nucleus\n" +
            "  Most of the atom = empty space",
          caption: "Simplified atomic structure. The nucleus (protons + neutrons) is tiny but contains almost all the mass. Electrons orbit in the surrounding space. If drawn to scale, the nucleus would be invisible.",
        },
      },
      {
        title: "Atomic Number (Z): What Makes an Element",
        body: "The atomic number (Z) is the number of protons in the nucleus. This is the single most important number in chemistry — it defines the element. Every atom with 6 protons is carbon. Every atom with 8 protons is oxygen. Every atom with 1 proton is hydrogen. Change the number of protons, and you change the element. The atomic number is what you see on the periodic table — it is the number above each element's symbol. In a neutral atom (no charge), the number of electrons equals the number of protons.",
        example: "Carbon has Z = 6 (always 6 protons). Oxygen has Z = 8 (always 8 protons). Hydrogen has Z = 1 (always 1 proton). Gold has Z = 79 (always 79 protons). If an atom has 7 protons, it is nitrogen — no exceptions.",
        misconception: "Some students think changing the number of electrons changes the element. It does not — it creates an ion (charged atom), but the element stays the same. Only changing the number of protons changes the element.",
      },
      {
        title: "Mass Number (A): Protons Plus Neutrons",
        body: "The mass number (A) is the total number of protons plus neutrons in the nucleus. Since electrons have almost no mass, the mass of an atom is essentially the mass of its protons and neutrons. Mass number = protons + neutrons. Unlike the atomic number, the mass number can vary between atoms of the same element, because the number of neutrons can vary.",
        example: "Carbon-12: A = 12 (6 protons + 6 neutrons). Carbon-14: A = 14 (6 protons + 8 neutrons). Both are carbon (same atomic number = 6), but they have different mass numbers because they have different numbers of neutrons.",
        diagram: {
          type: "visual",
          visual:
            "  Mass Number (A)  <-- top\n" +
            "       |\n" +
            "      12\n" +
            "       C        <-- element symbol\n" +
            "       |\n" +
            "       6        <-- atomic number (Z)\n" +
            "\n" +
            "  A = protons + neutrons = 6 + 6 = 12\n" +
            "  Z = protons = 6\n" +
            "  neutrons = A - Z = 12 - 6 = 6",
          caption: "Nuclear notation. The mass number (A) goes on top, the atomic number (Z) goes on the bottom, and the element symbol is in the middle. Neutrons = A - Z.",
        },
      },
      {
        title: "Isotopes: Same Element, Different Neutrons",
        body: "Isotopes are atoms of the same element (same number of protons) that have different numbers of neutrons (different mass numbers). Because they have the same number of protons and electrons, isotopes have the same chemical behavior — they react the same way. The only differences are their mass and their nuclear stability (some isotopes are radioactive, others are not). The word 'isotope' comes from Greek, meaning 'same place' — they occupy the same place on the periodic table.",
        example: "Hydrogen has three isotopes: protium (1H, 1 proton, 0 neutrons — ordinary hydrogen), deuterium (2H, 1 proton, 1 neutron — used in heavy water), and tritium (3H, 1 proton, 2 neutrons — radioactive). All three are hydrogen — they all have 1 proton and 1 electron. They just differ in neutrons.",
        diagram: {
          type: "comparison",
          left: {
            title: "CARBON-12 (12C)",
            items: [
              "6 protons",
              "6 neutrons",
              "6 electrons",
              "Mass number = 12",
              "Stable (not radioactive)",
              "Most common (99%)",
            ],
          },
          right: {
            title: "CARBON-14 (14C)",
            items: [
              "6 protons (same!)",
              "8 neutrons (different)",
              "6 electrons (same!)",
              "Mass number = 14",
              "Radioactive (used in carbon dating)",
              "Rare (about 1 in a trillion)",
            ],
          },
        },
      },
      {
        title: "Atomic Mass: The Weighted Average",
        body: "The atomic mass shown on the periodic table is NOT the mass number of any single atom. It is a weighted average of all naturally occurring isotopes of that element. A weighted average accounts for both the mass of each isotope and how common it is. If an element has two isotopes, one with mass 35 (75% abundant) and one with mass 37 (25% abundant), the atomic mass is (0.75 x 35) + (0.25 x 37) = 35.5 amu. This is why atomic masses on the periodic table are decimals, not whole numbers.",
        example: "Chlorine has two main isotopes: 35Cl (75% of all chlorine, mass = 35) and 37Cl (25% of all chlorine, mass = 37). Atomic mass = (0.75 x 35) + (0.25 x 37) = 26.25 + 9.25 = 35.5 amu. That is why chlorine's atomic mass on the periodic table is 35.45.",
        misconception: "Students often confuse atomic mass with mass number. Mass number is always a whole number (it is a count of protons + neutrons). Atomic mass is usually a decimal (it is a weighted average of isotopes). Mass number applies to a single atom. Atomic mass applies to the element as found in nature.",
      },
      {
        title: "Ions: When Atoms Gain or Lose Electrons",
        body: "An ion is an atom (or group of atoms) that has an unequal number of protons and electrons. A neutral atom has equal protons and electrons (charges cancel). If an atom loses electrons, it has more protons than electrons, so it becomes positively charged — this is called a cation. If an atom gains electrons, it has more electrons than protons, so it becomes negatively charged — this is called an anion. The number of protons NEVER changes when forming an ion — only the electrons change.",
        example: "Sodium (Na) has 11 protons and 11 electrons (neutral). If it loses 1 electron, it has 11 protons and 10 electrons — charge = +1. This is Na+ (sodium ion, a cation). Chlorine (Cl) has 17 protons and 17 electrons (neutral). If it gains 1 electron, it has 17 protons and 18 electrons — charge = -1. This is Cl- (chloride ion, an anion).",
        diagram: {
          type: "table",
          title: "Ion Formation Examples",
          headers: ["Atom", "Protons", "Electrons", "Charge", "Ion Name"],
          rows: [
            ["Na (neutral)", "11", "11", "0", "Sodium"],
            ["Na+ (lost 1 e-)", "11", "10", "+1", "Sodium ion (cation)"],
            ["Cl (neutral)", "17", "17", "0", "Chlorine"],
            ["Cl- (gained 1 e-)", "17", "18", "-1", "Chloride ion (anion)"],
            ["Ca (neutral)", "20", "20", "0", "Calcium"],
            ["Ca2+ (lost 2 e-)", "20", "18", "+2", "Calcium ion (cation)"],
          ],
        },
      },
      {
        title: "Electron Configuration: How Electrons Arrange Themselves",
        body: "Electrons do not orbit randomly. They occupy specific energy levels called shells (or energy levels). The first shell (closest to the nucleus) can hold a maximum of 2 electrons. The second shell can hold up to 8. The third shell can hold up to 8 (for the first 20 elements). Electrons always fill the lowest energy shell first, then move to the next one when it is full. This arrangement is called the electron configuration. The electrons in the outermost shell are called valence electrons, and they determine how the atom reacts chemically.",
        example: "Oxygen has 8 electrons. They fill as: 2 in the first shell, 6 in the second shell. Written as 1s2 2s2 2p4, or simply 2, 6. Sodium has 11 electrons: 2 in the first, 8 in the second, 1 in the third. Written as 2, 8, 1.",
        diagram: {
          type: "visual",
          visual:
            "  Shell 1 (closest):  max 2 electrons\n" +
            "  Shell 2:            max 8 electrons\n" +
            "  Shell 3:            max 8 electrons (first 20 elements)\n" +
            "\n" +
            "  Oxygen (8 e-):      [2] [6] [ ]\n" +
            "  Sodium (11 e-):     [2] [8] [1]\n" +
            "  Neon (10 e-):       [2] [8] [ ]  <- full outer shell = stable\n" +
            "  Argon (18 e-):      [2] [8] [8]  <- full outer shell = stable\n" +
            "\n" +
            "  Electrons fill lowest shell first.\n" +
            "  Outermost electrons = valence electrons (determine reactivity).",
          caption: "Electron shells fill from the inside out. Atoms with full outer shells (like neon and argon) are stable and do not react. Atoms with incomplete outer shells react to fill them.",
        },
      },
    ],
    workedExamples: [
      {
        problem: "An atom has 17 protons, 18 neutrons, and 18 electrons. What is the element, mass number, and charge?",
        steps: [
          { label: "Identify the element", detail: "17 protons = atomic number 17. Look at the periodic table: element 17 is Chlorine (Cl)." },
          { label: "Calculate the mass number", detail: "A = protons + neutrons = 17 + 18 = 35" },
          { label: "Calculate the charge", detail: "Charge = protons - electrons = 17 - 18 = -1. (More electrons than protons = negative charge.)" },
          { label: "Write the symbol", detail: "35Cl- (mass number 35, charge -1, element chlorine). This is the chloride ion." },
        ],
        answer: "Chlorine, mass number = 35, charge = -1 (the chloride ion, Cl-)",
      },
    ],
    vocabulary: [
      { term: "Atom", def: "The smallest unit of an element that retains its properties" },
      { term: "Proton", def: "Positively charged particle in the nucleus; number defines the element" },
      { term: "Neutron", def: "Neutral particle in the nucleus; number determines the isotope" },
      { term: "Electron", def: "Negatively charged particle orbiting the nucleus; responsible for chemical reactions" },
      { term: "Nucleus", def: "The dense center of the atom, containing protons and neutrons" },
      { term: "Atomic Number (Z)", def: "Number of protons; defines the element" },
      { term: "Mass Number (A)", def: "Protons + neutrons in the nucleus (always a whole number)" },
      { term: "Isotope", def: "Atoms of the same element with different numbers of neutrons" },
      { term: "Atomic Mass", def: "Weighted average mass of an element's naturally occurring isotopes (decimal)" },
      { term: "Ion", def: "Atom with unequal protons and electrons (has a charge)" },
      { term: "Cation", def: "Positively charged ion (lost electrons)" },
      { term: "Anion", def: "Negatively charged ion (gained electrons)" },
      { term: "Valence Electrons", def: "Electrons in the outermost shell; determine chemical reactivity" },
    ],
  },

  "significant-figures": {
    topicId: "significant-figures",
    title: "Significant Figures",
    subtitle: "How to communicate measurement precision",
    color: "#fbbf24",
    intro:
      "Significant figures (sig figs) are the digits in a measurement that carry meaning. They tell other scientists how precise your measurement is. This is not about being pedantic — reporting the wrong number of sig figs is a scientific error. If you write 2.000 g, you are claiming you measured to the nearest milligram. If you only measured to the nearest gram, writing 2.000 g is dishonest. This section will teach you how to count sig figs and how to round them in calculations, starting from zero knowledge.",
    concepts: [
      {
        title: "Why Significant Figures Exist",
        body: "Every measurement has uncertainty. When you measure something with a ruler, you can read the markings exactly, but you also estimate one digit beyond the markings. That estimated digit is uncertain. Significant figures communicate this uncertainty. The more sig figs you report, the more precise you are claiming to be. If your scale reads 2.5 g, you are saying the mass is between 2.4 and 2.6 g. If it reads 2.500 g, you are saying it is between 2.499 and 2.501 g — much more precise. Reporting the right number of sig figs is about honesty in science.",
        example: "2 g means the measurement is between 1 and 3 g (measured to the nearest gram). 2.0 g means it is between 1.9 and 2.1 g (measured to the nearest 0.1 g). 2.00 g means it is between 1.99 and 2.01 g (measured to the nearest 0.01 g). Each additional sig fig claims 10x more precision.",
        misconception: "Many students think sig figs are just about decimal places. They are not. Sig figs are about the total number of meaningful digits, which communicates precision. Decimal places communicate precision only for addition/subtraction.",
      },
      {
        title: "Rule 1: Non-Zero Digits Are Always Significant",
        body: "This is the simplest rule. Any digit that is not zero (1, 2, 3, 4, 5, 6, 7, 8, 9) counts as a significant figure. Always. No exceptions. If you see a non-zero digit, it is significant.",
        example: "12.3 has 3 sig figs (1, 2, 3 are all non-zero). 456 has 3 sig figs. 9.81 has 3 sig figs. 7 has 1 sig fig.",
      },
      {
        title: "Rule 2: Captive Zeros Are Significant",
        body: "Captive zeros are zeros that are sandwiched between non-zero digits. Because they are between significant digits, they are part of the measurement and are significant. Think of them as 'captured' between the non-zero digits.",
        example: "12.03 has 4 sig figs (the 0 is captive — between 2 and 3). 1005 has 4 sig figs (the two 0s are captive — between 1 and 5). 3.005 has 4 sig figs.",
      },
      {
        title: "Rule 3: Leading Zeros Are NOT Significant",
        body: "Leading zeros are zeros at the very beginning of a number, before the first non-zero digit. They are just placeholders — they position the decimal point. They do not represent anything that was measured. They are not significant.",
        example: "0.0123 has 3 sig figs (the two leading zeros do not count; only 1, 2, 3 are significant). 0.5 has 1 sig fig. 0.0042 has 2 sig figs. The leading zeros just tell you where the decimal point goes.",
        diagram: {
          type: "visual",
          visual:
            "  0.0123\n" +
            "  ^^\n" +
            "  ||\n" +
            "  Leading zeros — NOT significant (just placeholders)\n" +
            "\n" +
            "  Only 1, 2, 3 are significant = 3 sig figs",
          caption: "Leading zeros (before the first non-zero digit) are never significant. They only show the decimal point position.",
        },
      },
      {
        title: "Rule 4: Trailing Zeros After a Decimal Are Significant",
        body: "Trailing zeros are zeros at the end of a number. If there is a decimal point in the number, trailing zeros are significant — someone chose to write them, which means they were measured. If you write 2.500, those last two zeros are significant because you could have written 2.5 but chose to write 2.500, claiming more precision.",
        example: "123.0 has 4 sig figs (the trailing 0 is after the decimal, so it counts). 2.500 has 4 sig figs. 0.0100 has 3 sig figs (leading zeros do not count, but the trailing 00 after the decimal do count).",
      },
      {
        title: "Rule 5: Trailing Zeros Without a Decimal Are Ambiguous",
        body: "If a number ends in zeros but has no decimal point, those trailing zeros are ambiguous. We cannot tell if they were measured or if they are just placeholders. For example, 123,000 could have 3, 4, 5, or 6 sig figs — we do not know. To remove the ambiguity, use scientific notation, which makes the number of sig figs explicit.",
        example: "123,000 is ambiguous. If you mean 3 sig figs, write 1.23 x 10^5. If you mean 4 sig figs, write 1.230 x 10^5. If you mean 6 sig figs, write 1.23000 x 10^5. Scientific notation makes it clear.",
        diagram: {
          type: "table",
          title: "Sig Fig Rules Summary",
          headers: ["Rule", "Type of Zero", "Significant?", "Example"],
          rows: [
            ["1", "Non-zero digits", "Always", "12.3 = 3 sig figs"],
            ["2", "Captive zeros (between non-zeros)", "Yes", "12.03 = 4 sig figs"],
            ["3", "Leading zeros (before first non-zero)", "No", "0.0123 = 3 sig figs"],
            ["4", "Trailing zeros after decimal", "Yes", "2.500 = 4 sig figs"],
            ["5", "Trailing zeros, no decimal", "Ambiguous", "123,000 = use sci notation"],
          ],
        },
      },
      {
        title: "Rule 6: Exact Numbers Have Infinite Sig Figs",
        body: "Some numbers are not measurements — they are exact by definition or by counting. These have infinite significant figures and do not limit your calculations. There are two types: counted numbers (3 apples, 5 students — you cannot have 3.1 apples) and defined conversions (1 inch = 2.54 cm exactly, 1000 mm = 1 m exactly, 1 dozen = 12 exactly). Exact numbers never affect the sig figs of your answer.",
        example: "If you count 5 students, that 5 is exact (infinite sig figs). If you convert 2.50 g to mg using the factor 1000 mg/g, the 1000 is exact (it is a definition), so it does not limit sig figs. Your answer would have 3 sig figs (limited by 2.50), not 1 (which 1000 would imply if it were measured).",
      },
      {
        title: "Multiplication and Division: Fewest Sig Figs",
        body: "When you multiply or divide, your answer must have the same number of significant figures as the measurement with the FEWEST sig figs. Count the sig figs in each number you are multiplying or dividing, find the smallest count, and round your answer to that many sig figs. This makes sense: your result cannot be more precise than your least precise measurement.",
        example: "2.5 x 3.21 = 8.025. 2.5 has 2 sig figs, 3.21 has 3 sig figs. The fewest is 2, so round to 2 sig figs: 8.0. The calculator shows 8.025, but reporting that would claim more precision than you have.",
        diagram: {
          type: "visual",
          visual:
            "  2.5 x 3.21 = 8.025\n" +
            "  ^^^   ^^^^    ^^^^\n" +
            "  2 sf  3 sf   calculator result\n" +
            "\n" +
            "  Fewest sig figs = 2 (from 2.5)\n" +
            "  Round answer to 2 sig figs: 8.0\n" +
            "\n" +
            "  Your answer is only as precise as your\n" +
            "  least precise measurement.",
          caption: "For multiplication and division, the answer has the same number of sig figs as the number with the fewest sig figs.",
        },
      },
      {
        title: "Addition and Subtraction: Fewest Decimal Places",
        body: "When you add or subtract, the rule is different. Your answer must have the same number of DECIMAL PLACES (not sig figs) as the measurement with the fewest decimal places. Line up the decimal points, add or subtract, then round to the least precise decimal place. This makes sense: you cannot know a decimal place more precisely than your least precise measurement.",
        example: "12.1 + 3.45 = 15.55. 12.1 has 1 decimal place, 3.45 has 2 decimal places. The fewest is 1, so round to 1 decimal place: 15.6. The calculator shows 15.55, but the tenths place is the last place you can trust.",
        diagram: {
          type: "visual",
          visual:
            "  12.1    (1 decimal place)\n" +
            "+ 3.45   (2 decimal places)\n" +
            "-------\n" +
            "  15.55   calculator result\n" +
            "  15.6    rounded to 1 decimal place\n" +
            "\n" +
            "  Fewest decimal places = 1 (from 12.1)\n" +
            "  Round answer to 1 decimal place: 15.6",
          caption: "For addition and subtraction, the answer has the same number of decimal places as the number with the fewest decimal places.",
        },
      },
      {
        title: "Standard Deviation: Measuring Precision Statistically",
        body: "Standard deviation is a statistical measure of how spread out your data is from the average (mean). It tells you how precise your measurements are. A small standard deviation means your data points are clustered tightly around the mean (high precision). A large standard deviation means your data points are scattered far from the mean (low precision). When you report a result, you often write it as mean +/- standard deviation, for example 25.3 +/- 0.2 g. This tells the reader that most of your measurements fell within 0.2 g of 25.3 g. Standard deviation measures precision, NOT accuracy — it tells you how consistent your measurements are, not whether they are correct.",
        example: "Two students each measure the mass of a sample 5 times. Student A gets: 10.1, 10.2, 10.0, 10.1, 10.1 g (mean = 10.10, tightly clustered, small standard deviation = 0.07). Student B gets: 9.5, 10.8, 10.2, 9.9, 10.6 g (mean = 10.20, scattered, large standard deviation = 0.50). Student A has better precision (smaller standard deviation) even though both means are similar.",
        diagram: {
          type: "visual",
          visual:
            "  NORMAL DISTRIBUTION (BELL CURVE)\n" +
            "\n" +
            "         .---.\n" +
            "        /     \\\n" +
            "       /       \\\n" +
            "      /         \\\n" +
            "   --/-----------\\--\n" +
            "    -2s  -1s  mean  +1s  +2s\n" +
            "\n" +
            "  ~68% of data within +/- 1 standard deviation\n" +
            "  ~95% of data within +/- 2 standard deviations\n" +
            "  ~99.7% of data within +/- 3 standard deviations\n" +
            "\n" +
            "  Small SD = narrow curve = high precision\n" +
            "  Large SD = wide curve = low precision",
          caption: "The bell curve (normal distribution). About 68% of measurements fall within one standard deviation of the mean. A smaller standard deviation means a narrower, taller curve and more precise data.",
        },
        misconception: "Standard deviation tells you about precision (consistency), not accuracy (correctness). A scale that always reads 2 g too high has a small standard deviation (precise) but is not accurate. Also, the ~68% rule only applies if your data follows a normal distribution (bell curve). If your data is skewed, the percentages may differ.",
      },
    ],
    workedExamples: [
      {
        problem: "How many significant figures are in 0.0100?",
        steps: [
          { label: "Identify leading zeros", detail: "The first two zeros (0.0) are leading zeros — they come before the first non-zero digit. They do NOT count." },
          { label: "Identify non-zero digits", detail: "The '1' is a non-zero digit — it is significant." },
          { label: "Identify trailing zeros after decimal", detail: "The two zeros after the 1 (00) are trailing zeros after a decimal point — they DO count." },
          { label: "Count the significant digits", detail: "1 (the digit 1) + 2 (the trailing zeros) = 3 significant figures." },
        ],
        answer: "3 significant figures (the 1 and the two trailing zeros after the decimal)",
      },
      {
        problem: "Calculate the density: mass = 27.0 g, volume = 10.0 mL. Round to the correct number of sig figs.",
        steps: [
          { label: "Identify the operation", detail: "Density = mass / volume. This is division, so we use the multiplication/division rule." },
          { label: "Count sig figs in each value", detail: "27.0 has 3 sig figs (2, 7, and the trailing 0 after the decimal). 10.0 has 3 sig figs (1, 0, and the trailing 0 after the decimal)." },
          { label: "Apply the rule", detail: "For division, the answer has the fewest sig figs. Both have 3, so the answer has 3 sig figs." },
          { label: "Calculate", detail: "27.0 / 10.0 = 2.70 g/mL (3 sig figs)" },
        ],
        answer: "2.70 g/mL (3 sig figs)",
      },
    ],
    vocabulary: [
      { term: "Significant Figures", def: "Digits in a measurement that carry meaning (all certain digits + first uncertain)" },
      { term: "Captive Zero", def: "Zero between non-zero digits — always significant (12.03)" },
      { term: "Leading Zero", def: "Zero before the first non-zero digit — NOT significant (0.0123)" },
      { term: "Trailing Zero", def: "Zero at the end of a number — significant if after a decimal (2.500)" },
      { term: "Exact Number", def: "A counted or defined number with infinite sig figs (5 students, 1 in = 2.54 cm)" },
      { term: "Scientific Notation", def: "Format like 1.23 x 10^5 that makes the number of sig figs unambiguous" },
      { term: "Precision", def: "How closely repeated measurements agree with each other" },
      { term: "Uncertainty", def: "The estimated range within which the true value likely lies" },
      { term: "Standard Deviation", def: "A statistical measure of how spread out data is from the mean — measures precision, not accuracy" },
      { term: "Normal Distribution", def: "The bell curve pattern of random variation — ~68% of data falls within +/- 1 standard deviation" },
    ],
  },

  "dimensional-analysis": {
    topicId: "dimensional-analysis",
    title: "Dimensional Analysis",
    subtitle: "Converting units by making them cancel out",
    color: "#f0abfc",
    intro:
      "Dimensional analysis is a powerful problem-solving method that lets you convert from one unit to another by multiplying with fractions called conversion factors. The core idea is beautifully simple: if you know two things are equal (like 100 pennies = 1 dollar), you can write that equality as a fraction that equals 1, and multiplying by 1 never changes the true value of your quantity -- it only changes the units. By stringing these fractions together, the units you do not want cancel out diagonally, leaving only the unit you want. This method is used constantly in chemistry, medicine, engineering, and everyday life, and once you master it, you will never guess about unit conversions again.",
    concepts: [
      {
        title: "What Is a Conversion Factor?",
        body:
          "A conversion factor is a fraction that expresses a known equality between two different units. Because the top and bottom of the fraction represent the exact same amount (just in different units), the fraction is mathematically equal to 1. Multiplying any number by 1 does not change its value, so multiplying by a conversion factor only changes the units, not the actual quantity. Every conversion factor comes from a known equality: 100 pennies = 1 dollar, 12 inches = 1 foot, 1000 meters = 1 kilometer, 60 seconds = 1 minute. From each equality, you can write TWO conversion factors -- one in each direction -- and you choose the one that makes the unwanted unit cancel.",
        example:
          "From the equality 100 pennies = 1 dollar, you can write 100 pennies / 1 dollar OR 1 dollar / 100 pennies. Both equal 1. You pick the one that cancels the unit you want to get rid of.",
        diagram: {
          type: "comparison",
          title: "One Equality Gives Two Conversion Factors",
          left: {
            title: "Equality",
            items: [
              "100 pennies = 1 dollar",
              "12 inches = 1 foot",
              "1000 m = 1 km",
              "60 s = 1 min",
              "454 g = 1 lb",
            ],
          },
          right: {
            title: "Two Fractions (Both = 1)",
            items: [
              "(100 pennies / 1 dollar)  or  (1 dollar / 100 pennies)",
              "(12 inches / 1 foot)  or  (1 foot / 12 inches)",
              "(1000 m / 1 km)  or  (1 km / 1000 m)",
              "(60 s / 1 min)  or  (1 min / 60 s)",
              "(454 g / 1 lb)  or  (1 lb / 454 g)",
            ],
          },
        },
        misconception:
          "Some students think a conversion factor changes the amount of stuff you have. It does not. 100 pennies and 1 dollar are the same amount of money. The factor only re-labels the quantity.",
      },
      {
        title: "The Money Analogy",
        body:
          "Think about converting pennies to dollars. You know that 100 pennies equals 1 dollar. If someone hands you 2,500 pennies and asks how many dollars that is, you do not just guess -- you set up a conversion factor. You write 2,500 pennies and multiply by the fraction (1 dollar / 100 pennies). The pennies unit appears on top (in your starting number) and on the bottom (in the fraction), so they cancel out, leaving only dollars. The math becomes 2,500 divided by 100 = 25 dollars. This is exactly how dimensional analysis works in chemistry, just with grams, moles, atoms, liters, and other units instead of pennies and dollars.",
        example:
          "Convert 2,500 pennies to dollars:  2,500 pennies x (1 dollar / 100 pennies) = 25 dollars. The 'pennies' cancel, leaving 'dollars.'",
        diagram: {
          type: "visual",
          title: "Money Analogy -- Pennies to Dollars",
          visual:
            "   2,500 pennies   |   1 dollar      |   = 25 dollars\n   ---------------   |  -----------    |   -----------\n         [start]      |  100 pennies    |    [answer]\n                      |                 |\n                      |  ^^^^^^^^^      |\n                      |  'pennies'      |\n                      |   cancels!      |\n\n  The pennies on top cancel with the pennies on the bottom.\n  What is left?  dollars.  That is your answer unit.",
        },
        misconception:
          "Students sometimes divide when they should multiply (or vice versa). The rule is simple: if the unit you want to cancel is on top, put it on the bottom of the fraction. Then the math takes care of itself.",
      },
      {
        title: "How to Set Up a Dimensional Analysis Problem",
        body:
          "Every dimensional analysis problem follows the same four-step recipe. First, write down your starting number WITH its unit. Second, identify the unit you want to end up with. Third, find the conversion factor (or factors) that connect the starting unit to the ending unit, and write each as a fraction so the unwanted unit is on the opposite side from where it appears in the starting number. Fourth, multiply straight across the top and divide straight across the bottom. The units you do not want will cancel diagonally, and the unit you want will be the only one left. This method works for one conversion or a chain of ten -- the process never changes.",
        example:
          "Convert 5 feet to inches. Start: 5 feet. Want: inches. Equality: 12 inches = 1 foot. Set up: 5 feet x (12 inches / 1 foot) = 60 inches. Feet cancel, inches remain.",
        diagram: {
          type: "steps",
          title: "The Four-Step Recipe",
          steps: [
            {
              label: "Step 1: Write the starting number with its unit",
              visual:
                "   START:  5 feet  (write this as a fraction over 1 if helpful)",
            },
            {
              label: "Step 2: Identify the unit you WANT",
              visual:
                "   WANT:  inches  (this tells you which fraction to use)",
            },
            {
              label: "Step 3: Write the conversion factor as a fraction",
              visual:
                "   5 feet  x  (12 inches / 1 foot)\n                 ^^^^^^^^^^^^^^^^^\n                 feet on bottom so it cancels the feet on top",
            },
            {
              label: "Step 4: Multiply across the top, divide across the bottom",
              visual:
                "   (5 x 12 inches) / 1 = 60 inches\n    feet cancelled, inches survived -- done!",
            },
          ],
        },
      },
      {
        title: "How Units Cancel Diagonally",
        body:
          "The magic of dimensional analysis is that units cancel just like numbers do in fractions. If a unit appears in the numerator (top) of one fraction and in the denominator (bottom) of the next fraction, they cancel each other out -- you cross them out. You can visualize this as a diagonal slash through the matching units. What remains after all the cancelling is the unit you want. If the unit you want does NOT survive, or if an unwanted unit survives, you set up the fractions incorrectly and need to flip one. Always check your units BEFORE you do any arithmetic -- if the units work out, the setup is correct.",
        example:
          "Convert 3 feet to yards:  3 feet x (1 yard / 3 feet). The 'feet' on top cancels with 'feet' on bottom. Result: 1 yard.",
        diagram: {
          type: "visual",
          title: "Diagonal Unit Cancellation",
          visual:
            "   Starting number      Conversion factor        Result\n   -----------------     -------------------       --------\n\n      3  feet      x      1  yard            =      1 yard\n         |                   |\n         |   <--- cancel ---> |\n         |     (diagonal)     |\n         feet (top)    feet (bottom)\n\n   Cross out 'feet' on top and 'feet' on bottom.\n   Only 'yard' survives.  3 x 1 / 3 = 1 yard.\n\n   Rule:  top unit cancels with the SAME unit on the bottom\n          of the very next fraction.  Think of it as a\n          diagonal slash connecting them.",
        },
        misconception:
          "Students sometimes try to cancel a unit on top with the same unit on top. That does not work. Cancellation only happens top-to-bottom (or bottom-to-top), never side-to-side.",
      },
      {
        title: "Single-Step Conversions",
        body:
          "A single-step conversion uses exactly one conversion factor. These are the simplest problems and are great for building confidence. You have a starting number with one unit, you want a different unit, and there is one equality that connects them. Common single-step conversions in chemistry include: converting kilometers to meters (1 km = 1000 m), converting grams to milligrams (1 g = 1000 mg), or converting liters to milliliters (1 L = 1000 mL). The key is to write the equality, form the fraction so the unwanted unit cancels, multiply, and verify the surviving unit matches what you wanted.",
        example:
          "Convert 4.5 km to meters:  4.5 km x (1000 m / 1 km) = 4,500 m. The km cancels, meters survive.",
        diagram: {
          type: "table",
          title: "Common Single-Step Conversions in Chemistry",
          headers: ["Start With", "Want", "Equality", "Setup"],
          rows: [
            ["4.5 km", "meters", "1 km = 1000 m", "4.5 km x (1000 m / 1 km) = 4500 m"],
            ["2500 mg", "grams", "1000 mg = 1 g", "2500 mg x (1 g / 1000 mg) = 2.5 g"],
            ["3.2 L", "mL", "1 L = 1000 mL", "3.2 L x (1000 mL / 1 L) = 3200 mL"],
            ["0.75 m", "cm", "1 m = 100 cm", "0.75 m x (100 cm / 1 m) = 75 cm"],
            ["5000 g", "kg", "1000 g = 1 kg", "5000 g x (1 kg / 1000 g) = 5 kg"],
          ],
        },
      },
      {
        title: "Multi-Step Conversions",
        body:
          "Sometimes there is no single equality that connects your starting unit to your desired unit. In that case, you chain multiple conversion factors together, like stepping stones across a river. Each factor converts to an intermediate unit, and the intermediate unit cancels with the next factor, until only your target unit remains. For example, to convert hours to seconds, you might go hours to minutes (1 hr = 60 min) and then minutes to seconds (1 min = 60 s). The minutes unit appears on the bottom of the first fraction and the top of the second, so it cancels. You can chain as many factors as needed -- the process is identical each time.",
        example:
          "Convert 2 hours to seconds:  2 hr x (60 min / 1 hr) x (60 s / 1 min) = 7,200 s. Hours cancel with the first factor, minutes cancel with the second, seconds survive.",
        diagram: {
          type: "flowchart",
          title: "Multi-Step Conversion: Hours to Seconds",
          nodes: [
            {
              label: "START: 2 hours",
              children: ["x (60 min / 1 hr)"],
              note: "hours cancel, minutes appear",
            },
            {
              label: "Intermediate: 120 minutes",
              children: ["x (60 s / 1 min)"],
              note: "minutes cancel, seconds appear",
            },
            {
              label: "ANSWER: 7,200 seconds",
              children: [],
              note: "only seconds survive -- done!",
            },
          ],
        },
        misconception:
          "Some students try to memorize a direct hours-to-seconds factor. You can, but it is safer to chain well-known factors. If you misremember 1 hr = 3600 s, your answer is wrong. But 60 x 60 is easy to verify.",
      },
      {
        title: "Converting Complex Units (mi/hr to m/s)",
        body:
          "Some units are compound -- they have two parts, like miles per hour (a speed) or grams per milliliter (a density). To convert a compound unit, you convert each part separately, one at a time, using its own conversion factor. For miles per hour to meters per second, you convert the miles (top) to meters AND the hours (bottom) to seconds. You write the starting value as a fraction (miles over hours) and then multiply by two conversion factors: one that cancels miles and brings in meters, and another that cancels hours and brings in seconds. Both conversions happen in the same chain of fractions, and every unwanted unit cancels diagonally.",
        example:
          "Convert 60 mi/hr to m/s. Known: 1 mile = 1609 meters, 1 hr = 3600 s. Setup: 60 mi/hr x (1609 m / 1 mi) x (1 hr / 3600 s) = 26.8 m/s. Miles cancel, hours cancel, meters and seconds survive.",
        diagram: {
          type: "visual",
          title: "Converting a Compound Unit: mi/hr to m/s",
          visual:
            "    60  mi     |  1609 m   |   1 hr     |    =  26.8 m\n    -------  x  | --------  | --------   |      -------\n      1 hr      |  1 mi     |  3600 s    |       1 s\n\n     [start]     [cancel mi] [cancel hr]\n                  ^^^^^^^^^   ^^^^^^^^^^\n                  mi on top   hr on top of\n                  cancels mi  start cancels\n                  on bottom   hr on bottom\n\n   Step 1: 60 mi  ->  multiply by 1609 m / 1 mi  ->  mi cancels\n   Step 2: 1 hr   ->  multiply by 1 hr / 3600 s  ->  hr cancels\n   Result:  (60 x 1609) / 3600  =  26.8  m/s",
        },
        misconception:
          "Students often forget to convert the bottom (denominator) unit. In mi/hr, BOTH miles and hours need converting. If you only convert miles, you get meters per hour, not meters per second.",
      },
      {
        title: "Choosing the Right Conversion Factor and Checking Your Work",
        body:
          "When you have two possible fractions from one equality (for example, 1 m / 100 cm or 100 cm / 1 m), how do you choose? The rule is: look at the unit you need to cancel. If it is on top of your starting number, put it on the bottom of the fraction. If it is on the bottom, put it on top. After setting up the entire chain, do a unit check: cross out every cancelled pair and confirm that the ONLY surviving unit is the one you wanted. If an extra unit survives, or the wrong unit survives, flip a fraction. Finally, do a sanity check on the number: if you convert a large unit to a small one (km to m), the number should get bigger. If you convert a small unit to a large one (cm to m), the number should get smaller.",
        example:
          "Convert 500 cm to meters. You want meters, and cm is on top. So use (1 m / 100 cm) -- cm on the bottom cancels cm on top. Result: 5 m. The number got smaller, which makes sense because meters are bigger than centimeters.",
        diagram: {
          type: "table",
          title: "Sanity Check Guide: Should the Number Get Bigger or Smaller?",
          headers: ["Conversion Direction", "Number Change", "Why"],
          rows: [
            ["km -> m", "Bigger", "Meters are smaller than km, so you need more of them"],
            ["m -> km", "Smaller", "Kilometers are bigger, so you need fewer"],
            ["g -> mg", "Bigger", "Milligrams are tiny, so you need many"],
            ["mg -> g", "Smaller", "Grams are bigger, so you need fewer"],
            ["hr -> s", "Bigger", "Seconds are smaller, so you need more"],
            ["s -> hr", "Smaller", "Hours are bigger, so you need fewer"],
          ],
        },
        misconception:
          "Students sometimes choose the fraction based on which number 'looks easier' to multiply by. That is the wrong approach. Always choose based on which orientation makes the unwanted unit cancel. The math difficulty is irrelevant -- the setup determines correctness.",
      },
    ],
    formulas: [
      {
        name: "General Dimensional Analysis Setup",
        formula: "Answer = Start Value x (Conversion Factor 1) x (Conversion Factor 2) x ...",
        desc:
          "Multiply your starting number by one or more conversion factors. Each factor is a fraction equal to 1, formed from a known equality. Arrange each fraction so the unit you want to cancel is on the opposite side (top vs bottom) from where it appears in the starting value or previous factor.",
        example: "5 km x (1000 m / 1 km) = 5000 m",
      },
      {
        name: "Conversion Factor from an Equality",
        formula: "If A = B, then (A / B) = 1 and (B / A) = 1",
        desc:
          "Any equality between two units yields two conversion factors, both equal to 1. Choose the one that places the unit you want to cancel on the opposite side of the fraction from where it currently sits.",
        example: "1 ft = 12 in gives (12 in / 1 ft) = 1 and (1 ft / 12 in) = 1",
      },
    ],
    workedExamples: [
      {
        problem:
          "Convert 25,000 milligrams to kilograms. (Known: 1000 mg = 1 g, 1000 g = 1 kg)",
        steps: [
          {
            label: "Write the starting value with its unit",
            detail:
              "Start: 25,000 mg.  We want kilograms.  There is no direct mg-to-kg equality we will use, so we chain through grams.",
          },
          {
            label: "Set up the first conversion factor (mg to g)",
            detail:
              "We need to cancel mg, which is on top.  So we put mg on the bottom:  (1 g / 1000 mg).  Now:  25,000 mg x (1 g / 1000 mg).",
          },
          {
            label: "Set up the second conversion factor (g to kg)",
            detail:
              "After the first factor, grams are on top.  We need to cancel grams, so put grams on the bottom:  (1 kg / 1000 g).  Full chain:  25,000 mg x (1 g / 1000 mg) x (1 kg / 1000 g).",
          },
          {
            label: "Cancel units and compute",
            detail:
              "mg cancels (top vs bottom), g cancels (top vs bottom).  Only kg survives.  Multiply across the top: 25,000 x 1 x 1 = 25,000.  Divide across the bottom: 1000 x 1000 = 1,000,000.  25,000 / 1,000,000 = 0.025 kg.",
          },
          {
            label: "Sanity check",
            detail:
              "We went from a tiny unit (mg) to a huge unit (kg), so the number should get much smaller.  25,000 mg -> 0.025 kg.  The number shrank dramatically, which makes sense.",
          },
        ],
        answer: "0.025 kg",
      },
      {
        problem:
          "Convert 55 miles per hour to meters per second. (Known: 1 mile = 1609 m, 1 hr = 60 min, 1 min = 60 s)",
        steps: [
          {
            label: "Write the starting value as a fraction",
            detail:
              "Start: 55 mi / 1 hr.  We want m / s.  We need to convert the top (mi -> m) and the bottom (hr -> s).",
          },
          {
            label: "Convert miles to meters (top unit)",
            detail:
              "Miles are on top, so put miles on the bottom of the factor:  (1609 m / 1 mi).  Chain so far:  55 mi / 1 hr x (1609 m / 1 mi).",
          },
          {
            label: "Convert hours to seconds (bottom unit)",
            detail:
              "Hours are on the bottom of the starting value, so put hours on the TOP of the factor:  (1 hr / 60 min).  Then minutes are on the bottom, so add (1 min / 60 s).  Full chain:  (55 mi / 1 hr) x (1609 m / 1 mi) x (1 hr / 60 min) x (1 min / 60 s).",
          },
          {
            label: "Cancel all unwanted units",
            detail:
              "mi cancels (top vs bottom).  hr cancels (bottom vs top).  min cancels (bottom vs top).  Surviving units: m on top, s on bottom = m/s.  Correct!",
          },
          {
            label: "Compute the number",
            detail:
              "Multiply across the top: 55 x 1609 x 1 x 1 = 88,495.  Multiply across the bottom: 1 x 1 x 60 x 60 = 3600.  88,495 / 3600 = 24.58 m/s.  (Rounded: about 24.6 m/s.)",
          },
        ],
        answer: "Approximately 24.6 m/s",
      },
      {
        problem:
          "A medication dose is 0.25 g. Convert this to milligrams. (Known: 1 g = 1000 mg)",
        steps: [
          {
            label: "Write the starting value",
            detail: "Start: 0.25 g.  We want milligrams (mg).",
          },
          {
            label: "Choose the conversion factor",
            detail:
              "From 1 g = 1000 mg, we can write (1000 mg / 1 g) or (1 g / 1000 mg).  Grams are on top in our starting value, so we need grams on the bottom to cancel.  Use (1000 mg / 1 g).",
          },
          {
            label: "Set up and cancel",
            detail:
              "0.25 g x (1000 mg / 1 g).  The g on top cancels with g on bottom.  Only mg survives.",
          },
          {
            label: "Compute",
            detail:
              "Multiply across the top: 0.25 x 1000 = 250.  Divide across the bottom: 1.  Answer: 250 mg.  Sanity check: mg is smaller than g, so the number should get bigger.  0.25 -> 250.  Yes, it got bigger.  Correct.",
          },
        ],
        answer: "250 mg",
      },
    ],
    vocabulary: [
      {
        term: "Dimensional Analysis",
        def: "A problem-solving method that uses conversion factors to change one unit into another by making unwanted units cancel out.",
      },
      {
        term: "Conversion Factor",
        def: "A fraction equal to 1, formed from a known equality between two units, used to convert from one unit to another.",
      },
      {
        term: "Equality",
        def: "A statement that two measurements in different units represent the same amount, such as 100 cm = 1 m or 1000 mg = 1 g.",
      },
      {
        term: "Unit Cancellation",
        def: "The process of crossing out a unit that appears in the numerator of one fraction and the denominator of the next, removing it from the final answer.",
      },
      {
        term: "Numerator",
        def: "The top part of a fraction. In dimensional analysis, the unit on top is the one you keep unless it matches a unit on the bottom of the next factor.",
      },
      {
        term: "Denominator",
        def: "The bottom part of a fraction. A unit on the bottom cancels with the same unit on the top of the adjacent fraction.",
      },
      {
        term: "Compound Unit",
        def: "A unit made of two or more parts, such as miles per hour (mi/hr) or grams per milliliter (g/mL). Each part must be converted separately.",
      },
      {
        term: "Sanity Check",
        def: "A quick verification that your answer makes sense: converting to a smaller unit should give a bigger number, and converting to a bigger unit should give a smaller number.",
      },
    ],
  },

  "the-mole": {
    topicId: "the-mole",
    title: "The Mole",
    subtitle: "Chemistry's counting unit -- how we count atoms by weighing them",
    color: "#60a5fa",
    intro:
      "Atoms are unimaginably small. A single grain of salt contains more atoms than there are stars in the observable universe. Because chemists need to know how many atoms are reacting together, but cannot count them one by one, they use a counting unit called the mole. Just as a dozen means 12 of something, a mole means 602,000,000,000,000,000,000,000 of something (written as 6.02 x 10^23). The mole bridges the microscopic world of atoms with the macroscopic world of grams that you can measure on a balance. By using the mole, chemists can weigh out exact numbers of atoms and molecules, making precise reactions possible.",
    concepts: [
      {
        title: "What Is a Mole? The Counting Unit",
        body:
          "A mole is simply a counting number, exactly like a dozen. When you say 'a dozen eggs,' you mean 12 eggs. When a chemist says 'a mole of carbon atoms,' they mean 6.02 x 10^23 carbon atoms. The word 'mole' does not describe a substance, a shape, or a mass -- it describes a quantity. You can have a mole of anything: a mole of water molecules, a mole of ping-pong balls, a mole of people (though that many people do not exist). The mole is useful because atoms are so tiny that even a speck of dust contains trillions of them, and chemists needed a way to talk about large numbers of atoms without writing out 23 zeros every time.",
        example:
          "1 mole of water molecules = 6.02 x 10^23 water molecules. 1 mole of carbon atoms = 6.02 x 10^23 carbon atoms. The number of items is always the same; only the identity of the item changes.",
        diagram: {
          type: "comparison",
          title: "Mole vs. Dozen -- Both Are Just Counting Words",
          left: {
            title: "A Dozen",
            items: [
              "1 dozen = 12 items",
              "1 dozen eggs = 12 eggs",
              "1 dozen donuts = 12 donuts",
              "The number 12 never changes",
              "Only the item being counted changes",
            ],
          },
          right: {
            title: "A Mole",
            items: [
              "1 mole = 6.02 x 10^23 items",
              "1 mole of atoms = 6.02 x 10^23 atoms",
              "1 mole of molecules = 6.02 x 10^23 molecules",
              "The number 6.02 x 10^23 never changes",
              "Only the item being counted changes",
            ],
          },
        },
        misconception:
          "Many students think a mole is a mass or a weight. It is not. A mole is a NUMBER. One mole of carbon weighs 12 grams, but one mole of gold weighs 197 grams. The count is the same; the mass differs because each atom has a different weight.",
      },
      {
        title: "Avogadro's Number: 6.02 x 10^23",
        body:
          "The number of items in one mole is called Avogadro's number, and it is 6.02 x 10^23 (that is 602 followed by 21 zeros). This is not a random number -- it was chosen so that exactly one mole of carbon-12 atoms weighs exactly 12 grams. From this definition, the number of atoms in a mole of any element is always 6.02 x 10^23. The number is named after Amedeo Avogadro, an Italian scientist, though he never actually calculated it himself. To grasp how enormous this number is: if you had a mole of pennies and gave away a billion dollars every second, it would take over 19 million years to give them all away.",
        example:
          "If you had 1 mole of rice grains (6.02 x 10^23 grains), it would cover the entire surface of the Earth to a depth of several miles. That is how huge this number is.",
        diagram: {
          type: "visual",
          title: "How Big Is Avogadro's Number?",
          visual:
            "   6.02 x 10^23  =  602,000,000,000,000,000,000,000\n\n   Analogy 1: PENNIES\n   If you had a mole of pennies and gave away\n   $1,000,000,000 (one billion dollars) every second,\n   it would take over 19,000,000 years to distribute them all.\n\n   Analogy 2: WATER\n   A mole of water molecules (6.02 x 10^23 molecules)\n   is about 18 mL -- a single swallow of water.\n   That shows how tiny each molecule is.\n\n   Analogy 3: POPCORN\n   If you popped a mole of popcorn kernels, the popcorn\n   would cover the United States in a layer over 9 miles deep.\n\n   Analogy 4: MARBLES\n   A mole of marbles would form a sphere larger than\n   the Earth itself.\n\n   The point:  6.02 x 10^23 is a number so vast that\n   it only makes sense when counting things as tiny as atoms.",
        },
        misconception:
          "Students often confuse Avogadro's number with Avogadro's Law (a gas law about volume). They are different things named after the same scientist. In this topic, Avogadro's number always means 6.02 x 10^23.",
      },
      {
        title: "The Roll-of-Coins Analogy",
        body:
          "Imagine you work at a bank and someone dumps a huge pile of pennies on your desk. Counting them one by one would take forever. But you know that a standard roll of pennies contains exactly 50 pennies and weighs a specific, known amount. Instead of counting, you weigh the pile. If a full roll weighs 125 grams, and your pile weighs 1,250 grams, you can say you have 10 rolls, which is 500 pennies -- without counting a single one. This is exactly what chemists do with atoms. Atoms are too small to count, but each element's atoms have a known average mass (from the periodic table). By weighing a sample, you can figure out how many moles (rolls) of atoms you have, and from that, how many individual atoms (pennies) you have.",
        example:
          "A roll of 50 pennies weighs 125 g. A pile weighs 625 g. 625 / 125 = 5 rolls. 5 rolls x 50 pennies/roll = 250 pennies. You counted by weighing -- exactly like chemists count atoms by weighing them.",
        diagram: {
          type: "visual",
          title: "The Roll-of-Coins Analogy",
          visual:
            "   BANK (Counting Pennies)          CHEMISTRY (Counting Atoms)\n   -------------------------          --------------------------\n\n   1 roll  = 50 pennies               1 mole  = 6.02 x 10^23 atoms\n   1 roll weighs 125 g                1 mole of C weighs 12.01 g\n\n   Pile weighs 625 g                  Sample weighs 24.02 g\n   625 / 125 = 5 rolls                24.02 / 12.01 = 2 moles\n   5 x 50 = 250 pennies               2 x 6.02x10^23 = 1.20x10^24 atoms\n\n   You never counted a single penny.  You never counted a single atom.\n   You WEIGHED, then did math.         You WEIGHED, then did math.\n\n   This is why the mole exists:\n   atoms are too small to count directly,\n   but we CAN weigh them.",
        },
      },
      {
        title: "Molar Mass: The Mass of One Mole",
        body:
          "Every element has a molar mass -- the mass (in grams) of exactly one mole of that element's atoms. You do not need to calculate it; it is printed on the periodic table. The molar mass of an element is the number under its symbol, and it has the unit grams per mole (g/mol). For carbon, the molar mass is 12.01 g/mol, meaning one mole of carbon atoms weighs 12.01 grams. For hydrogen, it is 1.008 g/mol. For oxygen, it is 16.00 g/mol. For gold, it is 196.97 g/mol. The molar mass is the bridge between mass (what you can measure on a scale) and moles (the counting unit). You use it as a conversion factor: (molar mass in g / 1 mol) or (1 mol / molar mass in g).",
        example:
          "The periodic table shows carbon's molar mass as 12.01. This means 1 mole of carbon atoms = 12.01 grams. So if you have 24.02 grams of carbon, you have 2 moles of carbon atoms.",
        diagram: {
          type: "table",
          title: "Molar Mass Examples from the Periodic Table",
          headers: ["Element", "Symbol", "Molar Mass (g/mol)", "Meaning"],
          rows: [
            ["Hydrogen", "H", "1.008", "1 mole of H atoms weighs 1.008 g"],
            ["Carbon", "C", "12.01", "1 mole of C atoms weighs 12.01 g"],
            ["Nitrogen", "N", "14.01", "1 mole of N atoms weighs 14.01 g"],
            ["Oxygen", "O", "16.00", "1 mole of O atoms weighs 16.00 g"],
            ["Sodium", "Na", "22.99", "1 mole of Na atoms weighs 22.99 g"],
            ["Iron", "Fe", "55.85", "1 mole of Fe atoms weighs 55.85 g"],
            ["Gold", "Au", "196.97", "1 mole of Au atoms weighs 196.97 g"],
          ],
        },
        misconception:
          "Students sometimes think all moles weigh the same. They do not. One mole of hydrogen weighs about 1 gram, while one mole of gold weighs about 197 grams. The NUMBER of atoms is the same (6.02 x 10^23), but each gold atom is much heavier than each hydrogen atom.",
      },
      {
        title: "The Mole Concept Map: Grams, Moles, and Particles",
        body:
          "There are three ways to describe a sample of a substance: by its mass in grams (what you measure on a balance), by its amount in moles (the counting unit), and by its number of particles (individual atoms or molecules). These three quantities are connected by two conversion factors. To go from grams to moles (or moles to grams), you use the molar mass from the periodic table. To go from moles to particles (or particles to moles), you use Avogadro's number, 6.02 x 10^23. You almost never go directly from grams to particles in one step -- you always pass through moles in the middle. Think of moles as the central hub of a wheel, with grams on one side and particles on the other.",
        example:
          "If you have 24.02 g of carbon, that is 2 moles (24.02 / 12.01). And 2 moles is 2 x 6.02 x 10^23 = 1.204 x 10^24 atoms. Grams -> moles -> particles.",
        diagram: {
          type: "visual",
          title: "The Mole Concept Map",
          visual:
            "                    GRAMS                       PARTICLES\n                  (what you weigh)              (individual atoms)\n                       |                               |\n                       |                               |\n            divide by molar mass            multiply by 6.02 x 10^23\n             (or multiply by it              (or divide by it to\n              to go the other way)            go the other way)\n                       |                               |\n                       |                               |\n                       v                               v\n\n                    +-------+                    +-------+\n                    |       |                    |       |\n                    | MOLES | <----------------> | MOLES |\n                    |       |                    |       |\n                    +-------+                    +-------+\n\n         GRAMS  <--(molar mass)-->  MOLES  <--(Avogadro's #)-->  PARTICLES\n\n    Key conversions:\n      grams -> moles:   divide grams by molar mass (g / (g/mol) = mol)\n      moles -> grams:   multiply moles by molar mass (mol x g/mol = g)\n      moles -> particles:  multiply moles by 6.02 x 10^23\n      particles -> moles:  divide particles by 6.02 x 10^23\n      grams -> particles:  grams -> moles -> particles (TWO steps)\n      particles -> grams:  particles -> moles -> grams (TWO steps)",
        },
        misconception:
          "Students often try to convert grams directly to particles using the molar mass. That does not work. The molar mass converts grams to moles only. You must then use Avogadro's number to go from moles to particles. Always go through moles.",
      },
      {
        title: "Converting Moles to Particles (and Back)",
        body:
          "To convert between moles and the number of individual particles (atoms, molecules, ions, etc.), you use Avogadro's number as a conversion factor. The equality is: 1 mole = 6.02 x 10^23 particles. From this, you form the fraction (6.02 x 10^23 particles / 1 mole) to go from moles to particles, or (1 mole / 6.02 x 10^23 particles) to go from particles to moles. This is a single-step dimensional analysis problem. If you have 3 moles of water molecules, you multiply by 6.02 x 10^23 to get 1.806 x 10^24 molecules. If you have 1.204 x 10^24 atoms, you divide by 6.02 x 10^23 to get 2 moles.",
        example:
          "How many atoms are in 2.5 moles of iron?  2.5 mol x (6.02 x 10^23 atoms / 1 mol) = 1.505 x 10^24 atoms. The 'mol' unit cancels, leaving 'atoms.'",
        diagram: {
          type: "visual",
          title: "Moles <-> Particles Conversion",
          visual:
            "   MOLES -> PARTICICLES (multiply by Avogadro's number)\n\n      2.5 mol   x   6.02 x 10^23 atoms     =   1.505 x 10^24 atoms\n                 |   ------------------ |\n                 |       1 mol          |\n                 |                      |\n                 mol cancels (top/bottom)\n\n   PARTICLES -> MOLES (divide by Avogadro's number)\n\n      1.204 x 10^24 atoms   x   1 mol          =   2.0 mol\n                           |   -------------  |\n                           |  6.02x10^23 at   |\n                           |                  |\n                           atoms cancel (top/bottom)\n\n   The conversion factor is always the SAME equality:\n      1 mole = 6.02 x 10^23 particles\n   You just flip it depending on which unit you want to cancel.",
        },
      },
      {
        title: "Converting Moles to Mass (and Back)",
        body:
          "To convert between moles and mass in grams, you use the molar mass from the periodic table as your conversion factor. The equality is: 1 mole = (molar mass) grams. For carbon, this is 1 mole = 12.01 grams. To go from moles to grams, multiply by the molar mass (mol x g/mol = g). To go from grams to moles, divide by the molar mass (g / (g/mol) = mol). This is also a single-step dimensional analysis problem. If you have 3 moles of carbon, you multiply by 12.01 g/mol to get 36.03 grams. If you have 24.02 grams of carbon, you divide by 12.01 g/mol to get 2 moles. The molar mass is different for every element, so always look it up -- never assume.",
        example:
          "How many grams are in 0.50 moles of oxygen?  Molar mass of O = 16.00 g/mol.  0.50 mol x (16.00 g / 1 mol) = 8.00 g. The 'mol' cancels, leaving grams.",
        diagram: {
          type: "table",
          title: "Moles <-> Grams Examples",
          headers: ["Element", "Molar Mass", "Given", "Conversion", "Answer"],
          rows: [
            ["Carbon (C)", "12.01 g/mol", "3.0 mol", "3.0 x 12.01", "36.03 g"],
            ["Carbon (C)", "12.01 g/mol", "24.02 g", "24.02 / 12.01", "2.0 mol"],
            ["Oxygen (O)", "16.00 g/mol", "0.50 mol", "0.50 x 16.00", "8.00 g"],
            ["Iron (Fe)", "55.85 g/mol", "2.0 mol", "2.0 x 55.85", "111.7 g"],
            ["Gold (Au)", "196.97 g/mol", "50.0 g", "50.0 / 196.97", "0.254 mol"],
          ],
        },
      },
      {
        title: "Mass-to-Particles: The Two-Step Conversion",
        body:
          "Sometimes you need to go from grams directly to the number of particles (or vice versa). There is no single conversion factor for this -- you must go through moles as an intermediate step. First, convert grams to moles using the molar mass. Then, convert moles to particles using Avogadro's number. This is a two-step dimensional analysis problem, and you chain the conversion factors just like in the dimensional analysis topic. The moles unit appears on the bottom of the first factor and the top of the second, so it cancels out, leaving grams on one end and particles on the other. This is the most common type of mole problem in introductory chemistry.",
        example:
          "How many atoms are in 24.02 g of carbon?  Step 1: 24.02 g x (1 mol / 12.01 g) = 2.0 mol.  Step 2: 2.0 mol x (6.02 x 10^23 atoms / 1 mol) = 1.204 x 10^24 atoms.  Grams -> moles -> atoms.",
        diagram: {
          type: "flowchart",
          title: "Two-Step Conversion: Grams to Particles",
          nodes: [
            {
              label: "START: 24.02 g of carbon",
              children: ["x (1 mol / 12.01 g)"],
              note: "grams cancel, moles appear (using molar mass)",
            },
            {
              label: "Intermediate: 2.0 moles of carbon",
              children: ["x (6.02 x 10^23 atoms / 1 mol)"],
              note: "moles cancel, atoms appear (using Avogadro's number)",
            },
            {
              label: "ANSWER: 1.204 x 10^24 atoms",
              children: [],
              note: "only atoms survive -- done!",
            },
          ],
        },
        misconception:
          "Students sometimes try to multiply grams directly by Avogadro's number to get particles. This is wrong. Grams and particles are connected only through moles. You must always do two steps: grams to moles, then moles to particles.",
      },
    ],
    formulas: [
      {
        name: "Avogadro's Number",
        formula: "1 mole = 6.02 x 10^23 particles",
        desc:
          "One mole of any substance contains exactly 6.02 x 10^23 particles (atoms, molecules, ions, etc.). Use this as a conversion factor between moles and particle count.",
        example: "2 moles of H2O = 2 x 6.02 x 10^23 = 1.204 x 10^24 molecules",
      },
      {
        name: "Moles to Grams",
        formula: "mass (g) = moles x molar mass (g/mol)",
        desc:
          "To find the mass of a given number of moles, multiply the moles by the element's molar mass from the periodic table. The mole unit cancels, leaving grams.",
        example: "3 mol of C x 12.01 g/mol = 36.03 g of carbon",
      },
      {
        name: "Grams to Moles",
        formula: "moles = mass (g) / molar mass (g/mol)",
        desc:
          "To find how many moles are in a given mass, divide the mass in grams by the element's molar mass. The gram unit cancels, leaving moles.",
        example: "24.02 g of C / 12.01 g/mol = 2.0 mol of carbon",
      },
      {
        name: "Grams to Particles (Two-Step)",
        formula: "particles = grams x (1 mol / molar mass) x (6.02 x 10^23 / 1 mol)",
        desc:
          "To convert a mass directly to a particle count, first convert grams to moles using molar mass, then convert moles to particles using Avogadro's number. The mole unit cancels in the middle.",
        example:
          "24.02 g C x (1 mol / 12.01 g) x (6.02x10^23 atoms / 1 mol) = 1.204 x 10^24 atoms",
      },
    ],
    workedExamples: [
      {
        problem:
          "How many atoms are in 3.0 moles of sodium (Na)?",
        steps: [
          {
            label: "Identify what you have and what you want",
            detail:
              "You have 3.0 moles of Na.  You want the number of atoms.  This is a moles-to-particles conversion, so you use Avogadro's number.",
          },
          {
            label: "Write the conversion factor",
            detail:
              "The equality is 1 mole = 6.02 x 10^23 atoms.  Moles are on top in the starting value, so put moles on the bottom of the fraction to cancel:  (6.02 x 10^23 atoms / 1 mol).",
          },
          {
            label: "Set up the problem and cancel units",
            detail:
              "3.0 mol x (6.02 x 10^23 atoms / 1 mol).  The 'mol' on top cancels with 'mol' on the bottom.  Only 'atoms' survives.",
          },
          {
            label: "Compute the answer",
            detail:
              "3.0 x 6.02 x 10^23 = 18.06 x 10^23.  Adjust to proper scientific notation: 1.806 x 10^24 atoms.",
          },
        ],
        answer: "1.806 x 10^24 atoms of sodium",
      },
      {
        problem:
          "How many grams are in 0.75 moles of iron (Fe)? (Molar mass of Fe = 55.85 g/mol)",
        steps: [
          {
            label: "Identify what you have and what you want",
            detail:
              "You have 0.75 moles of Fe.  You want grams.  This is a moles-to-mass conversion, so you use the molar mass of iron.",
          },
          {
            label: "Write the conversion factor",
            detail:
              "The equality is 1 mole of Fe = 55.85 g.  Moles are on top in the starting value, so put moles on the bottom:  (55.85 g / 1 mol).",
          },
          {
            label: "Set up and cancel units",
            detail:
              "0.75 mol x (55.85 g / 1 mol).  The 'mol' on top cancels with 'mol' on the bottom.  Only 'g' (grams) survives.",
          },
          {
            label: "Compute the answer",
            detail: "0.75 x 55.85 = 41.8875.  Round to appropriate significant figures: 41.9 g.",
          },
        ],
        answer: "41.9 grams of iron",
      },
      {
        problem:
          "How many carbon atoms are in 18.02 grams of carbon? (Molar mass of C = 12.01 g/mol)",
        steps: [
          {
            label: "Identify what you have and what you want",
            detail:
              "You have 18.02 grams of carbon.  You want the number of atoms.  There is no direct grams-to-atoms conversion, so this is a TWO-STEP problem: grams -> moles -> atoms.",
          },
          {
            label: "Step 1: Convert grams to moles using molar mass",
            detail:
              "Grams are on top, so put grams on the bottom of the factor:  (1 mol / 12.01 g).  18.02 g x (1 mol / 12.01 g) = 1.50 mol.  Grams cancel, moles survive.",
          },
          {
            label: "Step 2: Convert moles to atoms using Avogadro's number",
            detail:
              "Moles are now on top (from step 1), so put moles on the bottom:  (6.02 x 10^23 atoms / 1 mol).  1.50 mol x (6.02 x 10^23 atoms / 1 mol).  Moles cancel, atoms survive.",
          },
          {
            label: "Chain it together and compute",
            detail:
              "Full chain:  18.02 g x (1 mol / 12.01 g) x (6.02 x 10^23 atoms / 1 mol).  Grams cancel, moles cancel, atoms survive.  Compute:  (18.02 / 12.01) x 6.02 x 10^23 = 1.50 x 6.02 x 10^23 = 9.03 x 10^23 atoms.",
          },
          {
            label: "Sanity check",
            detail:
              "18.02 g of carbon is 1.5 moles (a bit more than 1 mole).  1 mole would be 6.02 x 10^23 atoms, so 1.5 moles should be about 9 x 10^23 atoms.  Our answer of 9.03 x 10^23 is right in that range.  Correct.",
          },
        ],
        answer: "9.03 x 10^23 atoms of carbon",
      },
    ],
    vocabulary: [
      {
        term: "Mole",
        def: "A counting unit equal to 6.02 x 10^23 items. Just as a dozen means 12, a mole means 6.02 x 10^23. It is used to count atoms, molecules, and other particles.",
      },
      {
        term: "Avogadro's Number",
        def: "The number of particles in one mole: 6.02 x 10^23. It is the conversion factor between moles and individual particle count.",
      },
      {
        term: "Molar Mass",
        def: "The mass of one mole of a substance, measured in grams per mole (g/mol). Found on the periodic table as the number under each element's symbol.",
      },
      {
        term: "Particle",
        def: "An individual atom, molecule, ion, or formula unit. When we say 'particles' in mole problems, we mean the individual countable items, not a mass.",
      },
      {
        term: "Grams",
        def: "The unit of mass used in chemistry. You measure grams on a balance. It is the macroscopic quantity you can directly observe and weigh.",
      },
      {
        term: "Conversion Factor (Mole)",
        def: "A fraction used to convert between grams, moles, and particles. Either molar mass (g/mol) for grams-to-moles, or Avogadro's number (6.02 x 10^23 / mol) for moles-to-particles.",
      },
      {
        term: "Scientific Notation",
        def: "A compact way to write very large or very small numbers using powers of 10. For example, 6.02 x 10^23 means 602,000,000,000,000,000,000,000.",
      },
      {
        term: "Two-Step Conversion",
        def: "A mole problem that requires going through moles as an intermediate, such as grams to moles to particles. You chain two conversion factors, and the mole unit cancels in the middle.",
      },
    ],
  },

  "stoichiometry": {
    topicId: "stoichiometry",
    title: "Stoichiometry",
    subtitle: "The mathematics of chemical reactions",
    color: "#fb923c",
    intro:
      "Stoichiometry is the branch of chemistry that deals with the quantitative relationships between reactants and products in a chemical reaction. The word comes from the Greek 'stoikheion' (element) and 'metron' (measure). Think of a balanced chemical equation as a recipe: it tells you exactly how much of each ingredient you need and how much product you can expect. Just as a recipe says 2 cups of flour and 1 cup of sugar make 12 cookies, a chemical equation says 2 molecules of hydrogen and 1 molecule of oxygen make 2 molecules of water. Stoichiometry lets us scale that recipe up from single molecules to the massive quantities used in industry, medicine, and everyday life.",
    concepts: [
      {
        title: "What Is Stoichiometry?",
        body:
          "Stoichiometry is the study of the amounts of substances that react and are produced in a chemical reaction. Every chemical reaction obeys a fixed ratio of reactants to products, and stoichiometry is how we calculate those amounts. The foundation of all stoichiometry is the balanced chemical equation, which tells us the exact proportions (by moles) in which substances combine and form. Without a balanced equation, stoichiometry is impossible, because the coefficients (the big numbers in front of each formula) are the keys to every calculation. Stoichiometry answers questions like: 'If I have 10 grams of hydrogen, how much oxygen do I need, and how much water will I produce?'",
        example:
          "In the reaction 2 H2 + O2 -> 2 H2O, the coefficients tell us that 2 moles of hydrogen react with 1 mole of oxygen to produce 2 moles of water. This 2:1:2 ratio never changes, no matter how large or small the scale.",
        diagram: {
          type: "visual",
          title: "The Core Idea of Stoichiometry",
          visual:
            "    REACTANTS                      PRODUCTS\n\n    2 H2  +  1 O2    ---------->    2 H2O\n    ^^^     ^^^                    ^^^\n    |       |                      |\n    |       |                      |\n   2 moles 1 mole                 2 moles\n  hydrogen oxygen               water\n\n  The coefficients (big numbers) give the\n  MOLE RATIO. This ratio is the heart of\n  every stoichiometry calculation.",
          caption:
            "A balanced equation is a ratio statement. The numbers in front of each formula are not just decoration -- they are the recipe proportions.",
        },
        misconception:
          "Many students think the subscript numbers (the little numbers inside a formula, like the 2 in H2O) are used for stoichiometry. They are not. Only the coefficients (the big numbers in front of the formula) give the mole ratio. Subscripts tell you how many atoms are in one molecule, not the reaction ratio.",
      },
      {
        title: "Balanced Equations as Recipes",
        body:
          "A balanced chemical equation is exactly like a recipe in a cookbook. A recipe lists ingredients and their quantities, and tells you how many servings you will produce. A balanced equation lists reactants (ingredients) with coefficients (quantities) and tells you how much product you will get. If you want to double the recipe, you double every ingredient. If you want to make half as many cookies, you use half of every ingredient. The same logic applies to chemical reactions: the coefficients tell you the ratio, and you scale that ratio up or down depending on how much material you actually have.",
        example:
          "Recipe: 2 cups flour + 1 cup sugar + 3 eggs -> 12 cookies. If you want 24 cookies, you need 4 cups flour, 2 cups sugar, and 6 eggs. The ratio 2:1:3:12 stays the same; you just multiply everything by 2.",
        diagram: {
          type: "visual",
          title: "The Cookie Recipe Analogy",
          visual:
            "  COOKBOOK RECIPE              CHEMICAL EQUATION\n\n  2 cups flour  +              2 H2       +\n  1 cup sugar   +              1 O2       +\n  3 eggs        ------>        12 cookies     ------>    2 H2O\n\n  Ratio: 2 : 1 : 3 : 12        Ratio: 2 : 1 : 2\n\n  Double the recipe?            Double the reaction?\n  4 cups flour                  4 H2\n  2 cups sugar                  2 O2\n  6 eggs                        4 H2O\n\n  The ratio NEVER changes.\n  You just scale it up or down.",
          caption:
            "A balanced equation is a recipe. The coefficients are the proportions. Scale up or down, but never change the ratio.",
        },
        misconception:
          "Some students think you can adjust the ratio to match what you have on hand, like using 3 cups of flour with 1 cup of sugar because that is what is in the pantry. In chemistry, the ratio is fixed by nature. You cannot change the coefficients to suit your supplies; you must work with the ratio the equation gives you.",
      },
      {
        title: "Mole Ratios from Coefficients",
        body:
          "The mole ratio is the single most important number in stoichiometry. It is the ratio of the coefficients of any two substances in a balanced equation. You can write a mole ratio between any two substances in the equation: reactant-to-reactant, reactant-to-product, or product-to-product. To find a mole ratio, simply take the coefficients of the two substances you are comparing and write them as a fraction. For example, in 2 H2 + O2 -> 2 H2O, the mole ratio of H2 to O2 is 2:1, the mole ratio of H2 to H2O is 2:2 (or 1:1), and the mole ratio of O2 to H2O is 1:2. These ratios are used as conversion factors to move from one substance to another in calculations.",
        example:
          "In the equation 4 NH3 + 5 O2 -> 4 NO + 6 H2O, the mole ratio of O2 to NH3 is 5:4, the mole ratio of NH3 to H2O is 4:6 (or 2:3), and the mole ratio of O2 to H2O is 5:6.",
        diagram: {
          type: "table",
          title: "Mole Ratios from 4 NH3 + 5 O2 -> 4 NO + 6 H2O",
          headers: ["Substance 1", "Substance 2", "Mole Ratio", "As a Fraction"],
          rows: [
            ["NH3", "O2", "4 : 5", "4 mol NH3 / 5 mol O2"],
            ["O2", "NH3", "5 : 4", "5 mol O2 / 4 mol NH3"],
            ["NH3", "NO", "4 : 4", "4 mol NH3 / 4 mol NO"],
            ["O2", "H2O", "5 : 6", "5 mol O2 / 6 mol H2O"],
            ["NH3", "H2O", "4 : 6", "4 mol NH3 / 6 mol H2O"],
            ["NO", "H2O", "4 : 6", "4 mol NO / 6 mol H2O"],
          ],
        },
        misconception:
          "A common mistake is using the wrong ratio -- for example, writing 5/4 when you need 4/5. Always check which substance is on top and which is on bottom. The substance you are converting FROM goes on the bottom (so it cancels), and the substance you are converting TO goes on top.",
      },
      {
        title: "The Stoichiometry Roadmap",
        body:
          "Every stoichiometry problem follows the same three-step path, often called the stoichiometry roadmap. Step 1: Convert whatever you are GIVEN (grams, liters, particles, etc.) into MOLES of that substance. Step 2: Use the mole ratio from the balanced equation to convert moles of the given substance into moles of the WANTED substance. Step 3: Convert moles of the wanted substance into the TARGET UNIT the question asks for (grams, liters, particles, etc.). The key insight is that you can only use the mole ratio when both quantities are in moles. Moles are the common currency of chemistry -- everything must pass through moles to get from one substance to another.",
        example:
          "Problem: How many grams of water are produced from 10.0 g of H2 reacting with excess O2? Step 1: Convert 10.0 g H2 to moles H2 (divide by molar mass 2.016). Step 2: Use mole ratio 2 mol H2O / 2 mol H2 to get moles of H2O. Step 3: Convert moles H2O to grams H2O (multiply by molar mass 18.02).",
        diagram: {
          type: "flowchart",
          title: "The Stoichiometry Roadmap",
          nodes: [
            {
              label: "GIVEN quantity (grams, liters, particles, etc.)",
              children: ["Step 1: Convert to moles using molar mass or Avogadro's number"],
              note: "You must be in moles before you can use the mole ratio.",
            },
            {
              label: "Step 1 result: MOLES of GIVEN substance",
              children: ["Step 2: Multiply by mole ratio from balanced equation"],
              note: "This is the only step that crosses from one substance to another.",
            },
            {
              label: "Step 2 result: MOLES of WANTED substance",
              children: ["Step 3: Convert to target unit (grams, liters, particles)"],
              note: "Use molar mass, molar volume, or Avogadro's number as needed.",
            },
            {
              label: "ANSWER: Target unit of wanted substance",
              note: "You have arrived. Always check significant figures and units.",
            },
          ],
        },
        misconception:
          "Students often try to jump directly from grams of one substance to grams of another, skipping the mole conversion. This does not work because grams of different substances contain different numbers of molecules. You MUST go through moles for the mole ratio step.",
      },
      {
        title: "Particulate View of a Reaction",
        body:
          "To truly understand stoichiometry, it helps to visualize what happens at the level of individual molecules. Before the reaction, you have a certain number of reactant molecules. During the reaction, bonds break and new bonds form, rearranging atoms into product molecules. After the reaction, you have a certain number of product molecules. The coefficients in the balanced equation tell you exactly how many molecules of each type are involved. The key principle is that atoms are neither created nor destroyed -- every atom that starts in the reactants ends up somewhere in the products. This is why equations must be balanced: the number of each type of atom must be the same on both sides.",
        example:
          "In 2 H2 + O2 -> 2 H2O, you start with 2 molecules of H2 (that is 4 H atoms) and 1 molecule of O2 (that is 2 O atoms). After the reaction, you have 2 molecules of H2O, which contains 4 H atoms and 2 O atoms. All atoms are accounted for.",
        diagram: {
          type: "visual",
          title: "Particulate Diagram: 2 H2 + O2 -> 2 H2O",
          visual:
            "  BEFORE REACTION                    AFTER REACTION\n\n  H-H   H-H    O=O                 H-O-H   H-O-H\n  (2 molecules    (1 molecule)       (2 molecules\n   of H2)                            of H2O)\n\n  Atoms present:                    Atoms present:\n    H: 4 atoms                         H: 4 atoms\n    O: 2 atoms                         O: 2 atoms\n\n  4 H atoms before = 4 H atoms after\n  2 O atoms before = 2 O atoms after\n  ATOMS ARE CONSERVED. They are just\n  rearranged into new molecules.",
          caption:
            "The atoms do not disappear or appear from nowhere. They simply change partners. This is why the equation must be balanced.",
        },
        misconception:
          "Some students believe that molecules are 'used up' and vanish, or that new atoms appear during a reaction. Neither is true. Atoms are rearranged, not created or destroyed. The total mass of reactants always equals the total mass of products.",
      },
      {
        title: "Limiting Reactant: The Bicycle Analogy",
        body:
          "In most real-world reactions, you do not have the exact perfect ratio of reactants. One reactant will run out first, and when it does, the reaction stops. This reactant is called the limiting reactant, because it limits how much product you can make. The other reactant(s) that are left over are called excess reactants. Think about building bicycles. Each bicycle needs 2 wheels and 1 frame. If you have 20 wheels and 15 frames, you can only build 10 bicycles (you run out of wheels after building 10). The wheels are the limiting reactant, and you will have 5 frames left over (excess). The amount of product is determined entirely by the limiting reactant, not by how much of the other reactants you have.",
        example:
          "Bicycle analogy: 2 wheels + 1 frame -> 1 bicycle. With 20 wheels and 15 frames: 20 wheels / 2 = 10 bicycles possible from wheels. 15 frames / 1 = 15 bicycles possible from frames. The smaller number (10) is the actual number of bicycles you can build. Wheels are limiting; 5 frames are in excess.",
        diagram: {
          type: "visual",
          title: "The Bicycle Assembly Analogy",
          visual:
            "  BUILDING BICYCLES: 2 wheels + 1 frame -> 1 bicycle\n\n  You have: 20 wheels and 15 frames\n\n  From wheels:  20 / 2 = 10 bicycles possible\n  From frames:  15 / 1 = 15 bicycles possible\n\n  You can only build 10 bicycles.\n  WHEELS are the LIMITING REACTANT.\n  5 FRAMES are left over (EXCESS).\n\n  +--+  +--+      [10 bicycles built]\n  |  |  |  |\n  +--+  +--+\n   |      |\n  [==]  [==]\n   |      |\n  / \\    / \\\n\n  Leftover: 5 frames that cannot become\n  bicycles because there are no more wheels.",
          caption:
            "The limiting reactant is the one that runs out first. It determines the maximum amount of product. Everything else is excess.",
        },
        misconception:
          "A very common error is assuming the reactant present in the smallest mass or smallest number of moles is automatically the limiting reactant. This is wrong. The limiting reactant is determined by comparing how much product each reactant could make (using the mole ratio). The one that produces the least product is limiting, regardless of its starting mass or moles.",
      },
      {
        title: "Limiting vs Excess Reactant Comparison",
        body:
          "The limiting reactant and excess reactant play very different roles in a reaction. The limiting reactant is completely consumed -- it is used up entirely, and none of it remains when the reaction is over. The excess reactant is NOT completely consumed; some of it is left over after the reaction stops. The amount of product formed is determined solely by the limiting reactant. To find the limiting reactant, calculate how much product each reactant could make individually; the one that makes the least product is the limiting reactant. The excess amount is the difference between what you started with and what was actually used.",
        example:
          "In the reaction 2 H2 + O2 -> 2 H2O, if you start with 5 moles of H2 and 2 moles of O2: From H2, you could make 5 mol H2O (5 mol H2 x 2/2). From O2, you could make 4 mol H2O (2 mol O2 x 2/1). O2 makes less product, so O2 is limiting. H2 is in excess, and 1 mole of H2 will be left over.",
        diagram: {
          type: "comparison",
          title: "Limiting Reactant vs Excess Reactant",
          left: {
            title: "LIMITING REACTANT",
            items: [
              "Completely consumed in the reaction",
              "Determines the maximum amount of product",
              "Runs out first, stopping the reaction",
              "None left over when reaction ends",
              "Found by comparing product amounts from each reactant",
              "The 'bottleneck' of the reaction",
            ],
          },
          right: {
            title: "EXCESS REACTANT",
            items: [
              "NOT completely consumed",
              "Does NOT determine the product amount",
              "Still present when the reaction stops",
              "Some quantity left over (unused)",
              "Leftover = starting amount minus amount used",
              "The 'extra ingredient' you did not need",
            ],
          },
        },
        misconception:
          "Students sometimes think both reactants are completely consumed in every reaction. This only happens if you have the exact stoichiometric ratio. In reality, reactions almost always have one reactant in excess, and only the limiting reactant is fully used up.",
      },
      {
        title: "Theoretical, Actual, and Percent Yield",
        body:
          "When you calculate how much product a reaction should produce based on stoichiometry, that is the theoretical yield -- the maximum possible amount, assuming perfect conditions and 100% conversion. In reality, reactions rarely produce the full theoretical amount. The actual yield is the amount of product you actually measure at the end of the experiment. The percent yield compares the actual yield to the theoretical yield as a percentage. A percent yield of 100% means the reaction was perfect. A percent yield below 100% means some product was lost (to side reactions, incomplete conversion, spillage, or difficulty collecting the product). Percent yields above 100% are usually a sign of error, such as the product being wet or impure.",
        example:
          "If stoichiometry predicts you should make 25.0 g of product (theoretical yield) but you only collect 21.5 g (actual yield), your percent yield is (21.5 / 25.0) x 100 = 86.0%.",
        diagram: {
          type: "table",
          title: "Three Types of Yield",
          headers: ["Yield Type", "What It Means", "How You Get It", "Can It Exceed 100%?"],
          rows: [
            [
              "Theoretical Yield",
              "Maximum possible product from stoichiometry",
              "Calculated from the balanced equation and limiting reactant",
              "No -- it is the upper limit",
            ],
            [
              "Actual Yield",
              "The amount of product you actually collect",
              "Measured experimentally (weighed, etc.)",
              "No (but impurities can make it appear so)",
            ],
            [
              "Percent Yield",
              "Efficiency of the reaction as a percentage",
              "(Actual Yield / Theoretical Yield) x 100",
              "Should never exceed 100% in a valid experiment",
            ],
          ],
        },
        misconception:
          "A percent yield above 100% does NOT mean you made extra product out of nowhere. It almost always means your product is contaminated (wet with solvent, contains impurities, or was not fully dried). A true percent yield should always be at or below 100%.",
      },
      {
        title: "Conservation of Mass in Reactions",
        body:
          "The Law of Conservation of Mass states that mass is neither created nor destroyed in a chemical reaction. This means the total mass of all reactants before the reaction equals the total mass of all products after the reaction. This law is the reason chemical equations must be balanced: if the equation is not balanced, it would imply that atoms appeared or disappeared, which violates this fundamental law. In practice, this means if you put 100 grams of reactants into a closed container, you will get exactly 100 grams of products out (assuming nothing escapes). Stoichiometry is essentially the mathematical application of this law -- it lets us predict the mass of products from the mass of reactants, because mass is conserved atom by atom.",
        example:
          "If 4.0 g of hydrogen reacts with 32.0 g of oxygen, the total mass of water produced must be 36.0 g (4.0 + 32.0). No mass is lost or gained. The atoms simply rearrange.",
        diagram: {
          type: "visual",
          title: "Conservation of Mass",
          visual:
            "  BEFORE REACTION              AFTER REACTION\n\n  4.0 g H2                    36.0 g H2O\n  32.0 g O2                   0.0 g leftover\n  ---------                   ---------\n  Total: 36.0 g               Total: 36.0 g\n\n  Mass before = Mass after\n\n  4.0 g + 32.0 g = 36.0 g  -->  36.0 g\n\n  The atoms are rearranged, but\n  the TOTAL MASS never changes.\n  This is why equations must be balanced.",
          caption:
            "Mass in equals mass out. Every atom is accounted for. This is the foundation of all stoichiometric calculations.",
        },
        misconception:
          "Some students think that if a gas is produced and escapes, mass is not conserved. The mass is still conserved -- it just left the container. If you could capture every atom, including the gas that escaped, the total mass would still be the same. Conservation of mass applies to the entire system, not just what stays in the beaker.",
      },
      {
        title: "Gas Volume at STP: 22.4 L per Mole",
        body:
          "When working with gases in stoichiometry, you often need to convert between moles and volume. At standard temperature and pressure (STP), defined as 0 degrees Celsius (273 K) and 1 atmosphere of pressure, one mole of ANY gas occupies exactly 22.4 liters. This is called the molar volume of a gas at STP. It does not matter what the gas is — hydrogen, oxygen, CO2, or anything else — one mole always occupies 22.4 L at STP. This gives you a conversion factor: 1 mol gas = 22.4 L gas (at STP). You can use it just like molar mass: to convert moles to liters, multiply by 22.4 L/mol. To convert liters to moles, divide by 22.4 L/mol. This only works at STP — at other temperatures and pressures, the volume per mole is different.",
        example:
          "How many liters of O2 gas (at STP) are produced from 2.0 moles of KClO3? Balanced equation: 2 KClO3 -> 2 KCl + 3 O2. Mole ratio: 3 mol O2 / 2 mol KClO3. 2.0 mol KClO3 x (3 mol O2 / 2 mol KClO3) x (22.4 L O2 / 1 mol O2) = 67.2 L O2.",
        diagram: {
          type: "visual",
          title: "Molar Volume at STP",
          visual:
            "  STP = Standard Temperature and Pressure\n  Temperature = 0 C = 273 K\n  Pressure = 1 atm\n\n  At STP, 1 mole of ANY gas = 22.4 L\n\n  +---------------------------------+\n  |                                 |\n  |   o   o   o   o   o   o   o    |\n  |                                 |   22.4 L total volume\n  |   o   o   o   o   o   o   o    |   1 mole of gas\n  |                                 |   (any gas!)\n  |   o   o   o   o   o   o   o    |\n  |                                 |\n  +---------------------------------+\n\n  Conversion factors:\n    moles -> liters:  multiply by 22.4 L/mol\n    liters -> moles:  divide by 22.4 L/mol\n\n  This ONLY works at STP (0 C, 1 atm).",
          caption:
            "At STP, one mole of any gas occupies 22.4 liters. This is a conversion factor between moles and volume for gases.",
        },
        misconception:
          "The 22.4 L/mol conversion factor only works at STP. If the problem does not say 'at STP,' you cannot use 22.4 L/mol. Also, 22.4 L is the volume per mole of gas — it is NOT the molar mass. The molar mass of O2 is 32 g/mol, but its molar volume at STP is 22.4 L/mol. These are completely different quantities.",
      },
    ],
    formulas: [
      {
        name: "Mole Ratio (Conversion Factor)",
        formula: "mole ratio = coefficient of wanted / coefficient of given",
        desc:
          "The mole ratio is derived from the coefficients of the balanced chemical equation. It is used as a conversion factor to convert moles of one substance into moles of another substance.",
        example:
          "In 2 H2 + O2 -> 2 H2O, to convert from moles of O2 to moles of H2O, the ratio is 2 mol H2O / 1 mol O2.",
      },
      {
        name: "Percent Yield",
        formula: "percent yield = (actual yield / theoretical yield) x 100",
        desc:
          "Percent yield measures the efficiency of a reaction by comparing the amount of product actually obtained to the maximum amount predicted by stoichiometry.",
        example:
          "If theoretical yield is 50.0 g and actual yield is 42.0 g, percent yield = (42.0 / 50.0) x 100 = 84.0%.",
      },
      {
        name: "Mass Conservation",
        formula: "total mass of reactants = total mass of products",
        desc:
          "The Law of Conservation of Mass states that the total mass of all reactants equals the total mass of all products in a chemical reaction. No mass is created or destroyed.",
        example:
          "10.0 g of reactant A + 15.0 g of reactant B = 25.0 g of products total.",
      },
      {
        name: "Molar Volume at STP",
        formula: "1 mol gas = 22.4 L gas (at STP: 0 C, 1 atm)",
        desc:
          "At standard temperature and pressure (0 C / 273 K and 1 atm), one mole of any gas occupies 22.4 liters. Use this as a conversion factor between moles and volume for gases at STP.",
        example:
          "3.0 mol of O2 at STP = 3.0 x 22.4 = 67.2 L of O2.",
      },
    ],
    workedExamples: [
      {
        problem:
          "How many grams of water (H2O) are produced when 16.0 g of O2 reacts with excess H2? The balanced equation is 2 H2 + O2 -> 2 H2O. (Molar masses: O2 = 32.00 g/mol, H2O = 18.02 g/mol)",
        steps: [
          {
            label: "Step 1: Convert grams of O2 to moles of O2",
            detail:
              "Use the molar mass of O2 as a conversion factor. 16.0 g O2 x (1 mol O2 / 32.00 g O2) = 0.500 mol O2.",
          },
          {
            label: "Step 2: Use the mole ratio to find moles of H2O",
            detail:
              "From the balanced equation, the ratio is 2 mol H2O / 1 mol O2. 0.500 mol O2 x (2 mol H2O / 1 mol O2) = 1.00 mol H2O.",
          },
          {
            label: "Step 3: Convert moles of H2O to grams of H2O",
            detail:
              "Use the molar mass of H2O. 1.00 mol H2O x (18.02 g H2O / 1 mol H2O) = 18.0 g H2O.",
          },
        ],
        answer: "18.0 grams of water are produced.",
      },
      {
        problem:
          "Limiting reactant problem: 5.00 g of H2 reacts with 10.0 g of O2. What is the limiting reactant, and how many grams of H2O are produced? Balanced equation: 2 H2 + O2 -> 2 H2O. (Molar masses: H2 = 2.016 g/mol, O2 = 32.00 g/mol, H2O = 18.02 g/mol)",
        steps: [
          {
            label: "Step 1: Convert both reactants to moles",
            detail:
              "H2: 5.00 g / 2.016 g/mol = 2.48 mol H2. O2: 10.0 g / 32.00 g/mol = 0.3125 mol O2.",
          },
          {
            label: "Step 2: Calculate how much product each reactant could make",
            detail:
              "From H2: 2.48 mol H2 x (2 mol H2O / 2 mol H2) = 2.48 mol H2O. From O2: 0.3125 mol O2 x (2 mol H2O / 1 mol O2) = 0.625 mol H2O.",
          },
          {
            label: "Step 3: Identify the limiting reactant",
            detail:
              "O2 produces less H2O (0.625 mol vs 2.48 mol), so O2 is the limiting reactant. H2 is in excess.",
          },
          {
            label: "Step 4: Convert the product moles to grams",
            detail:
              "0.625 mol H2O x (18.02 g H2O / 1 mol H2O) = 11.3 g H2O.",
          },
        ],
        answer:
          "O2 is the limiting reactant. 11.3 grams of H2O are produced.",
      },
      {
        problem:
          "A reaction has a theoretical yield of 45.0 g of product, but the chemist only collects 38.2 g. What is the percent yield?",
        steps: [
          {
            label: "Step 1: Identify the theoretical and actual yields",
            detail:
              "Theoretical yield = 45.0 g (the maximum predicted by stoichiometry). Actual yield = 38.2 g (what was actually measured).",
          },
          {
            label: "Step 2: Apply the percent yield formula",
            detail:
              "Percent yield = (actual yield / theoretical yield) x 100 = (38.2 g / 45.0 g) x 100.",
          },
          {
            label: "Step 3: Calculate",
            detail: "38.2 / 45.0 = 0.8489. Multiply by 100 = 84.9%.",
          },
        ],
        answer: "The percent yield is 84.9%.",
      },
    ],
    vocabulary: [
      {
        term: "Stoichiometry",
        def:
          "The study of the quantitative relationships between reactants and products in a chemical reaction, based on the balanced equation.",
      },
      {
        term: "Mole Ratio",
        def:
          "The ratio of the coefficients of two substances in a balanced chemical equation, used as a conversion factor to relate moles of one substance to moles of another.",
      },
      {
        term: "Limiting Reactant",
        def:
          "The reactant that is completely consumed first in a reaction, thereby limiting the amount of product that can be formed.",
      },
      {
        term: "Excess Reactant",
        def:
          "A reactant that is not completely consumed in a reaction; some of it remains after the reaction stops.",
      },
      {
        term: "Theoretical Yield",
        def:
          "The maximum amount of product that can be produced from a given amount of reactants, as calculated from stoichiometry.",
      },
      {
        term: "Actual Yield",
        def:
          "The amount of product actually obtained from a chemical reaction, measured experimentally.",
      },
      {
        term: "Percent Yield",
        def:
          "The ratio of actual yield to theoretical yield, expressed as a percentage. It measures the efficiency of a reaction.",
      },
      {
        term: "Law of Conservation of Mass",
        def:
          "The principle that mass is neither created nor destroyed in a chemical reaction; the total mass of reactants equals the total mass of products.",
      },
      {
        term: "Coefficient",
        def:
          "The number placed in front of a chemical formula in a balanced equation, indicating the relative number of moles of that substance.",
      },
      {
        term: "STP",
        def:
          "Standard Temperature and Pressure: 0 C (273 K) and 1 atm. At STP, 1 mole of any gas occupies 22.4 L.",
      },
      {
        term: "Molar Volume (at STP)",
        def:
          "The volume occupied by 1 mole of any gas at STP: 22.4 L/mol. Used as a conversion factor between moles and liters for gases.",
      },
    ],
  },

  "molarity-dilutions": {
    topicId: "molarity-dilutions",
    title: "Molarity & Dilutions",
    subtitle: "Measuring concentration and diluting solutions",
    color: "#2dd4bf",
    intro:
      "When you dissolve salt in water, you create a solution. But how much salt is in that water? Is it barely salty, or is it extremely salty? The answer depends on concentration -- how much solute is packed into a given amount of solution. Molarity is the most common way chemists express concentration: it tells you how many moles of solute are dissolved in each liter of solution. Once you understand molarity, you can make solutions of any desired concentration, dilute concentrated solutions to weaker ones, and use concentration in stoichiometry calculations. This topic covers everything from what a solution is, to calculating molarity, to the powerful dilution equation C1V1 = C2V2.",
    concepts: [
      {
        title: "What Is a Solution?",
        body:
          "A solution is a homogeneous mixture -- a mixture that is the same throughout, with no visible boundaries between its components. Every solution has two parts: the solute and the solvent. The solute is the substance that gets dissolved (usually present in the smaller amount). The solvent is the substance that does the dissolving (usually present in the larger amount). When you dissolve sugar in water, sugar is the solute and water is the solvent. The resulting liquid looks uniform -- you cannot see individual sugar particles -- which is what makes it a solution, not just a mixture. Solutions can be solid, liquid, or gas, but in chemistry we most often work with liquid (aqueous) solutions where water is the solvent.",
        example:
          "Salt water: salt (NaCl) is the solute, water (H2O) is the solvent. The dissolved salt is evenly distributed throughout the water, so every sip tastes equally salty.",
        diagram: {
          type: "visual",
          title: "Anatomy of a Solution",
          visual:
            "  SOLUTE (what gets dissolved)        SOLUTION (the result)\n  +---+---+---+                      +---+---+---+\n  | N | N | N |  salt                 | ~ N ~ N ~ |  salt water\n  +---+---+---+  (NaCl)              | ~ ~ N ~ ~ |  (uniform)\n                                      | N ~ ~ ~ N |\n                                      +---+---+---+\n                                           |\n                                      SOLVENT (water)\n                                      fills the rest\n\n  Solute + Solvent = Solution\n  The solute particles are spread\n  evenly throughout the solvent.",
          caption:
            "A solution is made of a solute dissolved in a solvent. The result is uniform throughout -- you cannot distinguish the parts.",
        },
        misconception:
          "Some students think the solute 'disappears' when it dissolves. It does not disappear -- the particles are still there, just spread out at the molecular level. If you evaporate the water, the salt will reappear as solid crystals.",
      },
      {
        title: "What Is Molarity?",
        body:
          "Molarity (symbol: M) is the standard measure of concentration in chemistry. It is defined as moles of solute per liter of solution, written as M = moles / liters (or mol/L). A 1 M (one molar) solution contains 1 mole of solute dissolved in enough solvent to make 1 liter of total solution. Molarity tells you how 'crowded' the solute particles are in the solution. A high molarity means many solute particles packed into each liter (concentrated). A low molarity means few solute particles per liter (dilute). Molarity is useful because it directly relates to moles, which connect to every other chemical calculation through stoichiometry.",
        example:
          "A 2.0 M NaCl solution has 2.0 moles of NaCl dissolved in every 1 liter of solution. If you have 0.5 L of this solution, you have 2.0 x 0.5 = 1.0 mole of NaCl.",
        diagram: {
          type: "visual",
          title: "What One Molar Means",
          visual:
            "  1 M (1 molar) solution = 1 mole of solute per 1 liter of solution\n\n  +---------------------------------+\n  |                                 |\n  |   o   o   o   o   o   o   o    |\n  |                                 |\n  |   o   o   o   o   o   o   o    |   1 L total solution\n  |                                 |   1 mol solute\n  |   o   o   o   o   o   o   o    |\n  |                                 |\n  +---------------------------------+\n\n  'o' = solute particles\n  1 mole = 6.022 x 10^23 particles\n  dissolved in enough solvent to\n  make 1 liter of total solution.",
          caption:
            "Molarity is moles per liter. It measures how concentrated the solute is within the solution.",
        },
        misconception:
          "A common mistake is thinking that 1 M means 1 mole of solute in 1 liter of solvent. It does not. It means 1 mole of solute dissolved in ENOUGH solvent to make 1 liter of total SOLUTION. You might add less than 1 liter of water because the solute itself takes up some volume.",
      },
      {
        title: "Calculating Molarity",
        body:
          "To calculate molarity, you need two pieces of information: the number of moles of solute and the total volume of the solution in liters. The formula is M = moles of solute / liters of solution. If you are given grams instead of moles, you must first convert grams to moles using the molar mass. If you are given milliliters instead of liters, you must convert milliliters to liters by dividing by 1000. Once you have both values in the correct units, simply divide moles by liters to get molarity. You can also rearrange the formula: moles = M x liters (useful when you know the molarity and volume and want to find moles), or liters = moles / M (useful when you know moles and molarity and want to find volume).",
        example:
          "If you dissolve 0.50 moles of NaCl in enough water to make 250 mL of solution: First convert 250 mL to 0.250 L. Then M = 0.50 mol / 0.250 L = 2.0 M.",
        diagram: {
          type: "table",
          title: "Molarity Calculation Examples",
          headers: ["Moles of Solute", "Volume of Solution", "Molarity"],
          rows: [
            ["1.0 mol", "1.0 L", "1.0 M"],
            ["2.0 mol", "1.0 L", "2.0 M"],
            ["0.50 mol", "0.250 L", "2.0 M"],
            ["3.0 mol", "0.500 L", "6.0 M"],
            ["0.10 mol", "2.0 L", "0.050 M"],
            ["5.0 mol", "10.0 L", "0.50 M"],
          ],
        },
        misconception:
          "Students often forget to convert milliliters to liters before dividing. 250 mL is NOT 250 L. Always divide mL by 1000 to get liters. Using 250 instead of 0.250 would give a molarity 1000 times too large.",
      },
      {
        title: "Concentrated vs Dilute Solutions",
        body:
          "The terms 'concentrated' and 'dilute' describe the relative amount of solute in a solution. A concentrated solution has a large amount of solute relative to the amount of solvent -- the particles are crowded together. A dilute solution has a small amount of solute relative to the solvent -- the particles are spread far apart. Think of making Kool-Aid or coffee: if you put a lot of powder or coffee grounds in a small amount of water, you get a strong, concentrated drink. If you put very little powder in a large amount of water, you get a weak, dilute drink. The same solute and solvent can make solutions of very different concentrations depending on the ratio. Molarity gives us a precise number to describe this: a 6 M solution is concentrated, while a 0.01 M solution is dilute.",
        example:
          "Coffee analogy: 3 tablespoons of coffee in 1 cup of water = strong (concentrated). 1 teaspoon of coffee in 1 cup of water = weak (dilute). Same ingredients, different concentration.",
        diagram: {
          type: "comparison",
          title: "Concentrated vs Dilute",
          left: {
            title: "CONCENTRATED",
            items: [
              "High molarity (many moles per liter)",
              "Solute particles are crowded together",
              "Like strong coffee or extra-sweet Kool-Aid",
              "More solute packed into less solvent",
              "Example: 6.0 M HCl",
            ],
          },
          right: {
            title: "DILUTE",
            items: [
              "Low molarity (few moles per liter)",
              "Solute particles are spread far apart",
              "Like weak coffee or barely-sweet Kool-Aid",
              "Less solute spread through more solvent",
              "Example: 0.010 M HCl",
            ],
          },
        },
        misconception:
          "'Concentrated' and 'dilute' are relative terms, not absolute. A 1 M solution might be considered concentrated for one substance but dilute for another. The terms describe the ratio of solute to solvent, not a fixed cutoff.",
      },
      {
        title: "Particle Diagrams of Concentration",
        body:
          "Visualizing solutions at the particle level makes concentration intuitive. In a concentrated solution, you see many solute particles packed into a given volume of solvent -- the particles are close together, and there is little empty space between them. In a dilute solution, you see few solute particles scattered in the same volume of solvent -- the particles are far apart, with lots of solvent between them. When you dilute a solution (by adding more solvent), you are not adding or removing any solute particles. You are simply spreading the same number of particles over a larger volume, which makes the solution less concentrated. This is the key to understanding dilution: the moles of solute stay the same; only the volume changes.",
        example:
          "If you have 1 L of 2 M solution (2 moles of solute) and you add 1 L of water, you now have 2 L of solution with the same 2 moles of solute. The new concentration is 2 mol / 2 L = 1 M. You doubled the volume and halved the concentration.",
        diagram: {
          type: "visual",
          title: "Particle View: Concentrated vs Dilute",
          visual:
            "  CONCENTRATED (2.0 M)          DILUTE (0.5 M)\n  Same volume, more solute      Same volume, less solute\n\n  +-------------+               +-------------+\n  | o o o o o o |               | o           |\n  | o o o o o o |               |       o     |\n  | o o o o o o |               |             |\n  | o o o o o o |               |    o        |\n  | o o o o o o |               |          o  |\n  | o o o o o o |               |             |\n  +-------------+               +-------------+\n   12 particles                  3 particles\n   in this volume                in this volume\n\n  More particles per volume      Fewer particles per volume\n  = higher concentration         = lower concentration",
          caption:
            "Concentration is about particle density -- how many solute particles fit in a given volume of solution. More particles = more concentrated.",
        },
        misconception:
          "Some students think diluting a solution changes the number of solute particles. It does not. Adding water only spreads the existing particles further apart. The total moles of solute are unchanged in a dilution.",
      },
      {
        title: "Making a Solution of Known Molarity",
        body:
          "To make a solution of a specific molarity, you cannot simply dump solute into a volume of solvent, because the solute changes the total volume. Instead, you use a volumetric flask. The procedure is: (1) Calculate how many moles of solute you need using moles = M x liters. (2) Convert moles to grams using the molar mass. (3) Weigh out that exact mass of solute. (4) Dissolve the solute in a small amount of solvent (less than the final volume). (5) Add solvent carefully until the total solution volume reaches the mark on the volumetric flask. The critical point is that the final volume must be the total solution volume, not the volume of solvent you added. The solute takes up some space, so you always add less solvent than the final volume.",
        example:
          "To make 500 mL of 1.0 M NaCl: moles needed = 1.0 M x 0.500 L = 0.50 mol. Grams = 0.50 mol x 58.44 g/mol = 29.2 g. Weigh 29.2 g NaCl, dissolve in some water, then add water until total volume = 500 mL.",
        diagram: {
          type: "steps",
          title: "Steps to Make a Solution of Known Molarity",
          steps: [
            {
              label: "Step 1: Calculate moles needed",
              visual: "moles = M x liters (e.g., 1.0 M x 0.500 L = 0.50 mol)",
            },
            {
              label: "Step 2: Convert moles to grams",
              visual: "grams = moles x molar mass (e.g., 0.50 mol x 58.44 = 29.2 g)",
            },
            {
              label: "Step 3: Weigh the solute",
              visual: "Use a balance to weigh exactly 29.2 g of NaCl",
            },
            {
              label: "Step 4: Dissolve in partial solvent",
              visual: "Add NaCl to a beaker with some water and stir until dissolved",
            },
            {
              label: "Step 5: Fill to final volume",
              visual: "Transfer to volumetric flask, add water to the 500 mL mark",
            },
          ],
        },
        misconception:
          "A very common mistake is dissolving the solute in exactly 500 mL of water. This would give you MORE than 500 mL of total solution (because the solute adds volume), making the concentration slightly lower than intended. You must dissolve first, then fill to the mark.",
      },
      {
        title: "Mole vs Molarity: Quantity vs Concentration",
        body:
          "The mole and molarity are two of the most commonly confused concepts in chemistry. A mole is a QUANTITY — it tells you HOW MANY particles you have (6.02 x 10^23 per mole). Molarity is a CONCENTRATION — it tells you how many moles are packed into each liter of solution (mol/L). The difference matters: if you have 1.0 mole of NaCl, you have a specific amount of salt. If you have 1.0 M NaCl, you have a solution where each liter contains 1.0 mole — but the total amount depends on how much solution you have. 1 liter of 1.0 M NaCl contains 1.0 mole. 0.5 liter of 1.0 M NaCl contains only 0.5 mole. The concentration is the same, but the amount is different. Think of it like juice: the mole is how much juice you have (a cup, a gallon), and molarity is how strong the juice is (concentrated or diluted).",
        example:
          "1.0 mole of NaCl = 6.02 x 10^23 molecules of NaCl (a quantity). 1.0 M NaCl = a solution containing 1.0 mol per liter (a concentration). If you have 250 mL of 1.0 M NaCl, you have 0.25 moles of NaCl (1.0 mol/L x 0.250 L). The concentration tells you the ratio; the volume tells you how much you actually have.",
        diagram: {
          type: "comparison",
          title: "Mole (Quantity) vs Molarity (Concentration)",
          left: {
            title: "MOLE (quantity)",
            items: [
              "Tells you HOW MANY particles",
              "1 mole = 6.02 x 10^23 items",
              "Like 'a dozen' = 12 items",
              "Unit: mol (or mmol, umol)",
              "Example: 2.0 mol NaCl = 2 x 6.02x10^23 molecules",
            ],
          },
          right: {
            title: "MOLARITY (concentration)",
            items: [
              "Tells you how CROWDED the particles are",
              "1 M = 1 mole per liter of solution",
              "Like 'how strong is the juice'",
              "Unit: M (mol/L) (or mM, uM)",
              "Example: 2.0 M NaCl = 2 mol in every liter",
            ],
          },
        },
        misconception:
          "The most common error is treating molarity as an amount. If a problem says 'you have 500 mL of 2.0 M NaCl,' that does NOT mean you have 2.0 moles. You have 2.0 x 0.500 = 1.0 mole. Molarity x Volume = Moles. You must always multiply concentration by volume to get the actual amount.",
      },
      {
        title: "The Dilution Equation: C1V1 = C2V2",
        body:
          "Dilution is the process of making a solution less concentrated by adding more solvent. The dilution equation C1V1 = C2V2 lets you calculate how much solvent to add or what the new concentration will be. C1 is the initial (stock) concentration, V1 is the initial volume, C2 is the final (desired) concentration, and V2 is the final total volume. The equation works because the moles of solute do not change during dilution -- you are only adding solvent. Since moles = concentration x volume, and moles are constant, C1V1 (initial moles) must equal C2V2 (final moles). You typically know three of the four variables and solve for the fourth. The key is identifying which concentration and volume are 'before' (1) and which are 'after' (2).",
        example:
          "You have 100 mL of 6.0 M HCl and you want to dilute it to 2.0 M. C1 = 6.0 M, V1 = 100 mL, C2 = 2.0 M, V2 = ? Using C1V1 = C2V2: 6.0 x 100 = 2.0 x V2, so V2 = 300 mL. The final total volume should be 300 mL, meaning you add 200 mL of water to the 100 mL of stock.",
        diagram: {
          type: "visual",
          title: "The Dilution Process (C1V1 = C2V2)",
          visual:
            "  BEFORE DILUTION                 AFTER DILUTION\n\n  +-----------+                   +-------------------+\n  | o o o o o |                   | o   o   o   o   o |\n  | o o o o o |  + add water  --> |                   |\n  | o o o o o |                   |   o   o   o   o   |\n  +-----------+                   |                   |\n   C1 = 6.0 M                     | o   o   o   o   o |\n   V1 = 100 mL                    +-------------------+\n   moles = 0.60                    C2 = 2.0 M\n                                   V2 = 300 mL\n                                   moles = 0.60\n\n  C1 x V1 = C2 x V2\n  6.0 x 100 = 2.0 x 300\n  600 = 600  (moles are conserved!)\n\n  Same particles, more volume = lower concentration.",
          caption:
            "Dilution adds solvent but keeps the same solute. The moles of solute are conserved: C1V1 = C2V2.",
        },
        misconception:
          "Students often think V2 is the volume of water to ADD. It is not. V2 is the FINAL total volume of the solution. The volume of water to add is V2 minus V1. In the example above, you add 300 - 100 = 200 mL of water.",
      },
      {
        title: "Stock Solutions and Moles Are Conserved",
        body:
          "In laboratories, it is common to keep a concentrated 'stock solution' on the shelf and dilute it as needed, rather than making every solution from scratch. This saves time and ensures consistency. A stock solution might be 12 M HCl, and you dilute it to 1 M for an experiment. The fundamental principle behind every dilution is that moles of solute are conserved -- you are not adding or removing solute, only adding solvent. Before dilution, the moles of solute equal C1 x V1. After dilution, the same moles of solute equal C2 x V2. Setting them equal gives the dilution equation. This conservation of moles is what makes the math work, and it is the same principle as conservation of mass in reactions: you cannot create or destroy solute particles by adding water.",
        example:
          "A lab has a 6.0 M stock solution of NaOH. A procedure calls for 500 mL of 0.50 M NaOH. Using C1V1 = C2V2: 6.0 x V1 = 0.50 x 500, so V1 = 41.7 mL. Measure 41.7 mL of stock and dilute to 500 mL total.",
        diagram: {
          type: "flowchart",
          title: "Dilution from a Stock Solution",
          nodes: [
            {
              label: "STOCK SOLUTION (concentrated)",
              children: ["Known concentration C1 (e.g., 6.0 M)"],
              note: "Stored on the shelf, ready to be diluted.",
            },
            {
              label: "Measure volume V1 of stock",
              children: ["Calculate V1 using C1V1 = C2V2"],
              note: "V1 is the amount of stock you need to use.",
            },
            {
              label: "Add solvent to reach final volume V2",
              children: ["Final concentration is C2 (the desired molarity)"],
              note: "Moles of solute are unchanged. Only volume increased.",
            },
          ],
        },
        misconception:
          "Some students think diluting changes the identity or chemical nature of the solute. It does not. A diluted HCl solution is still HCl -- it is just less concentrated. The solute is the same substance; there is simply more water around it.",
      },
      {
        title: "Molarity in Chemical Reactions",
        body:
          "Molarity is not just for making solutions -- it is a powerful tool in stoichiometry. When a reactant is in solution, its molarity and volume tell you exactly how many moles you have: moles = M x V (where V is in liters). Once you have moles, you can use the mole ratio from the balanced equation just as you would with any other reactant. This means the stoichiometry roadmap still applies: convert the given quantity to moles (using M x V for solutions), use the mole ratio, then convert to the target unit. Molarity bridges the world of solutions with the world of reaction calculations, allowing you to do stoichiometry with liquids just as easily as with solids.",
        example:
          "How many moles of NaOH are in 250 mL of 0.10 M NaOH? moles = M x V = 0.10 mol/L x 0.250 L = 0.025 mol NaOH. These moles can then be used in any stoichiometry calculation.",
        diagram: {
          type: "visual",
          title: "Molarity Connects to Stoichiometry",
          visual:
            "  Solution info: M and V\n        |\n        v\n  moles = M x V  (volume must be in liters!)\n        |\n        v\n  Use mole ratio from balanced equation\n        |\n        v\n  Convert to target unit (grams, volume, etc.)\n\n  Example: 0.250 L of 0.10 M NaOH\n  moles = 0.10 x 0.250 = 0.025 mol NaOH\n  Now use 0.025 mol in any stoichiometry problem.",
          caption:
            "Molarity x Volume = Moles. Once you have moles, the rest of stoichiometry works exactly the same as with solids.",
        },
        misconception:
          "A frequent error is forgetting to convert milliliters to liters before multiplying by molarity. Molarity is defined per liter, so if your volume is in mL, you must divide by 1000 first. 250 mL x 0.10 M is wrong; 0.250 L x 0.10 M is correct.",
      },
    ],
    formulas: [
      {
        name: "Molarity",
        formula: "M = moles of solute / liters of solution",
        desc:
          "Molarity is the concentration of a solution, defined as moles of solute divided by the total volume of the solution in liters. The unit is mol/L, abbreviated as M.",
        example:
          "2.0 moles of NaCl in 1.0 L of solution gives M = 2.0 / 1.0 = 2.0 M.",
      },
      {
        name: "Moles from Molarity",
        formula: "moles = M x V (V in liters)",
        desc:
          "If you know the molarity and volume of a solution, you can find the moles of solute by multiplying them together. The volume must be in liters.",
        example:
          "0.500 L of 1.5 M solution contains 1.5 x 0.500 = 0.75 moles of solute.",
      },
      {
        name: "Dilution Equation",
        formula: "C1V1 = C2V2",
        desc:
          "The dilution equation relates the initial concentration (C1) and volume (V1) of a stock solution to the final concentration (C2) and total volume (V2) after dilution. It works because moles of solute are conserved during dilution.",
        example:
          "100 mL of 6.0 M diluted to 2.0 M: 6.0 x 100 = 2.0 x V2, so V2 = 300 mL.",
      },
    ],
    workedExamples: [
      {
        problem:
          "What is the molarity of a solution made by dissolving 29.4 g of NaCl in enough water to make 500.0 mL of solution? (Molar mass of NaCl = 58.44 g/mol)",
        steps: [
          {
            label: "Step 1: Convert grams of NaCl to moles",
            detail:
              "29.4 g NaCl x (1 mol NaCl / 58.44 g NaCl) = 0.503 mol NaCl.",
          },
          {
            label: "Step 2: Convert mL to liters",
            detail: "500.0 mL / 1000 = 0.5000 L of solution.",
          },
          {
            label: "Step 3: Calculate molarity",
            detail: "M = moles / liters = 0.503 mol / 0.5000 L = 1.01 M.",
          },
        ],
        answer: "The molarity is 1.01 M.",
      },
      {
        problem:
          "Dilution problem: You have 50.0 mL of a 12.0 M HCl stock solution. How would you prepare 250.0 mL of 2.40 M HCl from this stock?",
        steps: [
          {
            label: "Step 1: Identify the knowns",
            detail:
              "C1 = 12.0 M (stock concentration), V1 = 50.0 mL (but this is what we have, not necessarily what we use), C2 = 2.40 M (desired final concentration), V2 = 250.0 mL (desired final volume).",
          },
          {
            label: "Step 2: Apply the dilution equation C1V1 = C2V2",
            detail:
              "We need to find V1 (how much stock to use). 12.0 x V1 = 2.40 x 250.0. So V1 = (2.40 x 250.0) / 12.0 = 50.0 mL.",
          },
          {
            label: "Step 3: Determine how much water to add",
            detail:
              "V2 (final volume) - V1 (stock volume) = 250.0 - 50.0 = 200.0 mL of water to add.",
          },
        ],
        answer:
          "Measure 50.0 mL of the 12.0 M stock solution and add water until the total volume is 250.0 mL (add approximately 200.0 mL of water). The result is 250.0 mL of 2.40 M HCl.",
      },
      {
        problem:
          "How many moles of solute are in 1.50 L of a 0.250 M solution? If this solution is NaOH, how many grams of NaOH are present? (Molar mass of NaOH = 40.00 g/mol)",
        steps: [
          {
            label: "Step 1: Calculate moles from molarity and volume",
            detail:
              "moles = M x V = 0.250 mol/L x 1.50 L = 0.375 mol of solute.",
          },
          {
            label: "Step 2: Convert moles of NaOH to grams",
            detail:
              "grams = moles x molar mass = 0.375 mol x 40.00 g/mol = 15.0 g NaOH.",
          },
        ],
        answer:
          "There are 0.375 moles of solute, which corresponds to 15.0 grams of NaOH.",
      },
    ],
    vocabulary: [
      {
        term: "Solution",
        def:
          "A homogeneous mixture of two or more substances, consisting of a solute dissolved in a solvent. The composition is uniform throughout.",
      },
      {
        term: "Solute",
        def:
          "The substance that is dissolved in a solution. It is typically present in the smaller amount.",
      },
      {
        term: "Solvent",
        def:
          "The substance that dissolves the solute to form a solution. It is typically present in the larger amount. Water is the most common solvent.",
      },
      {
        term: "Molarity (M)",
        def:
          "A unit of concentration defined as moles of solute per liter of solution. The unit is mol/L, written as M.",
      },
      {
        term: "Concentrated",
        def:
          "A solution containing a relatively large amount of solute per unit volume. High molarity means concentrated.",
      },
      {
        term: "Dilute",
        def:
          "A solution containing a relatively small amount of solute per unit volume. Low molarity means dilute.",
      },
      {
        term: "Dilution",
        def:
          "The process of making a solution less concentrated by adding more solvent. The moles of solute remain unchanged.",
      },
      {
        term: "Stock Solution",
        def:
          "A concentrated solution stored in the laboratory that is diluted as needed to prepare solutions of lower concentration.",
      },
      {
        term: "Concentration",
        def:
          "The amount of solute per unit volume of solution. Molarity (mol/L) is the most common unit of concentration in chemistry.",
      },
      {
        term: "Millimolarity (mM)",
        def:
          "A concentration unit: mmol/L = 10^-3 M. Used for dilute solutions. 1 mM = 0.001 M.",
      },
      {
        term: "Micromolarity (uM)",
        def:
          "A concentration unit: umol/L = 10^-6 M. Used for very dilute solutions. 1 uM = 0.000001 M.",
      },
    ],
  },

};
