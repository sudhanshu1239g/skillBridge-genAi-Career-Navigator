# Design Documentation
## Skill-Bridge Career Navigator

## 1. Purpose
This document explains the system design of the Skill-Bridge Career Navigator platform, including:

- Key product and engineering design choices
- Technical stack (languages, frameworks, libraries, AI model)
- AI pipeline decisions and fallback strategy
- Scalability, security, and operational considerations
- Planned future enhancements

## 2. Product Goal and Design Intent
Skill-Bridge is designed to help students, recent graduates, and career switchers bridge the gap between current profile strength and real job requirements.

The product design prioritizes:

- Clarity: Provide concrete next steps (not generic advice)
- Personalization: Tailor output to user profile + target role
- Reliability: Keep output usable even when AI responses are imperfect
- Simplicity: Deliver results through a low-friction, single-flow UX

## 3. High-Level System Design
```text
Frontend (React + Vite)
  -> Handles auth UI, report generation forms, report visualization

Backend (Node.js + Express)
  -> Auth routes (register/login/logout/get-me)
  -> Interview intelligence routes (generate/fetch reports, generate resume PDF)

Data & AI Pipeline
  -> Resume upload (Multer memory storage)
  -> Resume text extraction (pdf-parse)
  -> Structured AI generation (@google/genai + Zod schema)
  -> Output normalization + fallback scoring
  -> Persistence to MongoDB
  -> Resume PDF generation via Puppeteer (on-demand)
```

## 4. Core Design Choices
### 4.1 Monorepo-style split (`frontend/` + `backend/`)
Choice:
- Keep frontend and backend in separate folders with independent dependency trees and scripts.

Why:
- Clear responsibility boundaries
- Faster iteration for full-stack teams
- Easier future migration to separate deployments

### 4.2 RESTful API Layer (Express)
Choice:
- Use REST endpoints for auth and report operations.

Why:
- Easy to integrate with React frontend
- Straightforward debugging in local dev and demos
- Low complexity compared to GraphQL for current scope

### 4.3 Cookie + JWT Authentication with Blacklist
Choice:
- JWT token in cookie; invalidate via token blacklist on logout.

Why:
- Lightweight auth model for MVP
- Improves logout control versus stateless-only JWT
- Suitable for role-based expansion later

### 4.4 Resume Parsing First, AI Second
Choice:
- Extract raw text from uploaded PDF, then pass parsed text into AI pipeline.

Why:
- Creates deterministic preprocessing stage
- Avoids model handling binary files directly
- Supports future parser upgrades (DOCX/GitHub profile ingestion)

### 4.5 Structured AI Output with Schema Constraints
Choice:
- Define expected response fields using Zod and provide JSON schema to the generation call.

Why:
- Reduces output unpredictability
- Makes database writes safer
- Enables robust frontend rendering without excessive null handling

### 4.6 Defensive Normalization and Fallbacks
Choice:
- Apply field-level defaults, severity normalization, and heuristic fallback for `matchScore`.

Why:
- LLM outputs can vary in shape and completeness
- Ensures consistent user experience
- Prevents avoidable runtime errors and schema violations

## 5. Technical Stack
### 5.1 Programming Languages
- JavaScript (frontend + backend)
- SCSS (styling)

### 5.2 Frontend Stack
- React 19
- Vite 8
- React Router
- Axios
- Sass/SCSS

### 5.3 Backend Stack
- Node.js
- Express 5
- MongoDB with Mongoose
- Multer (file upload handling, memory storage)
- pdf-parse (resume text extraction)
- Puppeteer (HTML-to-PDF resume output)
- bcryptjs (password hashing)
- jsonwebtoken (JWT issuance/verification)
- cookie-parser, cors, dotenv

### 5.4 AI Stack
- `@google/genai` SDK
- Model used in current implementation: `gemini-3-flash-preview`
- Structured response approach: `zod` + `zod-to-json-schema`

## 6. AI Pipeline Design
### 6.1 Inputs
- Resume text (from parsed PDF)
- User self-description
- Target job description

### 6.2 Prompting Strategy
- Task-specific role framing (technical interviewer/career evaluator)
- Explicit schema and response contract expectations

### 6.3 Structured Output Contract
Expected entities:
- `matchScore`
- `technicalQuestions[]` (`question`, `intention`, `answer`)
- `behavioralQuestions[]` (`question`, `intention`, `answer`)
- `skillGaps[]` (`skill`, `severity`)
- `preparationPlan[]` (`day`, `focus`, `tasks[]`)

### 6.4 Reliability Controls
- JSON cleanup and parsing safeguards
- Enum normalization (`High` -> `high`)
- Default-value substitution where fields are missing
- Fallback deterministic score calculation based on JD/resume overlap

## 7. Data Model Summary
### 7.1 User
- Username, email, password hash

### 7.2 InterviewReport
- `title`, `user`, `resume`, `selfDescription`, `jobDescription`
- `matchScore`
- `technicalQuestions`, `behavioralQuestions`
- `skillGaps`, `preparationPlan`
- Timestamps for history and tracking

### 7.3 Blacklist
- Invalidated JWT tokens (for logout/session control)

## 8. API Design Summary
### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/logout`
- `GET /api/auth/get-me`

### Intelligence/Reports
- `POST /api/interview/` (multipart input)
- `GET /api/interview/report/:interviewId`
- `GET /api/interview/`
- `POST /api/interview/resume/pdf/:interviewReportId`

## 9. Security and Compliance Considerations
Current protections:
- Password hashing via bcrypt
- JWT verification middleware
- Token blacklist invalidation on logout
- Upload size limits for resume files

Recommended production hardening:
- HTTP-only, secure, same-site cookie strategy by environment
- Rate limiting and abuse controls
- Input validation (length/content constraints)
- Audit logging and centralized error tracking
- Secrets management via secure vault/env tooling

## 10. Performance and Scalability Notes
Current design favors correctness and MVP velocity.

Potential bottlenecks:
- AI generation latency
- PDF rendering via Puppeteer
- Synchronous per-request processing during report generation

Scale-ready upgrades:
- Queue-based async jobs for report and PDF generation
- Caching repeated JD analysis results
- Background workers for heavy PDF operations
- Horizontal API scaling with shared DB and stateless app instances

## 11. Tradeoffs and Limitations
- Uses single-role analysis per request (not multi-job aggregation yet)
- AI recommendations depend on model quality and prompt coverage
- Resume parsing currently PDF-first; richer profile sources are pending
- No native certification/course search integration in current version

## 12. Potential Future Enhancements
### Product Enhancements
- Multi-job market analysis (100+ postings per role)
- GitHub/portfolio ingestion for project-level signal
- Learning path recommendations mapped to free/paid resources
- Mentor dashboard with progress milestones and feedback loops
- Role transition planner for career switchers (transferable skill mapping)

### AI Enhancements
- Multi-stage pipelines (extract -> score -> recommend -> explain)
- Confidence scoring per recommendation
- Explainability layer for why each skill gap matters
- Model routing for cost/performance optimization

### Platform Enhancements
- RBAC for mentor/cohort/institution accounts
- Analytics dashboard for completion and engagement metrics
- Notification system for roadmap reminders and weekly progress
- Exportable progress reports for mentors and students

## 13. Conclusion
The current architecture balances fast delivery with practical reliability:

- A clean frontend-backend separation
- A structured AI pipeline with fallback protections
- Persistent reporting and actionable output for users

This provides a strong foundation for evolving Skill-Bridge from a capable MVP into a full career intelligence platform.

