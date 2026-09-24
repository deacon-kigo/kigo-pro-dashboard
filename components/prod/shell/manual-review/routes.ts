const manualReviewApiRoutes = {
  get: "/dashboard/receipts/manual-review/:receiptId",
  getFiles: "/dashboard/receipts/:receiptId/files",
  list: "/dashboard/receipts/manual-review",
  saveComment: "/dashboard/receipts/manual-review/:receiptId/comment",
  submitReview: "/dashboard/receipts/manual-review",
} as const;

const manualReviewWebRoutes = {
  view: "/manual-review",
} as const;

export { manualReviewApiRoutes, manualReviewWebRoutes };
