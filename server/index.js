const express = require('express');
const cors = require('cors');
const db = require('./db');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Login endpoint - returns JWT when credentials match
app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user || !user.password) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });
});

// Auth middleware for /api/users - only admin role allowed
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload || payload.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Apply auth to users routes
app.use('/api/users', requireAuth);

app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r => ({ ...r, active: !!r.active })));
  });
});

// Admin-only: reset a user's password (set to provided password)
app.post('/api/users/:id/reset-password', (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Missing password' });
  const hash = bcrypt.hashSync(password, 8);
  db.run('UPDATE users SET password = ? WHERE id = ?', [hash, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  });
});

app.get('/api/users/:id', (req, res) => {
  db.get('SELECT * FROM users WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    row.active = !!row.active;
    res.json(row);
  });
});

app.post('/api/users', (req, res) => {
  const { name, email, role, active, password } = req.body;
  const id = uuidv4();
  const act = active ? 1 : 0;
  const passHash = password ? bcrypt.hashSync(password, 8) : null;
  db.run(
    'INSERT INTO users (id, name, email, role, active, password) VALUES (?, ?, ?, ?, ?, ?)',
    [id, name || '', email || '', role || 'user', act, passHash],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get('SELECT * FROM users WHERE id = ?', [id], (err2, row) => {
        if (err2) return res.status(500).json({ error: err2.message });
        row.active = !!row.active;
        res.status(201).json(row);
      });
    }
  );
});

app.put('/api/users/:id', (req, res) => {
  const { name, email, role, active, password } = req.body;
  const act = active ? 1 : 0;
  if (password) {
    const passHash = bcrypt.hashSync(password, 8);
    db.run(
      'UPDATE users SET name = ?, email = ?, role = ?, active = ?, password = ? WHERE id = ?',
      [name || '', email || '', role || 'user', act, passHash, req.params.id],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
        db.get('SELECT * FROM users WHERE id = ?', [req.params.id], (err2, row) => {
          if (err2) return res.status(500).json({ error: err2.message });
          row.active = !!row.active;
          res.json(row);
        });
      }
    );
  } else {
    db.run(
      'UPDATE users SET name = ?, email = ?, role = ?, active = ? WHERE id = ?',
      [name || '', email || '', role || 'user', act, req.params.id],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
        db.get('SELECT * FROM users WHERE id = ?', [req.params.id], (err2, row) => {
          if (err2) return res.status(500).json({ error: err2.message });
          row.active = !!row.active;
          res.json(row);
        });
      }
    );
  }
});

app.delete('/api/users/:id', (req, res) => {
  db.run('DELETE FROM users WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  });
});

// Endpoint for changing own password (must be authenticated but any role)
function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.post('/api/change-password', verifyToken, (req, res) => {
  const { oldPassword, newPassword } = req.body || {};
  if (!oldPassword || !newPassword) return res.status(400).json({ error: 'Missing parameters' });
  const userId = req.user && req.user.id;
  db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user || !user.password) return res.status(404).json({ error: 'User not found' });
    const ok = bcrypt.compareSync(oldPassword, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const hash = bcrypt.hashSync(newPassword, 8);
    db.run('UPDATE users SET password = ? WHERE id = ?', [hash, userId], function (err2) {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ status: 'ok' });
    });
  });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
