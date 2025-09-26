import { NextFunction, Request, Response } from "express";
import { pool } from "../database/database";

// get all grades :

export const getGrades = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await pool.query(`SELECT * FROM grade`);
    if (result) res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const addGrade = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO grade (name) Values ($1) RETURNING *`,
      [name]
    );
    if (result) res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json(error);
  }
};
export const updateGrade = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { grade, newName } = req.body;
    if (!grade || !newName)
      res.status(400).json("Invalid inputs or missing inputs");
    const result = await pool.query(
      `UPDATE grade 
    SET name = $1
    WHERE name = $2 
    RETURNING *`,
      [newName, grade]
    );
    if (result) res.status(200).json("updated!");
  } catch (error) {
    res.status(400).json(error);
  }
};
export const deleteGrade = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    const result = await pool.query(
      `DELETE FROM grade 
      WHERE name = $1 RETURNING *`,
      [name]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "grade not found" });
    }

    res.json({
      message: "grade deleted successfully",
      deleted: result.rows[0],
    });
  } catch (error) {
    res.status(400).json(error);
  }
};
