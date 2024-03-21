import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/createquiz.module.css";
import cross from "../assets/cross.png";
import plus from "../assets/plus.png";
import Typetext from "./Typetext";
import TypeURL from "./TypeURL";
import TypetextandURL from "./TypetextandURL";
import toast from "react-hot-toast";
import axios from "axios";
import { quizServer } from "../App";
import { Context } from "..";

const Createquiz = ({
  quizId,
  setQuizID,
  getLink,
  setGetLink,
  setAnalytics,
  setDashboard,
  setCreateQuiz,
  quizName,
  quizType,
  setQuizType,
}) => {
  const [questions, setQuestions] = useState([
    { question: "", optionType: "", options: ["", ""], correctAnswer: null },
  ]);
  const { loading, setLoading } = useContext(Context);
  const [currentOptionType, setCurrentOptiontype] = useState("text");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentOptions, setCurrentOptions] = useState([""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [count, setCount] = useState(1);
  const [timer, setTimer] = useState(0);

  const handleRemoveQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
    setCount(count - 1);

    let newIndex = currentIndex;
    if (index === currentIndex) {
      newIndex = Math.max(newQuestions.length - 1, 0);
    } else if (index < currentIndex) {
      newIndex = currentIndex - 1;
    }
    setCurrentIndex(newIndex);

    setOptions(newQuestions[newIndex]?.options || ["", ""]);
    setCorrectAnswer(newQuestions[newIndex]?.correctAnswer || null);
  };

  const handleClickonCircle = (index) => {
    setCurrentIndex(index);
    let currentOptionType = questions[index].optionType;

    if (currentOptionType === "") {
      currentOptionType = "text";
    }

    setCurrentOptiontype(currentOptionType);
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      question: "",
      optionType: "",
      options: ["", ""],
      correctAnswer: "",
    };
    setQuestions([...questions, newQuestion]);
    setCount(count + 1);
    setCurrentIndex(count);
    // setCurrentOptiontype("text");
  };

  useEffect(() => {
    setCurrentQuestion(questions[currentIndex]?.question || "");
    setCurrentOptions(questions[currentIndex]?.options || [""]);
  }, [currentIndex, questions]);

  // console.log(questions);
  // console.log(currentOptionType);
  const handleQuizCreation = async () => {
    // Validation

    let flag = true;
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question.trim()) {
        toast.error(`Question ${i + 1} is required`);
        flag = false;
        return;
      }
      if (!questions[i].optionType.trim()) {
        toast.error(`Option type for question ${i + 1} is required`);
        flag = false;
        return;
      }
      if (questions[i].options.length < 2) {
        toast.error(`Question ${i + 1} should have at least two options`);
        flag = false;
        return;
      }
      for (let j = 0; j < questions[i].options.length; j++) {
        if (!questions[i].options[j].trim()) {
          toast.error(`Option ${j + 1} for question ${i + 1} is required`);
          flag = false;
          return;
        }
      }
      if (
        questions[i].correctAnswer === "" ||
        questions[i].correctAnswer === null
      ) {
        toast.error(`Correct answer for question ${i + 1} is required`);
        flag = false;
        return;
      }
    }

    const obj = {
      quizName: quizName,
      quizType: quizType,
      questions: questions,
      timer: timer,
    };
    // console.log(obj);
    if (flag === true) {
      setLoading(true);
      try {
        const { data } = await axios.post(`http://localhost:4000/api/v1/quiz/create-quiz`, obj, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });

        setQuizID(data.quizId);
        setLoading(false);
        toast.success(data.message);
        setCreateQuiz(false);
        setAnalytics(true);
        setGetLink(true);
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while creating the quiz");
        setLoading(false);
        setDashboard(true);
        setCreateQuiz(false);
      }
    }
  };
  const obj = {
    quizName: quizName,
    quizType: quizType,
    questions: questions,
    timer: timer,
  };
  // console.log(obj);
  // console.log(quizType);
  return (
    <div className={styles.popup_2} onClick={(e) => e.stopPropagation()}>
      <section className={styles.section_1}>
        <div className={styles.circleAndPlus}>
          {Array.from({ length: count }).map((_, index) => (
            <div
              onClick={() => handleClickonCircle(index)}
              key={index}
              className={`${styles.circle} ${
                index === currentIndex ? styles.border : ""
              }`}
            >
              {index + 1}
              {count === 1 ? null : (
                <img
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveQuestion(index);
                    handleClickonCircle(Math.max(index - 1, 0));
                  }}
                  src={cross}
                  alt="cross img"
                />
              )}
            </div>
          ))}
          {count >= 5 ? null : (
            <img onClick={handleAddQuestion} src={plus} alt="add img" />
          )}
        </div>
        <span>Max 5 questions</span>
      </section>
      <section className={styles.section_2}>
        <input
          onChange={(e) => {
            const newQuestions = [...questions];
            newQuestions[currentIndex].question = e.target.value;
            setQuestions(newQuestions);
          }}
          value={
            questions[currentIndex] ? questions[currentIndex].question : ""
          }
          type="text"
          name="poll question"
          placeholder="Poll Question"
        />
        <div className={styles.optionType}>
          <span>Option Type</span>
          <label>
            <input
              type="radio"
              name="option"
              value="text"
              checked={questions[currentIndex]?.optionType === "text"}
              onChange={() => {
                setCurrentOptiontype("text");
                const newQuestions = [...questions];
                newQuestions[currentIndex].optionType = "text";
                setQuestions(newQuestions);
              }}
            />
            <span>Text</span>
          </label>
          <label>
            <input
              type="radio"
              name="option"
              value="url"
              checked={questions[currentIndex]?.optionType === "url"}
              onChange={() => {
                setCurrentOptiontype("url");
                const newQuestions = [...questions];
                newQuestions[currentIndex].optionType = "url";
                setQuestions(newQuestions);
              }}
            />
            <span>Image URL</span>
          </label>
          <label>
            <input
              type="radio"
              name="option"
              value="textandurl"
              checked={questions[currentIndex]?.optionType === "textandurl"}
              onChange={() => {
                setCurrentOptiontype("textandurl");
                const newQuestions = [...questions];
                newQuestions[currentIndex].optionType = "textandurl";
                setQuestions(newQuestions);
              }}
            />
            <span>Text & Image URL</span>
          </label>
        </div>
      </section>

      <section className={styles.section_3}>
        {currentOptionType === "text" && (
          <Typetext
            questions={questions}
            setQuestions={setQuestions}
            currentIndex={currentIndex}
          />
        )}
        {currentOptionType === "url" && (
          <TypeURL
            questions={questions}
            setQuestions={setQuestions}
            currentIndex={currentIndex}
          />
        )}
        {currentOptionType === "textandurl" && (
          <TypetextandURL
            questions={questions}
            setQuestions={setQuestions}
            currentIndex={currentIndex}
          />
        )}
      </section>
      {quizType === "Q&A" ? (
        <div className={styles.timer}>
          <span className={styles.text}>Timer</span>
          <span
            style={{
              backgroundColor: timer === 0 ? "#D60000" : "white",
              color: timer === 0 ? "white" : "#9F9F9F",
            }}
            onClick={() => setTimer(0)}
          >
            OFF
          </span>
          <span
            style={{
              backgroundColor: timer === 5 ? "#D60000" : "white",
              color: timer === 5 ? "white" : "#9F9F9F",
            }}
            onClick={() => setTimer(5)}
          >
            5 sec
          </span>
          <span
            style={{
              backgroundColor: timer === 10 ? "#D60000" : "white",
              color: timer === 10 ? "white" : "#9F9F9F",
            }}
            onClick={() => setTimer(10)}
          >
            10 sec
          </span>
        </div>
      ) : null}
      <section className={styles.section_4}>
        <div className={styles.cancelContinue}>
          <button
            className={styles.cancelbtn}
            onClick={() => {
              setDashboard(true);
              setCreateQuiz(false);
              setQuizType("Q&A");
            }}
          >
            Cancel
          </button>
          <button
            disabled={loading}
            className={styles.continuebtn}
            onClick={handleQuizCreation}
          >
            {loading ? "Wait..." : "Create Quiz"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Createquiz;
