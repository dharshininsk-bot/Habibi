import Database from 'better-sqlite3';
const db = new Database('habibi.db');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();
console.log('Available Tables:', tables.map(t => t.name).join(', '));
db.close();
