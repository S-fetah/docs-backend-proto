import { NextFunction, Request, Response } from "express";
import { pool } from "../database/database";
import { assignSchema } from "../middlewares/gradeValidator";
import z, { string } from "zod";

// get all grades :

export const getGrades = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await pool.query(`SELECT * FROM grade`);
    if (result.rowCount && result.rowCount > 0)
      res.status(200).json(result.rows);
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
    if (result.rowCount && result.rowCount > 0)
      res.status(200).json("updated!");
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

// Assign, Reassign, Unassign grade to/from users
export const getAssignedUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = z.string().min(3).safeParse(req.params.grade);
    const grade = parsed.success ? parsed.data : undefined;

    let result;
    if (grade) {
      result = await pool.query(
        `SELECT u.firstName, u.lastName, g.name AS grade_name
         FROM grade_as ga
         JOIN users u ON ga.user_id = u.id
         JOIN grade g ON ga.grade_id = g.id
         WHERE g.name = $1`,
        [grade]
      );
    } else {
      result = await pool.query(
        `SELECT u.firstName, u.lastName, g.name AS grade_name
         FROM grade_as ga
         JOIN users u ON ga.user_id = u.id
         JOIN grade g ON ga.grade_id = g.id`
      );
    }

    return res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};
export const assignGrade = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id, grade_name } = assignSchema.parse(req.body);

    const result = await pool.query(
      `
  INSERT INTO grade_as (user_id, grade_id)
  VALUES ($1, (SELECT id FROM grade WHERE name = $2))
  RETURNING *;
  `,
      [user_id, grade_name]
    );

    if (!result.rowCount) {
      return res.status(400).json({ message: "Failed to assign grade" });
    } else {
      return res.status(201).json({
        message: "Grade assigned successfully",
        grade: result.rows[0], // the inserted row ( hopefully......)
      });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};

export const reassignGrade = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id, grade_name, newGrade_name } = assignSchema.parse(req.body);

    const result = await pool.query(
      `UPDATE grade_as
       SET grade_id = (SELECT id FROM grade WHERE name = $3)
      WHERE user_id = $1 AND grade_id = $2
       RETURNING *`,
      [user_id, grade_name, newGrade_name]
    );

    if ((result.rowCount ?? 0) > 0) {
      return res.status(200).json({
        message: "Grade updated successfully",
        grade: result.rows[0], // the updated row
      });
    } else {
      return res.status(404).json({
        message: "No grade assignment found for this user",
      });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
};
export const unassignGrade = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_id, grade_name } = assignSchema.parse(req.body);

    const result = await pool.query(
      `DELETE FROM grade_as
       WHERE user_id = $1 AND grade_id = (SELECT id FROM grade WHERE name = $2)
       RETURNING *`,
      [user_id, grade_name]
    );

    if ((result.rowCount ?? 0) > 0) {
      return res.status(200).json({
        message: "Grade unassigned successfully",
        grade: result.rows[0], // the deleted row
      });
    } else {
      return res.status(404).json({
        message: "No grade assignment found for this user",
      });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
};
