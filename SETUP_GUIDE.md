# 🚀 JobAssist Setup Guide

Follow these simple steps to get JobAssist running on your machine!

---

## 📋 Prerequisites

Before you begin, make sure you have:
- ✅ **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- ✅ **npm** (comes with Node.js) or **yarn**
- ✅ A **code editor** (VS Code recommended)
- ✅ A **modern browser** (Chrome, Firefox, Safari)

### Check if Node.js is installed:
```bash
node --version
npm --version
```

---

## 🎯 Step-by-Step Installation

### Step 1: Extract the ZIP File
1. Extract `JobAssist-Complete.zip` to your desired location
2. Open terminal/command prompt
3. Navigate to the extracted folder:
```bash
cd path/to/jobassist
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- React and React DOM
- Lucide React (icons)
- Tailwind CSS (styling)
- All other required packages

**Expected time:** 1-2 minutes

### Step 3: Start the Development Server
```bash
npm start
```

**What happens:**
- Development server starts
- Browser opens automatically at `http://localhost:3000`
- App is ready to use! 🎉

---

## ✅ Verify Installation

After `npm start`, you should see:
1. ✅ Terminal shows "Compiled successfully!"
2. ✅ Browser opens automatically
3. ✅ You see the JobAssist homepage with centered "JobAssist" logo
4. ✅ Navigation tabs: Home, Resume Analysis, Mock Interview, Technologies

---

## 🎨 First-Time Setup (Optional)

### Enable Camera Access (for live interviews)
When you start a live camera interview:
1. Browser will ask for camera permission
2. Click **"Allow"**
3. Camera feed should appear

### Test Resume Upload
1. Go to **"Resume Analysis"** tab
2. Try uploading a sample resume (PDF, DOCX, or TXT)
3. Click **"Analyze Resume & Get Job Matches"**
4. Wait 5-10 seconds for AI analysis

---

## 🐛 Common Issues & Solutions

### Issue 1: `npm install` fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### Issue 2: Port 3000 already in use
**Solution:**
```bash
# Use a different port
PORT=3001 npm start
```

Or kill the process using port 3000:
```bash
# On Mac/Linux
lsof -ti:3000 | xargs kill -9

# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### Issue 3: "Cannot find module" errors
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: Tailwind styles not working
**Solution:**
```bash
# Rebuild the project
npm run build
npm start
```

### Issue 5: Camera not working
**Solution:**
1. Check browser permissions (Settings → Privacy → Camera)
2. Make sure you're using HTTPS or localhost
3. Try a different browser (Chrome recommended)

---

## 📦 Building for Production

When you're ready to deploy:

### Step 1: Create Production Build
```bash
npm run build
```

This creates an optimized build in the `build/` folder.

### Step 2: Test Production Build Locally
```bash
# Install serve globally
npm install -g serve

# Serve the build folder
serve -s build
```

Open `http://localhost:3000` to test the production build.

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Free)
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

### Option 2: Netlify (Free)
1. Go to [netlify.com](https://www.netlify.com/)
2. Drag and drop the `build/` folder
3. Done! ✅

### Option 3: GitHub Pages
```bash
# Install gh-pages
npm install -g gh-pages

# Add to package.json:
# "homepage": "https://yourusername.github.io/jobassist"

# Deploy
npm run build
gh-pages -d build
```

---

## 🎯 Project Structure Explained

```
jobassist/
│
├── public/                    # Static files
│   ├── index.html            # Main HTML template
│   ├── manifest.json         # PWA configuration
│   └── robots.txt            # SEO configuration
│
├── src/                       # Source code
│   ├── App.js                # Main JobAssist component (⭐ THE APP)
│   ├── index.js              # React entry point
│   └── index.css             # Global styles + Tailwind
│
├── .gitignore                # Files to ignore in Git
├── package.json              # Dependencies and scripts
├── postcss.config.js         # PostCSS configuration for Tailwind
├── tailwind.config.js        # Tailwind CSS configuration
└── README.md                 # Documentation
```

---

## 🔧 Customization Tips

### Change Colors
Edit `src/App.js` and replace Tailwind color classes:
- `indigo-600` → your primary color
- `purple-600` → your secondary color
- `pink-600` → your accent color

### Change Branding
Edit `src/App.js`:
```javascript
// Line ~20
<h1 className="text-2xl font-bold text-slate-900">YourBrand</h1>
<p className="text-xs text-slate-500">Your Tagline</p>
```

### Modify AI Behavior
Edit the prompts in:
- `generateInterviewQuestions()` - Change question generation
- `analyzeResume()` - Modify resume analysis
- `analyzeResponse()` - Adjust feedback criteria

---

## 📝 Development Tips

### Hot Reload
The dev server has hot reload enabled:
1. Edit `src/App.js`
2. Save the file
3. Browser automatically refreshes ✅

### Debugging
1. Open browser DevTools (F12)
2. Check Console for errors
3. Use React DevTools extension

### Code Formatting
```bash
# Install Prettier
npm install --save-dev prettier

# Format all files
npx prettier --write "src/**/*.{js,jsx,css}"
```

---

## 🎓 Learning Resources

### React
- [Official React Docs](https://react.dev/)
- [React Tutorial](https://react.dev/learn)

### Tailwind CSS
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/)

### Lucide Icons
- [Icon Library](https://lucide.dev/)

---

## ✅ Quick Checklist

Before deploying, make sure:
- [ ] App runs without errors (`npm start`)
- [ ] All features work (resume upload, question generation, feedback)
- [ ] Camera permission works (if using live camera)
- [ ] Production build succeeds (`npm run build`)
- [ ] No console errors in DevTools
- [ ] Responsive design looks good on mobile
- [ ] README.md is updated with your info

---

## 🎉 You're All Set!

Your JobAssist is now ready to help candidates ace their interviews!

**Quick Start Command:**
```bash
npm start
```

**Production Build:**
```bash
npm run build
```

**Deploy:**
```bash
vercel deploy
```

---

## 📞 Need Help?

1. Check the [Troubleshooting](#-common-issues--solutions) section
2. Review the main [README.md](README.md)
3. Check browser console for errors
4. Ensure all dependencies are installed

---

<div align="center">
  <p><strong>Happy Coding! 🚀</strong></p>
</div>
