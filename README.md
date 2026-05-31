# 🩺 CureBot — AI Healthcare Assistant for Lahore

An AI-powered medical chatbot that helps residents of Lahore, Pakistan book doctor appointments, schedule lab tests, check symptoms, get medicine information, and access emergency services — all through natural conversation.

**Live Demo:** [CureBot Frontend](frontend/index.html)

---

## ✨ Features

### 🏥 Healthcare Services
- **Book Doctor Appointments** — Step-by-step: choose specialty → hospital → doctor → time slot → confirm
- **Schedule Lab Tests** — Select lab, test type, date, with preparation instructions
- **Find Doctors** — Search 125+ doctors by specialty across 27 hospitals
- **Find Hospitals** — Browse all Lahore hospitals with addresses, phone numbers, specialties
- **Find Labs** — 11 diagnostic labs with test menus and home collection info
- **Emergency Contacts** — Rescue 1122, Edhi, police, hospital emergency numbers

### 🤖 AI Medical Assistant
- **Health Q&A** — Ask about any condition (diabetes, blood pressure, asthma, dengue, etc.)
- **Symptom Checker** — Describe symptoms, get possible causes and advice
- **Medicine Info** — Dosage, side effects, and warnings for common medicines
- **First Aid** — Step-by-step emergency guidance (burns, choking, bleeding, etc.)
- **Smart Responses** — Vague queries prompt for specifics instead of guessing

### 🧠 Machine Learning (Zero Dependencies)
- Custom **Naive Bayes Classifier** for intent detection
- Custom **TF-IDF Search Engine** for knowledge base matching
- **Feedback Learning** — Users rate responses, bot improves over time
- **Pattern Recognition** — Learns from unknown queries
- No external libraries — pure JavaScript implementation

---

## 🏗️ Architecture

```
┌─────────────────┐     HTTPS      ┌──────────────────────┐
│   Frontend      │ ──────────────► │   AWS Lambda         │
│   (HTML/CSS/JS) │                 │                      │
│                 │ ◄────────────── │  index.mjs           │
└─────────────────┘     JSON        │  (NLP + Flows)       │
                                    │                      │
                                    │  medical-ai.mjs      │
                                    │  (ML Engine)         │
                                    └──────────────────────┘
```

- **Frontend:** Single HTML file, no build tools, Remix Icons, Inter font
- **Backend:** Node.js ES Module on AWS Lambda (Function URL)
- **ML Engine:** Custom TF-IDF + Naive Bayes (27 KB total deployment)

---

## 🚀 Quick Start

### Run Locally
```bash
# No dependencies to install!
node -e "import('./index.mjs').then(m => m.handler({requestContext:{http:{method:'POST'}},body:JSON.stringify({message:'hi',context:{}})}).then(r => console.log(JSON.parse(r.body).reply)))"
```

### Open Frontend
Just open `frontend/index.html` in any browser.

### Deploy to AWS
```powershell
# Requires AWS CLI configured
.\deploy.ps1
```

Or manually:
1. Zip `index.mjs` + `medical-ai.mjs` → `function.zip`
2. Upload to AWS Lambda
3. Set runtime: Node.js 20.x, Handler: `index.handler`
4. Enable Function URL with CORS

---

## 📁 Project Structure

```
Curebot/
├── index.mjs              # Main handler — NLP parsing, conversation flows, data
├── medical-ai.mjs         # ML engine — classifier, TF-IDF, knowledge base
├── package.json           # Project metadata (zero dependencies)
├── function.zip           # Ready-to-deploy Lambda package (27 KB)
├── deploy.ps1             # Automated AWS deployment script
├── frontend/
│   ├── index.html         # Complete UI (mobile-app style)
│   └── images/            # Hospital photos
├── devlog.md              # Development log
└── README.md              # This file
```

---

## 💬 Usage Examples

| You say | CureBot responds |
|---------|-----------------|
| "hi" | Welcome message with menu options |
| "book appointment" | Step-by-step hospital & doctor selection |
| "find cardiologist" | Lists all cardiologists with fees & schedules |
| "What is diabetes?" | Full explanation with symptoms, management, tests |
| "I have a headache" | Possible causes + advice + when to see doctor |
| "medicine paracetamol" | Dosage, side effects, warnings |
| "burn" | First aid steps for burns |
| "health issues" | Asks what specific issue you have |
| "emergency" | All emergency numbers for Lahore |
| "hospitals in DHA" | Filtered hospital list |

---

## 🧠 How the ML Works

### Intent Classification (Naive Bayes)
```
User message → Tokenize → Classify → medical / service / greeting
```
- Trained on 70+ examples
- Uses Laplace smoothing for unseen words
- Keyword fallback for high-confidence medical terms

### Answer Matching (TF-IDF)
```
Medical question → Tokenize → Stem → Score against knowledge base → Best match
```
- Custom IDF scoring across 17 documents
- Combined score: 60% TF-IDF + 40% keyword overlap
- Minimum threshold prevents bad matches
- Vague queries return a prompt for specifics

### Continuous Learning
```
User feedback (👍/👎) → Store correction → Match future similar queries
```

---

## 📊 Data Coverage

| Category | Count |
|----------|-------|
| Hospitals | 27 |
| Doctors | 125+ |
| Specialties | 20+ |
| Labs | 11 |
| Medical Conditions | 17 |
| Symptoms | 14 |
| Medicines | 7 |
| First Aid Guides | 7 |
| Areas of Lahore | 14 |

---

## 🛠️ Built With

- **[Kiro](https://kiro.dev)** — AI-powered development environment
- **AWS Lambda** — Serverless compute
- **Remix Icons** — UI icons
- **Inter Font** — Typography
- **Pure JavaScript** — Zero external dependencies for ML

---

## ⚠️ Disclaimer

CureBot is **not a replacement for professional medical advice**. It provides general health information only. Always consult a qualified healthcare provider for diagnosis and treatment. In emergencies, call **1122** immediately.

## AUTHOR
Areebah Moeed Abbasi

---

## 📄 License

MIT
