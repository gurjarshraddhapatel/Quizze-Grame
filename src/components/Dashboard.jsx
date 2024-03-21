import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/dashboard.module.css";
import eye from "../assets/eye.png";
import { quizServer } from "../App";
import axios from "axios";
import { Context } from "..";

const Dashboard = ({ id }) => {
  const [quizes, setQuizes] = useState([]);
  const [quizes2, setQuizes2] = useState([]);
  const { user, loading, setLoading } = useContext(Context);

  useEffect(() => {
    getAllQuizes();
    fetchAllQuizes();
  }, [id]);

  const getAllQuizes = async () => {
    if (!id) {
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:4000/api/v1/quiz/getAllQuizes/${id}`, {
        withCredentials: true,
      });
      setLoading(false);
      const quizzesByImpressionsDesc = data.quizzesByImpressionsDesc || [];
      setQuizes(quizzesByImpressionsDesc);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const fetchAllQuizes = async () => {
    if (!id) {
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:4000/api/v1/quiz/getAllQuizes/${id}`, {
        withCredentials: true,
      });
      setLoading(false);
      const quizzesByImpressions = data.quizzesByImpressions || [];
      setQuizes2(quizzesByImpressions);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };
  

  const totalQuestions = quizes2.reduce((total, quiz) => total + quiz.questions.length, 0);

  // console.log(quizes);

  return (
    <div className={styles.dashboard}>
      <div className={styles.stats}>
        <div className={styles.quiz}>
          <p>
            {" "}
            <span>{quizes2.length}</span> Quiz
          </p>
          <p>Created</p>
        </div>
        <div className={styles.question}>
          <p>
            {" "}
            <span>{totalQuestions}</span> questions
          </p>
          <p>Created</p>
        </div>
        <div className={styles.total}>
          <p>
            {" "}
            <span>
              {quizes2.reduce((total, quiz) => total + quiz.impressions, 0) >= 1000
                ? (quizes2.reduce((total, quiz) => total + quiz.impressions, 0) / 1000).toFixed(1) + " K"
                : quizes2.reduce((total, quiz) => total + quiz.impressions, 0)}
            </span>{" "}
            Total Impressions
          </p>
        </div>
      </div>
      <div className={styles.box}>
        <p>Trending Quizzes</p>
        {
          loading ? 'Loading...' : 

            <div className={styles.trending}>
            {Array.isArray(quizes) &&
              quizes.map((quiz, index) => (
                <div className={styles.quizBox} key={index}>
                  <div className={styles.para1}>
                    <span>{quiz.quizName}</span>{" "}
                    <div className={styles.numberEye}>
                      <span>
                        {quiz.impressions >= 1000 ? (quiz.impressions / 1000).toFixed(1) + " K" : quiz.impressions}
                      </span>
                      <img src={eye} alt="" />
                    </div>
                  </div>
                  <p className={styles.para2}>
                    Created on : {new Date(quiz.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              ))}
          </div>
        }
      </div>
    </div>
  );
};

export default Dashboard;
