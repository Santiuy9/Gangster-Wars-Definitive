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
        Ataque: userInfo?.stats?.ataque || 0,
        Defensa: userInfo?.stats?.defensa || 0,
        Velocidad: userInfo?.stats?.velocidad || 0,
    });

    useEffect(() => {
        if (userInfo) {
            console.log("UserInfo:", userInfo);
            setCharacter(userInfo.character || {});
            setInventory(userInfo.inventory || []);
            calculateStats(userInfo.character || {});
            setIsLoading(false);
            console.log("User is authenticated");
        } else {
            // console.log("No user is authenticated");
            setIsLoading(false);
        }

        console.log(userInfo); // Manejo seguro con el operador de encadenamiento opcional
    }, [userInfo]);

    useEffect(() => {
        if (userInfo?.stats) {
            setStats({
                Ataque: userInfo.stats.ataque,
                Defensa: userInfo.stats.defensa,
                Velocidad: userInfo.stats.velocidad,
            });
        }
    }, [userInfo?.stats]);
    

    const calculateStats = (characterData) => {
        const newStats = { Ataque: 0, Defensa: 0, Velocidad: 0 };

        Object.values(characterData).forEach((item) => {
            if (item?.damage) {
                newStats.Ataque += item.damage; // Para armamento
            }
            if (item?.defense) {
                newStats.Defensa += item.defense; // Para equipamiento
            }
            if (item?.speed) {
                newStats.Velocidad += item.speed; // Para vehículos
            }
        });

        setStats(newStats);
    };

    const handleEquipItem = (item, category) => {
        // Comprobar si ya hay un objeto equipado en esta categoría
        if (character[category]) {
            alert(`Ya tienes un objeto equipado en ${category}. Primero debes desequiparlo.`);
            return;
        }
    
        // Obtener estados previos para posibles reversiones
        const prevCharacter = { ...character };
        const prevInventory = [...inventory];
    
        // Actualizar el personaje (equipar el objeto)
        const updatedCharacter = { ...character, [category]: item };
        const updatedInventory = inventory.filter((i) => i._id !== item._id);
    
        // Actualizar las estadísticas en base al estado actual
        const updatedStats = { ...stats };
    
        if (item.category === "Armamento") {
            updatedStats.Ataque += parseInt(item.damage, 10) || 0; // Sumar a Ataque
        }
        if (item.category === "Equipamiento") {
            updatedStats.Defensa += parseInt(item.defense, 10) || 0; // Sumar a Defensa
        }
        if (item.category === "Vehículo") {
            updatedStats.Velocidad += parseInt(item.speed, 10) || 0; // Sumar a Velocidad
        }
    
        // Sincronizar con el backend
        const token = localStorage.getItem("token");
        if (!token) {
            alert("No estás autenticado. Inicia sesión.");
            return;
        }
    
        axios
            .put(
                `http://localhost:5000/api/user/${userInfo.id}/equipItem`,
                {
                    equipItem: item,      // Objeto que estamos equipando
                    category,             // Categoría (armamento, defensa, etc.)
                    newStats: updatedStats, // Pasar las nuevas estadísticas
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                console.log("Respuesta del backend:", response.data);
    
                const { character: serverCharacter, inventory: serverInventory, stats: serverStats } = response.data;
    
                // Verificar que la respuesta sea correcta
                console.log("Datos después de la respuesta del backend:", {
                    serverCharacter,
                    serverInventory,
                    serverStats,
                });
    
                // Actualizar estados locales con los datos del servidor
                setCharacter(serverCharacter);
                setInventory(serverInventory);
                setStats(serverStats); // Actualiza las estadísticas correctamente
    
                // Actualizar también el inventario local en el estado
                setCharacter({ ...serverCharacter }); // Asegúrate de pasar un objeto nuevo
                setInventory([...serverInventory]); // Asegúrate de pasar una copia del inventario
                setStats({ ...serverStats }); // Asegúrate de pasar un objeto nuevo para las stats
            })
            .catch((error) => {
                console.error("Error al actualizar el backend:", error);
                // Restaurar estados previos si algo falla
                setCharacter(prevCharacter);
                setInventory(prevInventory);
                setStats(prevStats);
                alert("No se pudo equipar el ítem. Intenta nuevamente.");
            });
    };
    
    
    

    const handleUnequipItem = (category) => {
        const unequippedItem = character[category]; // Ítem a desequipar
        console.log(unequippedItem)
    
        if (!unequippedItem) {
            alert("No tienes un ítem equipado en esta categoría.");
            return;
        }
    
        // Obtener los valores para restar de las estadísticas
        const removedStats = userInfo.stats;
    
        if (unequippedItem.category === "Armamento") {
            removedStats.Ataque = parseInt(unequippedItem.damage, 10) || 0;
        }
        if (unequippedItem.category === "Equipamiento") {
            removedStats.Defensa = parseInt(unequippedItem.defense, 10) || 0;
        }
        if (unequippedItem.category === "Vehículo") {
            removedStats.Velocidad = parseInt(unequippedItem.speed, 10) || 0;
        }

        console.log(removedStats)
    
        // Actualizar las estadísticas localmente
        const newStats = {
            Ataque: userInfo.stats.ataque - removedStats.Ataque,
            Defensa: userInfo.stats.defensa - removedStats.Defensa,
            Velocidad: userInfo.stats.velocidad - removedStats.Velocidad,
        };
        
        console.log(newStats)
        
        // Actualizar el personaje y el inventario localmente
        const updatedCharacter = { ...character, [category]: null }; // Eliminar el ítem equipado
        const updatedInventory = [...inventory, unequippedItem]; // Agregar el ítem al inventario
        
        setStats(newStats);
        console.log(newStats)
        setCharacter(updatedCharacter);
        setInventory(updatedInventory);
    
        // Sincronizar con el backend
        const token = localStorage.getItem("token");
        if (!token) {
            alert("No estás autenticado. Inicia sesión.");
            return;
        }
    
        // Enviar la solicitud PUT para actualizar el personaje y las estadísticas
        axios
            .put(
                `http://localhost:5000/api/user/${userInfo.id}/unequipItem`,
                {
                    character: updatedCharacter,
                    inventory: updatedInventory,
                    newStats, // Mandamos las nuevas estadísticas calculadas
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                console.log("Respuesta del backend:", response.data);
                const { character: serverCharacter, inventory: serverInventory, stats: serverStats } = response.data;
    
                // Actualizar los estados con la respuesta del backend
                setCharacter(serverCharacter);
                setInventory(serverInventory);
                setStats(serverStats); // Actualizar estadísticas del servidor
    
                // alert("Ítem desequipado con éxito.");
            })
            .catch((error) => {
                console.error("Error al actualizar el backend:", error);
                alert("No se pudo desequipar el ítem. Intenta nuevamente.");
    
                // Restaurar el estado local en caso de error
                setCharacter({ ...character });
                setInventory([...inventory]);
                setStats({ ...stats });
            });
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
                            hoverText={`Daño: ${character?.Armamento?.damage || 0}`}
                            // percentage={stats.Ataque}
                            color="red"
                        />
                        <HoverBar
                            name="Defensa"
                            hoverText={`Defensa: ${character?.Equipamiento?.defense || 0}`}
                            // percentage={stats.Defensa}
                        />
                        <HoverBar
                            name="Velocidad"
                            hoverText={`Velocidad: ${character?.Vehículo?.speed || 0}`}
                            // percentage={stats.Velocidad}
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
