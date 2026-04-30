const pdfParse = require('pdf-parse-fork');
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No PDF file uploaded" });
        }

        // 1. PDF Extraction
        const pdfResult = await pdfParse(req.file.buffer);
        const extractedText = pdfResult.text;
        const { selfDescription, jobDescription, title } = req.body;

        // 2. AI Generation
        const interViewReportByAi = await generateInterviewReport({
            resume: extractedText,
            selfDescription,
            jobDescription
        });

        // 3. YOUR SCORE LOGIC (Re-integrated)
        const calculateRealScore = (resume, jd) => {
            const resumeLower = (resume || "").toLowerCase();
            const jdLower = (jd || "").toLowerCase();

            const weights = {
                core: { list: ['react', 'node', 'express', 'mongodb', 'typescript', 'nextjs', 'javascript', 'golang', 'cpp', 'python'], val: 6 },
                tools: { list: ['docker', 'aws', 'git', 'kubernetes', 'jenkins', 'sql', 'rest', 'graphql'], val: 3 },
            };
            
            let score = 50; 
            Object.values(weights).forEach(group => {
                group.list.forEach(skill => {
                    if (resumeLower.includes(skill) && jdLower.includes(skill)) {
                        score += group.val;
                    }
                });
            });
            return Math.min(score, 98); 
        };

        // 4. Safety Helper for Array Mapping
        const ensureArray = (data) => Array.isArray(data) ? data : (data ? [data] : []);

        // 5. Database Entry
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            title: (title && title !== "undefined") ? title : "New Analysis",
            resume: extractedText,
            selfDescription,
            jobDescription,

            // Priority: AI Score -> Your Custom Logic -> 70 Default
            matchScore: interViewReportByAi.matchScore || interViewReportByAi.match_score || calculateRealScore(extractedText, jobDescription),

            technicalQuestions: ensureArray(interViewReportByAi.technicalQuestions).map(q => ({
                question: q.question || "Technical Question",
                intention: q.intention || "Assess technical depth",
                answer: q.answer || "No sample answer provided"
            })),

            behavioralQuestions: ensureArray(interViewReportByAi.behavioralQuestions).map(q => ({
                question: q.question || "Behavioral Question",
                intention: q.intention || "Assess soft skills",
                answer: q.answer || "No sample answer provided"
            })),

            skillGaps: ensureArray(interViewReportByAi.skillGaps).map(gap => ({
                skill: gap.skill || "General Requirement",
                severity: String(gap.severity || "medium").toLowerCase() 
            })),

            preparationPlan: ensureArray(interViewReportByAi.preparationPlan).map(plan => ({
                day: plan.day || 1,
                focus: plan.focus || plan.task || "Skill Reinforcement",
                tasks: Array.isArray(plan.tasks) ? plan.tasks : [plan.task || "Review core concepts"]
            }))
        });

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport 
        });

    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ message: "Error generating report", error: error.message });
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }