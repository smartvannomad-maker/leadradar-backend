const TECH_KEYWORDS = [
  "react",
  "react native",
  "node",
  "node.js",
  "javascript",
  "typescript",
  "next.js",
  "vue",
  "angular",
  "python",
  "django",
  "flask",
  "java",
  "spring",
  "php",
  "laravel",
  "postgresql",
  "mysql",
  "mongodb",
  "aws",
  "azure",
  "gcp",
  "docker",
  "kubernetes",
  "graphql",
  "rest api",
  "firebase",
  "redux",
  "tailwind",
];

function normalizeText(value = "") {
  return String(value || "").toLowerCase().trim();
}

export function extractTechStack(text = "") {
  const input = normalizeText(text);
  return TECH_KEYWORDS.filter((keyword) => input.includes(keyword));
}

export function detectWorkModel(text = "") {
  const input = normalizeText(text);

  if (input.includes("remote")) return "remote";
  if (input.includes("hybrid")) return "hybrid";
  if (
    input.includes("on-site") ||
    input.includes("onsite") ||
    input.includes("office")
  ) {
    return "onsite";
  }

  return null;
}

export function detectEmploymentType(text = "") {
  const input = normalizeText(text);

  if (input.includes("full-time")) return "full-time";
  if (input.includes("part-time")) return "part-time";
  if (input.includes("contract")) return "contract";
  if (input.includes("freelance")) return "freelance";
  if (input.includes("temporary")) return "temporary";

  return null;
}

export function extractHiringSignals({ title = "", description = "" }) {
  const input = `${title} ${description}`.toLowerCase();

  return {
    urgent: /urgent|urgently|immediate|asap/.test(input),
    senior: /senior|lead|principal|staff/.test(input),
    startup: /startup|fast-paced|scale|scaling/.test(input),
    remote: /remote/.test(input),
    hiring_multiple: /multiple|several|team growth|growing team/.test(input),
    product_build: /build|launch|greenfield|new product/.test(input),
  };
}

export function calculateLeadScore({
  signals = {},
  techStack = [],
  hasEmail = false,
  hasDecisionMaker = false,
  website = "",
}) {
  let score = 0;

  if (signals.urgent) score += 20;
  if (signals.startup) score += 15;
  if (signals.hiring_multiple) score += 15;
  if (signals.product_build) score += 15;
  if (signals.remote) score += 5;
  if (signals.senior) score += 5;

  score += Math.min((techStack || []).length * 4, 20);

  if (hasEmail) score += 10;
  if (hasDecisionMaker) score += 10;
  if (website) score += 5;

  return Math.min(score, 100);
}