# CyberShield SOC - Getting Started Guide

## 🌐 Try the Live Demo (Fastest Way)

**No installation needed!** Just click the link below:

### **👉 [https://cybershield-soc.vercel.app](https://cybershield-soc.vercel.app) 👈**

**Login with ANY email and password** (it's a demo with mock authentication):
- Email: `admin@cybershield.com`
- Password: `password123`

---

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Application
```bash
npm start
```

### Step 3: Open Your Browser
Navigate to: **http://localhost:4200**

---

## 🔐 Login Instructions

The application uses **mock authentication** for demo purposes. You can login with ANY email and password combination.

### Demo Credentials (or use any):
- **Email:** `admin@cybershield.com`
- **Password:** `password123`

**Note:** The login is for demonstration only. In production, this would connect to a real authentication backend.

---

## 🎯 Dashboard Features

Once logged in, you'll see the **Enterprise SOC Dashboard** with:

### 1. **Security Metrics (Top Cards)**
- Security Score (0-100)
- Total Incidents
- Active Threats
- Servers Online
- Network Activity

### 2. **Interactive Global Threat Map**
- Click on any region to see threat details
- Real-time threat indicators
- Live scanning mode (click "SCAN MODE" button)
- Geographic threat distribution

### 3. **AI Assistant** 🤖
- **AI Predictions**: Smart recommendations with confidence levels
- **Chat Interface**: Ask questions about your security posture
- **Automated Insights**: System update recommendations
- **Threat Analysis**: Real-time threat intelligence

#### Using the AI Assistant:
1. Scroll to the AI Assistant section
2. Click "Activate" to enable AI monitoring
3. Review AI predictions and click "Update Now" or "Investigate"
4. Use the chat to ask questions like:
   - "What's the current threat level?"
   - "Should I update the firewall?"
   - "Analyze recent security events"

### 4. **Real-Time Data**
- Auto-refreshing every 10 seconds
- Live threat feed
- Activity log updates
- Network traffic monitoring

### 5. **Charts & Visualizations**
- Threat Activity Trend (line chart)
- Network Traffic (bar chart)
- Incident Severity Distribution
- System Health Monitor

### 6. **Incident Management**
- Recent incidents table
- Search and filter capabilities
- Export to CSV
- Severity and status tracking

---

## 🎨 Theme Toggle

Click the theme icon (☀️/🌙) in the header to switch between:
- **Dark Mode** (default) - Optimized for SOC environments
- **Light Mode** - For daytime use

---

## 🔄 Auto-Refresh Settings

Control how often the dashboard updates:
- **30s** - High frequency updates
- **1m** - Balanced (default)
- **5m** - Low frequency
- **Paused** - Manual refresh only

---

## 📊 Interactive Features

### Search Incidents
Use the search bar in the header to filter incidents by:
- Incident ID
- Type (Malware, Phishing, DDoS, etc.)
- Severity (High, Medium, Low)
- Status (Active, Resolved, Investigating)

### Export Data
Click "Export CSV" to download the current incident list for offline analysis.

### System Health Monitoring
- View real-time health status of all systems
- Color-coded indicators (Green = Good, Yellow = Warning, Red = Critical)
- Last check timestamps
- Trend indicators (↗️ improving, ↘️ declining, ➡️ stable)

### Geographic Threat Analysis
- Click on map regions to see detailed threat information
- View threat counts by country
- Risk level indicators
- Last scan timestamps

---

## 🤖 AI Assistant Commands

Try asking the AI:
- "What's the current security status?"
- "Show me high-priority threats"
- "When should I update the firewall?"
- "Analyze network traffic patterns"
- "What are the top security recommendations?"

---

## 🔔 Notifications

Click the bell icon (🔔) to view:
- Critical alerts
- High-priority warnings
- Medium-priority notices
- Informational updates

Badge shows the number of unread alerts.

---

## ⚙️ Navigation

### Header Buttons:
- **System Settings** - Configure system parameters
- **Admin** - User management and system administration
- **Logout** - End your session

### Quick Actions:
- **Refresh Dashboard** - Manual data refresh
- **Toggle Scan Mode** - Start/stop global security scan
- **View All Incidents** - Navigate to full incident list

---

## 📱 Responsive Design

The dashboard is fully responsive and works on:
- Desktop (1920x1080 and above) - Full experience
- Laptop (1366x768) - Optimized layout
- Tablet (768x1024) - Adapted interface
- Mobile (375x667) - Compact view

---

## 🎯 Best Practices

1. **Keep AI Assistant Active** - Get real-time recommendations
2. **Review Predictions Daily** - Act on high-confidence alerts
3. **Monitor Geographic Threats** - Watch for regional attack patterns
4. **Export Data Regularly** - Maintain offline records
5. **Check System Health** - Ensure all services are operational
6. **Use Search Effectively** - Filter incidents for faster analysis

---

## 🆘 Troubleshooting

### Dashboard Not Loading?
```bash
# Stop the server (Ctrl+C)
# Clear cache and restart
npm start
```

### Data Not Updating?
- Check auto-refresh setting (not set to "Paused")
- Click the refresh button manually
- Check browser console for errors (F12)

### AI Assistant Not Responding?
- Ensure AI is activated (green status)
- Check that you've entered a message
- Wait 1-2 seconds for AI response

---

## 🔗 Additional Resources

- **Full Documentation**: See `README.md`
- **Architecture**: See `ARCHITECTURE.md`
- **Deployment Guide**: See `DEPLOY.md`
- **API Documentation**: See API Endpoints section in README

---

## 🎉 You're Ready!

Your CyberShield SOC Dashboard is now running at:
**http://localhost:4200**

Explore the features, interact with the AI assistant, and monitor your security infrastructure in real-time!

---

**Need Help?** Check the documentation files or open an issue in the repository.
