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
    EUR: process.env.STRIPE_PRICE_START