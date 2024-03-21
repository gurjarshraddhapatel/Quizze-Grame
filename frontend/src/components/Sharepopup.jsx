import React, { useRef } from "react";
import styles from "../styles/sharepopup.module.css";
import cross from "../assets/cross.png";
import toast from "react-hot-toast";

const Sharepopup = ({ quizId, quizType, setAnalytics, setGetLink }) => {
  const inputRef = useRef();

  const handleShare = () => {
    const inputElement = inputRef.current;
    const inputValue = inputElement.value;

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(inputValue)
        .then(() => toast.success("Link Copied to clipboard"))
        .catch((err) => console.error("Failed to copy text: ", err));
    } else {
      inputElement.select();
      document.execCommand("copy");
      toast.success("Link Copied to clipboard");
    }
  };

  let link;
  if (quizType === "Q&A") {
    link = `http://localhost:3000/playQuiz/${quizId}`;
  } else if (quizType === "Poll") {
    link = `http://localhost:3000/Poll/${quizId}`;
  } else {
    link = "No link is available";
  }

  return (
    <div className={styles.popup}>
      <img
        onClick={() => {
          setAnalytics(true);
          setGetLink(false);
        }}
        src={cross}
        alt=""
      />
      <h1>Congrats your Quiz is Published!</h1>
      <input
        value={link}
        ref={inputRef}
        readOnly
        type="text"
        placeholder="Link"
      />
      <br />
      <button onClick={handleShare}>Share</button>
    </div>
  );
};

export default Sharepopup;
