import React from "react";
import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
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
        const userId = auth.currentUser?.uid;
        if (!userId) {
            alert('No estás autenticado.');
            return;
        }

        const playerRef = doc(db, 'Players', userId);

        try {
            const playerDoc = await getDoc(playerRef);
            if (playerDoc.exists()) {
                const playerData = playerDoc.data();
                const playerMoney = playerData.dinero;

                if (playerMoney >= price) {
                    await updateDoc(playerRef, {
                        dinero: playerMoney - price,
                        Inventory: arrayUnion(item)
                    });
                    alert('Compra realizada con éxito!');
                } else {
                    alert('No tienes suficiente dinero para comprar este ítem.');
                }
            } else {
                console.error('No se encontró el jugador.');
            }
        } catch (error) {
            console.error('Error al realizar la compra: ', error);
        }
    };

    const handleBuyClick = () => {
        const item = { 
            title, 
            description, 
            imageSrc,
            category,
            proBarName,
            proBarPercentage,
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
