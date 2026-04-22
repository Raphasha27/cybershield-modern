# 🚀 Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository: `Raphasha27/cybershield-modern`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Angular
   - **Root Directory**: `./`
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `dist/cybershield-soc/browser`
   - **Install Command**: `npm install`

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your app will be live at: `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? cybershield-soc
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

### Option 3: One-Click Deploy

Click the button below to deploy directly:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Raphasha27/cybershield-modern)

---

## 📝 Configuration Details

### vercel.json
The project includes a `vercel.json` file with optimal settings:

```json
{
  "version": 2,
  "name": "cybershield-soc",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/cybershield-soc/browser"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Environment Variables (Optional)

If you're using the backend, add these in Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add:
   - `NODE_ENV` = `production`
   - `API_URL` = Your backend API URL
   - `JWT_SECRET` = Your JWT secret

---

## 🔧 Custom Domain (Optional)

### Add Your Domain

1. Go to Project Settings → Domains
2. Click "Add"
3. Enter your domain (e.g., `cybershield.yourdomain.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-30 minutes)

### Recommended Domains
- `cybershield-soc.vercel.app` (Free Vercel subdomain)
- `cybershield.yourdomain.com` (Custom domain)
- `soc.yourdomain.com` (Custom subdomain)

---

## 📊 Deployment Status

After deployment, you'll get:

- **Production URL**: `https://your-project.vercel.app`
- **Preview URLs**: Automatic for each PR
- **Analytics**: Built-in Vercel Analytics
- **Logs**: Real-time deployment logs

---

## 🔄 Automatic Deployments

Vercel automatically deploys:

- **Production**: Every push to `master` or `main` branch
- **Preview**: Every pull request
- **Branch**: Every push to any branch (optional)

### Configure Auto-Deploy

1. Go to Project Settings → Git
2. Enable:
   - ✅ Production Branch: `master`
   - ✅ Preview Deployments: All branches
   - ✅ Automatic Deployments: Enabled

---

## 🐛 Troubleshooting

### Build Fails?

**Check these:**
1. Node version (should be 18+)
2. Build command is correct: `npm run vercel-build`
3. Output directory: `dist/cybershield-soc/browser`
4. All dependencies are in `package.json`

**View logs:**
- Go to Deployments tab
- Click on failed deployment
- Check build logs for errors

### 404 Errors?

**Solution:**
- Ensure `vercel.json` has the route configuration
- Check that `dist/cybershield-soc/browser` contains `index.html`
- Verify Angular routing is configured correctly

### Styles Not Loading?

**Solution:**
- Check browser console for errors
- Verify all assets are in the `dist` folder
- Clear Vercel cache and redeploy

---

## 🎯 Performance Optimization

### Enable Vercel Features

1. **Analytics**
   - Go to Analytics tab
   - Enable Web Analytics
   - Track page views and performance

2. **Speed Insights**
   - Enable Speed Insights
   - Monitor Core Web Vitals
   - Get performance recommendations

3. **Edge Functions** (Optional)
   - Add edge functions for API routes
   - Improve response times globally

---

## 💰 Pricing

### Free Tier Includes:
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Preview deployments
- ✅ Analytics (basic)
- ✅ Custom domains

### Pro Tier ($20/month):
- Everything in Free
- 1 TB bandwidth/month
- Advanced analytics
- Password protection
- Team collaboration

---

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Documentation**: https://vercel.com/docs
- **Angular on Vercel**: https://vercel.com/guides/deploying-angular-with-vercel
- **Support**: https://vercel.com/support

---

## ✅ Post-Deployment Checklist

- [ ] Deployment successful
- [ ] Live URL accessible
- [ ] All pages load correctly
- [ ] Login functionality works
- [ ] Dashboard displays properly
- [ ] AI Assistant functional
- [ ] Interactive map works
- [ ] Charts render correctly
- [ ] Mobile responsive
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled
- [ ] README updated with live URL

---

## 🎉 Success!

Once deployed, your CyberShield SOC will be live at:

**https://your-project.vercel.app**

Share this URL with:
- Potential employers
- Portfolio visitors
- Team members
- Stakeholders

---

<div align="center">

**Deployed with ❤️ using Vercel**

[![Powered by Vercel](https://img.shields.io/badge/Powered_by-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

</div>
