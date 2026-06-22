import mysql, { Pool, PoolConnection, RowDataPacket } from "mysql2/promise";
import { env } from "./env.js";

let pool: Pool | undefined;

export const getPool = (): Pool => {
  if (!pool) {
    pool = mysql.createPool({
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      connectionLimit: 10,
      decimalNumbers: true,
      namedPlaceholders: false
    });
  }

  return pool;
};

export const query = async <T = RowDataPacket[]>(
  sql: string,
  params: unknown[] = []
): Promise<T> => {
  const [rows] = await getPool().query(sql, params);
  return rows as T;
};

export const execute = async (sql: string, params: unknown[] = []) => {
  const [result] = await getPool().execute(sql, params as any[]);
  return result;
};

export const withTransaction = async <T>(
  callback: (connection: PoolConnection) => Promise<T>
): Promise<T> => {
  const connection = await getPool().getConnection();

  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
