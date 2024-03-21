const jwt = require('jsonwebtoken')
const {ErrorHandler} = require("../utils/ErrorHandler")
const bookUserCollection = require('../models/userModel')

const isAuthenticated = async (req, res, next) => {
    try {
        const {token} = req.cookies
        
        if(!token) return next(new ErrorHandler('Login First', 404))
        
        const data = jwt.verify(token, "eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwOTYzNjMwNCwiaWF0IjoxNzA5NjM2MzA0fQ")
        req.user = await bookUserCollection.findById(data._id)
        next()
    } catch (error) {
        next(new ErrorHandler(error.message, 500))
    }

}

module.exports = isAuthenticated