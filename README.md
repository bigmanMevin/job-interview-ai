# JobAssist - AI-Powered Interview Coach

<div align="center">
  <h3>🎯 Land Your Dream Job with AI-Powered Interview Preparation</h3>
  <p>Smart resume analysis • Custom interview questions • Real-time feedback</p>
</div>

---

## ✨ Features

### 🎯 **Smart Resume Analysis**
- Upload or paste your resume (PDF, DOCX, TXT)
- AI detects your skills, experience level, and current role
- Get personalized **company recommendations** with fit reasons
- Receive **role suggestions** matching your profile
- Identify strengths and gaps in your resume

### 💼 **Custom Interview Questions**
- AI generates questions specific to your **target company**
- Tailored to your **target role** (UI/UX Designer, Software Engineer, etc.)
- Appropriate for your **experience level** (Intern, Junior, Senior, etc.)
- 5 unique questions per interview session

**Example:** 
- Company: Google
- Role: UI/UX Designer  
- Level: Intern
- Result: 5 Google-specific UI/UX interview questions

### 🎥 **Interactive Practice**
- **Live Camera**: Practice with your webcam
- **Upload Video**: Analyze pre-recorded responses
- Type your answers and get instant AI feedback

### 📊 **Detailed Feedback**
- Score out of 100
- Strengths in your response (3 points)
- Areas for improvement (3 points)
- Communication assessment
- Content quality evaluation
- Performance metrics (Confidence, Relevance, Clarity)

### 🏢 **Job Matching**
- One-click interview prep for recommended companies
- Role suggestions based on resume analysis
- Company-specific preparation tips

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

---

## 📖 How to Use

### Step 1: Analyze Your Resume
1. Navigate to **"Resume Analysis"** tab
2. Choose to **paste text** or **upload file** (PDF, DOCX, TXT)
3. Click **"Analyze Resume & Get Job Matches"**
4. Review:
   - ✅ Recommended companies with fit reasons
   - ✅ Suggested roles matching your profile
   - ✅ Detected skills and experience level
   - ✅ Strengths and areas to improve
   - ✅ Interview preparation tips

### Step 2: Set Up Your Interview
1. Navigate to **"Mock Interview"** tab
2. Enter interview details:
   - **Target Company**: e.g., "Google", "Microsoft", "Apple"
   - **Target Role**: e.g., "UI/UX Designer", "Software Engineer"
   - **Experience Level**: Intern, Junior, Mid-Level, Senior, or Lead
3. Click **"Generate AI Interview Questions"**
4. AI creates 5 custom questions specific to your setup

### Step 3: Practice Interview
1. Choose video mode:
   - **Live Camera**: Practice with webcam (requires camera permission)
   - **Upload Video**: Use pre-recorded responses
2. Click **"Start Interview"**
3. Read each question and type your response
4. Click **"Submit & Get Feedback"** to receive:
   - 🏆 Score out of 100
   - ✅ Strengths in your answer
   - 📈 Areas for improvement
   - 💬 Communication assessment
   - 📝 Content quality evaluation
   - 📊 Performance metrics
5. Click **"Next Question"** to continue or **"Finish Interview"** when done

---

## 🎯 Example Use Cases

### 1. **Targeting a Specific Company**
- Upload resume → See "Google" recommended
- Click "Practice" on Google → Auto-fills company
- Enter "Software Engineer" role
- Select "Mid-Level"
- Get 5 Google-specific SWE questions

### 2. **Career Switcher**
- Paste resume from finance background
- See recommended roles: "Product Manager", "Business Analyst"
- Pick "Product Manager" at "Amazon"
- Practice with PM-specific questions
- Get tailored feedback on business acumen

### 3. **Recent Graduate**
- Upload student resume
- See internship-level companies: "Startups", "Tech Giants"
- Practice for "Junior Developer" role
- Get feedback on technical communication
- Identify skill gaps to address

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React.js** | Frontend framework |
| **Tailwind CSS** | Styling and design |
| **Lucide React** | Icon library |
| **Claude API** | AI-powered analysis and question generation |
| **WebRTC** | Live camera functionality |

---

## 📁 Project Structure

```
jobassist/
├── public/
│   ├── index.html          # HTML template
│   ├── manifest.json       # PWA manifest
│   └── robots.txt          # SEO robots file
├── src/
│   ├── App.js              # Main JobAssist component
│   ├── index.js            # React entry point
│   └── index.css           # Global styles + Tailwind
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies and scripts
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md               # This file
```

---

## 🎨 UI Highlights

- ✅ **Centered Branding**: "JobAssist" professionally centered
- ✅ **Modern Design**: Clean white cards with subtle shadows
- ✅ **Smooth Animations**: Transitions and hover effects
- ✅ **Responsive**: Works on mobile, tablet, and desktop
- ✅ **Professional Typography**: Inter font family
- ✅ **Intuitive Navigation**: Pill-style tabs

---

## ⚙️ Configuration

### Environment Variables (Optional)
Create a `.env` file in the root directory:

```env
# Add any custom configuration here
REACT_APP_API_URL=your_api_url
```

---

## 🐛 Troubleshooting

### Issue: Camera not working
**Solution**: Grant camera permissions in browser settings

### Issue: Resume analysis failed
**Solution**: Ensure file is PDF, DOCX, or TXT under 10MB

### Issue: Questions not generating
**Solution**: Fill in all fields (company, role, experience level)

### Issue: Slow API responses
**Solution**: Normal - AI processing takes 2-10 seconds

---

## 🚀 Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel deploy
```

### Deploy to Netlify
```bash
npm run build
# Drag and drop 'build' folder to Netlify
```

### Deploy to GitHub Pages
```bash
npm install -g gh-pages
npm run build
gh-pages -d build
```

---

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Runs the app in development mode |
| `npm test` | Launches the test runner |
| `npm run build` | Builds the app for production |
| `npm run eject` | Ejects from Create React App (⚠️ irreversible) |

---

## 🎯 Features Roadmap

- [ ] Save interview history
- [ ] Multi-language support
- [ ] Voice recording for responses
- [ ] PDF report generation
- [ ] Company database integration
- [ ] Interview scheduler
- [ ] Mock interview with AI avatar

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **AI**: Powered by [Claude](https://www.anthropic.com/) (Anthropic)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Framework**: [React.js](https://react.dev/)

---

## 📞 Support

Having issues? Check the [Troubleshooting](#-troubleshooting) section above.

---

<div align="center">
  <p><strong>Built with ❤️ for job seekers worldwide</strong></p>
  <p>Version 1.0.0 • Last Updated: November 2025</p>
</div>
