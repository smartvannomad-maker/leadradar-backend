export async function fetchAshbyJobs({ organizationSlug, keyword = "" }) {
  if (!organizationSlug) {
    throw new Error("Ashby organizationSlug is required.");
  }

  const url = "https://jobs.ashbyhq.com/api/non-user-graphql";

  const body = {
    operationName: "ApiJobBoardWithTeams",
    variables: {
      organizationHostedJobsPageName: organizationSlug,
    },
    query: `
      query ApiJobBoardWithTeams($organizationHostedJobsPageName: String!) {
        jobBoard: jobBoardWithTeams(
          organizationHostedJobsPageName: $organizationHostedJobsPageName
        ) {
          teams {
            id
            name
            parentTeamId
            jobs {
              id
              title
              locationName
              employmentType
              workplaceType
              publishedDate
              url
            }
          }
        }
      }
    `,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "LeadRadar/1.0",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for Ashby`);
  }

  const data = await response.json();
  const teams = data?.data?.jobBoard?.teams || [];

  const jobs = teams.flatMap((team) =>
    (team.jobs || []).map((job) => ({
      source: "ashby",
      externalId: String(job.id),
      url: job.url,
      title: job.title,
      companyName: organizationSlug,
      location: job.locationName || null,
      description: "",
      employmentType: job.employmentType || null,
      workModel: job.workplaceType || null,
      postedAt: job.publishedDate || null,
      companyWebsite: null,
    }))
  );

  if (!keyword) return jobs;

  const q = keyword.toLowerCase();
  return jobs.filter((job) =>
    `${job.title} ${job.location || ""}`.toLowerCase().includes(q)
  );
}