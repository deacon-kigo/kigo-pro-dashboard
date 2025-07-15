#!/bin/bash

# Fix Vercel deployment script - addresses multiple project conflicts
# This script helps identify and fix multiple Vercel projects connected to the same repo

echo "🔍 Vercel Deployment Fix Script"
echo "================================"

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

# Show current project info
echo "📋 Current Vercel project configuration:"
if [ -f ".vercel/project.json" ]; then
    cat .vercel/project.json | jq '.'
else
    echo "No .vercel/project.json found"
fi

# Check current git remote
echo ""
echo "🔗 Current git remote (origin):"
git remote get-url origin

# List all Vercel projects for this team
echo ""
echo "📜 Listing all Vercel projects:"
vercel projects list

echo ""
echo "🚀 Suggested fixes:"
echo "1. Check if multiple Vercel projects are connected to this repo"
echo "2. Remove duplicate/conflicting Vercel projects"
echo "3. Ensure only one project (kigo-pro-dashboard) is connected to:"
echo "   https://github.com/deacon-kigo/kigo-pro-dashboard.git"
echo ""
echo "4. If needed, unlink and re-link this project:"
echo "   vercel --cwd . unlink"
echo "   vercel --cwd . link"
echo ""
echo "5. Or redeploy with force flag:"
echo "   vercel --prod --force"

# Ask user what they want to do
echo ""
read -p "Do you want to unlink and re-link this project? (y/N): " confirm
if [ "$confirm" == "y" ] || [ "$confirm" == "Y" ]; then
    echo "🔄 Unlinking current project..."
    vercel --cwd . unlink
    
    echo "🔗 Re-linking project..."
    vercel --cwd . link
    
    echo "🚀 Deploying..."
    vercel --prod
fi

echo "✅ Script completed!" 