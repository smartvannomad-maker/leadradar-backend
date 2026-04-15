const jobSourceConfigs = [
  {
    source: "greenhouse",
    label: "Stripe Greenhouse",
    config: {
      boardToken: "stripe",
    },
  },
  {
    source: "greenhouse",
    label: "Notion Greenhouse",
    config: {
      boardToken: "notion",
    },
  },
  {
    source: "lever",
    label: "Netlify Lever",
    config: {
      companyHandle: "netlify",
    },
  },
  {
    source: "lever",
    label: "Vercel Lever",
    config: {
      companyHandle: "vercel",
    },
  },
  {
    source: "ashby",
    label: "Linear Ashby",
    config: {
      organizationSlug: "linear",
    },
  },
];

export default jobSourceConfigs;