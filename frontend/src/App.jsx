import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider, UserContext } from './UserContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Misiones from './components/Misiones';
import Tienda from './components/Tienda';
import Personaje from './components/Personaje';
import './App.css';

function AppContent() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { setUserInfo } = useContext(UserContext); // Esto ya funciona porque UserProvider envuelve AppContent

    // Función para obtener los datos del usuario
    const fetchUserData = async (token) => {
        try {
            const response = await fetch("http://localhost:5000/api/user", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (!response.ok) throw new Error("Error en la solicitud: " + response.status);

            const data = await response.json();
            setUserInfo(data);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Error al obtener los datos del usuario", error);
            setIsAuthenticated(false);
        }
    };

    // Efecto para cargar el token al iniciar la aplicación
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) fetchUserData(token);
    }, []);

    // Efecto para escuchar cambios en localStorage
    useEffect(() => {
        const handleStorageChange = () => {
            const token = localStorage.getItem('token');
            if (token) fetchUserData(token);
            else {
                setIsAuthenticated(false);
                setUserInfo(null);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Función de logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserInfo(null);
    };

    console.log(isAuthenticated)
    return (
        <Router>
            <Header 
                isAuthenticated={isAuthenticated} 
                onLogout={handleLogout} 
            />
            {isAuthenticated && <Footer />}
            <Routes>
                <Route 
                    path="/" 
                    element={<Home isAuthenticated={isAuthenticated} />} 
                />
                <Route 
                    path="/login" 
                    element={
                        <Login 
                            onLogin={(token) => {
                                localStorage.setItem('token', token);
                                fetchUserData(token);
                            }}
                        />
                    } 
                />
                <Route path="/register" element={<Register />} />
                <Route path="/misiones" element={<Misiones />} />
                <Route path="/tienda" element={<Tienda />} />
                <Route 
                    path="/personaje" 
                    element={<Personaje isAuthenticated={isAuthenticated} />} 
                />
            </Routes>
        </Router>
    );
}

export default function App() {
    return (
        <UserProvider>
            <AppContent />
        </UserProvider>
    );
}






// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import axios from 'axios';

// import Home from './components/Home';
// import Header from './components/Header';
// import Footer from './components/Footer';
// import Login from './components/Login';
// import Register from './components/Register';
// import Misiones from './components/Misiones';
// import Tienda from './components/Tienda';
// import Personaje from './components/Personaje';
// import './App.css';

// function App() {
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [userInfo, setUserInfo] = useState(null);
//     const [username, setUsername] = useState('');
//     const [playerInfo, setPlayerInfo] = useState(null);
//     const [tiempoRestanteVida, setTiempoRestanteVida] = useState(0);
//     const [tiempoRestanteEnergia, setTiempoRestanteEnergia] = useState(0);
//     const recargaInterval = 5000; // 5 minutos en milisegundos

//     const formatTime = (seconds) => {
//         const minutes = Math.floor(seconds / 60);
//         const remainingSeconds = seconds % 60;
//         return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
//     };

//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//         }
    
//         // Verificación de autenticación
//         axios.get('http://localhost:5000/api/auth/check', { withCredentials: true })
//             .then(response => {
//                 console.log("Verificación de autenticación:", response.data);
//                 if (response.data.isAuthenticated) {
//                     setIsAuthenticated(true);
//                     const userId = response.data.user.userId;
//                     setUserInfo(response.data.user);
    
//                     // Llamada a obtener los datos del usuario si el userId está disponible
//                     if (userId) {
//                         obtenerDatosUsuario(userId);
//                     }
//                 } else {
//                     setIsAuthenticated(false);
//                 }
//             })
//             .catch(error => {
//                 console.error("Error al verificar la autenticación:", error);
//             })
//             .finally(() => setLoading(false)); // Cambia el estado de carga una vez que se complete la verificación
//     }, []);

//     const obtenerDatosUsuario = async (userId) => {
//         console.log("Obteniendo datos del usuario con ID:", userId); // Añade este log
//         try {
//             const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
//             const userData = response.data;
//             console.log("Datos del usuario obtenidos:", userData);
//             if (userData && userData.username) {
//                 setUsername(userData.username);
//                 setPlayerInfo(userData);
//                 console.log("Username actualizado:", userData.username);
//             } else {
//                 console.error("No se encontraron los datos del usuario.");
//             }
//         } catch (error) {
//             console.error("Error al obtener los datos del usuario:", error);
//         }
//     };
    
    

//     const actualizarRecarga = (userData) => {
//         const now = Date.now();
//         const actualizaAtributo = async (atributo, valor, lastUpdateField) => {
//             if (userData[atributo] < 100 && userData[lastUpdateField]) {
//                 const tiempoTranscurrido = now - new Date(userData[lastUpdateField]).getTime();
//                 const puntosRecarga = Math.floor(tiempoTranscurrido / recargaInterval);
//                 const nuevoValor = Math.min(userData[atributo] + puntosRecarga, 100);
//                 const tiempoRestante = recargaInterval - (tiempoTranscurrido % recargaInterval) / 1000;

//                 if (nuevoValor !== userData[atributo]) {
//                     await actualizarAtributo(atributo, nuevoValor);
//                 }

//                 return tiempoRestante;
//             }
//             return recargaInterval / 1000;
//         };

//         // Actualiza vida y energía
//         Promise.all([
//             actualizaAtributo('vida', userData.vida, 'lastVidaUpdate'),
//             actualizaAtributo('energia', userData.energia, 'lastEnergiaUpdate')
//         ]).then(([vidaRestante, energiaRestante]) => {
//             setTiempoRestanteVida(vidaRestante);
//             setTiempoRestanteEnergia(energiaRestante);
//         });
//     };

//     const actualizarAtributo = async (atributo, valor) => {
//         if (!userInfo) return;

//         try {
//             console.log(`Actualizando atributo ${atributo} con valor ${valor}`);
//             await axios.put(`/api/users/${userInfo.id}`, {
//                 [atributo]: valor,
//                 [`last${atributo.charAt(0).toUpperCase() + atributo.slice(1)}Update`]: new Date()
//             });
//             setPlayerInfo((prev) => ({
//                 ...prev,
//                 [atributo]: valor
//             }));
//         } catch (error) {
//             console.error("Error al actualizar el atributo:", error);
//         }
//     };

//     // Actualización en intervalos de recarga
//     useEffect(() => {
//         if (playerInfo) {
//             actualizarRecarga(playerInfo); // Llama a actualizarRecarga cada vez que playerInfo cambia
//         }
//         // console.log(playerInfo)
//     }, [playerInfo]);

//     useEffect(() => {
//         if (!playerInfo) return;

//         const interval = setInterval(() => {
//             if (userInfo) {
//                 if (playerInfo.vida >= 100 && playerInfo.energia >= 100) {
//                     clearInterval(interval); // Detenemos la recarga si ambos están a 100
//                 } else {
//                     if (playerInfo.vida < 100) {
//                         actualizarAtributo('vida', playerInfo.vida + 1);
//                     }
//                     if (playerInfo.energia < 100) {
//                         actualizarAtributo('energia', playerInfo.energia + 1);
//                     }
//                 }
//             }
//         }, recargaInterval);

//         return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
//     }, [playerInfo, userInfo]);

//     // Cuenta regresiva visual para recargas
//     useEffect(() => {
//         const countdownInterval = setInterval(() => {
//             setTiempoRestanteVida((prev) => (prev > 0 ? prev - 1 : recargaInterval / 1000));
//             setTiempoRestanteEnergia((prev) => (prev > 0 ? prev - 1 : recargaInterval / 1000));
//         }, 1000); // Cada segundo

//         return () => clearInterval(countdownInterval);
//     }, []);

//     useEffect(() => {
//         console.log("Estado de autenticación:", isAuthenticated); // Log para verificar autenticación
//         console.log("Username en App.jsx:", username); // Log para verificar el valor de username en App.jsx
//     }, [isAuthenticated, username]); // Dependencia en isAuthenticated y username

//     return (
//         <Router>
//             <Header
//                 isAuthenticated={isAuthenticated}
//                 playerInfo={playerInfo || { vida: 0, energia: 0, dinero: 0, monedaPremium: 0 }}
//                 tiempoRestanteVida={formatTime(tiempoRestanteVida)}
//                 tiempoRestanteEnergia={formatTime(tiempoRestanteEnergia)}
//             />
//             {isAuthenticated && <Footer />}
    
//             <Routes>
//                 <Route path="/" element={<Home username={username} />} />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/register" element={<Register />} />
//                 <Route path="/misiones" element={<Misiones />} />
//                 <Route path="/tienda" element={<Tienda />} />
//                 <Route 
//                     path="/personaje" 
//                     element={
//                         <Personaje 
//                             isAuthenticated={isAuthenticated} 
//                             playerInfo={playerInfo || { vida: 0, energia: 0, dinero: 0, monedaPremium: 0 }} 
//                         />
//                     }
//                 />
//             </Routes>
//         </Router>
//     );
    
// }

// export default App;