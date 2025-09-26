import { NextFunction, Request, Response } from "express";
import { pool } from "../database/database";

// get all Permissions :

export const getPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await pool.query(`SELECT * FROM permission`);
    if (result) res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const addPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO permission (name) Values ($1) RETURNING *`,
      [name]
    );
    if (result) res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json(error);
  }
};
export const updatePermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { perm, newName } = req.body;
    if (!perm || !newName)
      res.status(400).json("Invalid inputs or missing inputs");
    const result = await pool.query(
      `UPDATE permission 
    SET name = $1
    WHERE name = $2 
    RETURNING *`,
      [newName, perm]
    );
    if (result) res.status(200).json("updated!");
  } catch (error) {
    res.status(400).json(error);
  }
};
export const deletePermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { permission } = req.body;
    const result = await pool.query(
      `DELETE FROM permission 
      WHERE name = $1 RETURNING *`,
      [permission]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Permission not found" });
    }

    res.json({
      message: "Permission deleted successfully",
      deleted: result.rows[0],
    });
  } catch (error) {
    res.status(400).json(error);
  }
};
