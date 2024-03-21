import React, {useState} from "react";
import styles from '../styles/popup1.module.css'
import toast from "react-hot-toast";

const Popup1 = ({quizName, setQuizName, setQuizType, hidePopup1, setCreateQuiz, setDashboard, setHidePopup1}) => {

  const [qa, setQa] = useState(true)
  const [poll, setPoll] = useState(false)


  const handleQA = () => {
    setQuizType("Q&A")
    setQa(true)
    setPoll(false)
  }

  const handlePoll = () => {
    setQuizType("Poll")
    setPoll(true)
    setQa(false)
  }
  
  return (
    <div
      style={{ display: hidePopup1 ? "none" : "flex" }}
      onClick={(e) => e.stopPropagation()}
      className={styles.popup_1}
    >
      <input
        type="text"
        name="quizName"
        id="quizName"
        placeholder="Quiz name"
        onChange={(e) => setQuizName(e.target.value)}
      />
      <div className={styles.quizType}>
        <span>Quiz Type</span>
        <button
          onClick={handleQA}
          className={`${styles.qa} ${qa ? styles.greenColor : styles.whiteBg}`}
        >
          Q&A
        </button>
        <button
          onClick={handlePoll}
          className={`${styles.poll} ${
            poll ? styles.greenColor : styles.whiteBg
          }`}
        >
          Poll Type
        </button>
      </div>
      <div className={styles.cancelContinue}>
        <button
          onClick={() => {
            setCreateQuiz(false);
            setDashboard(true);
          }}
          className={styles.cancelbtn}
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (!quizName.trim()) {
              toast.error('Quiz name is required');
            } else {
              setHidePopup1(true);
            }
          }}
          className={styles.continuebtn}
        >
          Continue
        </button>

      </div>
    </div>
  );
};

export default Popup1;
