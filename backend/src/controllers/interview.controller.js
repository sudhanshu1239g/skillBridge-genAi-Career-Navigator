const pdfParse = require("pdf-parse")
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

        // 1. Using your specific library's syntax
        const pdfResult = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
        const extractedText = pdfResult.text;

        const { selfDescription, jobDescription, title } = req.body;

        // 2. Pass the extracted text to the AI
        const interViewReportByAi = await generateInterviewReport({
            resume: extractedText,
            selfDescription,
            jobDescription
        });
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            title: (title && title !== "undefined") ? title : "New Interview Analysis",
            resume: extractedText,
            selfDescription,
            jobDescription,

    // 1. Calculate a fallback matchScore if the AI forgets it
            matchScore: interViewReportByAi.matchScore || interViewReportByAi.match_score || 75,

            technicalQuestions: (interViewReportByAi.technicalQuestions || []).map(q => ({
                question: q.question || "Technical Question",
                intention: q.intention || "Assess technical depth",
                answer: q.answer || "No sample answer provided"
            })),

            behavioralQuestions: (interViewReportByAi.behavioralQuestions || []).map(q => ({
                question: q.question || "Behavioral Question",
                intention: q.intention || "Assess soft skills",
                answer: q.answer || "No sample answer provided"
            })),

    // 2. Fix the Enum Error (High -> high)
            skillGaps: (interViewReportByAi.skillGaps || []).map(gap => ({
                skill: gap.skill || "General Requirement",
                severity: String(gap.severity || "medium").toLowerCase() 
            })),

    // 3. Fix the "Focus" and "Tasks Array" Error
            preparationPlan: (interViewReportByAi.preparationPlan || []).map(plan => ({
                day: plan.day || 1,
        // Map AI 'task' to 'focus' if focus is missing
                focus: plan.focus || plan.task || "Skill Reinforcement",
        // Wrap the single AI 'task' string into an array [task]
                tasks: Array.isArray(plan.tasks) ? plan.tasks : [plan.task || "Review core concepts"]
            }))
        });


    res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport // <--- Using it here removes the warning!
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