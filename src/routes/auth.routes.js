import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import knex from "../db/knex.js";
import { v4 as uuidv4 } from "uuid";

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
    const workspaceId = uuidv4();

    const user = await knex.transaction(async (trx) => {
      await trx("workspaces").insert({
        id: workspaceId,
        name: cleanEmail,
        plan: "starter",
        subscription_status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      });

      const insertedUsers = await trx("users")
        .insert({
          email: cleanEmail,
          password_hash: passwordHash,
          workspace_id: workspaceId,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning("*");

      const newUser = insertedUsers[0];

      await trx("workspace_members").insert({
        id: uuidv4(),
        workspace_id: workspaceId,
        user_id: newUser.id,
        role: "owner",
        created_at: new Date(),
        updated_at: new Date(),
      });

      return newUser;
    });

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      workspaceId: user.workspace_id,
    });

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        workspaceId: user.workspace_id,
      },
      workspace: {
        id: user.workspace_id,
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
      workspaceId: user.workspace_id,
    });

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        workspaceId: user.workspace_id,
      },
      workspace: {
        id: user.workspace_id,
      },
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
});

export default router;