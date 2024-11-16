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
            console.log("UserInfo:", userInfo);
            setCharacter(userInfo.character || {});
            setInventory(userInfo.inventory || []);
            calculateStats(userInfo.Character || {});
            setIsLoading(false);
            console.log("User is authenticated");
        } else {
            console.log("No user is authenticated");
            setIsLoading(false);
        }

        console.log(userInfo?.inventory); // Manejo seguro con el operador de encadenamiento opcional
        console.log(userInfo?.character); // Manejo seguro con el operador de encadenamiento opcional
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
    
        // Obtener estados previos para posibles reversiones
        const prevCharacter = { ...character };
        const prevInventory = [...inventory];
    
        // Actualizar estados locales
        const updatedCharacter = { ...character, [category]: item };
        const updatedInventory = inventory.filter((i) => i._id !== item._id);
    
        setCharacter(updatedCharacter);
        setInventory(updatedInventory);
    
        const token = localStorage.getItem("token");
        if (!token) {
            alert("No estás autenticado. Inicia sesión.");
            return;
        }

        console.log("Datos a enviar al backend:", {
            userId: userInfo.id,
            equipItem: item,
            category,
        });
        console.log("Token de autenticación:", token);
    
        // Sincronizar con el backend
        axios
            .put(`http://localhost:5000/api/user/${userInfo.id}/equipItem`, { equipItem: item, category }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        .then((response) => {
            console.log("Respuesta del backend:", response.data);
            const { character: serverCharacter, inventory: serverInventory } = response.data;
            setCharacter(serverCharacter);
            setInventory(serverInventory);
        })
        .catch((error) => {
            console.error("Error al actualizar el backend:", error);
            console.log("Error al enviar solicitud PUT a equipItem:", error.response);
            setCharacter(prevCharacter);
            setInventory(prevInventory);
            alert("No se pudo equipar el ítem. Intenta nuevamente.");
        });
    };
    
    const handleUnequipItem = (category) => {
        const unequippedItem = character[category];
        
        const updatedCharacter = { ...character, [category]: null };
        setCharacter(updatedCharacter);
        
        const updatedInventory = [...inventory, unequippedItem];
        setInventory([...inventory, character[category]]); // Devuelve el ítem al inventario
        
        // Opcional: Sincronizar con el backend
        const token = localStorage.getItem("token");
        if (!token) {
            alert("No estás autenticado. Inicia sesión.");
            return;
        }
        console.log("Datos a enviar al backend:", {
            userId: userInfo.id,
            unequippedItem,
            category,
        });

        // Enviar la solicitud PUT al backend para actualizar los datos
        axios
            .put(`http://localhost:5000/api/user/${userInfo.id}/unequipItem`, {
                character: updatedCharacter,  // Actualizamos los datos del personaje
                inventory: updatedInventory,  // Añadimos el ítem de vuelta al inventario
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        .then((response) => {
            console.log("Respuesta del backend:", response.data);
            const { character: serverCharacter, inventory: serverInventory } = response.data;
            setCharacter(serverCharacter);
            setInventory(serverInventory);
        })
        .catch((error) => {
            console.error("Error al actualizar el backend:", error);
            // En caso de error, revertimos los cambios locales
            setCharacter({ ...character });
            setInventory([...inventory]);
            alert("No se pudo desequipar el ítem. Intenta nuevamente.");
        });
        console.log(inventory)
        console.log(userInfo)
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
                                            <button onClick={() => handleUnequipItem(category)}>
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
    )
}