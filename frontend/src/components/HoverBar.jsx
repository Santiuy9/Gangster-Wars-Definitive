import React from 'react';
import './css/HoverBar.css';

const HoverBar = ({ name, hoverText, percentage, color = '#4CAF50' }) => {
  return (
    <div className="hover-bar-container">
      <div 
        className="hover-bar" 
        style={{ 
          '--percentage': `${percentage}%`,
          '--bar-color': color
        }}
      >
        <span className="bar-name">{name}</span>
        <span className="bar-hover-text">{hoverText}</span>
      </div>
    </div>
  );
};

export default HoverBar;