const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Suponiendo que tienes un modelo de Usuario
const router = express.Router();

// Ruta para el login
router.post('/', async (req, res) => {  // Debe ser POST a '/'
    console.log("Recibiendo solicitud de login...");
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Por favor, ingresa el email y la contraseña.' });
    }

    try {
        // Buscamos al usuario por su email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Comparamos la contraseña cifrada con la enviada
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta.' });
        }

        // Creamos un JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h', // El token expirará en una hora
        });

        // Enviamos el token al cliente
        res.status(200).json({ message: 'Inicio de sesión exitoso', token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al iniciar sesión. Inténtalo de nuevo.' });
    }
});

module.exports = router;
