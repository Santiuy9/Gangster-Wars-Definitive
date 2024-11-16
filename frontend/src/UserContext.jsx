import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [userInfo, setUserInfo] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    // Define la función fetchUserData dentro del contexto
    const fetchUserData = async (token) => {
        if (token) {
            try {
                const response = await axios.get("http://localhost:5000/api/user", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserInfo(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUserInfo(null); // Limpiar datos si falla la autenticación
            }
        }
    };

    // Efecto para cargar los datos del usuario cuando el token cambia
    useEffect(() => {
        if (token) {
            fetchUserData(token);
        } else {
            setUserInfo(null); // Si no hay token, limpia los datos del usuario
        }
    }, [token]);

    // Función para actualizar el token
    const updateToken = (newToken) => {
        if (newToken) {
            localStorage.setItem("token", newToken);
        } else {
            localStorage.removeItem("token");
        }
        setToken(newToken);
    };

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, fetchUserData, updateToken }}>
            {children}
        </UserContext.Provider>
    );
}
