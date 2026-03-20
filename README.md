# Skill-Bridge Career Navigator

An AI-powered career intelligence platform that helps learners and early-career professionals close the gap between current skills and real-world job requirements.

## Overview
Skill-Bridge Career Navigator transforms unstructured profile data (resume PDF and self-description) into a personalized career action plan for a target role.  
Instead of generic guidance, users receive role-specific insights:

- Match score for profile-to-role fit
- Missing skills prioritized by severity
- Tailored technical and behavioral mock interview questions
- Day-wise preparation roadmap
- Downloadable, ATS-friendly resume tailored to the chosen role

This project is designed for practical impact and demo-ready clarity in hackathon, capstone, and product prototype settings.

## Problem Statement
Students and career switchers often face a fragmented upskilling journey:

- Job requirements are spread across multiple postings and platforms
- Learning resources are abundant but difficult to prioritize
- Users lack a clear transition map from where they are to where they want to be

Skill-Bridge addresses this by generating a data-backed, personalized pathway from current profile to target role readiness.

## Target Audience
- Recent graduates identifying the most valuable certifications and technical priorities
- Career switchers mapping transferable skills and closing critical gaps
- Mentors and coaches who need structured, explainable growth plans for mentees

## Key Objectives
- Deliver concrete next steps, not abstract recommendations
- Use profile data and job requirement inputs in one unified analysis flow
- Apply AI responsibly with fallback logic when generation quality varies

## Feature Highlights
### 1) Skill Gap Analysis
- Evaluates resume/self-description against target job description
- Produces a role-fit score (`0-100`)
- Identifies missing skills with severity labels: `low`, `medium`, `high`

### 2) Dynamic Preparation Roadmap
- Generates day-wise plan (`day`, `focus`, `tasks[]`)
- Helps users prioritize learning efforts in a structured sequence

### 3) Mock Interview Engine
- Builds technical and behavioral question sets
- Includes interviewer intention and model answer guidance

### 4) Resume Regeneration
- Creates a customized, ATS-friendly resume based on target role context
- Exports generated resume to PDF

### 5) Report History
- Saves analyses per authenticated user
- Enables progress tracking across multiple role attempts

## Success Metrics Alignment
### Clarity of Path
- Day-wise roadmap and prioritized skill gaps reduce uncertainty

### Data Integration
- Resume parsing + profile context + job description analysis in a single pipeline

### AI Application Quality
- Schema-constrained output, normalization, and deterministic fallback behavior

## System Architecture
```text
[ React + Vite Frontend ]
        |
        v
[ Express API Layer ]
  | Auth Module
  | Interview Intelligence Module
        |
        +--> Resume Parsing (pdf-parse)
        +--> AI Generation (@google/genai)
        +--> Schema Validation (zod + zod-to-json-schema)
        +--> Resume PDF Rendering (puppeteer)
        |
        v
[ MongoDB ]
  | users
  | interviewreports
  | blacklists
```

## Technology Stack
### Frontend
- React 19
- Vite 8
- React Router
- Axios
- SCSS

### Backend
- Node.js + Express 5
- MongoDB + Mongoose
- Multer (in-memory file upload)
- pdf-parse (resume text extraction)
- Puppeteer (resume PDF generation)

### AI and Validation
- `@google/genai` for content generation
- `zod` and `zod-to-json-schema` for strongly-typed response contracts

### Authentication
- JWT-based auth via cookies
- Token blacklist for logout invalidation

## End-to-End Workflow
1. User authenticates (register/login).
2. User submits:
   - target job description
   - resume PDF and/or self-description
3. Backend extracts resume text from uploaded PDF.
4. AI service generates structured analysis.
5. Backend normalizes and persists report.
6. Frontend presents:
   - match score
   - skill gaps
   - interview questions
   - preparation roadmap
7. User can download a tailored resume PDF.

## AI Reliability and Fallback Design
To keep outputs production-friendly despite LLM variability:

- Strict schema guidance for expected response format
- Defensive parsing of AI JSON output
- Field-level defaults when optional data is missing
- Fallback scoring heuristic when `matchScore` is absent
- Severity normalization to satisfy enum constraints in persistence layer

This ensures the platform remains usable even under imperfect model responses.


## Data Model Snapshot
### Interview Report (core fields)
- `title`
- `user`
- `resume`
- `selfDescription`
- `jobDescription`
- `matchScore`
- `technicalQuestions[]` -> `question`, `intention`, `answer`
- `behavioralQuestions[]` -> `question`, `intention`, `answer`
- `skillGaps[]` -> `skill`, `severity`
- `preparationPlan[]` -> `day`, `focus`, `tasks[]`
- `createdAt`, `updatedAt`

## Local Development Setup
### Prerequisites
- Node.js (LTS recommended)
- npm
- MongoDB instance (local or cloud)
- Google GenAI API key

### 1) Clone repository
```bash
git clone https://github.com/sudhanshu1239g/paloAlto-Project.git
cd genAiResumeProject
```

### 2) Install dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3) Start backend
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:8000`

### 4) Start frontend
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

## Scripts
### Backend
- `npm run dev` -> start server with nodemon
- `npm start` -> start server with node

### Frontend
- `npm run dev` -> start Vite dev server
- `npm run build` -> production build
- `npm run preview` -> preview production build
- `npm run lint` -> run ESLint

## Demo Walkthrough
1. Create account and sign in.
2. Paste a target role job description.
3. Upload resume PDF (or provide self-description).
4. Generate analysis report.
5. Review:
   - Match score
   - Skill gap heat (severity tags)
   - Technical and behavioral interview sections
   - Day-wise preparation roadmap
6. Download customized resume PDF.

## Security and Operational Notes
- Auth relies on cookie token handling and blacklist invalidation on logout.
- Uploaded resumes are processed in memory via Multer; size limits are enforced.
- CORS is configured for local frontend origin (`http://localhost:5173`) in current setup.
- For production readiness, add:
  - secure cookie flags
  - stricter CORS controls
  - request validation and rate limiting
  - centralized logging and monitoring

## Current Scope
- Single job description analysis per report
- User-authenticated report history
- AI-generated interview prep + role-aligned resume PDF

## Planned Enhancements
- Multi-job aggregation for stronger market benchmarking
- GitHub/project profile ingestion for evidence-based skill mapping
- Course and certification recommendation engine (free + paid + duration)
- Mentor dashboard with progress milestones
- Explainability layer for score and recommendation rationale

## Contributing
Contributions are welcome. For meaningful pull requests:

- Keep changes focused and documented
- Follow existing code structure (`frontend/`, `backend/`)
- Include clear reproduction steps for bug fixes
- Update README/API docs when behavior changes

## License
This project is licensed under the MIT License
