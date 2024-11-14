import React, { useState, useEffect } from 'react';
import './css/CountdownBar.css';

const CountdownBar = ({ duration, isPaused, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    //console.log(`Countdown started: ${timeLeft} seconds left`);

    if (isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          console.log('Countdown finished');
          onComplete && onComplete(); 
          clearInterval(interval);
          return duration;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      console.log('Countdown interval cleared');
    };
  }, [isPaused, timeLeft, onComplete, duration]);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}h`;
    }
    if (minutes > 0) {
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}m`;
    }
    return `${String(seconds).padStart(2, '0')}s`;
  };

  const percentage = (timeLeft / duration) * 100;

  return (
    <div className="countdown-bar">
      <div className="countdown-fill" style={{ width: `${percentage}%` }}></div>
      <span className="countdown-label">{formatTime(timeLeft)}</span>
    </div>
  );
};

export default CountdownBar;
