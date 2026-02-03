const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const dbPath = path.join(__dirname, 'users.db');
const db = new sqlite3.Database(dbPath);

// Create table (password column may be added later) and seed some users if table empty
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT,
      role TEXT,
      active INTEGER
    )
  `);

  // Ensure password column exists (add it if missing) and then seed only after schema is ready
  db.all("PRAGMA table_info(users)", (err, cols) => {
    if (err) {
      console.error('Error reading table info', err);
      return;
    }
    const hasPassword = cols && cols.some(c => c.name === 'password');

    function seedIfEmpty() {
      db.get('SELECT COUNT(1) as c FROM users', (err, row) => {
        if (err) {
          console.error('Error counting users', err);
          return;
        }
        if (!row || row.c === 0) {
          const stmt = db.prepare('INSERT INTO users (id, name, email, role, active, password) VALUES (?, ?, ?, ?, ?, ?)');
          const now = Date.now();
          // `adminpass` for Alice (admin), `userpass` for others (simple defaults for dev)
          const alicePass = bcrypt.hashSync('adminpass', 8);
          const userPass = bcrypt.hashSync('userpass', 8);
          stmt.run(`u-${now}-1`, 'Alice', 'alice@example.com', 'admin', 1, alicePass);
          stmt.run(`u-${now}-2`, 'Bob', 'bob@example.com', 'user', 1, userPass);
          stmt.run(`u-${now}-3`, 'Charlie', 'charlie@example.com', 'user', 0, userPass);
          stmt.finalize();
          console.log('Seeded users with default passwords');
        }
      });
    }

    if (!hasPassword) {
      db.run('ALTER TABLE users ADD COLUMN password TEXT', (err2) => {
        if (err2) {
          // If the alter fails for any reason, log and still attempt to seed (will fail if column really missing)
          console.error('Failed to add password column', err2);
        } else {
          console.log('Added password column to users table');
        }
        // seed after alter attempt completes
        seedIfEmpty();
      });
    } else {
      // already has column, seed immediately
      seedIfEmpty();
    }
  });
});

module.exports = db;
