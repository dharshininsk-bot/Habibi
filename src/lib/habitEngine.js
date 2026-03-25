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
export function calculateDailyTask(frictionScore, energyLevel, pathwayDifficulty = 2) {
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
