/* The /des-920 canvas is a static page, so it asks here for the deployment id
   the Vercel toolbar script needs. */
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    deploymentId: process.env.VERCEL_DEPLOYMENT_ID ?? null,
  });
}
