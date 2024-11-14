import React from "react";
import Button from "./Button";
import './css/Footer.css';

export default function Footer() {
    return (
        <footer className="Footer">
            <ul className="lista">
                <li><Button label="Inicio" to="/"/></li>
                <li><Button label="Misiones" to="/misiones"/></li>
                {/* <li><Button label="Negocio" to="/negocio"/></li> */}
                <li><Button label="Tienda" to="/tienda"/></li>
                {/* <li><Button label="Pandilla" to="/pandilla"/></li> */}
                <li><Button label="Personaje" to="/personaje"/></li>
            </ul>
        </footer>
    )
}