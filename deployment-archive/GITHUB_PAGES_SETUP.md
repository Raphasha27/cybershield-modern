# 🚀 GitHub Pages Setup Guide

## Quick Setup (2 Minutes)

### Step 1: Enable GitHub Pages

1. **Go to Repository Settings**
   - Navigate to: https://github.com/Raphasha27/cybershield-modern/settings
   - Click on **"Pages"** in the left sidebar

2. **Configure Source**
   - **Source**: Select **"GitHub Actions"**
   - This will use the workflow we've already created

3. **Save Settings**
   - Click **"Save"**
   - GitHub will automatically detect the workflow

### Step 2: Trigger First Deployment

The deployment will trigger automatically on the next push, but you can trigger it manually:

```bash
# Trigger deployment with an empty commit
git commit --allow-empty -m "Trigger GitHub Pages deployment"
git push origin master
```

### Step 3: Access Your Site

After 2-3 minutes, your site will be live at:
**https://raphasha27.github.io/cybershield-modern/**

## Workflow Details

The GitHub Actions workflow (`.github/workflows/github-pages.yml`) will:

1. **Trigger on**: Push to master branch
2. **Build**: Install dependencies and build Angular app
3. **Deploy**: Publish to GitHub Pages
4. **Custom Domain**: Uses `cybershield-soc.vercel.app` as CNAME

## Monitoring Deployment

### Check Deployment Status

1. **Actions Tab**
   - Go to: https://github.com/Raphasha27/cybershield-modern/actions
   - View the "Deploy to GitHub Pages" workflow

2. **Pages Settings**
   - Go to: https://github.com/Raphasha27/cybershield-modern/settings/pages
   - Check deployment status and URL

### Deployment Logs

If deployment fails:
1. Click on the failed workflow run
2. Expand the failed step
3. Review error messages
4. Common fixes:
   - Check Node.js version compatibility
   - Verify build command works locally
   - Ensure all dependencies are in package.json

## Custom Domain (Optional)

### To use your own domain:

1. **Add CNAME file**
   ```bash
   echo "yourdomain.com" > public/CNAME
   git add public/CNAME
   git commit -m "Add custom domain"
   git push origin master
   ```

2. **Configure DNS**
   - Add CNAME record: `www.yourdomain.com` → `raphasha27.github.io`
   - Add A records for apex domain to GitHub Pages IPs

3. **Update Repository Settings**
   - Go to Settings → Pages
   - Enter your custom domain
   - Enable "Enforce HTTPS"

## Troubleshooting

### Common Issues:

**404 Error on Refresh:**
- The workflow includes proper routing configuration
- Angular routes should work correctly

**Build Fails:**
```bash
# Test build locally
npm install
npm run build

# Check for errors
npm run lint
```

**Deployment Doesn't Start:**
- Ensure GitHub Actions are enabled in repository settings
- Check if workflow file is in correct location: `.github/workflows/github-pages.yml`

**Site Not Updating:**
- Check if latest commit triggered workflow
- Verify workflow completed successfully
- Clear browser cache

### Getting Help:

- **GitHub Pages Docs**: https://docs.github.com/en/pages
- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Project Issues**: https://github.com/Raphasha27/cybershield-modern/issues

## Deployment URLs

After setup, your app will be available at:

| Platform | URL | Purpose |
|----------|-----|---------|
| **Vercel** | https://cybershield-soc.vercel.app | Primary deployment |
| **GitHub Pages** | https://raphasha27.github.io/cybershield-modern/ | Alternative/backup |

Both deployments are automatically updated when you push to master!

---

## ✅ Next Steps

1. Enable GitHub Pages in repository settings
2. Wait for first deployment (2-3 minutes)
3. Test both deployment URLs
4. Update any documentation with GitHub Pages URL
5. Share both URLs in your portfolio/resume

**Your CyberShield SOC will now be available on two platforms for maximum reliability!**