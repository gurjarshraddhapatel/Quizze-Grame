import React from 'react'
import styles from "../styles/result.module.css";

const Pollresult = () => {
  return (
    <div className={styles.parent}>
      <div className={styles.childBox}>
        <h1 className={styles.poll_msg}>Thank you for participating in the Poll</h1>
      </div>
    </div>
  )
}

export default Pollresult
