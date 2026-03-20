# Skill-Bridge Career Navigator

Bridge the gap between what candidates know and what roles demand.

`Skill-Bridge Career Navigator` is an AI-powered platform for students, recent graduates, and career switchers who want a concrete, data-backed path to their dream role. It analyzes a candidate profile (resume PDF + self-description) against a target job description, then generates:

- a match score
- missing skills with severity
- technical and behavioral mock interview questions
- a day-wise preparation roadmap
- a tailored, downloadable resume

## Problem We Solve
Students and early-career professionals often struggle to convert academic knowledge into market-ready skills. Job boards, courses, and certifications are scattered across platforms, so users lack a clear and personalized "what to do next" plan.

Skill-Bridge turns this ambiguity into a focused action plan.

## Target Audience
- Recent graduates deciding which skills and certifications matter most.
- Career switchers identifying transferable skills and critical gaps.
- Mentors/coaches who need structured, explainable guidance for mentees.

## Core Value Proposition
- `Clarity of Path`: Users get an actionable roadmap, not generic advice.
- `Data Integration`: Resume content is parsed and combined with job requirements.
- `AI with Fallback`: Structured AI outputs are schema-validated and guarded with deterministic fallbacks.

## Key Features
- AI Gap Analysis Dashboard
  - Computes role match score.
  - Highlights missing skills with severity (`low`, `medium`, `high`).
- Dynamic Learning & Prep Roadmap
  - Generates day-wise focus areas and task lists.
- Interview Pivot Engine
  - Produces technical + behavioral questions with interviewer intent and model answers.
- Resume Optimizer
  - Generates a tailored ATS-friendly resume and exports PDF.
- Report History
  - Stores and retrieves previous analyses for each user.

## System Architecture
```text
React (Vite) Frontend
        |
        v
Express API (Auth + Interview Modules)
        |
        +--> PDF Parsing (pdf-parse)
        +--> AI Orchestration (@google/genai + Zod JSON schema)
        +--> Resume PDF Rendering (Puppeteer)
        |
        v
MongoDB (Users, Reports, Token Blacklist)
```

## Tech Stack
- Frontend: React 19, Vite, React Router, Axios, SCSS
- Backend: Node.js, Express 5, MongoDB/Mongoose
- AI/Validation: Google GenAI SDK, Zod, zod-to-json-schema
- File Handling: Multer (in-memory), pdf-parse
- PDF Generation: Puppeteer
- Auth: JWT + HTTP cookies + token blacklist

## How It Works
1. User signs up/logs in.
2. User submits:
   - job description
   - resume PDF and/or self-description
3. Backend extracts resume text and calls the AI service with strict JSON schema.
4. Platform stores a structured report containing:
   - `matchScore`
   - `technicalQuestions`
   - `behavioralQuestions`
   - `skillGaps`
   - `preparationPlan`
5. User reviews report and can download a custom resume PDF.

## AI Reliability and Fallback Strategy
To avoid brittle LLM behavior:

- Schema-constrained generation using Zod + JSON schema.
- Graceful defaulting if fields are partially missing.
- Deterministic match score fallback based on resume/JD skill overlap if AI score is missing.
- Severity normalization (`High` -> `high`) to satisfy DB enums.

This keeps the experience stable even when model outputs vary.

## API Overview
### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/logout`
- `GET /api/auth/get-me`

### Career/Interview Intelligence
- `POST /api/interview/` -> create a new report (multipart with resume)
- `GET /api/interview/report/:interviewId` -> fetch one report
- `GET /api/interview/` -> list user reports
- `POST /api/interview/resume/pdf/:interviewReportId` -> generate custom resume PDF

## Local Setup
### 1) Clone and install
```bash
git clone https://github.com/sudhanshu1239g/paloAlto-Project.git
cd genAiResumeProject

cd backend && npm install
cd ../frontend && npm install
```

### 2) Configure backend environment
Create `backend/.env`:

```env
MONGO_URi=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_GENAI_API_KEY=your_google_genai_api_key
```

### 3) Run backend
```bash
cd backend
npm run dev
```

Backend runs on: `http://localhost:8000`

### 4) Run frontend
```bash
cd frontend
npm run dev
```

Frontend runs on: `http://localhost:5173`

## Suggested Demo Script
1. Register/login as a new user.
2. Paste a real job description for a target role.
3. Upload a resume PDF (or add a self-description).
4. Generate report and walk through:
   - match score
   - skill gap tags
   - interview question sets
   - day-wise roadmap
5. Download the tailored resume PDF.

## Success Metrics Mapping
- `Clarity of Path`: Day-wise roadmap + prioritized skill gaps.
- `Data Integration`: Resume parsing + JD comparison + persistent report history.
- `AI Application`: Structured generation with robust fallbacks and defensive normalization.

## Current Scope and Next Iteration
### In scope now
- Single-job-description analysis
- Personalized interview and preparation report
- Resume PDF regeneration

### High-impact next upgrades
- Multi-job aggregation (100+ postings per role) for stronger market signal.
- GitHub profile ingestion for project/stack evidence.
- Course/certification recommendations (free + paid) with duration and difficulty.
- Mentor view with shareable progress snapshots.

## License
This project is currently unlicensed. Add a `LICENSE` file (e.g., MIT) before public distribution.

