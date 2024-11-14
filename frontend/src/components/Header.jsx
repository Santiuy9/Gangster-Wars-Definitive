import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import HoverBar from './HoverBar';
import './css/Header.css';

export default function Header({ playerInfo, isAuthenticated, tiempoRestanteVida, tiempoRestanteEnergia }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log('Sesión cerrada correctamente');
            navigate('/');
        } catch (error) {
            console.log('Error al cerrar sesión', error);
        }
    };


    return (
        <header className="game-header">
            {isAuthenticated ? (
                <>
                    <HoverBar name={`Vida ${playerInfo.vida}`} hoverText={`Recarga en ${tiempoRestanteVida}s`} percentage={playerInfo.vida} color='#4caf50' />

                    <HoverBar name={`Energia ${playerInfo.energia}`} hoverText={`Recarga en ${tiempoRestanteEnergia}s`} percentage={playerInfo.energia} color='#3300ff' />

                    <div className="player-stat">
                        <span className="stat-label">Dinero:</span>
                        <span className="stat-value">${playerInfo.dinero}</span>
                    </div>
                    <div className="player-stat">
                        <span className="stat-label">Moneda Premium:</span>
                        <span className="stat-value">{playerInfo.monedaPremium}</span>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        Cerrar Sesión
                    </button>
                </>
            ) : (
                <div className="guest-header">
                    <h1>Bienvenido a <Link to="/">Gangster Wars</Link></h1>
                    <p>
                        <Link to="/login">Inicia Sesión</Link> o <Link to="/register">Regístrate</Link> para comenzar
                    </p>
                </div>
            )}
        </header>
    );
}
