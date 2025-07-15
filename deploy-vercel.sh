#!/bin/bash

# Deploy script for Vercel troubleshooting
# This script helps debug and deploy to Vercel properly

echo "🚀 Starting Vercel deployment troubleshooting..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root."
    exit 1
fi

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Clean up any previous builds
echo "🧹 Cleaning up previous builds..."
rm -rf .next
rm -rf out
rm -rf node_modules/.cache

# Test local build first
echo "🔧 Testing local build..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Local build failed. Please fix build errors first."
    exit 1
fi

echo "✅ Local build successful!"

# Check git status
echo "📊 Checking git status..."
git status

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Consider committing them first."
    read -p "Do you want to continue? (y/N): " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        echo "Deployment cancelled."
        exit 1
    fi
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment script completed!" 