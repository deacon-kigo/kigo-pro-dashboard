# Vercel Toolbar Commenting Guide

## Quick Start

### How to Leave Comments on Kigo Pro Dashboard

#### Option 1: In Development (Localhost)

1. Run `pnpm dev` to start the development server
2. Open http://localhost:3001 (or shown port)
3. Press **`Ctrl`** (or **`⌘`** on Mac) to activate Vercel Toolbar
4. Click the **💬 comment icon** in the toolbar
5. Click anywhere on the page to place a comment
6. Type your feedback and submit

#### Option 2: On Deployed Previews/Production

1. Open the deployed URL (e.g., https://kigo-pro-dashboard.vercel.app)
2. Press **`Ctrl`** (or **`⌘`** on Mac) to activate Vercel Toolbar
3. Click the **💬 comment icon**
4. Click anywhere to comment

#### Option 3: From Storybook (Recommended Workflow)

1. Browse designs in Storybook
2. See the **yellow banner** at top: "Want to leave feedback?"
3. Click **"💬 Open in New Tab ↗"** button
4. Dashboard opens in new tab
5. Press **`Ctrl`** (or **`⌘`**) to activate toolbar
6. Leave comments as usual

---

## Why Comments Don't Work in Storybook iframes

**Technical Reason:** Cross-origin security restrictions prevent the Vercel Toolbar from working properly when the dashboard is embedded in a Storybook iframe.

**Solution:** Always click **"Open in New Tab"** to leave comments.

---

## Viewing Comment History

### Via Vercel Dashboard (Recommended)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click the **🔔 notification bell** icon (top right)
3. Select the **"Comments"** tab
4. View all comments across all deployments

### Filtering Comments

You can filter by:

- **Author** - Who left the comment
- **Status** - Resolved/Unresolved
- **Project** - kigo-pro-dashboard
- **Page** - Specific routes like `/campaigns`, `/offer-manager`
- **Branch** - main, feature branches, etc.
- **Text Search** - Search comment content

### Via Vercel Toolbar

- Open toolbar (press `Ctrl`)
- Click **"Comments"** icon
- Shows comments for **current page only**

---

## Comment Features

### What You Can Do

- ✅ **Pin comments** anywhere on the page
- ✅ **Add screenshots** (with browser extension)
- ✅ **Create discussion threads** (reply to comments)
- ✅ **Mention teammates** (@username)
- ✅ **Resolve comments** when addressed
- ✅ **Link to Slack, Linear, Jira, GitHub** (convert to tickets)

### Notifications

- **Email notifications** when:
  - Someone replies to your comment
  - You're mentioned in a comment
  - New comments on your deployments
- **Dashboard notifications** in the 🔔 bell icon

---

## Integration with Other Tools

### Slack Integration

- All comments can sync to Slack channels
- Get notified in Slack when comments are added
- Link comment threads to Slack discussions

### Linear/Jira Integration

- Convert comments to Linear issues
- Convert comments to Jira tickets
- Screenshots and context automatically included

### GitHub Integration

- Comments sync with PR status checks
- Link comments to GitHub issues

**Setup:** Configure integrations at [vercel.com/dashboard](https://vercel.com/dashboard) → Settings → Integrations

---

## Best Practices

### ✅ Do

- Use "Open in New Tab" from Storybook for commenting
- Leave specific, actionable feedback
- Tag relevant team members
- Resolve comments when addressed
- Use screenshots for visual issues

### ❌ Don't

- Try to comment in Storybook iframes (won't work)
- Leave vague feedback without context
- Forget to check notification bell for responses

---

## Troubleshooting

### "I don't see the toolbar"

**Solution:** Press `Ctrl` (or `⌘`) to activate it

### "I can't comment in Storybook"

**Solution:** Click "Open in New Tab ↗" button - comments don't work in iframes

### "Where are my old comments?"

**Solution:** Go to [vercel.com/dashboard](https://vercel.com/dashboard) → 🔔 bell icon → Comments tab

### "Comments not saving"

**Solution:** Make sure you're logged into Vercel account at vercel.com

---

## Team Workflow Recommendation

### For Design Reviews

1. **Review** in Storybook (see iframe overview)
2. **Comment** using "Open in New Tab" (detailed feedback)
3. **Track** in Vercel Dashboard (view all comments)
4. **Resolve** when addressed

### For Development Iteration

1. **Develop** locally with `pnpm dev`
2. **Self-review** using Vercel Toolbar
3. **Push** to preview branch
4. **Share** preview URL with team
5. **Collect** feedback via comments
6. **Iterate** based on feedback

---

## Quick Reference

| Action              | Shortcut                                                  |
| ------------------- | --------------------------------------------------------- |
| Activate Toolbar    | `Ctrl` or `⌘`                                             |
| Open Comments Panel | Click 💬 icon in toolbar                                  |
| Place Comment       | Click anywhere on page                                    |
| View All Comments   | [Dashboard](https://vercel.com/dashboard) → 🔔 → Comments |
| Open from Storybook | Click "💬 Open in New Tab ↗"                             |

---

## Additional Resources

- [Vercel Comments Documentation](https://vercel.com/docs/comments)
- [Vercel Toolbar Documentation](https://vercel.com/docs/vercel-toolbar)
- [Browser Extension](https://chromewebstore.google.com/detail/vercel/lahhiofdgnbcgmemekkmjnpifojdaelb) (optional, adds screenshot feature)

---

**Questions?** Check the [Vercel Dashboard](https://vercel.com/dashboard) or contact your team lead.
