// Mirrors kigo-core-server dashboard routes under /dashboard/pilots/sweepstakes.
const sweepstakesApiRoutes = {
  activate: "/dashboard/pilots/sweepstakes/:sweepstakeId/activate",
  advance: "/dashboard/pilots/sweepstakes/:sweepstakeId/advance",
  campaigns: "/dashboard/pilots/sweepstakes/:sweepstakeId/campaigns",
  confirmWinner: "/dashboard/pilots/sweepstakes/:sweepstakeId/confirm-winner",
  // Pilot-only create: name/partner/program/winnerCount/selectionOn/timezone.
  create: "/dashboard/pilots/sweepstakes",
  createCampaign: "/dashboard/pilots/sweepstakes/:sweepstakeId/campaigns",
  deactivate: "/dashboard/pilots/sweepstakes/:sweepstakeId/deactivate",
  edit: "/dashboard/pilots/sweepstakes/:sweepstakeId",
  entrants: "/dashboard/pilots/sweepstakes/:sweepstakeId/entrants",
  entrantsCsv: "/dashboard/pilots/sweepstakes/:sweepstakeId/entrants/csv",
  get: "/dashboard/pilots/sweepstakes/:sweepstakeId",
  linkCampaign: "/dashboard/pilots/sweepstakes/:sweepstakeId/campaigns/link",
  list: "/dashboard/pilots/sweepstakes",
  replaceWinner: "/dashboard/pilots/sweepstakes/:sweepstakeId/replace-winner",
  resetToSetup: "/dashboard/pilots/sweepstakes/:sweepstakeId/reset-to-setup",
  selectWinner: "/dashboard/pilots/sweepstakes/:sweepstakeId/select-winner",
  unlinkCampaign:
    "/dashboard/pilots/sweepstakes/:sweepstakeId/campaigns/:campaignId",
} as const;

const sweepstakesWebRoutes = {
  create: "/sweepstakes/create-sweepstake",
  detail: "/sweepstakes/:sweepstakeId",
  view: "/sweepstakes",
} as const;

export { sweepstakesApiRoutes, sweepstakesWebRoutes };
