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
    const { userInfo, setUserInfo } = useContext(UserContext); // Esto ya funciona porque UserProvider envuelve AppContent

    // console.log(userInfo)
    
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
            if (JSON.stringify(data) !== JSON.stringify(userInfo)) {
                setUserInfo(data);
                setIsAuthenticated(true);
            }
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

    // console.log(isAuthenticated)
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
