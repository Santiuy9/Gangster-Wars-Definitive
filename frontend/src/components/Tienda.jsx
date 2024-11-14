import React, { useState } from "react";
import Armamento from './Armamento'
import Equipamiento from './Equipamiento'
import Vehiculos from './Vehiculos'
import './css/Tienda.css'

export default function Tienda() {
    const [activeCategory, setActiveCategory] = useState('armamento')
    
    const renderCategory = () => {
        switch (activeCategory) {
            case 'armamento':
                return <Armamento />;
            case 'equipamiento':
                return <Equipamiento />;
            case 'vehiculos':
                return <Vehiculos />;        
        
            default:
                return <Armamento />;
        }
    }

    return (
        <div className="PrincipalContainer Tienda">
            <h1>Tienda</h1>
            <div className="category-buttons">
                <button onClick={() => setActiveCategory('armamento')}>Armamento</button>
                <button onClick={() => setActiveCategory('equipamiento')}>Equipamiento</button>
                <button onClick={() => setActiveCategory('vehiculos')}>Vehiculos</button>
            </div>
                {renderCategory()}
        </div>
    )
}