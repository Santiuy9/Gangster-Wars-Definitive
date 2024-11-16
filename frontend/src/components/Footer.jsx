import React, {useContext} from "react";
import { UserContext } from "../UserContext";
import Button from "./Button";
import './css/Footer.css';

export default function Footer() {
    const { userInfo, setUserInfo } = useContext(UserContext);

    return (
        <footer className="Footer">
            {userInfo ? (
                <ul className="lista">
                    <li><Button label="Inicio" to="/"/></li>
                    <li><Button label="Misiones" to="/misiones"/></li>
                    {/* <li><Button label="Negocio" to="/negocio"/></li> */}
                    <li><Button label="Tienda" to="/tienda"/></li>
                    {/* <li><Button label="Pandilla" to="/pandilla"/></li> */}
                    <li><Button label="Personaje" to="/personaje"/></li>
                </ul>
            ) : (
                <>
                </>
            )}
        </footer>
    )
}