#!/bin/bash

# Script to deploy Storybook to the same production URL
# URL: https://storybook-static-lemon-ten.vercel.app/

# Exit on error
set -e

echo "Building Storybook..."
npm run build-storybook

# Check if storybook-static directory exists
if [ ! -d "storybook-static" ]; then
    echo "Error: storybook-static directory not found. Build may have failed."
    exit 1
fi

# Create a temporary vercel.json specifically for Storybook - using single quotes to avoid variable expansion
cat > storybook-static/vercel.json << 'EOL'
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": null,
  "devCommand": null,
  "framework": null,
  "outputDirectory": "."
}
EOL

echo "Deploying to production..."
cd storybook-static
echo "Running Vercel deploy command..."
vercel --prod --name storybook-static

echo "Deployment complete!"
echo "Your Storybook is now available at the URL shown above." 