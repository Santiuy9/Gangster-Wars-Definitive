import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import axios from "axios";
import SlideButton from "./SlideButon";
import ProgressBar from "./ProgressBar";
import './css/ItemCard.css';

export default function ItemCard({
    imageSrc,
    title,
    description,
    price,
    category,
    proBarName,
    proBarTxtColor,
    proBarBgColor,
    proBarPercentage,
}) {
    const { userInfo, setUserInfo } = useContext(UserContext);

    const token = localStorage.getItem("token");

    const renderIcon = () => {
        if (category === "Armamento") {
            return <i className="fa-solid fa-gun"></i>;
        } else if (category === "Equipamiento") {
            return <i className="fa-solid fa-shield-halved"></i>;
        } else if (category === "Vehículo") {
            return <i className="fa-solid fa-car"></i>;
        } else {
            return null;
        }
    };

    const fetchUserInfo = async (token) => {
        try {
            const response = await axios.get("http://localhost:5000/api/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data; // Devuelve la información del usuario
        } catch (error) {
            console.error("Error al obtener la información del usuario:", error);
            return null; // Manejar error devolviendo null o mostrando un mensaje
        }
    };

    useEffect(() => {
        async function getUserData() {
            if (token) {
                const data = await fetchUserInfo(token);
                setUserInfo(data); // Guarda los datos del usuario en el estado
            }
        }
        getUserData();
    }, [token]);

    if (!userInfo) {
        return <p>Cargando...</p>;
    }

    const handlePurchase = async (item, price) => {
        if (!token) {
            alert("No estás autenticado");
            return;
        }

        try {
            if (userInfo.dinero >= price) {
                // Actualizar en el backend
                await axios.put(
                    `http://localhost:5000/api/user/${userInfo.id}`,
                    {
                        dinero: userInfo.dinero - price,
                        newItem: item,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Obtener datos actualizados
                const updatedData = await fetchUserInfo(token);
                setUserInfo(updatedData); // Actualizar el estado con los datos frescos

                alert("¡Compra realizada con éxito!");
            } else {
                alert("No tienes suficiente dinero para realizar la compra");
            }
        } catch (error) {
            console.error("Error al realizar la compra:", error);
            alert("Hubo un problema al realizar la compra. Inténtalo nuevamente.");
        }
    };

    const handleBuyClick = () => {
        let item = {
            imageSrc,
            title,
            description,
            price,
            category,
            proBarName,
            proBarTxtColor,
            proBarBgColor,
        };
        if (category === "Armamento") {
            item = { ...item, damage: proBarPercentage };
        } else if (category === "Equipamiento") {
            item = { ...item, defense: proBarPercentage };
        } else if (category === "Vehículo") {
            item = { ...item, speed: proBarPercentage };
        }

        handlePurchase(item, parseInt(price));
    };

    return (
        <div className="ItemCard">
            <img src={imageSrc} alt={title} />
            <div className="ItemDescription">
                <h2>{title}</h2>
                <p>{description}</p>
                <ProgressBar
                    name={proBarName}
                    TXTcolor={proBarTxtColor}
                    BGcolor={proBarBgColor}
                    fillPercentage={proBarPercentage}
                />
                {renderIcon()}
            </div>
            <SlideButton
                textDefault="Comprar"
                textHover={`$${price}`}
                onClick={handleBuyClick}
            />
        </div>
    );
}
