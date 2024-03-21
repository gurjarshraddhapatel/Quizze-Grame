import React, { useEffect, useState } from 'react';
import styles from "../styles/createquiz.module.css";
import del from '../assets/delete.png';

const TypetextandURL = ({questions, setQuestions, currentIndex}) => {
  const [options, setOptions] = useState(questions[currentIndex]?.options || ["", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(questions[currentIndex]?.correctAnswer || null);

  const addOption = () => {
    if (options.length < 4) {
      setOptions([...options, ""]); 
    }
  };

  const removeOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
    if (questions[currentIndex]) {
        const newQuestions = [...questions];
        newQuestions[currentIndex].options = newOptions;
        setQuestions(newQuestions);
    }
};


const handleInputChange = (event, index, type) => {
  const newOptions = [...options];
  const parts = newOptions[index].split('|');
  if (type === 'text') {
    parts[0] = event.target.value;
  } else {
    parts[1] = event.target.value;
  }
  newOptions[index] = parts.join('|');
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
    {options.map((option, index) => {
      const parts = option.split('|');
      const text = parts[0] || ""; 
      const url = parts[1] || ""; 
      return (
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
            placeholder="Text" 
            value={text} 
            onChange={(event) => handleInputChange(event, index, 'text')} 
            style={correctAnswer === option ? {backgroundColor : '#60B84B', color: "white", width: "25%"} : {width: "25%"}}
          />
          <input 
            type="text" 
            placeholder="URL" 
            value={url} 
            onChange={(event) => handleInputChange(event, index, 'url')} 
            style={correctAnswer === option ? {backgroundColor : '#60B84B', color: "white"} : {}}
          />
          {index > 1 && <img src={del} alt="Delete option" onClick={() => removeOption(index)} />}
        </div>
      );
    })}
    {options.length < 4 && (
      <button className={styles.addOption} onClick={addOption}>
        Add Option
      </button>
    )}
  </div>
  );
};

export default TypetextandURL;
