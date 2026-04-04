import { verifyAccessToken } from "../utils/jwt.js";

export function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      workspaceId: payload.workspaceId,
      workspaceRole: payload.workspaceRole || "member",
    };

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}