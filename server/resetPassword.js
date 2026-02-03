const db = require('./db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const [,, email, password, name = null, role = 'admin'] = process.argv;

if (!email || !password) {
  console.log('Usage: node resetPassword.js <email> <password> [name] [role]');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 8);

// Ensure table has password column (db.js should have done this, but double-check)
db.get("PRAGMA table_info(users)", (err) => {
  if (err) {
    console.error('DB error:', err.message || err);
    process.exit(1);
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err2, row) => {
    if (err2) {
      console.error('DB error:', err2.message || err2);
      process.exit(1);
    }

    if (row) {
      db.run('UPDATE users SET password = ? WHERE email = ?', [hash, email], function (uerr) {
        if (uerr) {
          console.error('Failed to update password:', uerr.message || uerr);
          process.exit(1);
        }
        console.log(`Updated password for ${email}`);
        process.exit(0);
      });
    } else {
      const id = uuidv4();
      const nm = name || email.split('@')[0];
      const active = 1;
      db.run('INSERT INTO users (id, name, email, role, active, password) VALUES (?, ?, ?, ?, ?, ?)', [id, nm, email, role, active, hash], function (ierr) {
        if (ierr) {
          console.error('Failed to create user:', ierr.message || ierr);
          process.exit(1);
        }
        console.log(`Created user ${email} (role=${role}) with id ${id}`);
        process.exit(0);
      });
    }
  });
});
