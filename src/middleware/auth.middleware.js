import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      console.log("AUTH FAIL: no bearer token");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("AUTH OK:", decoded);

    req.user = decoded;
    return next();
  } catch (error) {
    console.log("AUTH FAIL:", error.name, error.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
}