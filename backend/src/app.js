const express = require('express')
const connectDB = require('./config/database')
const cookiesParser = require('cookie-parser')
const cors=require('cors')



connectDB()

const app = express()

app.use(express.json())
app.use(cookiesParser())
app.use(cors({

  origin:"http://localhost:5173",
  credentials:true

}))

const authRouter = require('./routes/auth.routes')
const interviewRouter = require("./routes/interview.routes")

app.use('/api/auth', authRouter)
app.use("/api/interview", interviewRouter)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

module.exports = app