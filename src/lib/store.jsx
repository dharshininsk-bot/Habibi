import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { db, pathwaysCol, historyCol, galleryCol } from './firebase';
import { onSnapshot, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';

const HabitContext = createContext();

const MOCK_PATHWAYS = [
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
];

const MOCK_HISTORY = [
  { id: 'h1', date: 'Mar 24', pathway: 'Bodyweight Mastery', taskTitle: 'Advanced Pushup Progressions', timeSpent: '45m', completedSubtasks: 5, type: 'ember' },
  { id: 'h2', date: 'Mar 23', pathway: 'Bodyweight Mastery', taskTitle: 'Core Warm-up', timeSpent: '10m', completedSubtasks: 1, type: 'spark' },
];

const MOCK_GALLERY = [
  { id: 'g1', day: 1, energy: 90, level: 3, imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400&auto=format&fit=crop' },
  { id: 'g2', day: 2, energy: 85, level: 2, imageUrl: 'https://images.unsplash.com/photo-1460518451285-cd7ba71ba4c8?q=80&w=400&auto=format&fit=crop' },
  { id: 'g3', day: 5, energy: 70, level: 2, imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop' },
  { id: 'g4', day: 6, energy: 95, level: 3, imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400&auto=format&fit=crop' },
];

export const HabitProvider = ({ children }) => {
  const [history, setHistory] = useState(MOCK_HISTORY);
  const [pathways, setPathways] = useState(MOCK_PATHWAYS);
  const [galleryEntries, setGalleryEntries] = useState(MOCK_GALLERY);
  const [badges, setBadges] = useState([]);
  const [learningSpeed, setLearningSpeed] = useState(1.0);
  const [recoverySpeed, setRecoverySpeed] = useState(1.0);

  const [activeUsers] = useState([
    { id: 1, name: "Alice", avatar: "https://i.pravatar.cc/100?u=16" },
    { id: 2, name: "Bob", avatar: "https://i.pravatar.cc/100?u=17" },
    { id: 3, name: "Charlie", avatar: "https://i.pravatar.cc/100?u=18" }
  ]);

  // Sync Pathways
  useEffect(() => {
    try {
      const q = query(pathwaysCol);
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (docs.length > 0) {
          // Merge Firebase data with MOCK data, prioritizing Firebase for matching IDs
          setPathways(prev => {
            const merged = [...docs];
            MOCK_PATHWAYS.forEach(mock => {
              if (!merged.find(d => d.id === mock.id)) merged.push(mock);
            });
            return merged;
          });
        }
      });
      return unsubscribe;
    } catch (e) {
      console.warn("Firebase sync error:", e);
    }
  }, []);

  // Sync History
  useEffect(() => {
    try {
      const q = query(historyCol, orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (docs.length > 0) {
          setHistory(prev => {
            const merged = [...docs];
            MOCK_HISTORY.forEach(mock => {
              if (!merged.find(d => d.id === mock.id)) merged.push(mock);
            });
            return merged;
          });
        }
      });
      return unsubscribe;
    } catch (e) { }
  }, []);

  // Sync Gallery
  useEffect(() => {
    try {
      const q = query(galleryCol, orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (docs.length > 0) {
          setGalleryEntries(prev => {
            const merged = [...docs];
            MOCK_GALLERY.forEach(mock => {
              if (!merged.find(d => d.id === mock.id)) merged.push(mock);
            });
            return merged;
          });
        }
      });
      return unsubscribe;
    } catch (e) { }
  }, []);

  const addPathway = async (newPathway) => {
    try {
      await addDoc(pathwaysCol, { ...newPathway, createdAt: serverTimestamp() });
    } catch (e) {
      setPathways(prev => [...prev, { id: Date.now(), ...newPathway }]);
    }
  };

  const addSessionToHistory = async (session) => {
    try {
      await addDoc(historyCol, { 
        ...session, 
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        createdAt: serverTimestamp() 
      });
    } catch (e) {
      setHistory(prev => [{ id: Date.now(), ...session }, ...prev]);
    }
  };

  const addGalleryEntry = async (entry) => {
    try {
      await addDoc(galleryCol, { ...entry, createdAt: serverTimestamp() });
    } catch (e) {
      setGalleryEntries(prev => [{ id: Date.now(), ...entry }, ...prev]);
    }
  };

  const value = useMemo(() => ({
    history,
    badges,
    learningSpeed,
    recoverySpeed,
    activeUsers,
    addSessionToHistory,
    pathways,
    addPathway,
    galleryEntries,
    addGalleryEntry
  }), [history, badges, learningSpeed, recoverySpeed, activeUsers, pathways, galleryEntries]);

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabitStore = () => useContext(HabitContext);
