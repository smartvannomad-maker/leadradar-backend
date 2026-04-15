import { fetchGreenhouseJobs } from "./jobFetchers/greenhouse.fetcher.js";
import { fetchLeverJobs } from "./jobFetchers/lever.fetcher.js";
import { fetchAshbyJobs } from "./jobFetchers/ashby.fetcher.js";
import { fetchRssJobs } from "./jobFetchers/rss.fetcher.js";
import { fetchJobsFromManualUrl } from "./jobFetchers/manualUrl.fetcher.js";

export const jobSourceRegistry = {
  greenhouse: fetchGreenhouseJobs,
  lever: fetchLeverJobs,
  ashby: fetchAshbyJobs,
  rss: fetchRssJobs,
  manual_url: fetchJobsFromManualUrl,
};