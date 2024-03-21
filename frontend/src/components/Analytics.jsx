import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/analytics.module.css";
import del from "../assets/delete.png";
import edit from "../assets/edit.png";
import share from "../assets/share.png";
import { Link } from "react-router-dom";
import { Context } from "..";
import axios from "axios";
import { quizServer } from "../App";
import toast from "react-hot-toast";
import Viewquizanalysis from "./Viewquizanalysis";
import Viewpollanalysis from "./Viewpollanalysis";
import Updatequiz from "./Updatequiz";
import Sharepopup from "./Sharepopup";

const Analytics = ({quizId, quizType, setAnalytics, setDashboard, getLink, setGetLink}) => {
  const { user, setUser, loading, setLoading, isAuthenticated, setIsAuthenticated } = useContext(Context)
  const [quizes, setQuizes] = useState([{}])
  const [deleteQuizID, setDeleteQuizID] = useState("")
  const [viewquizanalysis, setViewquizanalysis] = useState(false)
  const [viewpollanalysis, setViewpollanalysis] = useState(false)
  const [currentQuizID, setcurrentQuizID] = useState("")
  const [updateQuiz, setUpdateQuiz] = useState(false)
  const [quizTobeUpdate, setQuizTobeUpdate] = useState("")

  const getAllQuizes = async (userId) => {
    if (!userId) {
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:4000/api/v1/quiz/getAllQuizes/${userId}`, {
        withCredentials: true,
      });
      setLoading(false);
      setIsAuthenticated(true);
      const quizzesByDate = data.quizzesByDate || [];
      setQuizes(quizzesByDate);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };
  

  const handleShareQuiz = (id, type) => {
    let link;
    if (type === "Q&A") {
      link = `http://localhost:3000/playQuiz/${id}`;
    } else if (type === "Poll") {
      link = `http://localhost:3000/Poll/${id}`;
    } else {
      link = "";
    }
    
  
    if (link !== "") {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(link)
          .then(() => toast.success("Link Copied to clipboard"))
          .catch(err => console.error('Failed to copy text: ', err));
      } else {
        // If Clipboard API is not available, use document.execCommand
        const textarea = document.createElement("textarea");
        textarea.value = link;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        toast.success("Link Copied to clipboard");
      }
    } else {
      toast.error("No link is available. Please try again later.");
    }
  }

  const handleQuizAnalysis = (type, id) => {
    if(type === "Q&A"){
      setcurrentQuizID(id)
      setViewquizanalysis(true)
    }
    if(type === "Poll"){
      setcurrentQuizID(id)
      setViewpollanalysis(true)
    }
  }
  

  const handleDeletion = async () => {
    setLoading(true)
    try {
      const { data } = await axios.delete(`http://localhost:4000/api/v1/quiz/delete-quize/${deleteQuizID}`, { withCredentials: true });
      setLoading(false)
      toast.success(data.message)
      setIsAuthenticated(true)
    } catch (error) {
      toast.error(error.response.data.message)
      console.error('Error deleting quiz:', error);
    }
    setDeleteQuizID("")
    getAllQuizes(user._id)
  };

  useEffect(() => {
    if (user && user._id) {
      getAllQuizes(user._id);
    }
  }, [user]);

  return (
    <>
      {viewquizanalysis ? (
        <Viewquizanalysis currentQuizID={currentQuizID} />
      ) : viewpollanalysis ? (
        <Viewpollanalysis currentQuizID={currentQuizID} />
      ) : (
        <div className={styles.analytics}>
          <h2>Quiz Analytics</h2>
          <div className={styles.table_div}>
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Quiz Name</th>
                  <th>Created on</th>
                  <th>Impression</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              {loading ? (
                <tbody>
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center' }}>
                      Loading...
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {quizes.map((quiz, index) => {
                    const createdDate = new Date(quiz.createdAt);
                    const formattedDate = createdDate.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{quiz.quizName}</td>
                        <td>{formattedDate}</td>
                        <td>{quiz.impressions >= 1000 ? (quiz.impressions / 1000).toFixed(1) + "k" : quiz.impressions}</td>
                        <td className={styles.images}>
                          <img onClick={() => {setUpdateQuiz(true); setQuizTobeUpdate(quiz._id)}} src={edit} alt="description" />
                          <img onClick={() => setDeleteQuizID(quiz._id)} src={del} alt="description" />
                          <img onClick={() => handleShareQuiz(quiz._id, quiz.quizType)} src={share} alt="description" />
                        </td>
                        <td>
                          <Link onClick={() => {handleQuizAnalysis(quiz.quizType, quiz._id)}}>Question Wise Analysis</Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              )}
            </table>
          </div>
        </div>
      )}
      {deleteQuizID !== "" ? (
        <div onClick={() => setDeleteQuizID("")} className={styles.dark_overlay}>
          <div onClick={(e) => e.stopPropagation()} className={styles.deletePopup}>
            <span>Are you confirm you want to delete ?</span>
            <div className={styles.btn}>
              <button onClick={handleDeletion} className={styles.deletebtn}>Confirm Delete</button>
              <button onClick={() => setDeleteQuizID("")} className={styles.cancelbtn}>Cancel</button>
            </div>
          </div>
        </div>
      ) : null}

      {
        getLink ?  
        <div className={styles.dark_overlay}>
          <Sharepopup quizId={quizId} quizType={quizType} setAnalytics={setAnalytics} setGetLink={setGetLink}/>
        </div>

        :

        null
      }

      {
        updateQuiz ? 

        <div className={styles.dark_overlay}>
            <Updatequiz updateQuiz={updateQuiz} setUpdateQuiz={setUpdateQuiz} quizTobeUpdate={quizTobeUpdate}/>
        </div>

        :

        null
      }
    </>
  );
};

export default Analytics;
