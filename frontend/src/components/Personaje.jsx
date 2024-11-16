import React, { useState, useEffect, useContext } from "react";
import axios from "axios"; // Asegúrate de importar axios
import { UserContext } from "../UserContext";

import Button from "./Button";
import HoverBar from "./HoverBar";
import "./css/Personaje.css";

export default function Personaje() {
    const { userInfo, setUserInfo } = useContext(UserContext);

    const [character, setCharacter] = useState({
        Armamento: null,
        Equipamiento: null,
        Vehículo: null,
    });
    const [inventory, setInventory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        Ataque: 0,
        Defensa: 0,
        Velocidad: 0,
    });

    useEffect(() => {
        if (userInfo) {
            setCharacter(userInfo.Character || {});
            setInventory(userInfo.inventory || []);
            calculateStats(userInfo.Character || {});
            setIsLoading(false);
        } else {
            console.log("No user is authenticated");
            setIsLoading(false);
        }

        console.log(userInfo?.inventory); // Manejo seguro con el operador de encadenamiento opcional
    }, [userInfo]);

    const calculateStats = (characterData) => {
        const newStats = { Ataque: 0, Defensa: 0, Velocidad: 0 };

        Object.values(characterData).forEach((item) => {
            if (item?.proBarName && item?.proBarPercentage) {
                const statName = item.proBarName;
                const statValue = parseInt(item.proBarPercentage, 10) || 0;

                if (statName === "Daño") newStats.Ataque += statValue;
                if (statName === "Defensa") newStats.Defensa += statValue;
                if (statName === "Velocidad") newStats.Velocidad += statValue;
            }
        });

        setStats(newStats);
    };

    const handleEquipItem = (item, category) => {
        if (character[category]) {
            alert(`Ya tienes un objeto equipado en ${category}. Primero debes desequiparlo.`);
            return;
        }

        const updatedInventory = inventory.filter((i) => i.title !== item.title);
        setInventory(updatedInventory);
        setCharacter({ ...character, [category]: item });
        
        console.log(userInfo)
        console.log(item)

        // Opcional: Sincronizar con el backend
        axios
            .put(`http://localhost:5000/api/user/${userInfo.id}`, {
                Character: { ...character, [category]: item },
                inventory: updatedInventory,
            })
        .catch((error) => console.error("Error al actualizar el backend:", error));
    };

    const unequipItem = (category) => {
        const updatedCharacter = { ...character, [category]: null };
        setCharacter(updatedCharacter);
        setInventory([...inventory, character[category]]); // Devuelve el ítem al inventario

        // Opcional: Sincronizar con el backend
        axios
            .put(`http://localhost:5000/api/user/${userInfo.id}`, {
                Character: updatedCharacter,
                inventory: [...inventory, character[category]],
            })
            .catch((error) => console.error("Error al actualizar el backend:", error));
    };


    if (isLoading) {
        return <div>Cargando datos del usuario...</div>;
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
                                            <img
                                                src={character[category].imageSrc}
                                                alt={character[category].title}
                                                className="item-image"
                                            />
                                            <button onClick={() => unequipItem(category)}>
                                                Desequipar
                                            </button>
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
                        <HoverBar
                            name="Ataque"
                            hoverText={stats.Ataque}
                            percentage={stats.Ataque}
                            color="red"
                        />
                        <HoverBar
                            name="Defensa"
                            hoverText={stats.Defensa}
                            percentage={stats.Defensa}
                        />
                        <HoverBar
                            name="Velocidad"
                            hoverText={stats.Velocidad}
                            percentage={stats.Velocidad}
                            color="skyblue"
                        />
                    </div>
                </div>
                <div className="Inventory">
                    <h2>Inventario</h2>
                    <div className="inventory-slots">
                        {inventory.map((item, index) => (
                            <div className="slot" key={index}>
                                <p>{item.title}</p>
                                <img src={item.imageSrc} alt={item.title} className="item-image" />
                                <button onClick={() => handleEquipItem(item, item.category)}>
                                    Equipar
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
