import React, { useState } from "react";
import DifficultyBar from "./DifficultyBar";
import CountdownBar from "./CountdownBar";
import { doc, updateDoc, getDoc} from 'firebase/firestore';
import { auth, db } from '../firebase';
import './css/MissionCard.css';

export default function MissionCard({ 
    title,
    imageSrc,
    description,
    moneyReward,
    xpReward,
    difficulty,
    duration,
    missionInProgres,
    onStartMission,
    onEndMission,
    energiaCost,
    playerInfo,
    setPlayerInfo
}) {
    const [missionStarted, setMissionStarted] = useState(false);

    const startMission = async () => {
        if (!auth.currentUser) {
            console.error("No hay usuario autenticado");
            return;
        }

        console.log('Misión Iniciada');
        try {
            const userDocRef = doc(db, 'Players', playerInfo.uid);
            const userDocSnap = await getDoc(userDocRef);
    
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const currentEnergy = userData.energia;
    
                if (currentEnergy >= energiaCost) {
                    const nuevaEnergia = currentEnergy - energiaCost;
                    
                    // Guardar la hora exacta de finalización
                    const endTime = new Date(Date.now() + duration * 1000); // Ajusta `duration` a segundos o lo que necesites
    
                    await updateDoc(userDocRef, { 
                        energia: nuevaEnergia,
                        missionStatus: {
                            isActive: true,
                            missionId: title,
                            endTime: endTime.toISOString(),  // Guardar en formato ISO para precisión
                        }
                    });
    
                    setMissionStarted(true);
                    onStartMission();
                    setPlayerInfo(prev => ({ ...prev, energia: nuevaEnergia }));
                } else {
                    alert("No tienes suficiente energía para esta misión.");
                }
            } else {
                console.log("No se encontró el documento del jugador.");
            }
        } catch (error) {
            console.error("Error al iniciar la misión:", error);
        }
    };
    
    

    const handleMissionEnd = async () => {
        const isSuccess = Math.random() > difficulty / 100;
        const successMessage = "¡La misión fue exitosa!";
        const failureMessage = "La misión falló.";
    
        if (isSuccess) {
            const [minMoney, maxMoney] = moneyReward.replace(/\$/g, '').split(' - ').map(Number);
            const earnedMoney = Math.floor(Math.random() * (maxMoney - minMoney + 1)) + minMoney;
    
            try {
                const userDocRef = doc(db, 'Players', playerInfo.uid);
                await updateDoc(userDocRef, { 
                    dinero: playerInfo.dinero + earnedMoney, 
                    missionStatus: { isActive: false, missionId: null, endTime: null }
                });
                setPlayerInfo(prevInfo => ({ ...prevInfo, dinero: playerInfo.dinero + earnedMoney }));
            } catch (error) {
                console.error("Error al actualizar el dinero del jugador:", error);
            }
        }
    
        onEndMission(isSuccess ? successMessage : failureMessage);
        setMissionStarted(false);
    };
    
    
    

    return (
        <div className="MissionCard">
            <img src={imageSrc} alt="" />
            <div className="MissionDescription">
                <h2>{title}</h2>
                <p>{description}</p>
                <div className="MissionRewards">
                    <h3>Posible Recompensa</h3>
                    <div className="MissionRewardsDetails">
                        <p>{moneyReward}</p>
                        <p>XP {xpReward}</p>
                    </div>
                </div>
                <div className="MissionDifficulty">
                    <h3>Dificultad</h3>
                    <DifficultyBar difficulty={difficulty} />
                </div>
                <div className="MissionTime">
                    <h3>Tiempo de Duración</h3>
                    <CountdownBar 
                        duration={duration} 
                        isPaused={!missionStarted} 
                        onComplete={handleMissionEnd}  
                    />
                </div>
                <button 
                    className="start-mission-btn"
                    onClick={startMission}
                    disabled={missionStarted || missionInProgres} 
                >
                    {missionStarted ? "Misión en curso" : `Comenzar Misión (-${energiaCost} energía)`}
                </button>
            </div>
        </div>
    );
}
