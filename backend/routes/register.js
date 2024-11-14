// routes/register.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // El modelo de MongoDB que vamos a crear más adelante
const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Verificación de datos
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Por favor completa todos los campos' });
    }

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            vida: 100,
            energia: 100,
            dinero: 0,
            monedaPremium: 0,
            Character: {
                Armamento: [],
                Equipamiento: [],
                Vehículo: []
            },
            Inventory: []
        });

        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
});

module.exports = router;
