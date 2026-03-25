import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

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
    { id: 2, name: "Bob", avatar: "https://i.pravatar.cc/100?u=17" }
  ]);

  const [pathways, setPathways] = useState([
    {
      id: 'unity-basics',
      title: 'Unity Fundamentals',
      category: 'coding',
      creator: 'DevXavier',
      activeCount: 450,
      enrolled: '12.4k',
      difficulty: 'Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop',
      isPrivate: false,
      subtopics: [
        { title: 'Workspace Setup', duration: 15 },
        { title: 'Unity Interface', duration: 30 },
        { title: 'Your First Script', duration: 45 }
      ]
    },
    {
      id: 'oil-painting',
      title: 'Traditional Oil Painting',
      category: 'art',
      creator: 'ArtistSola',
      activeCount: 120,
      enrolled: '3.1k',
      difficulty: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&auto=format&fit=crop',
      isPrivate: false,
      subtopics: [
        { title: 'Color Theory', duration: 20 },
        { title: 'Brush Control', duration: 40 },
        { title: 'Light & Shadow', duration: 60 }
      ]
    },
    {
      id: 'bodyweight-pro',
      title: 'Bodyweight Mastery',
      category: 'fitness',
      creator: 'FitCoach',
      activeCount: 890,
      enrolled: '25k',
      difficulty: 'Advanced',
      thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop',
      isPrivate: false
    },
    {
      id: 'sourdough',
      title: 'The Sourdough Journey',
      category: 'cooking',
      creator: 'BakerBen',
      activeCount: 304,
      enrolled: '8k',
      difficulty: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1585478259715-876a6a81fc08?q=80&w=800&auto=format&fit=crop',
      isPrivate: false
    },
    {
      id: 'ui-motion',
      title: 'UI Motion & Animation',
      category: 'art',
      creator: 'DesignDua',
      activeCount: 56,
      enrolled: '1.2k',
      difficulty: 'Intermediate',
      thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop',
      isPrivate: false
    },
    {
      id: 'python-data',
      title: 'Python for Data Science',
      category: 'coding',
      creator: 'DataWiz',
      activeCount: 220,
      enrolled: '15k',
      difficulty: 'Beginner',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
      isPrivate: false
    }
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

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('habibi_token');
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) throw new Error('Invalid token');
        return res.json();
      })
      .then(data => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('habibi_token');
        setUser(null);
      })
      .finally(() => setAuthLoading(false));
    } else {
      setAuthLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    
    localStorage.setItem('habibi_token', data.token);
    setUser(data.user);
  };

  const register = async (username, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    
    localStorage.setItem('habibi_token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('habibi_token');
    setUser(null);
  };

  const value = useMemo(() => ({
    history,
    badges,
    learningSpeed,
    recoverySpeed,
    activeUsers,
    addSessionToHistory,
    pathways,
    addPathway: (newPathway) => setPathways(prev => [...prev, { id: Date.now(), ...newPathway }]),
    galleryEntries,
    addGalleryEntry,
    user,
    authLoading,
    login,
    register,
    logout
  }), [history, badges, learningSpeed, recoverySpeed, activeUsers, pathways, galleryEntries, user, authLoading]);

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabitStore = () => useContext(HabitContext);
