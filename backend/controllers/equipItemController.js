const User = require('../models/User');

// Función para equipar un ítem
async function equipItem(req, res) {
    const { userId, itemId, category } = req.body;

    try {
        // Buscar al usuario por su ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Buscar el ítem en el inventario
        const item = user.inventory.find(i => i._id.toString() === itemId);
        if (!item) {
            return res.status(404).json({ message: 'Ítem no encontrado en el inventario' });
        }

        // Verificar que el ítem corresponde a la categoría especificada
        if (item.category !== category) {
            return res.status(400).json({ message: `El ítem no corresponde a la categoría: ${category}` });
        }

        // Equipar el ítem en la categoría correspondiente del personaje
        user.character[category.toLowerCase()] = item;

        // Guardar los cambios
        await user.save();

        return res.status(200).json({ message: 'Ítem equipado correctamente', user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al equipar el ítem' });
    }
}

module.exports = { equipItem };
