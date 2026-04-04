import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET;

export function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      workspaceId: user.workspaceId,
      workspaceRole: user.workspaceRole,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
}

export function signRefreshToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      workspaceId: user.workspaceId,
      workspaceRole: user.workspaceRole,
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
}