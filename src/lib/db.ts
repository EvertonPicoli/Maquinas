import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  password: 'SsCcvySSBfEtnnpaWs05eCVJf7jiMpjuZLD8m2NXH1ZKRE6YlTUwIDJFNbvP5VPZ',
  host: 'fcggo88wsccogccccw0ss0ss',
  port: 5432,
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

export const query = async (text: string, params?: any[]) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

export const getClient = async () => {
  const client = await pool.connect();
  return client;
};

export default pool;