/**
 * Core Habit Engine for the Socially Aware Habit System
 */

export const TASK_LEVELS = {
  SPARK: {
    level: 1,
    id: 'SPARK',
    title: "Spark",
    color: "#22c55e", // Green
    description: "Keep the flame alive with a tiny win."
  },
  FLAME: {
    level: 2,
    id: 'FLAME',
    title: "Flame",
    color: "#eab308", // Yellow
    description: "A steady session for consistent progress."
  },
  EMBER: {
    level: 3,
    id: 'EMBER',
    title: "Ember",
    color: "#ef4444", // Red
    description: "Full focus for peak energy and momentum."
  }
};

export const SYLLABUS = [
  "Introduction & Core Concepts",
  "Environment Setup & Tools",
  "Basic Architecture & Flow",
  "Data Models & Structures",
  "Primary Implementation Phase",
  "Advanced Logic & Edge Cases",
  "Integration & State Management",
  "Performance Optimization",
  "Testing & Quality Assurance",
  "UI/UX Refinement",
  "Security & Deployment",
  "Final Project & Review"
];

/**
 * frictionScore = Inactivity + Skips + Incomplete Sessions
 */
export function calculateFrictionScore(inactivityDays, skips, incompleteSessions) {
  // Simple additive model for now
  return Math.min(10, (inactivityDays || 0) + (skips || 0) + (incompleteSessions || 0));
}

/**
 * Logic to adjust task complexity based on energy level
 */
export function calculateDailyTask(frictionScore, energyLevel, completedCount = 0, activePathway = null) {
  let moduleTitle = "Introduction";
  let customSubtopics = activePathway?.subtopics || [];
  
  if (customSubtopics.length > 0) {
    const moduleIndex = Math.min(customSubtopics.length - 1, completedCount);
    moduleTitle = customSubtopics[moduleIndex].title;
  } else {
    const moduleIndex = Math.min(SYLLABUS.length - 1, completedCount);
    moduleTitle = SYLLABUS[moduleIndex];
  }

  // Determine Task Base (Title & Color) based on Energy Level
  let taskBase;
  if (energyLevel <= 30) {
    taskBase = TASK_LEVELS.SPARK;
  } else if (energyLevel < 75) {
    taskBase = TASK_LEVELS.FLAME;
  } else {
    taskBase = TASK_LEVELS.EMBER;
  }

  // Determine Duration based on Energy Level
  let duration;
  if (energyLevel <= 30) {
    duration = 10;
  } else if (energyLevel <= 60) {
    duration = 30;
  } else if (energyLevel <= 90) {
    duration = 60;
  } else {
    duration = 90;
  }

  // Reasoning logic
  let reasoning = "";
  if (frictionScore > 5) {
    reasoning = "I can see this module has been a blocker. Let's start with a small spark to rebuild your rhythm.";
  } else if (energyLevel <= 30) {
    reasoning = "Your energy is low today. A quick spark is all you need to stay consistent.";
  } else if (energyLevel < 75) {
    reasoning = "You're in a good rhythm. This flame will keep your momentum building.";
  } else {
    reasoning = "Energy is high and your rhythm is clear. Let's turn This Ember into a blaze!";
  }

  return {
    ...taskBase,
    moduleTitle,
    duration,
    reasoning
  };
}

/**
 * Fluid momentum calculation with decay
 */
export function calculateNextMomentum(prevMomentum, isSuccess, energyLevel, frictionScore) {
  const DECAY_RATE = 0.10; // 10% decay on miss
  const BASE_GAIN = 10;

  if (isSuccess) {
    // Friction bonus: Overcoming difficulty is more valuable
    const frictionBonus = frictionScore * 0.5;
    const energyMultiplier = 1 + (energyLevel / 100);
    const gain = BASE_GAIN * energyMultiplier + frictionBonus;
    return Math.min(100, prevMomentum + gain);
  } else {
    return prevMomentum * (1 - DECAY_RATE);
  }
}

/**
 * Parser that breaks a module into subtasks
 * and feeds them based on energy/speed and current progress.
 */
/**
 * Parser that breaks a module into 5 proportional subtasks
 * to ensure a consistent rhythm ("beads on a string") 
 * across any session duration.
 */
export function parseModuleTasks(moduleTitle, isHighFriction, activePathway = null, sessionDuration = 30) {
  // We always show 5 beads to maintain the "Habibi" rhythm
  // Fractions of the total session time
  const proportions = [0.15, 0.35, 0.25, 0.15, 0.10]; 
  const labels = [
    `${moduleTitle} Warm-up`,
    'Deep Dive & Focus',
    'Practical Application',
    'Refinement / Polish',
    'Session Review'
  ];

  if (isHighFriction) {
    // High Friction State: Still show 3 beads but keep them tiny
    return [
      { id: 0, title: `Spark: Breath & Entry`, duration: '2m' },
      { id: 1, title: `Micro-Task: ${moduleTitle}`, duration: '6m' },
      { id: 2, title: `Quick Close`, duration: '2m' }
    ];
  }
  
  return proportions.map((pct, i) => {
    const mins = Math.max(1, Math.round(sessionDuration * pct));
    return {
      id: i,
      title: labels[i],
      duration: `${mins}m`
    };
  });
}
