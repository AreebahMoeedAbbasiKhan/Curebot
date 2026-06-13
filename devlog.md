# CureBot Development Log

## Project Overview

**CureBot** is an AI-powered healthcare assistant chatbot for Lahore, Pakistan. It helps users book doctor appointments, schedule lab tests, find doctors/hospitals/labs, check symptoms, get medicine information, first aid guidance, and access emergency contacts — all through a conversational interface backed by an AWS Lambda serverless backend with custom machine learning.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js ES Modules on AWS Lambda |
| Frontend | Single-page HTML/CSS/JS with Remix Icons |
| ML Engine | Custom TF-IDF + Naive Bayes (zero dependencies) |
| Deployment | AWS Lambda Function URL (serverless) |
| Infrastructure | PowerShell deploy script (`deploy.ps1`) |
| IDE | Built with Kiro AI |

---

## Features Built

### Core Services
1. **Book Doctor Appointment** — Multi-step flow (specialty → hospital → doctor → time → confirm)
2. **Schedule Lab Test** — Step-by-step booking with preparation instructions
3. **Search for a Doctor** — Filter by specialty, hospital, or name
4. **Find a Hospital** — Browse 27 hospitals with details
5. **Locate a Diagnostic Lab** — 11 labs with test offerings
6. **Emergency Contacts** — Rescue 1122, Edhi, police, hospitals

### AI Medical Assistant (ML-Powered)
7. **Health Q&A** — Answers questions about 17+ medical conditions (diabetes, hypertension, asthma, dengue, COVID, thyroid, anemia, migraine, depression, kidney disease, cancer, cholesterol, pneumonia, hepatitis, etc.)
8. **Symptom Checker** — 14 symptoms with possible causes and advice
9. **Medicine Information** — 7 common medicines with dosage, side effects, warnings
10. **First Aid Guidance** — Step-by-step instructions for burns, choking, bleeding, fractures, heart attacks, seizures, fainting
11. **Smart Routing** — Vague queries ("health issues") ask for specifics instead of guessing

### Machine Learning System
12. **Custom Naive Bayes Classifier** — Classifies messages as medical/service/greeting
13. **Custom TF-IDF Search** — Finds best matching answer from knowledge base
14. **Keyword + Stemming** — Handles varied phrasing and typos
15. **Feedback Learning Loop** — Users rate responses (👍/👎), corrections stored for improvement
16. **Pattern Matching** — Tracks unknown queries, learns from user corrections

### Data
- 27 hospitals (government, private, military, trust)
- 125+ doctors across 20+ specialties
- 11 diagnostic labs with test menus
- 17+ medical condition articles
- 14 symptom entries
- 7 medicine profiles
- 7 first aid guides
- Test preparation instructions
- Emergency contact numbers

### Frontend UI/UX
- Mobile-app style design (480px centered)
- Top navigation with CureBot branding
- Search bar with microphone icon
- Hero section with animated medical assistant avatar
- Trust badges (Verified, Licensed, Secure, 24/7)
- Emergency banner with Call 1122 button
- 5 service cards (Book Appointment, Lab Test, Find Doctor, Hospitals, Labs)
- Check Symptoms banner with "New" badge
- AI Medical Assistant section with 4 capability cards + quick question chips
- Popular Specialties horizontal scroll (6 specialties with colored icons)
- Top Hospitals carousel with real photos
- Chatbot section with feature checklist and input
- Feedback buttons (👍/👎) on bot responses
- Emergency footer disclaimer
- Dynamic chat messages with typing indicator

---

## Kiro Features Used

| Feature | How It Was Used |
|---------|----------------|
| **Vibe Session** | Entire project built through conversational prompts |
| **Autopilot Mode** | Kiro made changes autonomously without step-by-step approval |
| **File Editing** | Direct edits to backend and full frontend rewrites |
| **File Creation** | Created `medical-ai.mjs`, `devlog.md`, `README.md` |
| **Code Search (grep)** | Located functions in 800+ line backend file |
| **Image Understanding** | Interpreted UI screenshots to guide redesign |
| **Web Search** | Found hospital images from Wikipedia/Unsplash |
| **Web Fetch** | Verified image URLs and hospital information |
| **Iterative Refinement** | Multiple rounds of UI/UX feedback |
| **Testing** | Ran Node.js tests to verify ML engine works |

---

## Development Timeline

### Phase 1: Core Bot
- Welcome message customization
- Basic appointment/lab booking flows
- Hospital and doctor database

### Phase 2: UI/UX Redesign
- Multiple iterations based on reference screenshots
- Final design: mobile-app style with cards, specialties, hospital carousel
- Added Remix Icons, Inter font, animated avatar
- Hospital images (Mayo Hospital from Wikipedia + Unsplash)

### Phase 3: AI Medical Assistant
- Added symptom checker (14 symptoms)
- Medicine information database (7 medicines)
- First aid guides (7 scenarios)
- Health Q&A knowledge base (17+ conditions)

### Phase 4: Machine Learning
- Initially tried `natural` library (caused Lambda crash — too heavy)
- Built custom zero-dependency ML engine:
  - Naive Bayes text classifier
  - TF-IDF document search
  - Custom tokenizer and stemmer
- Smart routing: vague queries ask for specifics
- Feedback loop for continuous learning

---

## File Structure

```
Curebot/
├── index.mjs              # Main Lambda handler (NLP, flows, data)
├── medical-ai.mjs         # ML engine (TF-IDF, Bayes, knowledge base)
├── package.json           # Project config (zero dependencies)
├── function.zip           # Deployment package for Lambda (27 KB)
├── deploy.ps1             # PowerShell AWS deployment script
├── frontend/
│   ├── index.html         # Full UI (single-page app)
│   └── images/            # Hospital photos
│       ├── mayo-hospital.jpg
│       ├── hospital-1.jpg
│       ├── hospital-2.jpg
│       ├── hospital-3.jpg
│       └── hospital-4.jpg
├── devlog.md              # This file
└── README.md              # Project documentation
```

---

## Key Technical Decisions

1. **Zero dependencies** — Custom ML instead of `natural` library. Lambda cold starts are instant, zip is 27 KB instead of 16 MB.
2. **Single Lambda** — All logic in one function for simplicity and cost.
3. **ES Modules** — Using `.mjs` for modern JavaScript imports.
4. **Vague query handling** — Instead of guessing, asks user to be specific.
5. **Multi-method matching** — TF-IDF + keyword overlap + direct matching for robust answers.

---

*Built with [Kiro](https://kiro.dev) — AI-powered development environment.*
