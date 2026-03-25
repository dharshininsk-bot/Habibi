/**
 * Core Habit Engine for the Socially Aware Habit System
 */

export const TASK_LEVELS = {
  SPARK: {
    level: 1,
    id: 'SPARK',
    title: "The Spark",
    duration: 10,
    color: "#60a5fa", // Blue
    description: "Keep the flame alive with a tiny win."
  },
  FLOW: {
    level: 2,
    id: 'FLOW',
    title: "The Flow",
    duration: 30,
    color: "#fb923c", // Orange
    description: "A steady session for consistent progress."
  },
  DEEP_DIVE: {
    level: 3,
    id: 'DEEP_DIVE',
    title: "The Deep Dive",
    duration: 60,
    color: "#a855f7", // Purple
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
 * Logic to adjust task complexity
 */
export function calculateDailyTask(frictionScore, energyLevel, pathwayDifficulty = 2) {
  // If Friction is > 5, always force a Level 1 Spark to prevent quitting
  if (frictionScore > 5) {
    return {
      ...TASK_LEVELS.SPARK,
      reasoning: "I can see this module has been a blocker. Let's just do 10 minutes to keep the flame alive."
    };
  }

  // If energy is low, give a Spark
  if (energyLevel < 35) {
    return {
      ...TASK_LEVELS.SPARK,
      reasoning: "Your energy is low today. Taking it easy is okay, but let's do a tiny bit to stay consistent."
    };
  }

  // Moderate energy
  if (energyLevel >= 35 && energyLevel <= 75) {
    // If it's a hard pathway and there's some friction, downgrade to Spark
    if (pathwayDifficulty === 3 && frictionScore > 3) {
      return {
        ...TASK_LEVELS.SPARK,
        reasoning: "This topic is challenging. Let's stick to a small win today."
      };
    }

    return {
      ...TASK_LEVELS.FLOW,
      reasoning: "You're in a good rhythm. Ready for a standard session?"
    };
  }

  // Peak state: High energy AND Low friction
  if (energyLevel > 75 && frictionScore <= 2) {
    return {
      ...TASK_LEVELS.DEEP_DIVE,
      reasoning: "Energy is high and your rhythm is clear. It's time for a Deep Dive."
    };
  }

  // Fallback to flow
  return {
    ...TASK_LEVELS.FLOW,
    reasoning: "Let's keep the momentum going with a solid session."
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
