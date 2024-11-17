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
        // Verificar si ya hay un objeto equipado en esta categoría
        if (character[category]) {
            alert(`Ya tienes un objeto equipado en la categoría "${category}". Desequípalo antes de continuar.`);
            return;
        }
    
        // Actualizar el personaje (equipar el objeto)
        const updatedCharacter = { ...character, [category]: item };
    
        // Eliminar el objeto del inventario
        const updatedInventory = inventory.filter((i) => i._id !== item._id);
    
        // Determinar la estadística que se debe actualizar
        const updatedStats = { ...stats }; // Crear una copia de las estadísticas actuales
        if (category === "Armamento") {
            updatedStats.Ataque += parseInt(item.damage, 10) || 0;
        } else if (category === "Equipamiento") {
            updatedStats.Defensa += parseInt(item.defense, 10) || 0;
        } else if (category === "Vehículo") {
            updatedStats.Velocidad += parseInt(item.speed, 10) || 0;
        }
    
        // Sincronizar con el backend
        const token = localStorage.getItem("token");
        if (!token) {
            alert("No estás autenticado. Inicia sesión para continuar.");
            return;
        }
    
        axios
            .put(
                `http://localhost:5000/api/user/${userInfo.id}/equipItem`,
                {
                    character: updatedCharacter,
                    inventory: updatedInventory,
                    stats: updatedStats, // Nuevas estadísticas
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((response) => {
                console.log("Respuesta del servidor:", response.data);
    
                const { character: serverCharacter, inventory: serverInventory, stats: serverStats } = response.data;
    
                // Actualizar estados locales con los datos del servidor
                setCharacter(serverCharacter);
                setInventory(serverInventory);
                setStats(serverStats);
    
                // Actualizar el contexto global (userInfo)
                setUserInfo((prevUserInfo) => ({
                    ...prevUserInfo,
                    character: serverCharacter,
                    inventory: serverInventory,
                    stats: serverStats,
                }));
    
                // alert(`El objeto "${item.title}" se ha equipado correctamente en la categoría "${category}".`);
            })
            .catch((error) => {
                console.error("Error al sincronizar con el servidor:", error);
                alert("Ocurrió un error al intentar equipar el objeto. Intenta nuevamente.");
            });
    };

    const handleUnequipItem = async (item, category) => {
        if (!item || !category) {
            console.error("Faltan datos necesarios para desequipar el ítem.");
            return;
        }
        console.log(item)

        const statToRemove = {ataque: 0, defensa: 0, velocidad: 0}; // Crear una copia de las estadísticas actuales
        if (category === "Armamento") {
            statToRemove.ataque = parseInt(item.damage, 10) || 0;
        } else if (category === "Equipamiento") {
            statToRemove.defensa = parseInt(item.defense, 10) || 0;
        } else if (category === "Vehículo") {
            statToRemove.velocidad = parseInt(item.speed, 10) || 0;
        }
    
        console.log(statToRemove)

        try {
            const userId = userInfo.id; // ID del usuario
            const token = localStorage.getItem("token"); // Token de autenticación
    
            // Calcular nuevas estadísticas restando los valores del ítem desequipado
            const newStats = statToRemove

            console.log(newStats)
    
            // Preparar los datos para enviar al backend
            const requestData = {
                category, // Categoría del objeto desequipado
                unequippedItem: item, // El objeto que se desea desequipar
                newStats, // Nuevas estadísticas calculadas
            };
    
            // Enviar solicitud al backend
            const response = await axios.put(`/api/user/${userId}/unequipItem`, requestData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            // Manejar la respuesta
            if (response.status === 200) {
                console.log("Ítem desequipado con éxito:", response.data);
                // Actualizar la UI con los datos del servidor
                setUserInfo((prev) => ({
                    ...prev,
                    character: response.data.character, // Actualiza los ítems equipados
                    inventory: response.data.inventory, // Actualiza el inventario
                    stats: response.data.stats, // Actualiza las estadísticas del personaje
                }));
                console.log(userInfo)
            } else {
                console.error("Error al desequipar el ítem:", response.data.message);
            }
        } catch (error) {
            console.error("Error al desequipar el ítem:", error.response?.data || error.message);
        }
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
                                            {/* Ajuste aquí: Pasar el objeto y la categoría */}
                                            <button onClick={() => handleUnequipItem(character[category], category)}>
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
                            hoverText={`${character?.Armamento?.damage || 0} puntos`}
                            percentage={stats.Ataque}
                            color="red"
                        />
                        <HoverBar
                            name="Defensa"
                            hoverText={`${character?.Equipamiento?.defense || 0} puntos`}
                            percentage={stats.Defensa}
                        />
                        <HoverBar
                            name="Velocidad"
                            hoverText={`${character?.Vehículo?.speed || 0} puntos`}
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
