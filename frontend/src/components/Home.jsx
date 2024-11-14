import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import Button from './Button';
import './css/Home.css'

export default function Home({ username }) {
    // const handleButtonClick = () => {
    //     alert('Boton Clickeado')
    // }

    return (
        <div className='PrincipalContainer'>
            {username ? (
                <div className='Home'>
                    <h1>Bienvenido {username}</h1>
                    <p>Nos preguntamos... Que crimenes realizaremos hoy jefe?</p>
                    <Button label="Misiones" to="/misiones" />
                    <Button label="Negocios" to="/negocios" />
                    <Button label="Tienda" to="/tienda" />
                    <Button label="Pandilla" to="/pandilla" />
                    <Button label="Equipo" to="/equipo" />

                </div>
            ) : (
                <div>
                    <h1>Bienvenido a Gangster Wars</h1>
                    <p>Explora el juego y disfruta de la experiencia.</p>

                </div>
            )}
        </div>
    );
};