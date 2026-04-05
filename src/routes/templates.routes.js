import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

/**
 * Temporary in-code template store
 * --------------------------------
 * Your previous route expected a message_templates table, but that table
 * is not part of the new clean migration set, so DB queries against it
 * will fail until you add that schema back. This replacement keeps the
 * API working for now using in-memory defaults.
 *
 * IMPORTANT:
 * - Changes made with PUT will only persist until the server restarts.
 * - Later, we can move this into PostgreSQL with a proper migration.
 */

const templateStore = {
  whatsapp: [
    {
      id: 1,
      name: "Intro",
      text: "Hi {{name}}, I came across your business and thought LeadRadar could help you organise and track outreach more effectively.",
    },
    {
      id: 2,
      name: "Follow Up",
      text: "Hi {{name}}, just following up on my previous message. Let me know if you'd like a quick overview.",
    },
    {
      id: 3,
      name: "Quote Follow Up",
      text: "Hi {{name}}, I wanted to check whether you had time to review the quote and whether you have any questions.",
    },
  ],
  email: [
    {
      id: 1,
      name: "Cold Outreach",
      subject: "A simple way to manage your outreach",
      body: `Hi {{name}},

I hope you're well.

I wanted to reach out because I believe LeadRadar could help your business manage leads, follow-ups, and outreach in a much more organised way.

If you're open to it, I’d be happy to share a quick overview.

Kind regards,
{{senderName}}`,
    },
    {
      id: 2,
      name: "Follow Up",
      subject: "Following up on my previous email",
      body: `Hi {{name}},

Just following up on my previous message.

I’d be happy to show you how LeadRadar can help simplify your lead management and outreach process.

Kind regards,
{{senderName}}`,
    },
    {
      id: 3,
      name: "Quote Follow Up",
      subject: "Checking in on the quote",
      body: `Hi {{name}},

I just wanted to follow up regarding the quote I sent.

Please let me know if you have any questions or if you'd like to discuss the next steps.

Kind regards,
{{senderName}}`,
    },
  ],
};

function cloneTemplates() {
  return {
    whatsapp: templateStore.whatsapp.map((item) => ({ ...item })),
    email: templateStore.email.map((item) => ({ ...item })),
  };
}

router.get("/", async (req, res) => {
  try {
    const templates = cloneTemplates();

    return res.json({
      whatsapp: templates.whatsapp,
      email: templates.email,
    });
  } catch (error) {
    console.error("GET /api/templates failed:", error);
    return res.status(500).json({ message: "Could not load templates" });
  }
});

router.put("/whatsapp/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, text } = req.body || {};

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid template id" });
    }

    const index = templateStore.whatsapp.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Template not found" });
    }

    if (typeof name !== "string" || typeof text !== "string") {
      return res.status(400).json({
        message: "Both name and text are required",
      });
    }

    templateStore.whatsapp[index] = {
      ...templateStore.whatsapp[index],
      name: name.trim(),
      text: text.trim(),
    };

    return res.json(templateStore.whatsapp[index]);
  } catch (error) {
    console.error("PUT /api/templates/whatsapp/:id failed:", error);
    return res.status(500).json({ message: "Could not save WhatsApp template" });
  }
});

router.put("/email/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, subject, body } = req.body || {};

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid template id" });
    }

    const index = templateStore.email.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Template not found" });
    }

    if (
      typeof name !== "string" ||
      typeof subject !== "string" ||
      typeof body !== "string"
    ) {
      return res.status(400).json({
        message: "Name, subject, and body are required",
      });
    }

    templateStore.email[index] = {
      ...templateStore.email[index],
      name: name.trim(),
      subject: subject.trim(),
      body: body.trim(),
    };

    return res.json(templateStore.email[index]);
  } catch (error) {
    console.error("PUT /api/templates/email/:id failed:", error);
    return res.status(500).json({ message: "Could not save Email template" });
  }
});

export default router;