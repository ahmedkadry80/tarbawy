import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: process.env.DB_HOST || 'mysql-1bcf5405-eng-4485.h.aivencloud.com',
  user: process.env.DB_USER || 'avnadmin',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'tarbawy',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
