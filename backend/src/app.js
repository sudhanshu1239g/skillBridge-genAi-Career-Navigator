const express = require('express')
const connectDB = require('./config/database')
const cookiesParser = require('cookie-parser')


connectDB()

const app = express()

app.use(express.json())
app.use(cookiesParser())

const authRouter = require('./routes/auth.routes')
app.use('/api/auth', authRouter)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

module.exports = app