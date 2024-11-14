import React from "react";
import ItemCard from "./ItemCard";
import Chaleco from "../assets/chaleco-tactico-modular-s-i-cia-militar-negro.jpg"
import ChalecoTactico from "../assets/chaleco-tactico.jpg"

export default function Equipamiento() {
    return (
        <div className="category-content">
            <h2>Equipamiento</h2>
            <ItemCard 
                title="Chaleco Ligero"
                imageSrc={Chaleco}
                description="Chaleco que brinda algo de proteccion"
                price="1590"
                category="Equipamiento"
                proBarName="Defensa"
                proBarTxtColor="black"
                proBarBgColor="gold"
                proBarPercentage="35"

            />
            <ItemCard 
                title="Chaleco Tactico"
                imageSrc={ChalecoTactico}
                description="Chaleco militar con mucha proteccion"
                price="3590"
                category="Equipamiento"
                proBarName="Defensa"
                proBarTxtColor="black"
                proBarBgColor="gold"
                proBarPercentage="60"
            />
        </div>
    )
}