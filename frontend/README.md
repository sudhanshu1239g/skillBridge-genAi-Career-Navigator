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
