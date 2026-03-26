import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db.js';

const app = express();
const PORT = 3001;
const JWT_SECRET = 'habibi_super_secret_jwt_key_2026';

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if user exists
    const existingUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user
    const insert = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
    const info = insert.run(username, passwordHash);

    // Generate JWT
    const token = jwt.sign({ id: info.lastInsertRowid, username }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: { id: info.lastInsertRowid, username } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Get user
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user endpoint
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = db.prepare('SELECT id, username, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
});

// --- Pathways ---
app.get('/api/pathways', authenticateToken, (req, res) => {
  const pathways = db.prepare(`
    SELECT * FROM pathways 
    WHERE is_private = 0 OR creator_id = ?
    ORDER BY created_at DESC
  `).all(req.user.id);
  
  const parsed = pathways.map(p => ({
    ...p,
    subtopics: JSON.parse(p.subtopics),
    isPrivate: p.is_private === 1
  }));
  res.json(parsed);
});

app.post('/api/pathways', authenticateToken, (req, res) => {
  const { title, category, subtopics, isPrivate } = req.body;
  const insert = db.prepare(`
    INSERT INTO pathways (creator_id, title, category, subtopics, is_private)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = insert.run(req.user.id, title, category, JSON.stringify(subtopics), isPrivate ? 1 : 0);
  res.status(201).json({ id: info.lastInsertRowid });
});

// --- History (Sessions) ---
app.get('/api/history', authenticateToken, (req, res) => {
  const sessions = db.prepare(`
    SELECT s.*, p.title as pathway_title 
    FROM sessions s
    LEFT JOIN pathways p ON s.pathway_id = p.id
    WHERE s.user_id = ? 
    ORDER BY s.created_at DESC
  `).all(req.user.id);
  res.json(sessions);
});

app.post('/api/history', authenticateToken, (req, res) => {
  const { pathwayId, taskTitle, duration, completedSubtasks, type, speed } = req.body;
  const insert = db.prepare(`
    INSERT INTO sessions (user_id, pathway_id, task_title, duration, completed_subtasks, type, speed)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const info = insert.run(req.user.id, pathwayId, taskTitle, duration, completedSubtasks, type, speed);
  res.status(201).json({ id: info.lastInsertRowid });
});

// --- Gallery ---
app.get('/api/gallery', authenticateToken, (req, res) => {
  const items = db.prepare(`
    SELECT g.*, s.task_title 
    FROM gallery g
    LEFT JOIN sessions s ON g.session_id = s.id
    WHERE g.user_id = ? 
    ORDER BY g.created_at DESC
  `).all(req.user.id);
  res.json(items);
});

app.post('/api/gallery', authenticateToken, (req, res) => {
  const { sessionId, imageUrl, caption } = req.body;
  
  let finalSessionId = sessionId;
  if (!finalSessionId) {
    const latest = db.prepare('SELECT id FROM sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1').get(req.user.id);
    if (latest) finalSessionId = latest.id;
  }

  const insert = db.prepare(`
    INSERT INTO gallery (user_id, session_id, image_url, caption)
    VALUES (?, ?, ?, ?)
  `);
  const info = insert.run(req.user.id, finalSessionId, imageUrl, caption);
  res.status(201).json({ id: info.lastInsertRowid });
});

// --- Live Chat (SSE & REST) ---
let chatClients = [];

// Endpoint to establish SSE connection
app.get('/api/chat/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // Ensure headers are sent immediately

  const moduleTitle = req.query.module;
  const client = { id: Date.now(), res, moduleTitle };
  chatClients.push(client);

  req.on('close', () => {
    chatClients = chatClients.filter(c => c.id !== client.id);
  });
});

// Endpoint to get recent messages for a module
app.get('/api/chat/:moduleName', authenticateToken, (req, res) => {
  const { moduleName } = req.params;
  const messages = db.prepare(`
    SELECT c.*, u.username as sender
    FROM chat_messages c
    JOIN users u ON c.user_id = u.id
    WHERE c.module_title = ?
    ORDER BY c.created_at ASC
  `).all(moduleName);
  res.json(messages);
});

// Endpoint to post a new message
app.post('/api/chat/:moduleName', authenticateToken, (req, res) => {
  const { moduleName } = req.params;
  const { text } = req.body;
  
  if (!text) return res.status(400).json({ error: 'Message text is required' });

  // Save to DB
  const insert = db.prepare(`
    INSERT INTO chat_messages (user_id, module_title, text)
    VALUES (?, ?, ?)
  `);
  const info = insert.run(req.user.id, moduleName, text);

  const newMessage = {
    id: info.lastInsertRowid,
    user_id: req.user.id,
    sender: req.user.username,
    module_title: moduleName,
    text,
    created_at: new Date().toISOString()
  };

  // Broadcast to all active clients connected to this module
  chatClients.forEach(c => {
    if (c.moduleTitle === moduleName) {
      c.res.write(`data: ${JSON.stringify(newMessage)}\n\n`);
    }
  });

  res.status(201).json(newMessage);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Habibi Backend Server running on http://127.0.0.1:${PORT}`);
});
