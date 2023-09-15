import React, { useEffect, useState } from "react";

import styles from "./Countdown.module.css";

interface CountdownProps {
  duration: number;
  onCountdownEnd: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ duration, onCountdownEnd }) => {
  const [remainingTime, setRemainingTime] = useState(duration);

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;

    if (remainingTime > 0) {
      countdownInterval = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      onCountdownEnd();
    }

    return () => {
      clearInterval(countdownInterval);
    };
  }, [remainingTime, onCountdownEnd]);

  useEffect(() => {
    if (remainingTime <= 0) {
      onCountdownEnd();
    }
  }, [remainingTime, onCountdownEnd]);

  return (
    <h1 className={styles.remainingTime}>Countdown: {remainingTime} seconds</h1>
  );
};

export default Countdown;
