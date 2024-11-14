import React from 'react';
import './css/DifficultyBar.css';

export default function DifficultyBar({ difficulty }) {

    return (
        <div className="difficulty-bar">
            <div 
                className="difficulty-fill" 
                style={{ width: `${difficulty}%` }}
            ></div>
            <span className="difficulty-label">{difficulty}%</span>
        </div>
    );
};