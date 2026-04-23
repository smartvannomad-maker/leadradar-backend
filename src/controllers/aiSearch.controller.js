import { runAISearch } from "../services/aiSearch.service.js";

export async function runAISearchController(req, res) {
  try {
    const { query, filters } = req.body;
    const user = req.user;

    if (!query || !String(query).trim()) {
      return res.status(400).json({
        message: "Query is required",
      });
    }

    const result = await runAISearch({
      query: String(query).trim(),
      filters: filters || {},
      user,
    });

    return res.json(result);
  } catch (error) {
    console.error("❌ AI search error:", error);

    return res.status(500).json({
      message: error.message || "AI search failed",
    });
  }
}