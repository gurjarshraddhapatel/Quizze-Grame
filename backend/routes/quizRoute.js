const express = require('express')
const {createQuiz, getAllQuizes, updateQuiz, getQuiz, getQuizForUpdate, deleteQuiz, checkAnswer} = require('../controllers/quizController')
const isAuthenticated = require('../middlewares/auth')

const router = express.Router()

router.post('/create-quiz', isAuthenticated, createQuiz)
router.get('/getAllQuizes/:id', isAuthenticated, getAllQuizes)
router.put('/update-quize/:quizId', isAuthenticated, updateQuiz)
router.get('/getQuiz/:quizId', getQuiz)
router.get('/getQuizForUpdate/:quizId', getQuizForUpdate)
router.delete('/delete-quize/:id', isAuthenticated, deleteQuiz)
router.post('/check-answer', checkAnswer)

module.exports = router