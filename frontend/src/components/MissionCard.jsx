import React from "react";
import "./css/MissionCard.css";

const MissionCard = ({ 
  mission, 
  startMission, 
  timeRemaining, 
  isActive,
}) => {
  const totalDurationInSeconds = mission.duration * 60; // Convertir minutos a segundos
  
  return (
    <div className="mission-card">
      <h3>{mission.title}</h3>
      <img src={mission.imageSrc} alt={mission.title} />
      <p>{mission.description}</p>
      <p>Recompensa: ${mission.moneyReward[0]} - ${mission.moneyReward[1]}</p>
      <p>XP: {mission.xpReward[0]} - {mission.xpReward[1]}</p>
      <p>Dificultad: {mission.difficulty}</p>
      <p>Duración: {mission.duration} minutos</p>
      <p>Coste de Energía: {mission.costEnergy}</p>

      {isActive ? (
        <div>
          <p>Tiempo restante: {timeRemaining} segundos</p>
          <div className="progress-bar">
            <div
              className="progress"
              style={{
                width: `${((totalDurationInSeconds - timeRemaining) / totalDurationInSeconds) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      ) : (
        <button onClick={() => startMission(mission)}>Comenzar Misión</button>
      )}
    </div>
  );
};

export default MissionCard;
