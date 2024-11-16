// controllers/userController.js
const User = require('../models/User');

const updateUser = async (req, res) => {
    const { id } = req.params;  // ID del usuario que se pasa en la URL
    const { Character, inventory } = req.body;  // Datos enviados desde el frontend

    try {
        // Encuentra el usuario por su ID
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Actualiza los campos del usuario
        user.character = Character;  // Actualiza los ítems equipados en 'character'
        user.inventory = inventory;  // Actualiza el inventario

        // Guarda los cambios en la base de datos
        await user.save();

        // Responde con el usuario actualizado
        res.status(200).json(user);
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

module.exports = {
    updateUser,
};
