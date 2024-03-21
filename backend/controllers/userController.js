const {ErrorHandler} = require('../utils/ErrorHandler')
const UserCollection = require('../models/userModel')
const setCookie = require('../utils/cookie')
const bcrypt = require('bcrypt')

const register = async (req, res, next) => {

    const {name, email, password, confirmPassword} = req.body

    try {

        // checking validations
        if(!name || !email || !password || !confirmPassword) return next(new ErrorHandler("All Fields are required", 400))

        if (name.length < 3) return next(new ErrorHandler("Please enter a valid name. It should be at least 3 characters long.", 400))

        if (!email.includes('@')) return next(new ErrorHandler("Please enter a valid email address.", 400))

        if (password.length < 8) return next(new ErrorHandler("Your password is too weak. It should be at least 8 characters long.", 400))

        if (password !== confirmPassword) return next(new ErrorHandler("Password and confirm password do not match.", 400))

        const user = await UserCollection.findOne({email})

        // checking whether same email is already exist or not if yes then showing error
        if(user) return next(new ErrorHandler("User Already Exists", 400))


        // creating new user now

        // hashing password first
        const hashed_password = await bcrypt.hash(password, 10)
        const new_user = await UserCollection.create({name, email, password : hashed_password, confirmPassword : hashed_password})

        // getting first word of name
        const words = name.split(' ');
        const UserfirstName = words.slice(0, 1).join(' ');

        // setting cookie
        return setCookie(res, new_user._id, 201, `${UserfirstName} registered successfully`)
    } catch (error) {
        console.log(error.message)
        return next(new ErrorHandler('Internal Server Error', 500));
    }
    
}

const login = async (req, res, next) => {
    const {email, password} = req.body
    
    try {

        // here checking whether user provided all the fields or not
        if(!email || !password) return next(new ErrorHandler("All Fields are required", 400))

        if (!email.includes('@')) return next(new ErrorHandler("Please enter a valid email address.", 400))

        if (password.length < 8) return next(new ErrorHandler("Your password is too weak. It should be at least 8 characters long.", 400))

        // get the user of particular email
        const user = await UserCollection.findOne({email}).select('+password')

        // if not exists or wrong email or wrong password
        if(!user){
            return next(new ErrorHandler('Invalid email or password', 404))
        }
        
        // now checking password
        const password_match = await bcrypt.compare(password, user.password)

        // getting first word of name
        const words = user.name.split(' ');
        const UserfirstName = words.slice(0, 1).join(' ');
        
        // if password is correct
        if(password_match){
            return setCookie(res, user._id, 200, `Welcome ${UserfirstName}`)
        }  
        
        // else password is not correct
        return next(new ErrorHandler('Invalid email or password', 404))
    } catch (error) {
        console.log(error.message)
        return next(new ErrorHandler('Internal Server Error', 500));
    }
}


const logout = (req, res, next) => {

    // deleting token
    try {
        res.status(200).cookie("token", "", {expires : new Date(Date.now()), 
        sameSite : process.env.NODE_ENV === "Development" ? "lax" : "none", 
        secure :   process.env.NODE_ENV === "Development" ? false : true
    }).json({
            success : true,
            message : "logged out"
        })
    } catch (error) {
        console.log(error.message)
        return next(new ErrorHandler('Internal Server Error', 500));
    }
}

const getProfile = async (req, res, next) => {
    try {
        // Finding user in the database
        const profile = await UserCollection.findById(req.user._id);

        // User is not available
        if (!profile) {
            return next(new errorMiddleware("Profile not found", 404));
        }

        // Returning data of a particular user
        res.status(200).json({
            success: true,
            profile
        });
    } catch (error) {
        console.error(error);
        return next(new errorMiddleware("Internal Server Error", 500));
    }
};


module.exports = {register, login, logout, getProfile}