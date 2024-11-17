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
            stats: user.stats,
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
    const { character, inventory, stats } = req.body; // Datos enviados desde el frontend

    console.log("Equipando ítem para el usuario:", userId);
    console.log("Datos recibidos:", { character, inventory, stats });

    if (!character || !inventory || !stats) {
        return res.status(400).json({ message: "Faltan datos requeridos para equipar el ítem." });
    }

    try {
        // Buscar al usuario
        const user = await User.findById(userId);
        console.log("Usuario encontrado en la base de datos:", user);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        // Actualizar el personaje con el nuevo `character`
        user.character = character;

        // Actualizar las estadísticas del personaje con `stats`
        user.stats.ataque = stats.Ataque || user.stats.ataque;
        user.stats.defensa = stats.Defensa || user.stats.defensa;
        user.stats.velocidad = stats.Velocidad || user.stats.velocidad;

        // Actualizar el inventario con el nuevo `inventory`
        user.inventory = inventory;

        // Guardar los cambios en la base de datos
        await user.save();

        console.log("Datos del usuario después de guardar:", {
            character: user.character,
            inventory: user.inventory,
            stats: user.stats,
        });

        return res.status(200).json({
            message: "Ítem equipado con éxito.",
            character: user.character,
            inventory: user.inventory,
            stats: user.stats, // Enviar las estadísticas actualizadas
        });
    } catch (error) {
        console.error("Error al equipar el ítem:", error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
});

router.put("/user/:id/unequipItem", authenticateToken, async (req, res) => {
    const userId = req.params.id; // ID del usuario
    const { category, unequippedItem, newStats } = req.body; // Datos enviados desde el frontend

    console.log("Desequipando ítem para el usuario:", userId);
    console.log("Datos recibidos:", { category, unequippedItem, newStats });

    if (!category || !unequippedItem || !newStats) {
        return res.status(400).json({ message: "Faltan datos requeridos para desequipar el ítem." });
    }

    try {
        // Buscar al usuario
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        // Verificar que haya un ítem en la categoría para desequipar
        if (!user.character[category]) {
            return res.status(400).json({
                message: `No tienes un objeto equipado en la categoría ${category}.`,
            });
        }

        // Verificar que el ítem que se intenta desequipar sea el mismo que está equipado en la categoría
        if (user.character[category]._id.toString() !== unequippedItem._id) {
            return res.status(400).json({ message: "El ítem enviado no coincide con el equipado." });
        }

        // Eliminar el ítem de la categoría en `character`
        user.character[category] = null;

        // Agregar el ítem al inventario si no está duplicado
        if (!user.inventory.some((item) => item._id.toString() === unequippedItem._id)) {
            user.inventory.push(unequippedItem);
        }

        // Restar las estadísticas de acuerdo a la categoría del ítem
        switch (category) {
            case "Armamento":
                user.stats.ataque -= newStats.ataque || 0;
                break;
            case "Equipamiento":
                user.stats.defensa -= newStats.defensa || 0;
                break;
            case "Vehículo":
                user.stats.velocidad -= newStats.velocidad || 0;
                break;
            default:
                return res.status(400).json({ message: "Categoría no válida." });
        }

        // Guardar los cambios en la base de datos
        await user.save();

        console.log("Linea 193 - Datos del usuario después de guardar:", {
            character: user.character,
            inventory: user.inventory,
            stats: user.stats,
        });

        return res.status(200).json({
            message: "Ítem desequipado con éxito.",
            character: user.character,
            inventory: user.inventory,
            stats: user.stats, // Enviar las estadísticas actualizadas
        });
    } catch (error) {
        console.error("Error al desequipar el ítem:", error);
        return res.status(500).json({ 
            message: "Error interno del servidor.", 
            error: error.message 
        });
    }
});




module.exports = router;