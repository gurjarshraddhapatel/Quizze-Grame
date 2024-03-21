import React, { useContext, useEffect, useState } from 'react';
import styles from "../styles/playquiz.module.css";
import axios from 'axios';
import { quizServer } from '../App';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '..';

const Playquiz = () => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timer, setTimer] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const {setUserScore} = useContext(Context)
  const [loading, setLoading] = useState(false)

  const getQuiz = async () => {
    try {
      const {data} = await axios.get(`http://localhost:4000/api/v1/quiz/getQuiz/${id}`, { withCredentials: true });
      setQuiz(data.quiz);
      setTimer(data.quiz.timer);
      setUserAnswers(data.quiz.questions.map(question => ({ _id: question._id, question: question.question, userAnswer: "" })));
    } catch (err) {
      console.error(err.message);
      console.log(err)
      toast.error(`Error: ${err.message}`);
    }
  };

  useEffect(() => {
    getQuiz();
  }, [id]);

  useEffect(() => {
    if (timer === 0) {
      if (quiz.timer !== 0) {
        if (currentQuestionIndex < quiz.questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setTimer(quiz.timer);
        } else {
          handleSubmit();
        }
      }
    } else {
      const timeout = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timeout);
    }
  }, [timer]);

  // useEffect(() => {
  //   console.log({ quizId: id, questions: userAnswers });
  // }, [timer]);

  if (!quiz) {
    return <div>Loading...</div>;
  }

  const question = quiz.questions[currentQuestionIndex];

  const handleOptionClick = (option) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex].userAnswer = option; 
    setUserAnswers(newUserAnswers);
  };

  const handleNextClick = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer(quiz.timer);
    }
  };

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const encodedUserAnswers = userAnswers.map(answer => ({
        ...answer,
        userAnswer: answer.userAnswer 
      }));
      const { data } = await axios.post(`http://localhost:4000/api/v1/quiz//check-answer`, { quizId: id, questions: encodedUserAnswers }, { withCredentials: true });
        if (quiz.quizType === 'Poll') {
            toast.success("Thanks for participating in the poll!");
            navigate('/Poll');
        } else {
            setUserScore(`${data.totalScore}/${currentQuestionIndex+1}`);
            toast.success("Quiz submitted successfully!");
            navigate('/result');
        }
        setLoading(false);
    } catch (error) {
        setLoading(false);
        console.error(error);
        toast.error("Something went wrong");
    }
};

// console.log(userAnswers)

  return (
    <div className={styles.parent}>
      <div className={styles.childBox}>
        <section className={styles.section_1}>
          <span>{currentQuestionIndex + 1}/{quiz.questions.length}</span>
          {quiz.quizType !== 'Poll' && <span className={styles.timer}>00:{timer}s</span>}
        </section>
        <h1>{question.question}</h1>
        <section className={styles.section_2}>
        {question.options.map((option, index) => {
            let optionText, optionUrl;
            if (question.optionType === 'textandurl') {
              [optionText, optionUrl] = option.split('|');
            }
            return (
              <div key={index} className={option === userAnswers[currentQuestionIndex]?.userAnswer ? styles.selectedOption : ''} onClick={() => handleOptionClick(option)} >
                {question.optionType === 'text' ? option : 
                 question.optionType === 'url' ? <img src={option} alt="Option" /> :
                 question.optionType === 'textandurl' ? <div className={styles.textAndUrl}><img src={optionUrl} alt="Option" /><p>{optionText}</p></div> : null}
              </div>
            );
          })}
        </section>
        {currentQuestionIndex < quiz.questions.length - 1 ? (
          <button onClick={handleNextClick}>Next</button>
        ) : (
          <button onClick={handleSubmit}>{loading ? "wait..." : "SUBMIT"}</button>
        )}
      </div>
    </div>
  )
}

export default Playquiz;

