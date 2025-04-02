// This is a placeholder implementation to match kigo-admin-tools structure

export async function register() {
  // This is a placeholder file to match the kigo-admin-tools structure
  // Actual Sentry implementation would be added if/when needed
  console.log("Instrumentation registered");
}

export const onRequestError = (error: Error) => {
  console.error("Request error:", error);
  // Would call Sentry.captureRequestError in a real implementation
}; 