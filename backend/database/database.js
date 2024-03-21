const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const db = await mongoose.connect("mongodb+srv://sp4600788:sp4600788@quiz.qjc7ati.mongodb.net/Quizze?retryWrites=true&w=majority&appName=quiz")
        console.log(`Database is connected with ${db.connection.host}`)
    } catch (error) {
        console.log(error.message)
        console.log("Database not connected")
    }
}

module.exports = connectDB  