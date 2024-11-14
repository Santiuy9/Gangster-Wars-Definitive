import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import RoboPersona from '../assets/robo-a-persona.jpg';
import RoboACasa from '../assets/robo-a-casa.jpg';
import AsaltoAlBanco from '../assets/robo-a-banco.jpg';
import "./css/Misiones.css";

export default function Misiones() {
    const [playerInfo, setPlayerInfo] = useState(null);
    const [missionTimers, setMissionTimers] = useState({});
    const [loading, setLoading] = useState(true);
    const [isMissionActive, setIsMissionActive] = useState(false); // Nueva bandera

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchPlayerData(user.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchPlayerData = async (uid) => {
        setLoading(true);
        try {
            const docRef = doc(db, "Players", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const playerData = docSnap.data();
                setPlayerInfo(playerData);

                // Restauramos temporizadores de misiones activas
                const missionStatuses = playerData?.missionStatuses || {};
                let activeMissionExists = false; // Comprobar si hay misiones activas
                for (const [missionId, status] of Object.entries(missionStatuses)) {
                    if (status.isActive) {
                        activeMissionExists = true;
                        const timeLeft = new Date(status.endTime).getTime() - Date.now();
                        if (timeLeft > 0) {
                            startCountdown(missionId, timeLeft);
                        } else {
                            handleMissionEnd(missionId);
                        }
                    }
                }
                setIsMissionActive(activeMissionExists); // Actualiza el estado de misión activa
            }
        } catch (error) {
            console.error("Error al obtener los datos del jugador:", error);
        } finally {
            setLoading(false);
        }
    };

    const startCountdown = (missionId, duration) => {
        setMissionTimers((prevTimers) => ({
            ...prevTimers,
            [missionId]: duration,
        }));

        const interval = setInterval(() => {
            setMissionTimers((prevTimers) => {
                const newTimeLeft = prevTimers[missionId] - 1000;
                if (newTimeLeft <= 0) {
                    clearInterval(interval);
                    handleMissionEnd(missionId);
                    return { ...prevTimers, [missionId]: 0 };
                }
                return { ...prevTimers, [missionId]: newTimeLeft };
            });
        }, 1000);
    };

    const handleStartMission = async (mission) => {
        if (!playerInfo || isMissionActive) return; // Deshabilitar si hay una misión activa

        try {
            const userDocRef = doc(db, "Players", auth.currentUser.uid);
            const playerSnapshot = await getDoc(userDocRef);
            const currentPlayerData = playerSnapshot.data();

            if (currentPlayerData.energia < mission.costEnergy) {
                alert("No tienes suficiente energía para esta misión.");
                return;
            }

            const missionDuration = mission.duration;
            const endTime = new Date(Date.now() + missionDuration);

            await updateDoc(userDocRef, {
                [`missionStatuses.${mission.id}`]: {
                    isActive: true,
                    endTime: endTime.toISOString(),
                },
                energia: currentPlayerData.energia - mission.costEnergy,
            });

            setPlayerInfo((prevInfo) => ({
                ...prevInfo,
                energia: currentPlayerData.energia - mission.costEnergy,
                missionStatuses: {
                    ...prevInfo.missionStatuses,
                    [mission.id]: { isActive: true, endTime: endTime.toISOString() },
                },
            }));

            setIsMissionActive(true); // Activamos la bandera de misión activa
            startCountdown(mission.id, missionDuration);
        } catch (error) {
            console.error("Error al iniciar la misión:", error);
        }
    };

    const handleMissionEnd = async (missionId) => {
        try {
            const userDocRef = doc(db, "Players", auth.currentUser.uid);
            const playerSnapshot = await getDoc(userDocRef);
            const currentPlayerData = playerSnapshot.data();
    
            const mission = missions.find((m) => m.id === missionId);
            const rewardMoney = Math.floor(Math.random() * (mission.moneyReward[1] - mission.moneyReward[0] + 1)) + mission.moneyReward[0];
            const rewardXP = Math.floor(Math.random() * (mission.xpReward[1] - mission.xpReward[0] + 1)) + mission.xpReward[0];
    
            await updateDoc(userDocRef, {
                [`missionStatuses.${missionId}`]: {
                    isActive: false,
                    endTime: null,
                },
                dinero: currentPlayerData.dinero + rewardMoney,
                experiencia: (currentPlayerData.experiencia || 0) + rewardXP,
            });
    
            setPlayerInfo((prevInfo) => ({
                ...prevInfo,
                dinero: currentPlayerData.dinero + rewardMoney,
                experiencia: (currentPlayerData.experiencia || 0) + rewardXP,
                missionStatuses: {
                    ...prevInfo.missionStatuses,
                    [missionId]: { isActive: false, endTime: null },
                },
            }));
    
            setMissionTimers((prevTimers) => ({ ...prevTimers, [missionId]: 0 }));
            setIsMissionActive(false); // Desactivamos la bandera cuando termina la misión
            alert(`Misión completada. Has ganado $${rewardMoney} y ${rewardXP} XP.`);
        } catch (error) {
            console.error("Error al finalizar la misión:", error);
        }
    };
    

    const missions = [
        {
            id: "1",
            title: "Robar a una Persona",
            imageSrc: RoboPersona,
            description: "Roba a una persona en la calle",
            moneyReward: [50, 250],
            xpReward: [5, 25],
            difficulty: 5,
            duration: 10 * 1000,
            costEnergy: 10,
        },
        {
            id: "2",
            title: "Robar una Casa",
            imageSrc: RoboACasa,
            description: "Irrumpe dentro de una casa y apropia objetos de valor",
            moneyReward: [1500, 2500],
            xpReward: [150, 250],
            difficulty: 5,
            duration: 15 * 1000,
            costEnergy: 35,
        },
        {
            id: "3",
            title: "Atraco al Banco",
            imageSrc: AsaltoAlBanco,
            description: "Entra al Banco y roba la bodega de Oro",
            moneyReward: [30000, 50000],
            xpReward: [750, 1000],
            difficulty: 5,
            duration: 20 * 1000,
            costEnergy: 60,
        },
    ];

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="PrincipalContainer Misiones">
            <h1>Misiones</h1>

            {missions.map((mission) => (
                <div key={mission.id} className="mission-card">
                    <img src={mission.imageSrc} alt={mission.title} />
                    <h2>{mission.title}</h2>
                    <p>{mission.description}</p>
                    <p>Recompensa: ${mission.moneyReward[0]} - ${mission.moneyReward[1]}</p>
                    <p>XP: {mission.xpReward[0]} - {mission.xpReward[1]}</p>
                    <p>Coste de Energía: {mission.costEnergy}</p>

                    {missionTimers[mission.id] > 0 ? (
                        <p>Tiempo restante: {Math.floor(missionTimers[mission.id] / 1000)} segundos</p>
                    ) : (
                        <button onClick={() => handleStartMission(mission)} disabled={isMissionActive}>
                            Iniciar Misión
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
