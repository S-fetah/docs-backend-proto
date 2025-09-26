import { Request, Response, NextFunction } from "express";

export const valUser = (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (firstName.length < 3 || lastName.length < 3) {
    return res
      .status(400)
      .json({ message: "Name must be at least 3 characters long" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Email must be valid" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  next();
};
