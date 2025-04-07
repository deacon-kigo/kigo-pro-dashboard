#!/bin/bash

# Script to deploy Storybook to the same production URL
# URL: https://storybook-static-lemon-ten.vercel.app/

# Exit on error
set -e

echo "Building Storybook..."
npm run build-storybook

echo "Deploying to production (maintaining the same URL)..."
cd storybook-static
vercel --prod

echo "Deployment complete! Your Storybook is available at: https://storybook-static-lemon-ten.vercel.app/" 