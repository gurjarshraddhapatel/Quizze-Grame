import React, { useContext } from "react";
import styles from "../styles/leftsidebar.module.css";
import { userServer } from "../App";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "..";
import { Navigate } from "react-router-dom";


const Leftsidebar = ({
  dashboard,
  setDashboard,
  analytics,
  setAnalytics,
  createQuiz,
  setCreateQuiz,
  setHidePopup1,
}) => {
  const handleDashboard = () => {
    setDashboard(true);
    setAnalytics(false);
    setCreateQuiz(false);
  };

  const handleAnalytics = () => {
    setAnalytics(true);
    setDashboard(false);
    setCreateQuiz(false);
  };

  const handleCreateQuiz = () => {
    setCreateQuiz(true);
    setHidePopup1(false);
    setDashboard(false);
    setAnalytics(false);
  };

  const {loading, setLoading, isAuthenticated, setIsAuthenticated} = useContext(Context)

  const logoutApi = async () => {
    setLoading(true)
    try {
      const {data} = await axios.get(`${userServer}/logout`, {withCredentials : true})
      setLoading(false)
      toast.success(data.message)
      setIsAuthenticated(false)
    } catch (error) {
      setIsAuthenticated(true)
      setLoading(false)
      toast.error(error.response.data.message)
    }
  } 

  if(isAuthenticated === false) return <Navigate to={'/'}/>
 
  return (
    <div className={styles.leftSideBar}>
      <h2>QUIZZIE</h2>
      <div className={styles.content}>
        <p
          onClick={handleDashboard}
          className={dashboard ? `${styles.borderForP}` : null}
        >
          Dashboard
        </p>
        <p
          onClick={handleAnalytics}
          className={analytics ? `${styles.borderForP}` : null}
        >
          Analytics
        </p>
        <p
          onClick={handleCreateQuiz}
          className={createQuiz ? `${styles.borderForP}` : null}
        >
          Create Quiz
        </p>
      </div>
      <div className={styles.logoutSection}>
        <div className={styles.line}></div>
        <span onClick={logoutApi}>{loading ? "wait..." : "LOGOUT"}</span>
      </div>
    </div>
  );
};

export default Leftsidebar;
