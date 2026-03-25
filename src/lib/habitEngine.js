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
export function parseModuleTasks(moduleTitle, isHighFriction, activePathway = null, sessionDuration = 30, offset = 0) {
  let sourceSubtopics = [];
  if (activePathway?.subtopics?.length > 0) {
    sourceSubtopics = activePathway.subtopics;
  } else {
    // Default mock subtopics if none provided
    sourceSubtopics = [
      { title: `${moduleTitle} Warm-up`, duration: 10 },
      { title: 'Deep dive & Core Concept', duration: 20 },
      { title: 'Practical Implementation', duration: 15 },
      { title: 'Refinement & Debugging', duration: 10 },
      { title: 'Final Documentation', duration: 5 }
    ];
  }

  // Handle offset: Start from the first uncompleted subtopic
  const remainingSubtopics = sourceSubtopics.slice(offset);

  if (isHighFriction) {
    // High Friction State: UI collapses complex tasks into a single Micro-Task ("Spark").
    return [
      { id: 0, title: `Spark: Breath & Entry`, duration: '2m' },
      { id: 1, title: `Micro-Task: ${remainingSubtopics[0]?.title || moduleTitle}`, duration: '6m' },
      { id: 2, title: `Quick Close`, duration: '2m' }
    ];
  }
  
  // Sum up topics according to session timing
  let totalTime = 0;
  let assignedSubtopics = [];
  
  for (let i = 0; i < remainingSubtopics.length; i++) {
    const sub = remainingSubtopics[i];
    const subDuration = typeof sub.duration === 'string' ? parseInt(sub.duration.replace('m','')) : sub.duration;
    
    if (totalTime + subDuration <= sessionDuration) {
      assignedSubtopics.push({
        id: i,
        title: sub.title,
        duration: `${subDuration}m`
      });
      totalTime += subDuration;
    } else {
      break;
    }
  }

  // Ensure at least one subtopic is assigned if possible
  if (assignedSubtopics.length === 0 && remainingSubtopics.length > 0) {
    const firstSub = remainingSubtopics[0];
    const subDuration = typeof firstSub.duration === 'string' ? parseInt(firstSub.duration.replace('m','')) : firstSub.duration;
    assignedSubtopics.push({
      id: 0,
      title: firstSub.title,
      duration: `${subDuration}m`
    });
  }

  return assignedSubtopics;
}
