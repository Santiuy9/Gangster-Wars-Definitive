import React from "react";
import axios from "axios"
import SlideButton from "./SlideButon";
import ProgressBar from "./ProgressBar";
import './css/ItemCard.css'

export default function ItemCard({ 
    imageSrc,
    title,
    description,
    price,
    category,
    proBarName,
    proBarTxtColor,
    proBarBgColor,
    proBarPercentage 
}) {

    const renderIcon = () => {
        if (category === 'Armamento') {
            return <i className="fa-solid fa-gun"></i>
        } else if (category === 'Equipamiento') {
            return <i className="fa-solid fa-shield-halved"></i>
        } else if (category === 'Vehículo') {
            return <i className="fa-solid fa-car"></i>
        } else {
            return null;
        }
    }

    const handlePurchase = async (item, price) => {
        const token = localStorage.getItem("token");
        if(!token) {
            alert("No estas autenticado");
            return;
        }
        try {
            const response = await axios.get("http://localhost:5000/api/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const playerData = response.data;
            const playerMoney = playerData.dinero;

            if (playerMoney >= price) {
                await axios.put(
                    `http://localhost:5000/api/users/${playerData._id}`,
                    {
                        dinero: playerMoney - price,
                        newItem: item
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                alert("Compra realizada con exito!")
            }
            else {
                alert("No tienes suficiente dinero para realizar la compra")
            }
        } catch (error) {
            console.error("Error al realizar la compra: ", error)
        }
    }

    const handleBuyClick = () => {
        const item = { 
            imageSrc,
            title,
            description,
            price,
            category,
            proBarName,
            proBarTxtColor,
            proBarBgColor,
            damage: proBarPercentage 
        };
        handlePurchase(item, parseInt(price));
    }
    
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
    )
}
