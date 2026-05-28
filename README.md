# 🩺 CureBot - Lahore AI Medical Assistant

AI-powered medical appointment and lab booking agent for Lahore, Pakistan.  
Fully serverless on AWS (Lambda + API Gateway).

## Architecture

```
Frontend (S3/Amplify)  →  API Gateway (HTTP API)  →  Lambda (Node.js 20.x)
     ↑                         ↓                          ↓
  Chat UI              POST /chat route           NLP Intent Parser
                       GET /chat (health)         Booking Logic
                       CORS enabled               Lahore Healthcare Data
```

## Features

- 🏥 Book appointments at 5 major Lahore hospitals
- 🧪 Book lab tests at 4 diagnostic centers
- 📍 Location-aware suggestions (DHA, Gulberg, Johar Town, Model Town, Garden Town)
- 🧠 Natural language understanding (intent parsing)
- 🚨 Emergency contacts and hospital info
- 📋 Test preparation instructions
- 🔄 Reschedule/cancel bookings

## Supported Hospitals

| Hospital | Area |
|----------|------|
| Shaukat Khanum Memorial | Johar Town |
| Mayo Hospital | Anarkali |
| Services Hospital | Jail Road |
| Hameed Latif Hospital | Garden Town |
| National Hospital | DHA |

## Supported Labs

| Lab | Areas |
|-----|-------|
| Chughtai Lab | Gulberg, DHA, Johar Town, Model Town, Garden Town |
| Excel Labs | DHA, Gulberg, Johar Town |
| Al Razi Healthcare | Gulberg, Model Town |
| Dr. Essa Lab | DHA, Garden Town, Johar Town, Model Town |

## Deployment

### Prerequisites

- AWS CLI configured (`aws configure`)
- PowerShell (Windows) or Bash (Linux/Mac)
- IAM user with permissions for Lambda, API Gateway, IAM

### Deploy (Windows PowerShell)

```powershell
.\deploy.ps1
```

### Deploy (Linux/Mac Bash)

```bash
chmod +x deploy.sh
./deploy.sh
```

### What the script does:

1. Creates IAM execution role for Lambda
2. Packages and deploys `index.mjs` as Lambda function `curebot-api`
3. Creates HTTP API Gateway with CORS
4. Creates Lambda integration (payload v2.0)
5. Creates `POST /chat` and `GET /chat` routes
6. Deploys `prod` stage with auto-deploy
7. Adds Lambda invoke permission for API Gateway

## Testing

After deployment, you'll get a URL like:
```
https://xxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/chat
```

### Health Check
```bash
curl https://YOUR_API_URL/prod/chat
```

### Chat Examples
```bash
# Greeting
curl -X POST YOUR_URL -H "Content-Type: application/json" -d "{\"message\":\"hello\"}"

# Book appointment
curl -X POST YOUR_URL -H "Content-Type: application/json" -d "{\"message\":\"Book appointment at Mayo Hospital tomorrow morning\"}"

# Book lab test
curl -X POST YOUR_URL -H "Content-Type: application/json" -d "{\"message\":\"Book blood test at Chughtai Lab\"}"

# Find hospital
curl -X POST YOUR_URL -H "Content-Type: application/json" -d "{\"message\":\"Find nearest hospital in Gulberg\"}"

# Emergency
curl -X POST YOUR_URL -H "Content-Type: application/json" -d "{\"message\":\"emergency\"}"
```

## Frontend

Open `frontend/index.html` in a browser, paste your API URL, and start chatting.

For production hosting, upload `frontend/` to S3 with static website hosting or deploy via AWS Amplify.

## API Reference

### POST /chat

**Request:**
```json
{ "message": "Book blood test at Chughtai Lab tomorrow" }
```

**Response:**
```json
{
  "reply": "✅ Lab test booking initiated!...",
  "intent": "book_lab_test",
  "entities": {
    "lab": "Chughtai Lab",
    "testType": "blood test",
    "date": "tomorrow"
  },
  "booking": {
    "id": "LAB-XXXXXX",
    "type": "lab_test",
    "status": "pending"
  }
}
```

### GET /chat (Health Check)

**Response:**
```json
{
  "service": "CureBot",
  "status": "active",
  "version": "1.0.0"
}
```

## Security

- No AWS credentials exposed in frontend
- Lambda uses IAM execution role (least privilege)
- API Gateway handles CORS
- No sensitive data stored without consent
- All communication over HTTPS
