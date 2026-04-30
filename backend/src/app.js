const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()


app.use(cors({
    origin: [
        "https://skill-bridge-gen-ai-career-navigato-indol.vercel.app",
        "http://localhost:5173"
    ],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

app.get("/", (req, res) => {
    res.send("backend is running");
});
/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)



module.exports = app