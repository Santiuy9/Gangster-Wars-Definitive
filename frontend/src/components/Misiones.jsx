import React, { useEffect, useState } from 'react';
import missionsData from '../data/missions.json';

const Misiones = () => {
  const [missions, setMissions] = useState([]);
  const [activeMission, setActiveMission] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [missionResult, setMissionResult] = useState(null);

  useEffect(() => {
    setMissions(missionsData);
  }, []);

  useEffect(() => {
    if (activeMission && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [activeMission, timeLeft]);

  const handleStartMission = (mission) => {
    setActiveMission(mission);
    setTimeLeft(mission.duration); // Convierte la duración de minutos a segundos
    setMissionResult(null); // Resetear el resultado de la misión
  };

  const handleMissionComplete = () => {
    const successChance = Math.random(); // Generamos una probabilidad aleatoria para el éxito
    const successThreshold = (100 - activeMission.difficulty) / 100; // La dificultad determina las probabilidades

    const isSuccess = successChance <= successThreshold;
    setMissionResult(isSuccess);

    if (isSuccess) {
      // Recompensas
      const moneyReward = Math.floor(
        Math.random() * (activeMission.moneyReward[1] - activeMission.moneyReward[0] + 1) +
          activeMission.moneyReward[0]
      );
      const xpReward = Math.floor(
        Math.random() * (activeMission.xpReward[1] - activeMission.xpReward[0] + 1) +
          activeMission.xpReward[0]
      );
      alert(`¡Misión exitosa! Has ganado ${moneyReward}$ y ${xpReward} XP.`);
    } else {
      alert('Misión fallida. Intenta de nuevo.');
    }

    setActiveMission(null); // Finalizar la misión
  };

  return (
    <div className="misiones-container">
      {missions.map((mission) => (
        <div key={mission.id} className="mision-card">
          <img src={mission.imageSrc} alt={mission.title} className="mision-image" />
          <h3 className="mision-title">{mission.title}</h3>
          <p className="mision-description">{mission.description}</p>
          <div className="mision-rewards">
            <div className="reward">
              <span>Recompensa Dinero:</span>
              {`${mission.moneyReward[0]} - ${mission.moneyReward[1]}$`}
            </div>
            <div className="reward">
              <span>Recompensa XP:</span>
              {`${mission.xpReward[0]} - ${mission.xpReward[1]} XP`}
            </div>
          </div>
          <div className="mision-stats">
            <div>Dificultad: {mission.difficulty}</div>
            <div>Duración: {mission.duration} min</div>
            <div>Consumo de Energía: {mission.costEnergy}</div>
          </div>

          {activeMission?.id === mission.id ? (
            <div className="mision-status">
              {timeLeft > 0 ? (
                <div>
                  <p>Tiempo restante: {timeLeft}s</p>
                  <button onClick={handleMissionComplete}>Finalizar Misión</button>
                </div>
              ) : (
                <div>
                  <p>Misión completada.</p>
                  <button onClick={handleMissionComplete}>Ver Resultado</button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => handleStartMission(mission)}>Comenzar Misión</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Misiones;
