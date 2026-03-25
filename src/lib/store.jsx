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

  const [galleryEntries, setGalleryEntries] = useState([
    { id: 1, day: 1, energy: 90, level: 3, imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400&auto=format&fit=crop' },
    { id: 2, day: 2, energy: 85, level: 2, imageUrl: 'https://images.unsplash.com/photo-1460518451285-cd7ba71ba4c8?q=80&w=400&auto=format&fit=crop' },
    { id: 3, day: 5, energy: 70, level: 2, imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop' },
    { id: 4, day: 6, energy: 95, level: 3, imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400&auto=format&fit=crop' },
  ]);

  const addGalleryEntry = (entry) => {
    setGalleryEntries(prev => [
      ...prev,
      { id: Date.now(), day: prev.length > 0 ? prev[prev.length - 1].day + 1 : 1, ...entry }
    ]);
  };

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
      addSessionToHistory,
      galleryEntries,
      addGalleryEntry
    }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabitStore = () => useContext(HabitContext);
