import express from "express";
import Stripe from "stripe";
import db from "../db/knex.js";

const router = express.Router();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE || "";

async function activateWorkspace({
  workspaceId,
  planKey,
  billingProvider,
  providerCustomerId = null,
  providerSubscriptionId = null,
}) {
  if (!workspaceId || !planKey) return;

  await db("workspaces")
    .where({ id: workspaceId })
    .update({
      plan: planKey,
      subscription_status: "active",
      billing_provider: billingProvider || null,
      provider_customer_id: providerCustomerId,
      provider_subscription_id: providerSubscriptionId,
      updated_at: new Date(),
    });
}

function getPayfastSignatureString(data, passphrase = "") {
  const filtered = Object.entries(data)
    .filter(([key, value]) => key !== "signature" && value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value).trim()).replace(/%20/g, "+")}`)
    .join("&");

  if (!passphrase) {
    return filtered;
  }

  return `${filtered}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`;
}

async function verifyPayfastITNBasic(payload) {
  const crypto = await import("node:crypto");
  const signature = String(payload?.signature || "");
  if (!signature) return false;

  const signatureString = getPayfastSignatureString(payload, PAYFAST_PASSPHRASE);
  const generated = crypto.createHash("md5").update(signatureString).digest("hex");

  return generated === signature;
}

router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      if (!stripe || !stripeWebhookSecret) {
        return res.status(500).send("Stripe webhook not configured");
      }

      const signature = req.headers["stripe-signature"];
      if (!signature) {
        return res.status(400).send("Missing Stripe signature");
      }

      const event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        stripeWebhookSecret
      );

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        const workspaceId =
          session?.metadata?.workspaceId ||
          session?.client_reference_id ||
          "";
        const planKey = session?.metadata?.planKey || "";
        const customerId =
          typeof session.customer === "string" ? session.customer : null;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : null;

        await activateWorkspace({
          workspaceId,
          planKey,
          billingProvider: "stripe",
          providerCustomerId: customerId,
          providerSubscriptionId: subscriptionId,
        });
      }

      if (
        event.type === "customer.subscription.deleted" ||
        event.type === "customer.subscription.updated"
      ) {
        const subscription = event.data.object;
        const workspaceId = subscription?.metadata?.workspaceId || "";
        const status = subscription?.status || "";

        if (workspaceId) {
          if (status === "active" || status === "trialing") {
            await db("workspaces")
              .where({ id: workspaceId })
              .update({
                subscription_status: "active",
                updated_at: new Date(),
              });
          } else if (
            ["canceled", "unpaid", "past_due", "incomplete_expired"].includes(
              status
            )
          ) {
            await db("workspaces")
              .where({ id: workspaceId })
              .update({
                subscription_status: "expired",
                updated_at: new Date(),
              });
          }
        }
      }

      return res.json({ received: true });
    } catch (error) {
      console.error("Stripe webhook error:", error);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
);

router.post(
  "/payfast",
  express.urlencoded({ extended: false }),
  async (req, res) => {
    try {
      // Respond quickly; Payfast retries failed ITNs.
      res.status(200).send("OK");

      const payload = { ...req.body };
      const paymentStatus = String(payload?.payment_status || "").toUpperCase();
      const workspaceId = String(payload?.custom_str2 || "").trim();
      const planKey = String(payload?.custom_str3 || "").trim().toLowerCase();
      const pfPaymentId = String(payload?.pf_payment_id || "").trim();

      const signatureValid = await verifyPayfastITNBasic(payload);
      if (!signatureValid) {
        console.error("Payfast ITN invalid signature");
        return;
      }

      // MVP:
      // For production, also validate source IP and amount against your expected order
      // as Payfast recommends.
      if (paymentStatus === "COMPLETE" && workspaceId && planKey) {
        await activateWorkspace({
          workspaceId,
          planKey,
          billingProvider: "payfast",
          providerCustomerId: null,
          providerSubscriptionId: pfPaymentId || null,
        });
      }
    } catch (error) {
      console.error("Payfast IPN error:", error);
    }
  }
);

export default router;