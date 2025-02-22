//
// server/app/configs/db.config.js

import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_APP_USER,
  password: process.env.DB_APP_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const query = async (sql, params, connection = null) => {
  const conn = connection || (await pool.getConnection());
  try {
    const [results] = await conn.query(sql, params);
    return results;
  } catch (error) {
    throw error;
  } finally {
    if (!connection) conn.release();
  }
};

export const getConnection = async () => {
  return await pool.getConnection();
};

// Graceful shutdown for pool connections
process.on("SIGINT", async () => {
  console.log("Closing apps database pool...");
  await pool.end();
  process.exit(0);
});
