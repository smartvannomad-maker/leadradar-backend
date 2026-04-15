import {
  searchJobsByKeyword,
  searchJobsByUrl,
  listSavedPortals,
  addSavedPortal,
  removeSavedPortal,
  removeAllSavedPortals,
} from "../services/jobLead.service.js";

export async function searchJobLeads(req, res) {
  try {
    const userId = req.user?.userId;
    const workspaceId = req.user?.workspaceId;

    if (!userId || !workspaceId) {
      return res.status(400).json({ message: "Workspace or user not resolved" });
    }

    const {
      mode = "keyword",
      keyword = "",
      url = "",
      location = "",
    } = req.body || {};

    if (mode === "url") {
      if (!String(url).trim()) {
        return res.status(400).json({ message: "URL is required for URL search." });
      }

      const results = await searchJobsByUrl({
        url: String(url).trim(),
        keyword: String(keyword || "").trim(),
        location: String(location || "").trim(),
        userId,
        workspaceId,
      });

      return res.json({
        mode: "url",
        keyword: String(keyword || "").trim(),
        location: String(location || "").trim(),
        results,
      });
    }

    if (!String(keyword).trim()) {
      return res.status(400).json({ message: "Keyword is required for keyword search." });
    }

    const results = await searchJobsByKeyword({
      keyword: String(keyword).trim(),
      location: String(location || "").trim(),
      userId,
      workspaceId,
    });

    return res.json({
      mode: "keyword",
      keyword: String(keyword).trim(),
      location: String(location || "").trim(),
      results,
    });
  } catch (error) {
    console.error("searchJobLeads error:", error);
    return res.status(500).json({
      message: error.message || "Failed to search job leads.",
    });
  }
}

export async function getSavedPortals(req, res) {
  try {
    const userId = req.user?.userId;
    const workspaceId = req.user?.workspaceId;

    if (!userId || !workspaceId) {
      return res.status(400).json({ message: "Workspace or user not resolved" });
    }

    const portals = await listSavedPortals({ userId, workspaceId });
    return res.json({ portals });
  } catch (error) {
    console.error("getSavedPortals error:", error);
    return res.status(500).json({
      message: error.message || "Failed to load saved portals.",
    });
  }
}

export async function createSavedPortal(req, res) {
  try {
    const userId = req.user?.userId;
    const workspaceId = req.user?.workspaceId;

    if (!userId || !workspaceId) {
      return res.status(400).json({ message: "Workspace or user not resolved" });
    }

    const { name, url, source } = req.body || {};

    if (!String(name || "").trim()) {
      return res.status(400).json({ message: "Portal name is required." });
    }

    if (!String(url || "").trim()) {
      return res.status(400).json({ message: "Portal URL is required." });
    }

    const portal = await addSavedPortal({
      userId,
      workspaceId,
      name: String(name).trim(),
      url: String(url).trim(),
      source: String(source || "Custom").trim(),
    });

    return res.status(201).json({
      message: "Portal saved successfully.",
      portal,
    });
  } catch (error) {
    console.error("createSavedPortal error:", error);
    return res.status(500).json({
      message: error.message || "Failed to save portal.",
    });
  }
}

export async function deleteSavedPortal(req, res) {
  try {
    const userId = req.user?.userId;
    const workspaceId = req.user?.workspaceId;
    const { id } = req.params;

    if (!userId || !workspaceId) {
      return res.status(400).json({ message: "Workspace or user not resolved" });
    }

    await removeSavedPortal({
      id,
      userId,
      workspaceId,
    });

    return res.json({ message: "Portal deleted successfully." });
  } catch (error) {
    console.error("deleteSavedPortal error:", error);
    return res.status(500).json({
      message: error.message || "Failed to delete portal.",
    });
  }
}

export async function deleteAllSavedPortals(req, res) {
  try {
    const userId = req.user?.userId;
    const workspaceId = req.user?.workspaceId;

    if (!userId || !workspaceId) {
      return res.status(400).json({ message: "Workspace or user not resolved" });
    }

    await removeAllSavedPortals({ userId, workspaceId });

    return res.json({ message: "All saved portals deleted successfully." });
  } catch (error) {
    console.error("deleteAllSavedPortals error:", error);
    return res.status(500).json({
      message: error.message || "Failed to delete all portals.",
    });
  }
}