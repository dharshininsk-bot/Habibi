import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const HabitContext = createContext();

const INITIAL_PATHWAYS = [
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

export const HabitProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const [badges, setBadges] = useState([]);
  const [learningSpeed, setLearningSpeed] = useState(1.0);
  const [recoverySpeed, setRecoverySpeed] = useState(1.0);
  const [activeUsers, setActiveUsers] = useState([
    { id: 1, name: "Alice", avatar: "https://i.pravatar.cc/100?u=16" },
    { id: 2, name: "Bob", avatar: "https://i.pravatar.cc/100?u=17" }
  ]);

  const [pathways, setPathways] = useState(INITIAL_PATHWAYS);
  const [galleryEntries, setGalleryEntries] = useState([]);


  // Check badges logic
  useEffect(() => {
    if (learningSpeed >= 2.0 && !badges.includes('Speed Demon')) {
      setBadges(prev => [...prev, 'Speed Demon']);
    }
  }, [learningSpeed, badges]);

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const fetchData = async (token) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [pathwaysRes, historyRes, galleryRes] = await Promise.all([
        fetch('/api/pathways', { headers }),
        fetch('/api/history', { headers }),
        fetch('/api/gallery', { headers })
      ]);

      if (pathwaysRes.ok) {
        const dbPathways = await pathwaysRes.json();
        // Merge mocks and DB pathways, filtering out duplicates by title or ID
        const merged = [...INITIAL_PATHWAYS];
        dbPathways.forEach(p => {
          if (!merged.find(m => m.id === p.id || m.title === p.title)) {
            merged.unshift(p); // Put user pathways at the top
          }
        });
        setPathways(merged);
      }

      if (historyRes.ok) {
        const dbHistory = await historyRes.json();
        const mapped = dbHistory.map(h => ({
          id: h.id,
          date: new Date(h.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          pathway: h.pathway_title || 'General',
          taskTitle: h.task_title,
          timeSpent: h.duration,
          completedSubtasks: h.completed_subtasks,
          type: h.type || 'ember'
        }));
        setHistory(mapped);
      }
      if (galleryRes.ok) setGalleryEntries(await galleryRes.json());
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

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
      .then(data => {
        setUser(data.user);
        fetchData(token);
      })
      .catch(() => {
        localStorage.removeItem('habibi_token');
        setUser(null);
      })
      .finally(() => setAuthLoading(false));
    } else {
      setAuthLoading(false);
    }
  }, []);

  const addGalleryEntry = async (entry) => {
    const token = localStorage.getItem('habibi_token');
    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(entry)
    });
    if (res.ok) {
      const { id } = await res.json();
      setGalleryEntries(prev => [{ id, ...entry, created_at: new Date().toISOString() }, ...prev]);
    }
  };

  const addSessionToHistory = async (session) => {
    const token = localStorage.getItem('habibi_token');
    const res = await fetch('/api/history', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(session)
    });

    if (res.ok) {
      const { id } = await res.json();
      const pId = session.pathwayId || session.pathway_id;
      const activePath = pathways.find(p => p.id === pId || p.title === session.pathway);

      setHistory(prev => [{ 
        id, 
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        pathway: activePath?.title || session.pathway || 'General',
        taskTitle: session.taskTitle || session.task_title,
        timeSpent: session.duration || session.timeSpent,
        completedSubtasks: session.completedSubtasks || session.completed_subtasks,
        type: session.type || 'ember'
      }, ...prev]);
      
      if (session.speed > 1) {
        setLearningSpeed(prev => Math.min(3.0, prev + 0.1 * session.speed));
        setRecoverySpeed(prev => Math.max(0.5, prev - 0.05));
      }
    }
  };

  const addPathway = async (newPathway) => {
    const token = localStorage.getItem('habibi_token');
    const res = await fetch('/api/pathways', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newPathway)
    });

    if (res.ok) {
      const { id } = await res.json();
      setPathways(prev => [{ id, creator_id: user?.id, ...newPathway, created_at: new Date().toISOString() }, ...prev]);
    }
  };

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
    fetchData(data.token);
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
    fetchData(data.token);
  };

  const logout = () => {
    localStorage.removeItem('habibi_token');
    setUser(null);
    setHistory([]);
    setGalleryEntries([]);
    setPathways(INITIAL_PATHWAYS);
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
