import React, { useState, useEffect } from 'react';
import styles from "../styles/createquiz.module.css";
import del from '../assets/delete.png';

const TypeURL = ({questions, setQuestions, currentIndex}) => {
  const [options, setOptions] = useState(questions[currentIndex]?.options || ["", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(questions[currentIndex]?.correctAnswer || null);

  const handleAddOption = () => {
    if (options.length < 4) {
      setOptions([...options, ""]);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);

    if (questions[currentIndex]) {
      const newQuestions = [...questions];
      newQuestions[currentIndex].options = newOptions;
      setQuestions(newQuestions);
    }
  };
  

  const handleDeleteOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);

    if (questions[currentIndex]) {
      const newQuestions = [...questions];
      newQuestions[currentIndex].options = newOptions;
      setQuestions(newQuestions);
    }
  };

  useEffect(() => {
    setOptions(questions[currentIndex]?.options || ["", ""]);
    setCorrectAnswer(questions[currentIndex]?.correctAnswer || null);
  }, [currentIndex, questions]);

  return (
    <div className={styles.section_3}>
      {options.map((option, index) => (
        <div key={index} className={styles.input_img}>
          <input 
            type="radio" 
            name="options" 
            value={option}
            checked={correctAnswer === option}
            onChange={(event) => {
              setCorrectAnswer(event.target.value);

              if (questions[currentIndex]) {
                const newQuestions = [...questions];
                newQuestions[currentIndex].correctAnswer = event.target.value;
                setQuestions(newQuestions);
              }
            }}
          />
          <input 
            type="text" 
            placeholder="Image URL" 
            value={option} 
            onChange={(e) => handleOptionChange(index, e.target.value)}
            style={correctAnswer === option ? {backgroundColor : '#60B84B', color: "white"} : {}}
          />
          {index > 1 && <img src={del} alt="Delete option" onClick={() => handleDeleteOption(index)} />}
        </div>
      ))}
      {options.length < 4 && (
        <button className={styles.addOption} onClick={handleAddOption}>
          Add Option
        </button>
      )}
    </div>
  );
};

export default TypeURL;
