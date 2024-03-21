const jwt = require('jsonwebtoken')

const setCookie = (res, user_id, statusCode, message) => {
    const token = jwt.sign({_id : user_id}, "eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwOTYzNjMwNCwiaWF0IjoxNzA5NjM2MzA0fQ")

    res.status(statusCode).cookie('token' , token , { 
        httpOnly : true, 
        maxAge : 24 * 60 * 60 * 1000,
        sameSite : process.env.NODE_ENV === "Development" ? "lax" : "none", 
        secure :   process.env.NODE_ENV === "Development" ? false : true
    }).json({
        success : true,
        message
    })
}

module.exports = setCookie