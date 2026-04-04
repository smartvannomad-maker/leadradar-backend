import express from "express";
import db from "../db/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT id, channel, template_key, name, subject, body, text
      FROM message_templates
      ORDER BY channel, template_key::int
      `
    );

    const whatsapp = result.rows
      .filter((row) => row.channel === "whatsapp")
      .map((row) => ({
        id: Number(row.template_key),
        name: row.name,
        text: row.text || "",
      }));

    const email = result.rows
      .filter((row) => row.channel === "email")
      .map((row) => ({
        id: Number(row.template_key),
        name: row.name,
        subject: row.subject || "",
        body: row.body || "",
      }));

    res.json({ whatsapp, email });
  } catch (error) {
    console.error("GET /api/templates failed:", error);
    res.status(500).json({ message: "Could not load templates" });
  }
});

router.put("/whatsapp/:id", async (req, res) => {
  const { id } = req.params;
  const { name, text } = req.body;

  try {
    const result = await db.query(
      `
      UPDATE message_templates
      SET name = $1,
          text = $2,
          updated_at = NOW()
      WHERE channel = 'whatsapp'
        AND template_key = $3
      RETURNING id, template_key, name, text
      `,
      [name, text, String(id)]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Template not found" });
    }

    const row = result.rows[0];

    res.json({
      id: Number(row.template_key),
      name: row.name,
      text: row.text || "",
    });
  } catch (error) {
    console.error("PUT /api/templates/whatsapp/:id failed:", error);
    res.status(500).json({ message: "Could not save WhatsApp template" });
  }
});

router.put("/email/:id", async (req, res) => {
  const { id } = req.params;
  const { name, subject, body } = req.body;

  try {
    const result = await db.query(
      `
      UPDATE message_templates
      SET name = $1,
          subject = $2,
          body = $3,
          updated_at = NOW()
      WHERE channel = 'email'
        AND template_key = $4
      RETURNING id, template_key, name, subject, body
      `,
      [name, subject, body, String(id)]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Template not found" });
    }

    const row = result.rows[0];

    res.json({
      id: Number(row.template_key),
      name: row.name,
      subject: row.subject || "",
      body: row.body || "",
    });
  } catch (error) {
    console.error("PUT /api/templates/email/:id failed:", error);
    res.status(500).json({ message: "Could not save Email template" });
  }
});

export default router;