const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URi)
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.log('Error connecting to MongoDB:', error)
  }
}

module.exports = connectDB