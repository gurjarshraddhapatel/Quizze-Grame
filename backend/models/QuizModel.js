const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    optionType: {
        type: String,
        enum: ['text', 'url', 'textandurl'],
        required: true,
    },
    options: [{
        type: String,
        required: true,
    }],
    totalParticipants: {
        type: Map,
        of: Number,
        default: {}
    },
    correctAnswer: {
        type: String,
        required: true,
    },
    correctCount: {
        type: Number,
        default: 0,
    },
    incorrectCount: {
        type: Number,
        default: 0,
    },
});

const QuizSchema = new mongoose.Schema({
    quizName: {
        type: String,
        required: true,
    },
    quizType: {
        type: String,
        enum: ['Q&A', 'Poll'],
        required: true,
    },
    questions: [QuestionSchema], // Array of questions
    impressions : {
        type : Number,
        default : 0,
    },
    timer: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserCollection',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const QuizCollection = mongoose.model('QuizCollection', QuizSchema);

module.exports = QuizCollection;
