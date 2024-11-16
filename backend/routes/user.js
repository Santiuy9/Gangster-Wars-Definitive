const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Modelo de usuario

const router = express.Router();

// Middleware para verificar el token
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Se espera 'Bearer <token>'
    
    if (!token) return res.status(401).json({ message: 'Acceso denegado. No se encontró token.' });

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido.' });
        req.user = user;
        next();
    });
};

// Ruta para obtener los datos del usuario
router.get('/user', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
    
        const user = await User.findById(userId);
    
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado'})
        }
        
        const userData = {
            id: user._id,
            username: user.username,
            email: user.email,
            vida: user.vida,
            energia: user.energia,
            dinero: user.dinero,
            monedaPremium: user.monedaPremium,
            character: user.character,
            inventory: user.inventory,
        };
    
        res.json(userData);
        
    } catch (error) {
        console.error('Error al obtener los datos del usuario', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

router.put("/user/:id", authenticateToken, async (req, res) => {
    const { id } = req.params; // ID del usuario
    const { dinero, newItem } = req.body; // Datos enviados en el cuerpo de la solicitud

    try {
        // Verificar si el usuario autenticado está actualizando su propia cuenta
        if (req.user.id !== id) {
            return res.status(403).json({ message: "No tienes permiso para realizar esta acción" });
        }

        // Busca al usuario en la base de datos
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Actualizar dinero e inventario
        user.dinero = dinero;
        if (newItem) {
            user.inventory.push(newItem); // Agregar el nuevo ítem al inventario
        }

        await user.save(); // Guardar los cambios

        res.json({ message: "Datos actualizados correctamente", dinero: user.dinero, inventory: user.inventory });
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
});


module.exports = router;