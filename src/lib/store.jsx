import React, { createContext, useContext, useState, useEffect } from 'react';

const HabitContext = createContext();

export const HabitProvider = ({ children }) => {
  const [history, setHistory] = useState([
    { id: 1, date: 'Mar 24', pathway: 'Bodyweight Mastery', taskTitle: 'Advanced Pushup Progressions', timeSpent: '45m', completedSubtasks: 5, type: 'ember' },
    { id: 2, date: 'Mar 23', pathway: 'Bodyweight Mastery', taskTitle: 'Core Warm-up', timeSpent: '10m', completedSubtasks: 1, type: 'spark' },
  ]);
  
  const [badges, setBadges] = useState([]);
  
  // A mock learning speed metric based on flow factors
  const [learningSpeed, setLearningSpeed] = useState(1.0);
  const [recoverySpeed, setRecoverySpeed] = useState(1.0);

  const [activeUsers, setActiveUsers] = useState([
    { id: 1, name: "Alice", avatar: "https://i.pravatar.cc/100?u=16" },
    { id: 2, name: "Bob", avatar: "https://i.pravatar.cc/100?u=17" },
    { id: 3, name: "Charlie", avatar: "https://i.pravatar.cc/100?u=18" }
  ]);

  const addSessionToHistory = (session) => {
    setHistory(prev => [
      { id: Date.now(), date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), ...session },
      ...prev
    ]);
    
    // Simple logic for Learning Speed & Recovery
    if (session.speed > 1) {
      setLearningSpeed(prev => Math.min(3.0, prev + 0.1 * session.speed));
      setRecoverySpeed(prev => Math.max(0.5, prev - 0.05));
    }
  };

  // Check badges logic
  useEffect(() => {
    if (learningSpeed >= 2.0 && !badges.includes('Speed Demon')) {
      setBadges(prev => [...prev, 'Speed Demon']);
    }
  }, [learningSpeed, badges]);

  return (
    <HabitContext.Provider value={{
      history,
      badges,
      learningSpeed,
      recoverySpeed,
      activeUsers,
      addSessionToHistory
    }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabitStore = () => useContext(HabitContext);
