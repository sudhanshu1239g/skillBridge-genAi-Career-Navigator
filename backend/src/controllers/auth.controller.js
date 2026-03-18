const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const tokenBlacklistModel = require('../models/blacklist.model')
/**
 * 
 * @name registerUserController
 * @description Registers a new user in the system.
 * @returns 
 */
async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body
        
        if(!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const existingUser = await userModel.findOne({ email })
        if(existingUser) {
            return res.status(400).json({ message: 'Email already registered' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        

        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword
        })
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' })

        res.cookie('token', token)
        res.status(201).json({ message: 'User registered successfully', user: newUser })
        

        

        res.status(201).json({ message: 'User registered successfully' })
    } catch (error) {
        console.error('Error registering user:', error)
        res.status(500).json({ message: 'Internal server error' })
    }

}
/**
 * 
 * @name loginUserController
 * @description Authenticates a user and provides a JWT token for session management.
 * @returns 
 */
async function loginUserController(req, res) {
    try {
        const { email, password } = req.body
        
        if(!email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const user = await userModel.findOne({ email })
        if(!user) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' })

        res.cookie('token', token)
        res.status(200).json({ message: 'Login successful', user })
    } catch (error) {
        console.error('Error logging in user:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

/**
 * 
 * @name logoutUserController
 * @description Logs out a user by clearing the authentication token and blacklisting it.
 * @returns
 */
async function logoutUserController(req, res) {
    try {
        const token = req.cookies.token
        if(token) {
            await tokenBlacklistModel.create({ token })   
        }
        res.clearCookie('token')
        res.status(200).json({ message: 'Logout successful' })
    } catch (error) {
        console.error('Error logging out user:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
    
}

async function getMeController(req, res) {
    try {
        const user = await userModel.findOne({ email: req.user.email })
        if(!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json({ user })
    } catch (error) {
        console.error('Error fetching user data:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}



module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}