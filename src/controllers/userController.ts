import { Request, Response, NextFunction } from "express";

import { pool } from "../database/database";
import { user } from "../models/items";
export const addUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data: user = req.body;

  try {
    const added = await pool.query(
      `INSERT INTO users (firstName, lastName, email, password)
      VALUES ($1, $2, $3, $4) RETURNING *`,
      [data.firstName, data.lastName, data.email, data.password]
    );
    if (added) res.status(201).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName, lastName, email, password } = req.body;
  const id = req.params.id;
  if (!firstName && !lastName && !email && !password) {
    return res.status(400).json({ message: "at least one field is required" });
  }
  try {
    const updatedUser: Record<string, string> = {};

    if (firstName) updatedUser.firstName = firstName;
    if (lastName) updatedUser.lastName = lastName;
    if (email) updatedUser.email = email;
    if (password) updatedUser.password = password;

    console.log(updatedUser);

    const setClause = Object.keys(updatedUser)
      .map((key, idx) => `${key} = $${idx + 1}`)
      .join(", ");

    console.log(setClause);

    const values = Object.values(updatedUser);

    const query = `
      UPDATE users 
      SET ${setClause} 
      WHERE id = $${id}
      RETURNING *;
    `;

    const result = await pool.query(query, [...values, id]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server error" });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  if (!id) res.status(400).json("invalid id");
  try {
    const deleted = await pool.query(`DELETE FROM users WHERE id = ${id}`);
    if (deleted) res.status(200).json(deleted);
  } catch (error) {
    res.status(400).json("User Not Found! " + error);
  }
};
