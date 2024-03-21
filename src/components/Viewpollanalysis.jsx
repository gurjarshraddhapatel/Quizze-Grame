import React, { useContext, useEffect, useState } from 'react'
import styles from "../styles/viewpollanalysis.module.css";
import { Context } from '..';
import toast from 'react-hot-toast';
import axios from 'axios';
import { quizServer } from '../App';

const Viewpollanalysis = ({currentQuizID}) => {
    const {loading, setLoading} = useContext(Context)
    const [quiz, setQuiz] = useState(null)

    const getQuiz = async () => {
        setLoading(true)
        try {
            const {data} = await axios.get(`http://localhost:4000/api/v1/quiz/getQuizForUpdate/${currentQuizID}`, { withCredentials: true });
            console.log(data)
            setQuiz(data.quiz);
            setLoading(false)
        } catch (err) {
            setLoading(false)
            console.error(err.message);
            console.log(err)
            toast.error(`Error: ${err.message}`);
        }
    };

    useEffect(() => {
        getQuiz()
    }, [])

    if (!quiz) {
        return <div>Loading...</div>;
    }

    // console.log(quiz)

    return (
        <div className={`container ${styles.parent}`}>
            <section className={styles.section_1}>
                <h1>{quiz.quizName} Question Analysis</h1>
                <div>
                    <p>Created on : {new Date(quiz.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</p>
                    <p>Impressions : {quiz.impressions}</p>
                </div>
            </section>
            <br />
            <br />
            {quiz.questions.map((question, index) => (
    <div key={index} className={styles.question_box}>
        <h2>Q.{index + 1} {question.question}</h2>
        <br />
        <section className={styles.question_div}>
            {Object.entries(question.totalParticipants).map(([option, count], optionIndex) => (
                <div key={optionIndex}>
                    <span>{count}</span>
                    <p>Option {optionIndex + 1}</p>
                </div>
            ))}
        </section>
        <br />
        <br />
        <hr />
        <br />
    </div>
))}
        </div>
    )
}

export default Viewpollanalysis;

