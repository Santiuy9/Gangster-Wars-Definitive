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
    console.log(newItem)
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

router.put("/user/:id/equipItem", authenticateToken, async (req, res) => {
    const userId = req.params.id; // ID del usuario
    const { equipItem, category, character, inventory } = req.body; // Datos enviados desde el frontend

    console.log("Equipando ítem para el usuario:", userId);
    console.log("Datos recibidos:", { equipItem, category });
    
    if (!equipItem || !category) {
        return res.status(400).json({ message: "Faltan datos requeridos para equipar el ítem." });
    }

    try {
        // Buscar al usuario
        const user = await User.findById(userId);
        console.log("Usuario encontrado en la base de datos:", user);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        // Comprobar si ya hay un ítem equipado en esa categoría
        if (user.character[category]) {
            return res.status(400).json({
                message: `Ya tienes un objeto equipado en la categoría ${category}. Primero debes desequiparlo.`,
            });
        }

        // Agregar el ítem a la categoría del character
        user.character[category] = equipItem;

        // Filtrar el inventario para eliminar el ítem equipado
        user.inventory = user.inventory.filter(
            (item) => item._id.toString() !== equipItem._id
        );
        

        console.log("Datos del usuario antes de guardar:", {
            character: user.character,
            inventory: user.inventory,
        });
        
        // Guardar los cambios en la base de datos
        await user.save();

        return res.status(200).json({
            message: "Ítem equipado con éxito.",
            character: user.character,
            inventory: user.inventory,
        });
    } catch (error) {
        console.error("Error al equipar el ítem:", error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
});

router.put("/user/:id/unequipItem", async (req, res) => {
    try {
        const { id } = req.params;  // Obtener el ID del usuario desde la URL
        const { character, inventory } = req.body;  // Recibir los datos actualizados del personaje y el inventario
        
        // Buscar al usuario en la base de datos
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Actualizar los datos del personaje y el inventario en la base de datos
        user.character = character;  // Actualizamos el personaje
        user.inventory = inventory;  // Actualizamos el inventario
        
        // Guardamos los cambios
        await user.save();

        // Enviar los datos actualizados como respuesta
        res.status(200).json({
            character: user.character,  // Enviar el personaje actualizado
            inventory: user.inventory,  // Enviar el inventario actualizado
        });
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

module.exports = router;