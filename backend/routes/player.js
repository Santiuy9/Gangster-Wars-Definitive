const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const Player = require('../models/User'); // Suponiendo que tienes un modelo Player para MongoDB

// Obtener los datos del jugador
router.get('/:userId', async (req, res) => {
    try {
        const player = await Player.findOne({ userId: req.params.userId });
        if (!player) {
            return res.status(404).json({ message: "Player not found" });
        }
        res.json(player);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Actualizar los datos del jugador
router.put('/:userId', async (req, res) => {
    try {
        const player = await Player.findOneAndUpdate(
            { userId: req.params.userId },
            req.body,
            { new: true }
        );
        if (!player) {
            return res.status(404).json({ message: "Player not found" });
        }
        res.json(player);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/player", async (req, res) => {
    const token = req.header("Authorization").replace("Bearer ", "");
    
    if (!token) {
        return res.status(401).send({ error: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, "yourSecretKey"); // Verifica el token
        const player = await Player.findOne({ userId: decoded.userId }); // Busca al jugador
        if (!player) {
            return res.status(404).send({ error: "Player not found" });
        }
        res.send(player); // Devuelve los datos del jugador
    } catch (e) {
        res.status(400).send({ error: "Invalid token" });
    }
});

module.exports = router;
