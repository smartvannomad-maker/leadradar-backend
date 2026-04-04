import express from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import db from "../db/knex.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const email = (req.body?.email || "").trim().toLowerCase();
    const password = req.body?.password || "";

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await db("users").where({ email }).first();

    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const invite = await db("workspace_invites")
      .where({
        email,
        status: "pending",
      })
      .orderBy("created_at", "desc")
      .first();

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    let safeUser;

    await db.transaction(async (trx) => {
      if (invite) {
        await trx("users").insert({
          id: userId,
          email,
          password_hash: passwordHash,
          role: "user",
          workspace_id: invite.workspace_id,
          workspace_role: invite.role || "member",
          created_at: new Date(),
          updated_at: new Date(),
        });

        await trx("workspace_invites")
          .where({ id: invite.id })
          .update({
            status: "accepted",
            accepted_at: new Date(),
          });

        safeUser = {
          id: userId,
          email,
          role: "user",
          workspaceId: invite.workspace_id,
          workspaceRole: invite.role || "member",
        };
      } else {
        const workspaceId = uuidv4();
        const workspaceName = email.split("@")[0] || "My Workspace";

        await trx("workspaces").insert({
          id: workspaceId,
          name: workspaceName,
          created_at: new Date(),
          updated_at: new Date(),
        });

        await trx("users").insert({
          id: userId,
          email,
          password_hash: passwordHash,
          role: "user",
          workspace_id: workspaceId,
          workspace_role: "owner",
          created_at: new Date(),
          updated_at: new Date(),
        });

        safeUser = {
          id: userId,
          email,
          role: "user",
          workspaceId,
          workspaceRole: "owner",
        };
      }
    });

    const accessToken = signAccessToken(safeUser);
    const refreshToken = signRefreshToken(safeUser);

    await db("refresh_tokens").insert({
      id: uuidv4(),
      user_id: safeUser.id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      created_at: new Date(),
    });

    return res.status(201).json({
      user: safeUser,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("POST /api/auth/register error:", error);
    return res.status(500).json({ message: "Failed to register user" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = (req.body?.email || "").trim().toLowerCase();
    const password = req.body?.password || "";

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await db("users").where({ email }).first();

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      workspaceId: user.workspace_id,
      workspaceRole: user.workspace_role || "member",
    };

    const accessToken = signAccessToken(safeUser);
    const refreshToken = signRefreshToken(safeUser);

    await db("refresh_tokens").insert({
      id: uuidv4(),
      user_id: user.id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      created_at: new Date(),
    });

    return res.json({
      user: safeUser,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return res.status(500).json({ message: "Failed to login" });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const refreshToken = req.body?.refreshToken || "";

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const savedToken = await db("refresh_tokens")
      .where({ token: refreshToken, user_id: payload.sub })
      .first();

    if (!savedToken) {
      return res.status(401).json({ message: "Refresh token not recognized" });
    }

    if (new Date(savedToken.expires_at) < new Date()) {
      await db("refresh_tokens").where({ id: savedToken.id }).del();
      return res.status(401).json({ message: "Refresh token expired" });
    }

    const user = await db("users").where({ id: payload.sub }).first();

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      workspaceId: user.workspace_id,
      workspaceRole: user.workspace_role || "member",
    };

    const newAccessToken = signAccessToken(safeUser);

    return res.json({
      user: safeUser,
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("POST /api/auth/refresh error:", error);
    return res.status(500).json({ message: "Failed to refresh token" });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const refreshToken = req.body?.refreshToken || "";

    if (refreshToken) {
      await db("refresh_tokens").where({ token: refreshToken }).del();
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("POST /api/auth/logout error:", error);
    return res.status(500).json({ message: "Failed to logout" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await db("users")
      .select("id", "email", "role", "workspace_id", "workspace_role")
      .where({ id: req.user.id })
      .first();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        workspaceId: user.workspace_id,
        workspaceRole: user.workspace_role || "member",
      },
    });
  } catch (error) {
    console.error("GET /api/auth/me error:", error);
    return res.status(500).json({ message: "Failed to load user" });
  }
});

export default router;