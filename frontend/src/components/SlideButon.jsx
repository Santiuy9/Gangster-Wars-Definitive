import React, { useState } from 'react'
import './css/SlideButton.css'

const SlideButton = ({ textDefault, textHover, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = async () => {
    setIsProcessing(true);
    await onClick();
    setIsProcessing(false);
  }

  return (
    <button
      className="slide-button"
      onClick={handleClick}
      disabled={isProcessing}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={`text ${isHovered ? 'slide-out' : ''}`}>
        {textDefault}
      </span>
      <span className={`text hover-text ${isHovered ? 'slide-in' : ''}`}>
        {textHover}
      </span>
    </button>
  )
}

export default SlideButton