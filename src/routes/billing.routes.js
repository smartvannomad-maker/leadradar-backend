import express from "express";
import Stripe from "stripe";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

const FRONTEND_URL =
  (process.env.FRONTEND_URL || "https://leadradarr.netlify.app").replace(/\/+$/, "");

const API_BASE_URL =
  (process.env.API_BASE_URL ||
    "https://leadradar-backend-oziv.onrender.com").replace(/\/+$/, "");

const STRIPE_PRICES = {
  starter: {
    EUR: process.env.STRIPE_PRICE_STARTER_EUR || "price_starter_eur",
  },
  pro: {
    EUR: process.env.STRIPE_PRICE_PRO_EUR || "price_pro_eur",
  },
  premium: {
    EUR: process.env.STRIPE_PRICE_PREMIUM_EUR || "price_premium_eur",
  },
};

const PAYFAST_MODE = (process.env.PAYFAST_MODE || "sandbox").toLowerCase();
const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID || "";
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY || "";
const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE || "";
const PAYFAST_BASE_URL =
  PAYFAST_MODE === "live"
    ? "https://www.payfast.co.za/eng/process"
    : "https://sandbox.payfast.co.za/eng/process";

const PLAN_DETAILS = {
  starter: {
    title: "Starter",
    EUR: 9,
    ZAR: 199,
  },
  pro: {
    title: "Pro",
    EUR: 19,
    ZAR: 499,
  },
  premium: {
    title: "Premium",
    EUR: 49,
    ZAR: 1299,
  },
};

function getPlan(planKey) {
  return PLAN_DETAILS[planKey] || null;
}

function buildStripeSuccessUrl(planKey, currency) {
  const url = new URL(`${FRONTEND_URL}/dashboard/overview`);
  url.searchParams.set("success", "true");
  url.searchParams.set("plan", planKey);
  url.searchParams.set("currency", currency);
  return url.toString();
}

function buildStripeCancelUrl(planKey, currency) {
  const url = new URL(`${FRONTEND_URL}/dashboard/billing`);
  url.searchParams.set("cancel", "true");
  url.searchParams.set("plan", planKey);
  url.searchParams.set("currency", currency);
  return url.toString();
}

function buildPayfastUrl({ planKey, amount, req }) {
  const plan = getPlan(planKey);

  const returnUrl = new URL(`${FRONTEND_URL}/dashboard/overview`);
  returnUrl.searchParams.set("success", "true");
  returnUrl.searchParams.set("provider", "payfast");
  returnUrl.searchParams.set("plan", planKey);

  const cancelUrl = new URL(`${FRONTEND_URL}/dashboard/billing`);
  cancelUrl.searchParams.set("cancel", "true");
  cancelUrl.searchParams.set("provider", "payfast");
  cancelUrl.searchParams.set("plan", planKey);

  const notifyUrl = `${API_BASE_URL}/api/billing/webhooks/payfast`;

  const params = new URLSearchParams({
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: returnUrl.toString(),
    cancel_url: cancelUrl.toString(),
    notify_url: notifyUrl,
    name_first: "LeadRadar",
    name_last: "Customer",
    email_address: req.user.email || "",
    m_payment_id: `${req.user.workspaceId}:${planKey}:${Date.now()}`,
    amount: String(amount.toFixed(2)),
    item_name: `LeadRadar ${plan?.title || planKey}`,
    item_description: `${plan?.title || planKey} payment`,
    custom_str1: req.user.userId || "",
    custom_str2: req.user.workspaceId || "",
    custom_str3: planKey,
  });

  if (PAYFAST_MODE === "live") {
    params.set("subscription_type", "1");
    params.set("billing_date", new Date().toISOString().slice(0, 10));
    params.set("recurring_amount", String(amount.toFixed(2)));
    params.set("frequency", "3");
    params.set("cycles", "0");
  }

  if (PAYFAST_PASSPHRASE) {
    params.set("passphrase", PAYFAST_PASSPHRASE);
  }

  return `${PAYFAST_BASE_URL}?${params.toString()}`;
}

router.post("/checkout", requireAuth, async (req, res) => {
  try {
    const planKey = String(req.body?.planKey || "").trim().toLowerCase();
    const currency = String(req.body?.currency || "").trim().toUpperCase();

    if (!planKey || !currency) {
      return res.status(400).json({ message: "Missing plan or currency" });
    }

    const plan = getPlan(planKey);

    if (!plan) {
      return res.status(400).json({ message: "Invalid plan selected" });
    }

    if (!["EUR", "ZAR"].includes(currency)) {
      return res.status(400).json({ message: "Unsupported currency" });
    }

    if (currency === "EUR") {
      if (!stripe) {
        return res.status(500).json({
          message: "Stripe is not configured on the server",
        });
      }

      const priceId = STRIPE_PRICES[planKey]?.EUR;

      if (
        !priceId ||
        priceId === "price_starter_eur" ||
        priceId === "price_pro_eur" ||
        priceId === "price_premium_eur"
      ) {
        return res.status(500).json({
          message: "Stripe price IDs are not configured yet",
        });
      }

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: buildStripeSuccessUrl(planKey, currency),
        cancel_url: buildStripeCancelUrl(planKey, currency),
        client_reference_id: req.user.workspaceId,
        customer_email: req.user.email || undefined,
        metadata: {
          userId: req.user.userId || "",
          workspaceId: req.user.workspaceId || "",
          planKey,
          currency,
          billingProvider: "stripe",
        },
        subscription_data: {
          metadata: {
            userId: req.user.userId || "",
            workspaceId: req.user.workspaceId || "",
            planKey,
            currency,
            billingProvider: "stripe",
          },
        },
      });

      return res.json({
        provider: "stripe",
        url: session.url,
      });
    }

    if (currency === "ZAR") {
      if (!PAYFAST_MERCHANT_ID || !PAYFAST_MERCHANT_KEY) {
        return res.status(500).json({
          message: "Payfast merchant settings are not configured yet",
        });
      }

      const amount = Number(plan.ZAR || 0);
      const url = buildPayfastUrl({ planKey, amount, req });

      return res.json({
        provider: "payfast",
        url,
      });
    }

    return res.status(400).json({ message: "Unsupported currency" });
  } catch (error) {
    console.error("Checkout error:", error);
    return res.status(500).json({
      message: error.message || "Checkout failed",
    });
  }
});

export default router;