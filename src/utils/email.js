import sgMail from "@sendgrid/mail";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function sendWorkspaceInviteEmail({
  toEmail,
  invitedByEmail,
  workspaceName,
  role,
}) {
  if (!SENDGRID_API_KEY) {
    throw new Error("SENDGRID_API_KEY is not configured");
  }

  if (!SENDGRID_FROM_EMAIL) {
    throw new Error("SENDGRID_FROM_EMAIL is not configured");
  }

  const signupUrl = `${FRONTEND_URL}/signup?email=${encodeURIComponent(toEmail)}`;

  const msg = {
    to: toEmail,
    from: SENDGRID_FROM_EMAIL,
    subject: `You’ve been invited to join ${workspaceName} on LeadRadar`,
    text: [
      `You’ve been invited to join ${workspaceName} on LeadRadar.`,
      ``,
      `Role: ${role}`,
      `Invited by: ${invitedByEmail}`,
      ``,
      `Create your account here: ${signupUrl}`,
      ``,
      `If you already have an account with this email, log in using your existing credentials.`,
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
        <h2 style="margin-bottom: 8px;">You’ve been invited to LeadRadar</h2>
        <p style="margin-top: 0;">
          <strong>${escapeHtml(invitedByEmail)}</strong> invited you to join
          <strong>${escapeHtml(workspaceName)}</strong>.
        </p>

        <div style="margin: 16px 0; padding: 14px; border: 1px solid #e2e8f0; border-radius: 12px; background: #f8fafc;">
          <div><strong>Workspace:</strong> ${escapeHtml(workspaceName)}</div>
          <div><strong>Role:</strong> ${escapeHtml(role)}</div>
        </div>

        <p>Click below to create your account and join the workspace:</p>

        <p style="margin: 24px 0;">
          <a
            href="${signupUrl}"
            style="
              display: inline-block;
              padding: 12px 18px;
              border-radius: 12px;
              background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
              color: #ffffff;
              text-decoration: none;
              font-weight: 700;
            "
          >
            Accept Invite
          </a>
        </p>

        <p style="font-size: 14px; color: #475569;">
          Or copy and paste this link into your browser:
        </p>
        <p style="font-size: 14px; color: #2563eb; word-break: break-all;">
          ${signupUrl}
        </p>
      </div>
    `,
  };

  await sgMail.send(msg);
}