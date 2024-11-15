import React, { useState, useEffect } from "react";
import axios from 'axios';  // Asegúrate de importar axios
import Button from './Button';
import HoverBar from "./HoverBar";
import './css/Personaje.css';

export default function Personaje({ isAuthenticated, playerInfo }) {
    const [character, setCharacter] = useState({
        Armamento: null,
        Equipamiento: null,
        Vehículo: null
    });
    const [inventory, setInventory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        Ataque: 0,
        Defensa: 0,
        Velocidad: 0
    });

    useEffect(() => {
        if (isAuthenticated) {
            setCharacter(playerInfo.Character || {});
            setInventory(playerInfo.inventory || []);
            calculateStats(playerInfo.Character || {});
            setIsLoading(false);
        } else {
            console.log("No user is authenticated");
            setIsLoading(false);
        }
        console.log(playerInfo.inventory)
    }, [isAuthenticated, playerInfo]);

    const calculateStats = (characterData) => {
        const newStats = { Ataque: 0, Defensa: 0, Velocidad: 0 };

        Object.values(characterData).forEach(item => {
            if (item && item.proBarName && item.proBarPercentage) {
                const statName = item.proBarName;
                const statValue = parseInt(item.proBarPercentage, 10) || 0;

                if (statName === "Daño") newStats.Ataque += statValue;
                if (statName === "Defensa") newStats.Defensa += statValue;
                if (statName === "Velocidad") newStats.Velocidad += statValue;
            }
        });

        setStats(newStats);
    };

    const handleEquipItem = async (item, category) => {
        if (isAuthenticated) {
            const itemId = item._id; // Ahora el item tiene un _id
            const playerId = playerInfo._id; // El ID del jugador
    
            try {
                const response = await axios.post('/api/equip-item', {
                    playerId,
                    itemId,
                    category
                });
    
                console.log('Ítem equipado:', response.data);
                // Actualiza el estado o realiza alguna acción en el frontend
            } catch (error) {
                console.error('Error al equipar el ítem:', error);
            }
        } else {
            console.log("No user is authenticated");
        }
    };
    
    

    const unequipItem = async (category) => {
        if (isAuthenticated) {
            const newCharacter = { ...character, [category]: null };
            setCharacter(newCharacter);
            calculateStats(newCharacter);

            try {
                // Realizar la petición al backend para desequipar el ítem
                const response = await axios.post('/api/unequip-item', {
                    userId: playerInfo._id,
                    category: category
                });

                console.log('Item unequipped:', response.data);
            } catch (error) {
                console.error('Error al desequipar el ítem:', error);
            }
        } else {
            console.log("No user is authenticated");
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="PrincipalContainer Personaje">
            <h1>Personaje</h1>
            <div className="Personaje-container">
                <div className="Character-Items">
                    <div className="Character">
                        <h2>Personaje</h2>
                        <div className="character-slots">
                            {["Armamento", "Equipamiento", "Vehículo"].map((category, index) => (
                                <div className="slot" key={index}>
                                    {character[category] ? (
                                        <>
                                            <p>{character[category].title}</p>
                                            <img src={character[category].imageSrc} alt={character[category].title} className="item-image" />
                                            <button onClick={() => unequipItem(category)}>Desequipar</button>
                                        </>
                                    ) : (
                                        <p>Vacío</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="Stats">
                        <h2>Estadísticas</h2>
                        <HoverBar name="Ataque" hoverText={stats.Ataque} percentage={stats.Ataque} color="red"/>
                        <HoverBar name="Defensa" hoverText={stats.Defensa} percentage={stats.Defensa} />
                        <HoverBar name="Velocidad" hoverText={stats.Velocidad} percentage={stats.Velocidad} color="skyblue"/>
                    </div>
                </div>
                <div className="Inventory">
                    <h2>Inventario</h2>
                    <div className="inventory-slots">
                        {inventory.map((item, index) => (
                            <div className="slot" key={index}>
                                <p>{item.title}</p>
                                <img src={item.imageSrc} alt={item.title} className="item-image" />
                                <button onClick={() => handleEquipItem(item, item.category)}>Equipar</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
