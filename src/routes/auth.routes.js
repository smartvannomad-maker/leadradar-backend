import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import knex from "../db/knex.js";

const router = express.Router();

function signAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await knex("users")
      .whereRaw("LOWER(email) = LOWER(?)", [cleanEmail])
      .first();

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const insertedUsers = await knex("users")
      .insert({
        email: cleanEmail,
        password_hash: passwordHash,
      })
      .returning("*");

    const user = insertedUsers[0];

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
    });

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
      },
      accessToken,
    });
  } catch (error) {
    console.error("Register error:", error);
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await knex("users")
      .whereRaw("LOWER(email) = LOWER(?)", [cleanEmail])
      .first();

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const passwordOk = await bcrypt.compare(password, user.password_hash);

    if (!passwordOk) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
    });

    return res.json({
      user: {
        id: user.id,
        email: user.email,
      },
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
});

export default router;