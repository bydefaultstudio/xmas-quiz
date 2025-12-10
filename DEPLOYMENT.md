# Deployment Guide

Your 2025 Quiz app has been successfully uploaded to GitHub: https://github.com/bydefaultstudio/xmas-quiz.git

## Deploy to Vercel (Recommended - Free & Easy)

Vercel is the easiest way to deploy Next.js apps and get a public URL. Here's how:

### Option 1: Deploy via Vercel Website (Easiest)

1. **Go to [Vercel.com](https://vercel.com)** and sign up/login (you can use GitHub to sign in)

2. **Click "Add New Project"**

3. **Import your GitHub repository:**
   - Select the repository (note: GitHub repo name may still be `xmas-quiz`)
   - Click "Import"

4. **Configure the project:**
   - Framework Preset: Next.js (should auto-detect)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

5. **Click "Deploy"**

6. **Wait for deployment** (usually takes 1-2 minutes)

7. **Get your public URL!** Vercel will give you a URL like:
   - `https://2025-quiz.vercel.app` (or your custom domain)
   - You can customize the domain name in settings

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from project directory)
vercel

# For production deployment
vercel --prod
```

## Other Deployment Options

### Netlify

1. Go to [Netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Deploy!

### Railway

1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects Next.js and deploys

## Important Notes

✅ **Free hosting:** All these platforms offer free tiers perfect for this quiz app

✅ **Automatic deployments:** When you push to GitHub, they auto-deploy

✅ **Custom domain:** You can add your own domain in settings

✅ **HTTPS:** All platforms provide SSL certificates automatically

## What Gets Deployed

- ✅ All your code
- ✅ Player avatars
- ✅ Question database (`questrions.md`)
- ✅ Custom fonts
- ✅ Everything needed to run the quiz

## Post-Deployment Checklist

- [ ] Test the quiz flow end-to-end
- [ ] Verify all player avatars load correctly
- [ ] Check that questions load from markdown file
- [ ] Test leaderboard persistence
- [ ] Share your public URL! 🎉

## Updating the App

After making changes:

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```

2. Vercel/Netlify will automatically redeploy (or manually trigger if needed)

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment

