import pool from "../config/database";
import { User } from "../models/auth.model";

export const findUserByEmail = async (email: string): Promise<User | null> => {
    const [rows]: any = await pool.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows.length > 0 ? rows[0] : null;
};    

export const create = async (email: string, hashedPassword: string): Promise<User> => {
    const [result]: any = await pool.execute(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hashedPassword]
    );
    const id = result.insertId;
    return { id, email, password: hashedPassword };

};
