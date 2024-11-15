import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import HoverBar from './HoverBar'

import './css/Header.css';

export default function Header({ isAuthenticated, userInfo, onLogout }) {
    const navigate = useNavigate()

    console.log(isAuthenticated)
    console.log(userInfo)


    return (
        <header className="game-header">
            {isAuthenticated ? (
                <>
                    <HoverBar name={`Vida ${userInfo.vida}`} hoverText={`0s`} percentage={100} color='#4caf50' />
                    <HoverBar name={`Energia ${userInfo.energia}`} hoverText={`0s`} percentage={100} color='#3300ff' />

                    <div className="player-stat">
                        <span className="stat-label">Dinero:</span>
                        <span className="stat-value">${userInfo.dinero}</span>
                    </div>
                    <div className="player-stat">
                        <span className="stat-label">Moneda Premium:</span>
                        <span className="stat-value">{userInfo.monedaPremium}</span>
                    </div>
                    <button onClick={onLogout} className="logout-btn">
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


// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import HoverBar from './HoverBar';
// import './css/Header.css';

// export default function Header({ playerInfo, tiempoRestanteVida, tiempoRestanteEnergia }) {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);  // Estado para saber si está autenticado
//     const navigate = useNavigate();

//     // Verificar si el token está presente al cargar el componente
//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             setIsAuthenticated(true);
//         } else {
//             setIsAuthenticated(false);
//         }
//     }, [navigate]);

//     const handleLogout = async () => {
//         try {
//             await axios.post('http://localhost:5000/api/auth/logout', {}, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('token')}`,
//                 },
//             });
//             localStorage.removeItem('token');
//             console.log('Sesión cerrada correctamente');
//             setIsAuthenticated(false);  // Actualizar el estado de autenticación
//             navigate('/');  // Redirigir al home o página de login
//         } catch (error) {
//             console.log('Error al cerrar sesión', error);
//         }
//     };

//     return (
//         <header className="game-header">
//             {isAuthenticated ? (
//                 <>
//                     <HoverBar name={`Vida ${playerInfo.vida}`} hoverText={`Recarga en ${tiempoRestanteVida}s`} percentage={playerInfo.vida} color='#4caf50' />
//                     <HoverBar name={`Energia ${playerInfo.energia}`} hoverText={`Recarga en ${tiempoRestanteEnergia}s`} percentage={playerInfo.energia} color='#3300ff' />

//                     <div className="player-stat">
//                         <span className="stat-label">Dinero:</span>
//                         <span className="stat-value">${playerInfo.dinero}</span>
//                     </div>
//                     <div className="player-stat">
//                         <span className="stat-label">Moneda Premium:</span>
//                         <span className="stat-value">{playerInfo.monedaPremium}</span>
//                     </div>
//                     <button onClick={handleLogout} className="logout-btn">
//                         Cerrar Sesión
//                     </button>
//                 </>
//             ) : (
//                 <div className="guest-header">
//                     <h1>Bienvenido a <Link to="/">Gangster Wars</Link></h1>
//                     <p>
//                         <Link to="/login">Inicia Sesión</Link> o <Link to="/register">Regístrate</Link> para comenzar
//                     </p>
//                 </div>
//             )}
//         </header>
//     );
// }
