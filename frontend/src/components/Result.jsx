import React, { useContext } from 'react'
import styles from "../styles/result.module.css";
import cup from "../assets/cup.png";
import { Context } from '..';

const Result = () => {
  const {userScore} = useContext(Context)
  return (
    <div className={styles.parent}>
      <div className={styles.childBox}>
        <h1>Congrats Quiz is completed</h1>
        <img src={cup} alt="" />
        <h2>Your Score is <span>{userScore ? userScore : '00/00'}</span></h2>
      </div>
    </div>
  )
}

export default Result
